import { v4 as uuid } from 'uuid'

export type SicLevel = 'industry' | 'division' | 'class' | 'group'

export type ParsedSicNode = {
  id: string
  parentId: string | null
  level: SicLevel
  code: string | null
  title: string | null
  description: string | null

  isDuplicate: boolean
  isInferred: boolean
  isTruncated: boolean
  isActive: boolean

  path: string | null
}

/* -------------------------
   Helpers
-------------------------- */

function detectLevel(line: string): SicLevel | null {
  if (/^industry/i.test(line)) return 'industry'
  if (/^division/i.test(line)) return 'division'
  if (/^class/i.test(line)) return 'class'
  if (/^group/i.test(line)) return 'group'
  return null
}

function extractCodeAndTitle(line: string) {
  // Handles:
  // Class 131:
  // Group 1311: Spinning of textile fibres
  // Division 01 Agriculture
  const match = line.match(
    /(Industry|Division|Class|Group)\s+([A-Z0-9]+)?\s*:?\s*(.*)?$/i
  )

  return {
    code: match?.[2] ?? null,
    title: match?.[3]?.trim() || null
  }
}

function isTruncatedTitle(title: string | null) {
  if (!title) return true
  return title.length < 4
}

/* -------------------------
   Main parser
-------------------------- */

export function parseBotswanaSic(lines: string[]): ParsedSicNode[] {
  const nodes: ParsedSicNode[] = []

  let currentIndustry: ParsedSicNode | null = null
  let currentDivision: ParsedSicNode | null = null
  let currentClass: ParsedSicNode | null = null

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue

    const level = detectLevel(line)
    if (!level) continue

    const { code, title } = extractCodeAndTitle(line)

    const parent =
      level === 'industry'
        ? null
        : level === 'division'
        ? currentIndustry
        : level === 'class'
        ? currentDivision
        : currentClass

    const node: ParsedSicNode = {
      id: uuid(),
      parentId: parent?.id ?? null,
      level,
      code,
      title,
      description: null,

      isDuplicate: false,
      isInferred: !title,
      isTruncated: isTruncatedTitle(title),
      isActive: true,

      path: null
    }

    // materialized path
    node.path = [
      parent?.path,
      code || title || node.id
    ]
      .filter(Boolean)
      .join(' > ')

    nodes.push(node)

    // advance hierarchy cursor
    if (level === 'industry') {
      currentIndustry = node
      currentDivision = null
      currentClass = null
    }

    if (level === 'division') {
      currentDivision = node
      currentClass = null
    }

    if (level === 'class') {
      currentClass = node
    }
  }

  return nodes
}
