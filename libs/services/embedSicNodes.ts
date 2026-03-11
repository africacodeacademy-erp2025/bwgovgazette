import OpenAI from "openai";
import { prisma } from "../prisma";

const BATCH_SIZE = 20;
const RATE_LIMIT_DELAY_MS = 1_000; // pause between batches
const MAX_RETRIES = 5;

/** Row shape returned by the raw SQL query. */
interface SicNodeRow {
  id: string;
  title: string | null;
  description: string | null;
}

/**
 * Embed all SicNodes that have content but no embedding yet.
 *
 * - Fetches SicNodes where hasContent = true AND embedding IS NULL  (raw SQL
 *   because the column is `vector(1536)`, an Unsupported type in Prisma)
 * - Builds embedding text as `${title}\n${description}`
 * - Calls OpenAI text-embedding-3-small in batches of 20
 * - Stores the resulting vector into SicNode.embedding via raw SQL
 * - Idempotent: skips nodes that already have an embedding
 */
export async function embedSicNodes(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });

  // ── 1. Fetch nodes that need embedding (idempotent: embedding IS NULL) ──
  const nodes = await prisma.$queryRaw<SicNodeRow[]>`
    SELECT id, title, description
    FROM "SicNode"
    WHERE "hasContent" = true
      AND embedding IS NULL
    ORDER BY "createdAt" ASC
  `;

  const total = nodes.length;

  if (total === 0) {
    console.log("No SicNodes require embedding — all up to date.");
    return;
  }

  let processed = 0;
  let skipped = 0;

  console.log(`Total nodes to embed: ${total}`);

  // ── 2. Process in batches ──────────────────────────────────────────────
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches} (${batch.length} nodes)…`);

    // Build embedding input texts
    const inputs: string[] = [];
    const validIndices: number[] = [];

    batch.forEach((node, idx) => {
      const title = node.title?.trim() ?? "";
      const description = node.description?.trim() ?? "";
      const text = `${title}\n${description}`.trim();
      if (!text) {
        skipped++;
        return;
      }
      inputs.push(text);
      validIndices.push(idx);
    });

    if (inputs.length === 0) {
      console.log(`  ⏭ Batch ${batchNum} — all nodes skipped (no text).`);
      continue;
    }

    // ── 3. Call OpenAI with retry / rate-limit handling ──────────────────
    const embeddings = await callWithRetry(openai, inputs);

    // ── 4. Store results via raw SQL (vector column) ────────────────────
    for (let j = 0; j < validIndices.length; j++) {
      const node = batch[validIndices[j]];
      const vec = `[${embeddings[j].join(",")}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE "SicNode" SET embedding = $1::vector WHERE id = $2`,
        vec,
        node.id,
      );
      processed++;
    }

    console.log(`  ✓ Batch ${batchNum} stored.`);

    // ── 5. Rate-limit guard ─────────────────────────────────────────────
    if (i + BATCH_SIZE < total) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  console.log(
    `\nEmbedding complete — total: ${total}, processed: ${processed}, skipped: ${skipped}`,
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function callWithRetry(
  openai: OpenAI,
  inputs: string[],
  attempt = 1,
): Promise<number[][]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: inputs,
    });

    return response.data.map((d) => d.embedding);
  } catch (err: unknown) {
    const error = err as {
      message?: string;
      status?: number;
      response?: { status?: number };
    };
    if (attempt > MAX_RETRIES) {
      throw new Error(
        `OpenAI embedding request failed after ${MAX_RETRIES} retries: ${error.message}`,
      );
    }

    // Handle 429 (rate limit) or 5xx with exponential backoff
    const status: number | undefined = error?.status ?? error?.response?.status;
    if (status === 429 || (status && status >= 500)) {
      const backoff = Math.min(2 ** attempt * 1_000, 60_000);
      console.warn(
        `  ⚠ ${status} from OpenAI — retrying in ${backoff / 1000}s (attempt ${attempt}/${MAX_RETRIES})`,
      );
      await sleep(backoff);
      return callWithRetry(openai, inputs, attempt + 1);
    }

    // Non-retryable error
    throw err;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// CLI runner — allows `npx ts-node libs/services/embedSicNodes.ts`
// ---------------------------------------------------------------------------

if (require.main === module) {
  embedSicNodes()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("embedSicNodes failed:", err);
      process.exit(1);
    });
}
