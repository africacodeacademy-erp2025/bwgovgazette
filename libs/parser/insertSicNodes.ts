import { ParsedSicNode, SicLevel } from "./parseBotswanaSic";
import { prisma } from "../prisma";

const LEVEL_ORDER: SicLevel[] = ["industry", "division", "class", "group"];

export async function insertSicNodes(nodes: ParsedSicNode[]) {
  if (!nodes.length) {
    console.warn("No SIC nodes to insert");
    return;
  }

  console.log(`Inserting ${nodes.length} SIC nodes...`);

  // Insert level-by-level so parent rows exist before children
  for (const level of LEVEL_ORDER) {
    const batch = nodes.filter((n) => n.level === level);
    if (!batch.length) continue;

    await prisma.sicNode.createMany({
      data: batch.map((node) => ({
        id: node.id,
        parentId: node.parentId,
        level: node.level,
        code: node.code,
        title: node.title,
        description: node.description,

        isDuplicate: node.isDuplicate,
        isInferred: node.isInferred,
        isTruncated: node.isTruncated,
        isActive: node.isActive,

        path: node.path,
      })),
      skipDuplicates: true,
    });

    console.log(`  Inserted ${batch.length} ${level} nodes`);
  }

  console.log("SIC insert complete");
}
