
import { prisma } from '../prisma.ts'
import type { ParsedSicNode } from './parseBotswanaSic.ts'

export async function insertSicNodes(nodes: ParsedSicNode[]) {
  if (!nodes.length) {
    console.warn('No SIC nodes to insert')
    return
  }

  console.log(`Inserting ${nodes.length} SIC nodes...`)

  try {
    await prisma.sicNode.createMany({
      data: nodes.map(node => ({
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
      })),
      skipDuplicates: true
    })
    console.log('SIC insert complete')
  } catch (err) {
    console.error('SIC seeding failed', err)
    throw err
  }
}
