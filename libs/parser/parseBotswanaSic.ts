import { v4 as uuid } from "uuid";

export type SicLevel = "industry" | "division" | "class" | "group";

export type ParsedSicNode = {
  id: string;
  parentId: string | null;
  level: SicLevel;
  code: string | null;
  title: string | null;
  description: string | null;

  isDuplicate: boolean;
  isInferred: boolean;
  isTruncated: boolean;
  isActive: boolean;

  path: string | null;
};

/* -------------------------
   Helpers
-------------------------- */

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function resolveLevelFromHeading(
  keyword: string,
  code: string | null,
): SicLevel {
  const lower = keyword.toLowerCase();

  if (lower === "industry") return "industry";
  if (lower === "division") return "division";

  if (code) {
    const digitCount = (code.match(/\d/g) || []).length;

    if (digitCount === 2) return "division";
    if (digitCount === 3) return "class"; // 3-digit = class
    if (digitCount === 4) return "group"; // 4-digit = group
  }

  if (lower === "class") return "class";
  if (lower === "group") return "group";

  return "division";
}

type ParsedHeading = {
  level: SicLevel;
  code: string | null;
  title: string | null;
};

function parseHeading(line: string): ParsedHeading | null {
  const match = line.match(/^(Industry|Division|Class|Group)\b\s*(.*)$/i);
  if (!match) return null;

  const keyword = match[1];
  let rest = match[2]?.trim() ?? "";

  let code: string | null = null;
  let title: string | null = null;

  if (rest) {
    // Drop a leading colon for patterns like "INDUSTRY: MANUFACTURING"
    rest = rest.replace(/^:\s*/, "");

    if (rest) {
      // Industries in this dataset do NOT have a code; use the
      // trailing text purely as the title and keep code null.
      if (keyword.toLowerCase() === "industry") {
        title = rest;
      } else {
        // Handles patterns like:
        // 10: Manufacture of Food Products
        // 101 Manufacture of Other Food Products
        const codeMatch = rest.match(/^([A-Z0-9]+)\s*[:\-]?\s*(.*)$/);
        if (codeMatch) {
          code = codeMatch[1];
          title = codeMatch[2]?.trim() || null;
        } else {
          title = rest;
        }
      }
    }
  }

  const level = resolveLevelFromHeading(keyword, code);

  return { level, code, title };
}

function isTruncatedTitle(title: string | null) {
  if (!title) return true;
  return title.trim().length < 4;
}

/* -------------------------
   Main parser
-------------------------- */

export function parseBotswanaSic(lines: string[]): ParsedSicNode[] {
  const nodes: ParsedSicNode[] = [];

  let currentIndustry: ParsedSicNode | null = null;
  let currentDivision: ParsedSicNode | null = null;
  let currentClass: ParsedSicNode | null = null;
  let currentGroup: ParsedSicNode | null = null;

  let descriptionTarget: ParsedSicNode | null = null;
  let descriptionBuffer: string[] = [];
  let inDescription = false;

  const flushDescription = () => {
    if (descriptionTarget && descriptionBuffer.length) {
      const text = normalizeWhitespace(descriptionBuffer.join(" "));
      if (text) {
        descriptionTarget.description = text;
      }
    }

    descriptionTarget = null;
    descriptionBuffer = [];
    inDescription = false;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inDescription) {
        descriptionBuffer.push("");
      }
      continue;
    }

    const heading = parseHeading(line);
    if (heading) {
      // A new heading always terminates the current description block
      flushDescription();

      const { level, code, title } = heading;

      const parent =
        level === "industry"
          ? null
          : level === "division"
            ? currentIndustry
            : level === "class"
              ? currentDivision
              : currentClass;

      const node: ParsedSicNode = {
        id: uuid(),
        parentId: parent?.id ?? null,
        level,
        code: code ?? null,
        title: title ?? null,
        description: null,

        isDuplicate: false,
        isInferred: !title,
        isTruncated: isTruncatedTitle(title),
        isActive: true,

        path: null,
      };

      // materialized path
      node.path = [parent?.path, node.code || node.title || node.id]
        .filter(Boolean)
        .join(" > ");

      nodes.push(node);

      // advance hierarchy cursor
      if (level === "industry") {
        currentIndustry = node;
        currentDivision = null;
        currentClass = null;
        currentGroup = null;
      } else if (level === "division") {
        currentDivision = node;
        currentClass = null;
        currentGroup = null;
      } else if (level === "class") {
        currentClass = node;
        currentGroup = null;
      } else if (level === "group") {
        currentGroup = node;
      }

      // Descriptions in the source files follow the most recent group
      if (level === "group") {
        descriptionTarget = node;
      }

      continue;
    }

    // Description blocks
    if (/^Description\s*:/i.test(line)) {
      inDescription = true;

      if (!descriptionTarget) {
        descriptionTarget =
          currentGroup || currentClass || currentDivision || currentIndustry;
      }

      const after = line.replace(/^Description\s*:\s*/i, "");
      if (after) {
        descriptionBuffer.push(after);
      }
      continue;
    }

    if (inDescription && descriptionTarget) {
      descriptionBuffer.push(line);
    }
  }

  // Flush any trailing description at EOF
  flushDescription();

  return nodes;
}
