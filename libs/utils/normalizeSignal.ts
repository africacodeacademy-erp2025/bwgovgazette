import { PorterStemmer } from "natural";

/* ─────────────────────────────────────────────
   Common English stopwords
───────────────────────────────────────────── */

const STOPWORDS = new Set([
  "a", "an", "the",
  "and", "but", "or", "nor", "for", "yet", "so",
  "in", "on", "at", "to", "of", "by", "up", "as",
  "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did",
  "will", "would", "shall", "should", "may", "might",
  "can", "could", "it", "its", "this", "that",
  "with", "from", "into", "than", "not", "no",
]);

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function removePunctuation(text: string): string {
  return text.replace(/[^\w\s]/g, " ");
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/* ─────────────────────────────────────────────
   Public API
───────────────────────────────────────────── */

/**
 * Splits the input into lowercase tokens with punctuation removed,
 * filters out common English stopwords, and optionally applies
 * Porter stemming via the `natural` library.
 *
 * @param value   - Raw input string.
 * @param stem    - When `true`, each token is passed through PorterStemmer.
 * @returns Array of cleaned (and optionally stemmed) tokens.
 */
export function tokenizeText(value: string, stem = false): string[] {
  const cleaned = collapseWhitespace(removePunctuation(value.toLowerCase()));

  if (!cleaned) return [];

  const tokens = cleaned.split(" ").filter((t) => t.length > 0 && !STOPWORDS.has(t));

  return stem ? tokens.map((t) => PorterStemmer.stem(t)) : tokens;
}

/**
 * Returns a single normalized phrase derived from the input by applying
 * the full pipeline: lowercase → remove punctuation → collapse whitespace
 * → remove stopwords → optional stemming.
 *
 * @param value - Raw input string.
 * @param stem  - When `true`, tokens are stemmed before joining.
 * @returns Normalized phrase as a space-separated string.
 */
export function normalizeSignal(value: string, stem = false): string {
  return tokenizeText(value, stem).join(" ");
}
