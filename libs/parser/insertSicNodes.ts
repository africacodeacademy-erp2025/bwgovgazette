import { PrismaClient } from '@prisma/client'
import { ParsedSicNode } from './parseBotswanaSic'

const prisma = new PrismaClient()

export async function insertSicNodes(nodes: ParsedSicNode[]) {
  if (!nodes.length) {
    console.warn("No SIC nodes to insert");
    return;
  }

  console.log(`Inserting ${nodes.length} SIC nodes...`);

  await prisma.$transaction(
    nodes.map(node =>
      prisma.sicNode.create({
        data: {
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

          path: node.path
        }
      })
    )
  )

  console.log('SIC insert complete')
}
