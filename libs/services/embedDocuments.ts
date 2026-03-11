import OpenAI from "openai";
import { prisma } from "../prisma";

const BATCH_SIZE = 20;
const MAX_CONTENT_LENGTH = 4_000;
const RATE_LIMIT_DELAY_MS = 1_000;
const MAX_RETRIES = 5;

/** Row shape returned by the raw SQL query. */
interface DocTextRow {
  documentId: string;
  content: string;
}

/**
 * Embed all DocumentText rows that have content but no embedding yet.
 *
 * - Fetches rows where content IS NOT NULL AND embedding IS NULL (raw SQL
 *   because the column is `vector(1536)`, an Unsupported type in Prisma)
 * - Truncates content to 4 000 characters max
 * - Calls OpenAI text-embedding-3-small in batches of 20
 * - Stores the resulting vector into document_texts.embedding via raw SQL
 * - Idempotent: skips rows that already have an embedding
 */
export async function embedDocuments(): Promise<void> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const openai = new OpenAI({ apiKey });

  // ── 1. Fetch rows that need embedding ─────────────────────────────────
  const rows = await prisma.$queryRaw<DocTextRow[]>`
    SELECT "documentId", content
    FROM "document_texts"
    WHERE content IS NOT NULL
      AND embedding IS NULL
    ORDER BY "extractedAt" ASC
  `;

  const total = rows.length;

  if (total === 0) {
    console.log("No DocumentText rows require embedding — all up to date.");
    return;
  }

  let processed = 0;
  let skipped = 0;

  console.log(`Total documents to embed: ${total}`);

  // ── 2. Process in batches ─────────────────────────────────────────────
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(total / BATCH_SIZE);
    console.log(`Batch ${batchNum}/${totalBatches} (${batch.length} docs)…`);

    // Build embedding inputs (truncated to MAX_CONTENT_LENGTH)
    const inputs: string[] = [];
    const validIndices: number[] = [];

    batch.forEach((row, idx) => {
      const text = row.content.trim().slice(0, MAX_CONTENT_LENGTH);
      if (!text) {
        skipped++;
        return;
      }
      inputs.push(text);
      validIndices.push(idx);
    });

    if (inputs.length === 0) {
      console.log(`  ⏭ Batch ${batchNum} — all docs skipped (empty content).`);
      continue;
    }

    // ── 3. Call OpenAI with retry / rate-limit handling ──────────────────
    const embeddings = await callWithRetry(openai, inputs);

    // ── 4. Store results via raw SQL (vector column) ────────────────────
    for (let j = 0; j < validIndices.length; j++) {
      const row = batch[validIndices[j]];
      const vec = `[${embeddings[j].join(",")}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE "document_texts" SET embedding = $1::vector WHERE "documentId" = $2`,
        vec,
        row.documentId,
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

    const status: number | undefined = error?.status ?? error?.response?.status;
    if (status === 429 || (status && status >= 500)) {
      const backoff = Math.min(2 ** attempt * 1_000, 60_000);
      console.warn(
        `  ⚠ ${status} from OpenAI — retrying in ${backoff / 1000}s (attempt ${attempt}/${MAX_RETRIES})`,
      );
      await sleep(backoff);
      return callWithRetry(openai, inputs, attempt + 1);
    }

    throw err;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// CLI runner — allows `npx ts-node libs/services/embedDocuments.ts`
// ---------------------------------------------------------------------------

if (require.main === module) {
  embedDocuments()
    .then(() => {
      console.log("Done.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("embedDocuments failed:", err);
      process.exit(1);
    });
}
