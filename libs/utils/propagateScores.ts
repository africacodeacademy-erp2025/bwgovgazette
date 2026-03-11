import { prisma } from "../prisma";
import type { NodeScore } from "./scoreSignals";

// ---------------------------------------------------------------------------
// propagateScores
//
// Propagates finalScore values bottom-up through the SIC hierarchy so that
// parent nodes accumulate a weighted contribution from each of their children.
//
// Algorithm:
//  1. Fetch every SicNode (id + parentId only) – single DB round-trip.
//  2. Build an adjacency map: parentId → [childId, …]
//  3. Derive a post-order traversal order via iterative DFS from each root,
//     so every child is visited before its parent (prevents double-counting).
//  4. Walk the ordered list once:
//       if a node has children, add their contributions to its finalScore.
//
// Post-order guarantees that by the time we process a parent, every
// descendant's finalScore is already fully propagated.
//
// Nodes absent from nodeScores are silently skipped (no entry created).
// Nodes without children are left unchanged.
// ---------------------------------------------------------------------------
export async function propagateScores(
  nodeScores: Map<string, NodeScore>,
  propagationFactor: number = 0.4,
): Promise<void> {
  // ── 1. Fetch full SIC tree (id + parentId only) ─────────────────────────
  const nodes = await prisma.sicNode.findMany({
    select: {
      id: true,
      parentId: true,
    },
  });

  if (nodes.length === 0) return;

  // ── 2. Build adjacency and parent maps ───────────────────────────────────
  const children = new Map<string, string[]>(); // parentId → [childId, …]
  const parentOf = new Map<string, string | null>(); // id → parentId | null

  for (const node of nodes) {
    parentOf.set(node.id, node.parentId ?? null);
    if (!children.has(node.id)) children.set(node.id, []);
    if (node.parentId !== null && node.parentId !== undefined) {
      let siblings = children.get(node.parentId);
      if (!siblings) {
        siblings = [];
        children.set(node.parentId, siblings);
      }
      siblings.push(node.id);
    }
  }

  // ── 3. Post-order traversal (iterative DFS, children before parents) ─────
  //
  // We collect root nodes (parentId is null or references a node outside
  // the fetched set) and perform a full DFS, pushing nodes onto the result
  // list in post-order.
  const postOrder: string[] = [];
  const visited = new Set<string>();

  // Identify roots: nodes whose parentId is null/undefined or whose parent
  // is not present in the fetched set.
  const allIds = new Set(nodes.map((n) => n.id));
  const roots = nodes
    .filter((n) => n.parentId === null || !allIds.has(n.parentId!))
    .map((n) => n.id);

  // Iterative post-order DFS using an explicit stack.
  // Each stack entry is [nodeId, childrenIteratorIndex].
  for (const root of roots) {
    const stack: Array<{ id: string; childIdx: number }> = [
      { id: root, childIdx: 0 },
    ];

    while (stack.length > 0) {
      const frame = stack[stack.length - 1];

      if (visited.has(frame.id)) {
        // Guard against cycles – treat as already processed.
        stack.pop();
        continue;
      }

      const kids = children.get(frame.id) ?? [];

      if (frame.childIdx < kids.length) {
        // Push next unvisited child.
        const childId = kids[frame.childIdx];
        frame.childIdx += 1;
        if (!visited.has(childId)) {
          stack.push({ id: childId, childIdx: 0 });
        }
      } else {
        // All children processed – emit this node.
        visited.add(frame.id);
        postOrder.push(frame.id);
        stack.pop();
      }
    }
  }

  // ── 4. Bottom-up score propagation ───────────────────────────────────────
  //
  // For each node in post-order (leaves first, roots last):
  //   for each child in children[node]:
  //     parentScore.finalScore += child.finalScore * propagationFactor
  //
  // Because we visit in post-order, every child's finalScore has already
  // been updated with its own subtree contributions before we look at it here.
  for (const nodeId of postOrder) {
    const parentScore = nodeScores.get(nodeId);
    if (!parentScore) continue;

    const kids = children.get(nodeId) ?? [];
    for (const childId of kids) {
      const childScore = nodeScores.get(childId);
      if (!childScore) continue;
      parentScore.finalScore += childScore.finalScore * propagationFactor;
    }
  }
}
