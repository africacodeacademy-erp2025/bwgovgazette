import { prisma } from "../prisma";
import type { NodeScore } from "./scoreSignals";

// ---------------------------------------------------------------------------
// applySemanticBoost
//
// Adds a pgvector cosine-similarity layer on top of the deterministic scoring
// pipeline.  This is intentionally a *secondary* boost, not a primary scorer.
//
// Why secondary?
//   The deterministic pipeline (signal matching → text-search → propagation)
//   is interpretable, auditable, and reproducible.  Embedding similarity is a
//   useful "soft recall" mechanism that surfaces plausible SicNodes the
//   deterministic layer may have missed, but it can hallucinate relevance for
//   nodes with superficially similar descriptions.  By keeping it additive
//   and bounded, we ensure that:
//     a) A strong deterministic match is never outranked by semantics alone.
//     b) A borderline node can receive a gentle nudge if the vectors agree.
//     c) Completely new nodes can still enter the map via semantic-only score,
//        but at a conservative magnitude.
//
// Tuning:
//   SEMANTIC_BOOST_FACTOR controls global weight.  At 1.0 the max possible
//   boost is  (1.0 − 0.75) × 20 × 1.0 = 5.0 points – meaningful but not
//   dominant against typical deterministic scores of 10–50+.
//
// Safety guardrails:
//   MIN_SIMILARITY       – stricter floor (0.75) filters out marginal matches
//                          that the old 0.7 floor would have let through.
//   MAX_SEMANTIC_POINTS  – hard cap per node (30 pts) so even a perfect 1.0
//                          cosine similarity cannot dominate the final ranking.
//   DETERMINISTIC_CEILING– if a node already scores this high from
//                          deterministic + lexical layers, skip the semantic
//                          boost entirely.  Prevents inflating already-strong
//                          candidates and keeps the ranking stable.
// ---------------------------------------------------------------------------

/** Multiplicative factor applied to every semantic boost.  Tune down to
 *  reduce embedding influence, or up to let semantics dominate. */
const SEMANTIC_BOOST_FACTOR = 1.0;

/** Similarity below this threshold is treated as noise. */
const MIN_SIMILARITY = 0.75;

/** Hard upper bound (points) any single node can receive from semantics. */
const MAX_SEMANTIC_POINTS = 30;

/** Nodes whose deterministic finalScore already exceeds this value are
 *  skipped — they don't need (and shouldn't get) a semantic nudge. */
const DETERMINISTIC_CEILING = 50;

/** Maximum SicNodes to retrieve from the vector index per query. */
const TOP_K = 20;

/** Row shape returned by the cosine-similarity query. */
interface SimilarityRow {
  id: string;
  similarity: number;
}

/**
 * Fetch the document embedding, find the closest SicNodes by cosine
 * similarity, and add a bounded semantic boost to `nodeScores`.
 *
 * Mutates `nodeScores` in place.  Safe to call even when the document has
 * no embedding (returns immediately).
 */
export async function applySemanticBoost(
  documentId: string,
  nodeScores: Map<string, NodeScore>,
): Promise<void> {
  // ── 1. Fetch DocumentText embedding ─────────────────────────────────────
  const rows = await prisma.$queryRaw<{ embedding: string | null }[]>`
    SELECT embedding::text
    FROM "document_texts"
    WHERE "documentId" = ${documentId}
    LIMIT 1
  `;

  const embeddingText = rows[0]?.embedding;
  if (!embeddingText) {
    // No embedding stored for this document – nothing to boost.
    return;
  }

  // ── 2. Cosine similarity search against SicNode embeddings ──────────────
  const similar = await prisma.$queryRawUnsafe<SimilarityRow[]>(
    `
    SELECT id,
           1 - (embedding <=> $1::vector) AS similarity
    FROM "SicNode"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT $2
    `,
    embeddingText,
    TOP_K,
  );

  if (similar.length === 0) return;

  // ── 3. Convert similarity → bounded boost and apply ─────────────────────
  for (const row of similar) {
    // Anything below MIN_SIMILARITY is treated as noise.
    if (row.similarity < MIN_SIMILARITY) continue;

    // Raw boost: distance above the floor, scaled and factored.
    const rawBoost =
      (row.similarity - MIN_SIMILARITY) * 20 * SEMANTIC_BOOST_FACTOR;

    // Hard cap so semantics can never dominate the final ranking.
    const semanticScore = Math.min(rawBoost, MAX_SEMANTIC_POINTS);

    if (semanticScore <= 0) continue;

    const existing = nodeScores.get(row.id);

    if (existing) {
      // If the node already scores extremely high from deterministic +
      // lexical layers, skip the boost — it doesn't need a semantic nudge
      // and adding one could destabilise an already-strong ranking.
      if (existing.finalScore >= DETERMINISTIC_CEILING) continue;

      // Additive boost – does NOT override the deterministic score.
      // Also respect the cap relative to total contribution.
      existing.finalScore += Math.min(
        semanticScore,
        MAX_SEMANTIC_POINTS - Math.max(existing.finalScore, 0),
      );
    } else {
      // Node was not reached by deterministic scoring – initialise with
      // semantic-only score.  rawScore and penalty stay at 0 to make the
      // provenance clear in downstream inspection.
      nodeScores.set(row.id, {
        sicNodeId: row.id,
        rawScore: 0,
        penalty: 0,
        finalScore: semanticScore,
        matches: [],
      });
    }
  }
}
