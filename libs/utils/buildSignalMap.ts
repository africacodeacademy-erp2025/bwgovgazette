import { prisma } from "../prisma";
import { generateSignalsForCorpus } from "./generateSignals";
import { SignalType, SicNode } from "@prisma/client";

// ---------------------------------------------------------------------------
// BATCH_SIZE – number of signals to upsert per transaction chunk.
// ---------------------------------------------------------------------------
const BATCH_SIZE = 500;

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
// isSignalEligible – determines whether a SicNode should be processed.
// ---------------------------------------------------------------------------
function isSignalEligible(node: SicNode): boolean {
  if (node.description === null) {
    return false;
  }

  if (node.description.trim().length < 40) {
    return false;
  }

  if (node.isActive === false) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// buildSignalMap
//
// Idempotent script that populates the SicSignal table from all active
// SicNodes.  Safe to re-run: duplicates (same signal + sicNodeId) are
// skipped via skipDuplicates.
//
// Steps:
//   1. Fetch all active SicNodes.
//   2. Generate signals for the entire corpus (with specificity scoring).
//   3. Insert signals in batches, skipping duplicates.
//
// NOTE: SicSignal has governance defaults (createdBy/isActive). If you need to
//       override those, set them in the createMany payload below.
// ---------------------------------------------------------------------------
export async function buildSignalMap(): Promise<{
  nodesProcessed: number;
  signalsGenerated: number;
  signalsInserted: number;
}> {
  // ── 1. Fetch active SicNodes ────────────────────────────────────────────
  const allNodes = await prisma.sicNode.findMany();

  const nodes = allNodes.filter((node) => isSignalEligible(node));
  const skippedCount = allNodes.length - nodes.length;

  console.log(
    `[buildSignalMap] Eligible SicNode(s): ${nodes.length}; skipped: ${skippedCount}.`,
  );

  if (nodes.length === 0) {
    console.log("[buildSignalMap] Nothing to do – no eligible nodes.");
    return { nodesProcessed: 0, signalsGenerated: 0, signalsInserted: 0 };
  }

  // ── 2. Generate signals for every node (with corpus-wide specificity) ──
  const signals = generateSignalsForCorpus(nodes);

  console.log(
    `[buildSignalMap] Generated ${signals.length} signal(s) across ${nodes.length} processed node(s).`,
  );

  // ── 3. Insert in batches, skipping duplicates ──────────────────────────
  //    Prisma's createMany with skipDuplicates requires a unique constraint.
  //    SicSignal currently has no @@unique([signal, sicNodeId]), so we
  //    manually deduplicate against existing rows per batch.
  // ────────────────────────────────────────────────────────────────────────

  let totalInserted = 0;

  for (const batch of chunkArray(signals, BATCH_SIZE)) {
    // Collect all sicNodeIds in this batch to fetch existing signals in one go
    const nodeIds = [...new Set(batch.map((s) => s.sicNodeId))];

    const existing = await prisma.sicSignal.findMany({
      where: { sicNodeId: { in: nodeIds } },
      select: { normalizedValue: true, sicNodeId: true, type: true },
    });

    const existingKeys = new Set(
      existing.map((e) => `${e.normalizedValue}::${e.sicNodeId}::${e.type}`),
    );

    const toInsert = batch.filter(
      (s) => !existingKeys.has(`${s.signal}::${s.sicNodeId}::${s.type}`),
    );

    if (toInsert.length === 0) {
      continue;
    }

    const result = await prisma.sicSignal.createMany({
      data: toInsert.map((s) => ({
        sicNodeId: s.sicNodeId,
        signalValue: s.signal,
        normalizedValue: s.signal,
        weight: s.weight,
        type: s.type as SignalType,
        specificity: s.specificity,
      })),
      skipDuplicates: true,
    });

    totalInserted += result.count;
  }

  console.log(
    `[buildSignalMap] Inserted ${totalInserted} new signal(s) (${signals.length - totalInserted} duplicates skipped).`,
  );

  return {
    nodesProcessed: nodes.length,
    signalsGenerated: signals.length,
    signalsInserted: totalInserted,
  };
}

// ---------------------------------------------------------------------------
// CLI entry point – run directly with ts-node / tsx
// ---------------------------------------------------------------------------
if (require.main === module) {
  buildSignalMap()
    .then((result) => {
      console.log("[buildSignalMap] Done.", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[buildSignalMap] Fatal error:", err);
      process.exit(1);
    });
}
