import { ENGLISH_STOPWORDS } from "./stopwords";

export interface PreprocessedDocument {
  tokens: string[];
  bigrams: string[];
  trigrams: string[];
  frequency: Map<string, number>;
}

export function buildNgrams(tokens: string[], n: number): string[] {
  if (!Number.isFinite(n) || n < 1) return [];
  if (tokens.length < n) return [];

  const grams: string[] = [];
  for (let index = 0; index <= tokens.length - n; index++) {
    grams.push(tokens.slice(index, index + n).join(" "));
  }
  return grams;
}

export function preprocess(text: string): PreprocessedDocument {
  const normalized = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const rawTokens = normalized.length > 0 ? normalized.split(" ") : [];

  const tokens = rawTokens
    .filter((token) => token.length >= 3)
    .filter((token) => !ENGLISH_STOPWORDS.has(token));

  const bigrams = buildNgrams(tokens, 2);
  const trigrams = buildNgrams(tokens, 3);

  const frequency = new Map<string, number>();
  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return { tokens, bigrams, trigrams, frequency };
}
