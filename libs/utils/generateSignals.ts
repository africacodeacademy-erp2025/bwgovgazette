import { SicNode } from "@prisma/client";
import { PorterStemmer } from "natural";

import { ENGLISH_STOPWORDS } from "./stopwords";

enum SignalType {
  core = "core",
  phrase = "phrase",
  verb = "verb",
}

// ---------------------------------------------------------------------------
// Stopword list – common English function words unlikely to be meaningful
// signals in an industry-classification context.
// ---------------------------------------------------------------------------
const STOPWORDS = ENGLISH_STOPWORDS;

// ---------------------------------------------------------------------------
// Verb-like suffixes used as a lightweight heuristic for process/action tokens
// ---------------------------------------------------------------------------
const VERB_SUFFIXES = ["ing", "ion", "tion", "sion", "ation", "ment"];

// ---------------------------------------------------------------------------
// normalizeSignal
// Lowercases, strips punctuation, collapses whitespace, removes stopwords,
// and returns the resulting phrase.  Returns an empty string for blank input.
// ---------------------------------------------------------------------------
export function normalizeSignal(value: string): string {
  const tokens = value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
  return tokens.join(" ");
}

// ---------------------------------------------------------------------------
// tokenizeText
// Splits text into lowercase tokens, removes punctuation, collapses
// whitespace, filters stopwords, and optionally applies Porter stemming via
// the `natural` library.  Pass `stem: true` to enable stemming.
// Returns both raw (filtered) tokens by default; the caller can obtain the
// normalised phrase by calling normalizeSignal on the same input.
// ---------------------------------------------------------------------------
export function tokenizeText(value: string, stem = false): string[] {
  const tokens = value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
  return stem ? tokens.map((t) => PorterStemmer.stem(t)) : tokens;
}

// ---------------------------------------------------------------------------
// tokenize (internal)
// Splits text into lowercase word tokens, stripping punctuation.  No
// stopword filtering is applied here – that is handled downstream by
// isNounLike / isVerbLike.
// ---------------------------------------------------------------------------
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

// ---------------------------------------------------------------------------
// isNounLike
// Returns true for tokens that are plausible content words:
//   - length > 3 (filters out very short tokens)
//   - not a stopword
// ---------------------------------------------------------------------------
function isNounLike(token: string): boolean {
  return token.length > 3 && !STOPWORDS.has(token);
}

// ---------------------------------------------------------------------------
// isVerbLike
// Returns true when a token ends with a recognised verbal/nominalization suffix.
// ---------------------------------------------------------------------------
function isVerbLike(token: string): boolean {
  return VERB_SUFFIXES.some((suffix) => token.endsWith(suffix));
}

// ---------------------------------------------------------------------------
// buildNgrams
// Builds n-grams from an ordered token array.
// ---------------------------------------------------------------------------
function buildNgrams(tokens: string[], n: number): string[] {
  const grams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    grams.push(tokens.slice(i, i + n).join(" "));
  }
  return grams;
}

// ---------------------------------------------------------------------------
// SicSignalCreateInput alias
// Using a plain object type to represent signal data before persistence.
// ---------------------------------------------------------------------------
export type SicSignalCreateInput = {
  sicNodeId: string;
  signal: string;
  weight: number;
  type: string;
  /// Inverse document-frequency proxy computed by generateSignalsForCorpus.
  /// Defaults to 1 when called without a frequency map (single-node context).
  specificity: number;
};

// ---------------------------------------------------------------------------
// generateSignalsForNode
//
// Deterministically derives weighted signals from a SicNode's title and
// description.  Each signal is normalised and deduplicated before being
// returned; the first occurrence of a signal wins if it appears in more
// than one category.
//
// Weight defaults:
//   core   (noun-like unigrams)  → 3
//   phrase (bigrams + trigrams)  → 5
//   verb   (verb-like unigrams)  → 2
//
// @param freqMap  Optional corpus frequency map (signal → node count) built by
//                 buildSignalFrequencyMap.  When provided, specificity is set to
//                 1 / frequency.  Without it, specificity defaults to 1.
// ---------------------------------------------------------------------------
export function generateSignalsForNode(
  node: SicNode,
  freqMap?: ReadonlyMap<string, number>,
): SicSignalCreateInput[] {
  const text = [node.title ?? "", node.description ?? ""].join(" ");
  const tokens = tokenize(text);

  // Track seen normalised signals so we never emit duplicates
  const seen = new Set<string>();
  const results: SicSignalCreateInput[] = [];

  function emit(raw: string, type: SignalType, weight: number): void {
    const signal = normalizeSignal(raw);
    if (!signal || seen.has(signal)) return;
    seen.add(signal);
    const freq = freqMap?.get(signal) ?? 1;
    const specificity = 1 / freq;
    results.push({ sicNodeId: node.id, signal, weight, type, specificity });
  }

  // ── 1. Core noun-like unigrams ──────────────────────────────────────────
  for (const token of tokens) {
    if (isNounLike(token)) {
      emit(token, SignalType.core, 3);
    }
  }

  // ── 2. Verb-like unigrams ───────────────────────────────────────────────
  for (const token of tokens) {
    if (isVerbLike(token)) {
      emit(token, SignalType.verb, 2);
    }
  }

  // ── 3. Bigrams and trigrams from content tokens only ────────────────────
  // Filter to noun-like tokens to keep phrases meaningful.
  const contentTokens = tokens.filter(isNounLike);

  for (const bigram of buildNgrams(contentTokens, 2)) {
    emit(bigram, SignalType.phrase, 5);
  }

  for (const trigram of buildNgrams(contentTokens, 3)) {
    emit(trigram, SignalType.phrase, 5);
  }

  return results;
}

// ---------------------------------------------------------------------------
// buildSignalFrequencyMap
//
// Scans every node in the corpus and records how many *distinct* nodes
// produce each normalised signal.  This is the document-frequency (DF)
// denominator used in the specificity calculation.
//
//   DF(signal) = number of nodes whose text contains that signal
//
// The map is passed back into generateSignalsForNode so that specificity
// can be computed in a single corpus pass.
// ---------------------------------------------------------------------------
export function buildSignalFrequencyMap(nodes: SicNode[]): Map<string, number> {
  const freq = new Map<string, number>();
  for (const node of nodes) {
    // Generate raw signals without a freqMap – we only need the signal keys.
    const signals = generateSignalsForNode(node);
    for (const { signal } of signals) {
      freq.set(signal, (freq.get(signal) ?? 0) + 1);
    }
  }
  return freq;
}

// ---------------------------------------------------------------------------
// generateSignalsForCorpus
//
// Full corpus pipeline – the recommended entry point when seeding or
// reprocessing all SIC nodes:
//
//   1. Build a signal → node-count frequency map across all nodes.
//   2. Re-derive signals for every node, injecting the frequency map so
//      each signal receives an accurate specificity score:
//
//        specificity = 1 / DF(signal)
//
//      • specificity = 1.0  → signal appears in exactly one node (highly specific)
//      • specificity → 0    → signal is shared across many nodes (generic)
//
// Returns a flat array of SicSignalCreateInput ready for prisma.sicSignal.createMany().
// ---------------------------------------------------------------------------
export function generateSignalsForCorpus(
  nodes: SicNode[],
): SicSignalCreateInput[] {
  const freqMap = buildSignalFrequencyMap(nodes);
  return nodes.flatMap((node) => generateSignalsForNode(node, freqMap));
}
