import { prisma } from "../prisma";
import { PreprocessedDocument } from "./preprocessDocument";

// ---------------------------------------------------------------------------
// NodeScore
// Accumulates raw score, penalty, final score, and per-signal match details
// for a single SicNode.
// ---------------------------------------------------------------------------
export interface SignalMatch {
  signal: string;
  frequency: number;
  weight: number;
  specificity: number;
  contribution: number;
}

export interface NodeScore {
  sicNodeId: string;
  rawScore: number;
  penalty: number;
  finalScore: number;
  matches: SignalMatch[];
}

// ---------------------------------------------------------------------------
// buildNgramFrequency
// Converts an array of n-gram strings (bigrams or trigrams) into a frequency
// map.  O(n) single pass – no nested loops.
// ---------------------------------------------------------------------------
function buildNgramFrequency(ngrams: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const ng of ngrams) {
    freq.set(ng, (freq.get(ng) ?? 0) + 1);
  }
  return freq;
}

// ---------------------------------------------------------------------------
// Signal entry used in the pre-grouped lookup map.
// ---------------------------------------------------------------------------
interface SignalEntry {
  sicNodeId: string;
  normalizedValue: string;
  type: string;
  weight: number;
  specificity: number;
}

// ---------------------------------------------------------------------------
// scoreSignals
//
// Deterministic, signal-based SIC classification scorer.
//
// Algorithm  (refactored – token-first, O(tokens + matched signals)):
//  1. Fetch every active SicSignal whose parent SicNode has hasContent=true.
//  2. Pre-group signals into a Map<normalizedValue, SignalEntry[]> so that
//     every signal is reachable via an O(1) key lookup.
//  3. Build frequency maps for unigrams, bigrams, and trigrams – O(tokens).
//  4. Iterate the document's unique tokens (unigrams, bigrams, trigrams)
//     once.  For each token, look up matching signals via the Map.
//  5. contribution = frequency * weight * specificity
//  6. "negative" signals accumulate into penalty; all others into rawScore.
//  7. finalScore = Math.max(rawScore - penalty, 0)
//
// Time complexity:  O(T + M)  where T = unique document tokens,
//                   M = number of matching signal entries.
//                   Unmatched signals are never visited.
//
// Returns: Map<sicNodeId, NodeScore>
// ---------------------------------------------------------------------------
export async function scoreSignals(
  preprocessed: PreprocessedDocument,
): Promise<Map<string, NodeScore>> {
  // ── 1. Fetch signals ─────────────────────────────────────────────────────
  const signals = await prisma.sicSignal.findMany({
    where: {
      isActive: true,
      sicNode: { hasContent: true },
    },
    select: {
      sicNodeId: true,
      normalizedValue: true,
      type: true,
      weight: true,
      specificity: true,
    },
  });

  // ── 2. Pre-group signals by normalizedValue ──────────────────────────────
  // Multiple signals can share the same normalizedValue (different nodes or
  // types), so each key maps to an array of entries.
  const signalIndex = new Map<string, SignalEntry[]>();
  for (const s of signals) {
    if (!s.normalizedValue) continue;
    const wordCount = s.normalizedValue.split(" ").filter(Boolean).length;
    // Only index 1–3 word signals (matches the n-gram maps we have).
    if (wordCount < 1 || wordCount > 3) continue;

    let bucket = signalIndex.get(s.normalizedValue);
    if (!bucket) {
      bucket = [];
      signalIndex.set(s.normalizedValue, bucket);
    }
    bucket.push(s as SignalEntry);
  }

  // ── 3. Build frequency maps ──────────────────────────────────────────────
  // Unigram frequency is already in preprocessed.frequency.
  const bigramFreq = buildNgramFrequency(preprocessed.bigrams);
  const trigramFreq = buildNgramFrequency(preprocessed.trigrams);

  // ── 4. Iterate document tokens once & score matched signals ──────────────
  const scoreMap = new Map<string, NodeScore>();

  // Helper: given a token and its document frequency, score every signal
  // that shares that normalizedValue.
  function processToken(token: string, frequency: number): void {
    const entries = signalIndex.get(token);
    if (!entries) return;

    for (const {
      sicNodeId,
      normalizedValue,
      type,
      weight,
      specificity,
    } of entries) {
      // ── 5. Compute contribution (same math as before) ──────────────
      const contribution = frequency * weight * specificity;

      // ── 6. Accumulate into NodeScore ───────────────────────────────
      let node = scoreMap.get(sicNodeId);
      if (!node) {
        node = {
          sicNodeId,
          rawScore: 0,
          penalty: 0,
          finalScore: 0,
          matches: [],
        };
        scoreMap.set(sicNodeId, node);
      }

      node.matches.push({
        signal: normalizedValue,
        frequency,
        weight,
        specificity,
        contribution,
      });

      if (type === "negative") {
        node.penalty += Math.abs(contribution);
      } else {
        node.rawScore += contribution;
      }
    }
  }

  // Unigrams
  for (const [token, freq] of preprocessed.frequency) {
    processToken(token, freq);
  }
  // Bigrams
  for (const [token, freq] of bigramFreq) {
    processToken(token, freq);
  }
  // Trigrams
  for (const [token, freq] of trigramFreq) {
    processToken(token, freq);
  }

  // ── 7. Finalise scores ───────────────────────────────────────────────────
  for (const node of scoreMap.values()) {
    node.finalScore = Math.max(node.rawScore - node.penalty, 0);
  }

  return scoreMap;
}
