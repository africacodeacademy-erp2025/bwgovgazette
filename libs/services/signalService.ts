import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import type { PreprocessedDocument } from "../utils/preprocessDocument";

export interface NodeScore {
  sicNodeId: string;
  rawScore: number;
  penalty: number;
  finalScore: number;
  matches: {
    signal: string;
    frequency: number;
    weight: number;
    specificity: number;
    contribution: number;
  }[];
}

type SignalRow = {
  sicNodeId: string;
  normalizedValue: string;
  type: string;
  weight: number;
  specificity: number;
};

function getOrCreateNodeScore(
  map: Map<string, NodeScore>,
  sicNodeId: string,
): NodeScore {
  const existing = map.get(sicNodeId);
  if (existing) return existing;

  const created: NodeScore = {
    sicNodeId,
    rawScore: 0,
    penalty: 0,
    finalScore: 0,
    matches: [],
  };
  map.set(sicNodeId, created);
  return created;
}

export async function scoreSignals(
  preprocessed: PreprocessedDocument,
): Promise<Map<string, NodeScore>> {
  // For fast membership checks.
  const bigrams = new Set(preprocessed.bigrams);
  const trigrams = new Set(preprocessed.trigrams);
  const unigramFrequency = preprocessed.frequency;

  // Fetch active signals for active, content-bearing nodes.
  // Order results for deterministic scoring output.
  const signals = await prisma.sicSignal.findMany({
    where: {
      isActive: true,
      sicNode: { hasContent: true, isActive: true },
    },
    select: {
      sicNodeId: true,
      normalizedValue: true,
      type: true,
      weight: true,
      specificity: true,
    },
    orderBy: [
      { sicNodeId: "asc" },
      { normalizedValue: "asc" },
      { type: "asc" },
    ],
  });

  const results = new Map<string, NodeScore>();

  for (const signal of signals as SignalRow[]) {
    const normalizedValue = signal.normalizedValue;
    if (!normalizedValue) continue;

    let frequency = 0;

    // Match rules:
    // - core/verb/synonym match against unigram tokens via frequency map
    // - phrase matches against bigrams/trigrams via membership
    // - all other types default to unigram matching (deterministic + simple)
    if (signal.type === "phrase") {
      if (bigrams.has(normalizedValue) || trigrams.has(normalizedValue)) {
        frequency = 1;
      }
    } else if (
      signal.type === "core" ||
      signal.type === "verb" ||
      signal.type === "synonym" ||
      signal.type === "negative" ||
      signal.type === "boost"
    ) {
      frequency = unigramFrequency.get(normalizedValue) ?? 0;
    } else {
      frequency = unigramFrequency.get(normalizedValue) ?? 0;
    }

    if (frequency <= 0) continue;

    const score = frequency * signal.weight * signal.specificity;
    const nodeScore = getOrCreateNodeScore(results, signal.sicNodeId);

    if (signal.type === "negative") {
      const penaltyContribution = Math.abs(score);
      nodeScore.penalty += penaltyContribution;
      nodeScore.matches.push({
        signal: normalizedValue,
        frequency,
        weight: signal.weight,
        specificity: signal.specificity,
        contribution: penaltyContribution,
      });
      continue;
    }

    nodeScore.rawScore += score;
    nodeScore.matches.push({
      signal: normalizedValue,
      frequency,
      weight: signal.weight,
      specificity: signal.specificity,
      contribution: score,
    });
  }

  for (const nodeScore of results.values()) {
    nodeScore.finalScore = Math.max(nodeScore.rawScore - nodeScore.penalty, 0);
  }

  return results;
}

// ---------------------------------------------------------------------------
// SignalCount – internal type for raw query results
// ---------------------------------------------------------------------------
type SignalCount = {
  normalizedValue: string;
  count: number;
};

// ---------------------------------------------------------------------------
// BATCH_SIZE
// Number of updateMany calls dispatched inside a single transaction chunk.
// Keeps individual transactions from growing too large on wide corpora.
// ---------------------------------------------------------------------------
const BATCH_SIZE = 200;

// ---------------------------------------------------------------------------
// chunkArray – splits an array into sequential chunks of at most `size` items.
// ---------------------------------------------------------------------------
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ---------------------------------------------------------------------------
// computeSignalSpecificity
//
// Recomputes the `specificity` field for every active SicSignal in the DB.
// A signal is considered "active" when its parent SicNode has isActive = true.
//
// Algorithm:
//   1. GROUP BY signal value, counting distinct sicNodeIds — restricted to
//      signals that belong to at least one active SicNode.
//   2. specificity = 1 / distinctNodeCount
//      · 1.0  → signal is unique to a single node  (maximally specific)
//      · →0   → signal is shared across many nodes (generic / noisy)
//   3. All writes are batched and wrapped in Prisma interactive transactions
//      (BATCH_SIZE rows per transaction) to keep memory and lock contention low.
//
// Returns a summary object with the total number of distinct signals updated.
// ---------------------------------------------------------------------------
export async function computeSignalSpecificity(): Promise<{
  updatedSignals: number;
  totalRows: number;
}> {
  // ── Step 1 ─────────────────────────────────────────────────────────────
  // Raw GROUP BY query: for each normalised signal value, count the number of
  // *distinct* active sicNodeIds that reference it.
  //
  // Using $queryRaw so Prisma doesn't try to map an aggregation to a model.
  // ────────────────────────────────────────────────────────────────────────
  const grouped = await prisma.$queryRaw<SignalCount[]>(Prisma.sql`
    SELECT
      s."normalizedValue",
      COUNT(DISTINCT s."sicNodeId")::int AS count
    FROM   "SicSignal"  s
    JOIN   "SicNode"    n ON n.id = s."sicNodeId"
    WHERE  n."isActive" = true
    GROUP  BY s."normalizedValue"
  `);

  if (grouped.length === 0) {
    return { updatedSignals: 0, totalRows: 0 };
  }

  // ── Step 2 ──────────────────────────────────────────────────────────────
  // Build update payloads.
  //   specificity = 1 / count   (count is always ≥ 1 from the GROUP BY)
  // ────────────────────────────────────────────────────────────────────────
  const updates = grouped.map(({ normalizedValue, count }) => ({
    normalizedValue,
    specificity: 1 / count,
  }));

  // ── Step 3 ──────────────────────────────────────────────────────────────
  // Batch all updateMany calls into chunked interactive transactions so that
  // no single transaction holds locks on the entire sic_signals table.
  //
  // Each chunk issues BATCH_SIZE updateMany operations inside one transaction,
  // targeting only active-node signals (sicNode.isActive = true via relation
  // filter) to stay consistent with Step 1.
  // ────────────────────────────────────────────────────────────────────────
  let totalRows = 0;

  for (const batch of chunkArray(updates, BATCH_SIZE)) {
    await prisma.$transaction(async (tx) => {
      const counts = await Promise.all(
        batch.map(({ normalizedValue, specificity }) =>
          tx.sicSignal.updateMany({
            where: {
              normalizedValue,
              // Restrict to signals attached to active nodes only, matching
              // the scope of the GROUP BY query above.
              sicNode: { isActive: true },
            },
            data: { specificity },
          }),
        ),
      );
      totalRows += counts.reduce((sum, r) => sum + r.count, 0);
    });
  }

  return { updatedSignals: grouped.length, totalRows };
}
