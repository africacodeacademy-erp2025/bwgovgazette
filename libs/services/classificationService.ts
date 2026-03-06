import { prisma } from "../prisma";
import { preprocess } from "../utils/preprocessDocument";
import { scoreSignals } from "../utils/scoreSignals";
import { applyTextSearchBoost } from "../utils/applyTextSearchBoost";
import { applySemanticBoost } from "../utils/applySemanticBoost";
import { propagateScores } from "../utils/propagateScores";
import { rankResults } from "../utils/rankResults";

// Set to true to emit per-node score breakdowns for the top 5 results.
// Intended for evaluation and tuning — disable in production.
const DEBUG = process.env.CLASSIFY_DEBUG === "true";

// ---------------------------------------------------------------------------
// ClassificationResult
//
// Enriched result returned by classifyDocument().  Includes SicNode metadata
// and a full score breakdown for frontend inspection.  Raw embeddings are
// intentionally excluded.
// ---------------------------------------------------------------------------
export interface ScoreBreakdown {
  deterministicScore: number;
  lexicalBoost: number;
  semanticBoost: number;
  penalty: number;
}

export interface ClassificationResult {
  sicNodeId: string;
  code: string | null;
  title: string | null;
  finalScore: number;
  confidence: number;
  breakdown: ScoreBreakdown;
  explanation: string;
  topSignals: { signal: string; contribution: number }[];
}

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
): Promise<ClassificationResult[]> {
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

  // Snapshot after deterministic scoring (always captured for breakdown)
  const deterministicSnapshot = new Map(
    Array.from(nodeScores, ([k, v]) => [
      k,
      { score: v.finalScore, penalty: v.penalty },
    ]),
  );

  // ── 4. Lexical boost (pg_textsearch) ────────────────────────────────────
  await time("lexical boost", async () => {
    await applyTextSearchBoost(documentId, nodeScores);
  });

  // Snapshot after lexical boost
  const lexicalSnapshot = new Map(
    Array.from(nodeScores, ([k, v]) => [k, v.finalScore]),
  );

  // ── 5. Semantic boost (pgvector) ────────────────────────────────────────
  await time("semantic boost", async () => {
    await applySemanticBoost(documentId, nodeScores);
  });

  // Snapshot after semantic boost
  const semanticSnapshot = new Map(
    Array.from(nodeScores, ([k, v]) => [k, v.finalScore]),
  );

  // ── 6. Hierarchical propagation ─────────────────────────────────────────
  await time("propagation", async () => {
    await propagateScores(nodeScores);
  });

  // ── 7. Ranking ──────────────────────────────────────────────────────────
  const ranked = await time("ranking", async () => {
    return rankResults(nodeScores);
  });

  // ── DEBUG: Score breakdown for top 5 results ────────────────────────────
  if (DEBUG) {
    const top5 = ranked.slice(0, 5);
    console.log("\n[classify:debug] Score breakdown (top 5):");
    console.table(
      top5.map((r) => {
        const det = deterministicSnapshot.get(r.sicNodeId)?.score ?? 0;
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

  // ── 8. Fetch SicNode metadata for enriched results ──────────────────────
  const sicNodeIds = ranked.map((r) => r.sicNodeId);
  const sicNodes = await time("fetchSicNodeMeta", async () => {
    return prisma.sicNode.findMany({
      where: { id: { in: sicNodeIds } },
      select: { id: true, code: true, title: true },
    });
  });
  const sicById = new Map(sicNodes.map((n) => [n.id, n] as const));

  // ── 9. Build enriched ClassificationResult[] ────────────────────────────
  const enriched: ClassificationResult[] = ranked.map((r) => {
    const sic = sicById.get(r.sicNodeId);
    const det = deterministicSnapshot.get(r.sicNodeId);
    const detScore = det?.score ?? 0;
    const penalty = det?.penalty ?? 0;
    const afterLex = lexicalSnapshot.get(r.sicNodeId) ?? 0;
    const afterSem = semanticSnapshot.get(r.sicNodeId) ?? 0;

    const topSignals = (r.matches ?? [])
      .slice()
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 6)
      .map((m) => ({
        signal: m.signal,
        contribution: Math.round(m.contribution * 100) / 100,
      }));

    const signalSummary = topSignals.map((s) => s.signal).join(", ");

    return {
      sicNodeId: r.sicNodeId,
      code: sic?.code ?? null,
      title: sic?.title ?? null,
      finalScore: Math.round(r.score * 100) / 100,
      confidence: Math.round(r.confidence * 1000) / 1000,
      breakdown: {
        deterministicScore: Math.round(detScore * 100) / 100,
        lexicalBoost: Math.round((afterLex - detScore) * 100) / 100,
        semanticBoost: Math.round((afterSem - afterLex) * 100) / 100,
        penalty: Math.round(penalty * 100) / 100,
      },
      explanation: `Matched signals: ${signalSummary}`,
      topSignals,
    };
  });

  // ── 10 & 11. Persist tags + update status (transactional) ───────────────
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

  return enriched;
}
