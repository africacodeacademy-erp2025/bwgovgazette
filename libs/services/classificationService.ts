import { prisma } from "../prisma";
import { preprocess } from "../utils/preprocessDocument";
import { scoreSignals } from "../utils/scoreSignals";
import { applyTextSearchBoost } from "../utils/applyTextSearchBoost";
import { applySemanticBoost } from "../utils/applySemanticBoost";
import { propagateScores } from "../utils/propagateScores";
import { rankResults, RankedResult } from "../utils/rankResults";

// Set to true to emit per-node score breakdowns for the top 5 results.
// Intended for evaluation and tuning — disable in production.
const DEBUG = process.env.CLASSIFY_DEBUG === "true";

// ---------------------------------------------------------------------------
// classifyDocument
//
// Enterprise-grade SIC classification orchestrator.
//
// Pipeline:
//   1. Fetch DocumentText by documentId
//   2. Preprocess document text (tokenise, n-gram, frequency maps)
//   3. Run deterministic signal-based scoring
//   4. Apply Postgres full-text-search boost (lexical layer)
//   5. Apply pgvector semantic boost (embedding layer)
//   6. Propagate scores bottom-up through the SIC hierarchy
//   7. Rank results and compute confidence scores
//   8. Persist top results to DocumentSicTag (tagSource = "rule")
//   9. Update Document.processingStatus → "classified"
//
// Guarantees:
//   • The entire persist + status-update step runs inside a transaction
//   • Each stage is timed and logged for observability
//   • Returns the ranked result array for downstream consumers
// ---------------------------------------------------------------------------

interface StageTimer {
  stage: string;
  durationMs: number;
}

export async function classifyDocument(
  documentId: string,
): Promise<RankedResult[]> {
  const timings: StageTimer[] = [];

  const time = async <T>(stage: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now();
    const result = await fn();
    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    timings.push({ stage, durationMs });
    console.log(`[classify] ${stage} completed in ${durationMs}ms`);
    return result;
  };

  const pipelineStart = performance.now();

  // ── 1. Fetch document text ──────────────────────────────────────────────
  const documentText = await time("fetchDocumentText", async () => {
    const record = await prisma.documentText.findUnique({
      where: { documentId },
      select: { content: true },
    });

    if (!record || !record.content) {
      throw new Error(
        `[classify] No text content found for document ${documentId}`,
      );
    }

    return record.content;
  });

  // ── 2. Preprocessing ───────────────────────────────────────────────────
  const preprocessed = await time("preprocessing", async () => {
    return preprocess(documentText);
  });

  // ── 3. Deterministic scoring ────────────────────────────────────────────
  const nodeScores = await time("deterministic scoring", async () => {
    return scoreSignals(preprocessed);
  });

  // Snapshot after deterministic scoring (for debug breakdown)
  const deterministicSnapshot = DEBUG
    ? new Map(Array.from(nodeScores, ([k, v]) => [k, v.finalScore]))
    : null;

  // ── 4. Lexical boost (pg_textsearch) ────────────────────────────────────
  await time("lexical boost", async () => {
    await applyTextSearchBoost(documentId, nodeScores);
  });

  // Snapshot after lexical boost
  const lexicalSnapshot = DEBUG
    ? new Map(Array.from(nodeScores, ([k, v]) => [k, v.finalScore]))
    : null;

  // ── 5. Semantic boost (pgvector) ────────────────────────────────────────
  await time("semantic boost", async () => {
    await applySemanticBoost(documentId, nodeScores);
  });

  // Snapshot after semantic boost
  const semanticSnapshot = DEBUG
    ? new Map(Array.from(nodeScores, ([k, v]) => [k, v.finalScore]))
    : null;

  // ── 6. Hierarchical propagation ─────────────────────────────────────────
  await time("propagation", async () => {
    await propagateScores(nodeScores);
  });

  // ── 7. Ranking ──────────────────────────────────────────────────────────
  const ranked = await time("ranking", async () => {
    return rankResults(nodeScores);
  });

  // ── DEBUG: Score breakdown for top 5 results ────────────────────────────
  if (DEBUG && deterministicSnapshot && lexicalSnapshot && semanticSnapshot) {
    const top5 = ranked.slice(0, 5);
    console.log("\n[classify:debug] Score breakdown (top 5):");
    console.table(
      top5.map((r) => {
        const det = deterministicSnapshot.get(r.sicNodeId) ?? 0;
        const afterLex = lexicalSnapshot.get(r.sicNodeId) ?? 0;
        const afterSem = semanticSnapshot.get(r.sicNodeId) ?? 0;
        return {
          sicNodeId: r.sicNodeId.slice(0, 12) + "…",
          deterministic: Math.round(det * 100) / 100,
          textSearchBoost: Math.round((afterLex - det) * 100) / 100,
          semanticBoost: Math.round((afterSem - afterLex) * 100) / 100,
          finalScore: Math.round(r.score * 100) / 100,
          confidence: Math.round(r.confidence * 1000) / 1000,
        };
      }),
    );
  }

  // ── 8 & 9. Persist tags + update status (transactional) ─────────────────
  await time("persistResults", async () => {
    await prisma.$transaction(async (tx) => {
      // Clear any existing rule-based tags for this document
      await tx.documentSicTag.deleteMany({
        where: {
          documentId,
          tagSource: "rule",
        },
      });

      // Insert top ranked results as DocumentSicTag entries
      if (ranked.length > 0) {
        await tx.documentSicTag.createMany({
          data: ranked.map((r) => ({
            documentId,
            sicNodeId: r.sicNodeId,
            confidence: r.confidence,
            tagSource: "rule" as const,
          })),
          skipDuplicates: true,
        });
      }

      // Update document processing status
      await tx.document.update({
        where: { id: documentId },
        data: { processingStatus: "classified" },
      });
    });
  });

  const totalMs = Math.round((performance.now() - pipelineStart) * 100) / 100;
  console.log(
    `[classify] Pipeline complete for ${documentId} in ${totalMs}ms | ` +
      `${ranked.length} tags persisted`,
  );
  console.table(timings);

  return ranked;
}
