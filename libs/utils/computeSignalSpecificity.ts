import { prisma } from "../prisma";

/**
 * Computes and updates the `specificity` score for every active SicSignal.
 *
 * Algorithm:
 *  1. Group active signals by normalizedValue.
 *  2. Count how many distinct sicNodeIds share each normalizedValue.
 *  3. Set specificity = 1 / count  (a signal used by many nodes is less specific).
 *  4. All updates run inside a Prisma transaction.
 */
export async function computeSignalSpecificity(): Promise<void> {
  const signals = await prisma.sicSignal.findMany({
    where: {
      isActive: true,
      sicNode: { description: { not: null } },
    },
    select: {
      normalizedValue: true,
      sicNodeId: true,
      sicNode: { select: { description: true } },
    },
  });

  type SicNodeId = (typeof signals)[number]["sicNodeId"];
  const sharingMap = new Map<string, Set<SicNodeId>>();
  let totalSignalsAnalyzed = 0;

  for (const signal of signals) {
    const description = signal.sicNode.description;

    if (!description || description.length < 40) {
      continue;
    }

    if (!signal.normalizedValue) {
      continue;
    }

    totalSignalsAnalyzed += 1;

    const key = signal.normalizedValue;
    let set = sharingMap.get(key);
    if (!set) {
      set = new Set<SicNodeId>();
      sharingMap.set(key, set);
    }

    set.add(signal.sicNodeId);
  }

  const uniqueSignals = sharingMap.size;
  let maxSharingCount = 0;

  for (const sicNodeIds of sharingMap.values()) {
    if (sicNodeIds.size > maxSharingCount) {
      maxSharingCount = sicNodeIds.size;
    }
  }

  console.log(
    `[computeSignalSpecificity] total signals analyzed=${totalSignalsAnalyzed}, max sharing count=${maxSharingCount}, unique signals=${uniqueSignals}`,
  );

  await prisma.$transaction(async (tx) => {
    const updateBatch: Array<ReturnType<typeof tx.sicSignal.updateMany>> = [];
    const batchSize = 200;

    for (const [normalizedValue, sicNodeIds] of sharingMap) {
      const specificity = 1 / sicNodeIds.size;

      updateBatch.push(
        tx.sicSignal.updateMany({
          where: {
            normalizedValue,
            isActive: true,
            sicNodeId: { in: Array.from(sicNodeIds) },
          },
          data: { specificity },
        }),
      );

      if (updateBatch.length >= batchSize) {
        await Promise.all(updateBatch);
        updateBatch.length = 0;
      }
    }

    if (updateBatch.length > 0) {
      await Promise.all(updateBatch);
    }
  });
}
