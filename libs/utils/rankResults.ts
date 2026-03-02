import type { NodeScore, SignalMatch } from "./scoreSignals";

// ---------------------------------------------------------------------------
// rankResults
//
// Converts a raw Map<sicNodeId, NodeScore> into a ranked, confidence-scored
// result array suitable for presentation or downstream tagging.
//
// Algorithm:
//  1. Filter out any node whose finalScore === 0.
//  2. Sort remaining nodes descending by finalScore.
//  3. Keep the top N entries (default: 5).
//  4. Compute confidence for each entry using softmax-style normalization:
//       confidence = node.finalScore / sum(topN finalScores)
//  5. Return a plain array ordered highest → lowest confidence.
// ---------------------------------------------------------------------------

export interface RankedResult {
  sicNodeId: string;
  score: number;
  confidence: number;
  matches: SignalMatch[];
}

export function rankResults(
  nodeScores: Map<string, NodeScore>,
  topN: number = 5,
): RankedResult[] {
  // ── 1. Filter zero-score nodes ───────────────────────────────────────────
  const nonZero = Array.from(nodeScores.values()).filter(
    (ns) => ns.finalScore > 0,
  );

  if (nonZero.length === 0) return [];

  // ── 2. Sort descending by finalScore ────────────────────────────────────
  nonZero.sort((a, b) => b.finalScore - a.finalScore);

  // ── 3. Slice to topN ─────────────────────────────────────────────────────
  const top = nonZero.slice(0, topN);

  // ── 4. Sum of scores for normalization ───────────────────────────────────
  const total = top.reduce((sum, ns) => sum + ns.finalScore, 0);

  // ── 5. Build output ───────────────────────────────────────────────────────
  return top.map((ns) => ({
    sicNodeId: ns.sicNodeId,
    score: ns.finalScore,
    confidence: total > 0 ? ns.finalScore / total : 0,
    matches: ns.matches,
  }));
}
