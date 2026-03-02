import { prisma } from "../prisma";
import { NodeScore } from "./scoreSignals";

// ---------------------------------------------------------------------------
// BOOST_FACTOR
//
// Multiplier applied to the Postgres ts_rank score before adding it to the
// deterministic finalScore.  ts_rank returns values in [0, 1], so raw values
// are small relative to deterministic scores which can reach several hundred.
//
// Tuning guidance:
//   • Too low  (e.g. 1–2)  → FTS contribution is negligible; the hybrid
//                             approach yields the same ordering as deterministic.
//   • Too high (e.g. 100+) → A high-frequency but contextually weak node can
//                             overtake a precisely signalled node, defeating
//                             the deterministic scoring philosophy.
//   • 10 is a sensible default: it keeps the boost meaningfully additive
//     while ensuring the deterministic baseline always dominates unless the
//     FTS rank is unusually strong (> 0.1, i.e. multiple weighted matches).
//
// Adjust this constant during evaluation by observing whether the FTS layer
// promotes the *right* nodes without demoting correct deterministic winners.
// ---------------------------------------------------------------------------
const BOOST_FACTOR = 10;

// ---------------------------------------------------------------------------
// buildTsQueryString
//
// Converts an array of normalised signal strings into a single expression
// that is safe to pass to Postgres to_tsquery('english', ...).
//
// Construction rules:
//   • Single-word signals → bare lexeme:          "mining"
//   • Multi-word signals  → phrase operator (<->): "financial <-> services"
//   • All signals are joined with OR ( | ) so that *any* matching signal
//     contributes to the ts_rank rather than requiring all to be present.
//
// Returns null when no valid token can be derived (caller should skip node).
// ---------------------------------------------------------------------------
function buildTsQueryString(signals: string[]): string | null {
  const parts: string[] = [];

  for (const signal of signals) {
    // Re-tokenise the already-normalised signal to strip any residual
    // punctuation and guarantee only alphanumeric tokens reach to_tsquery.
    const tokens = signal
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    if (tokens.length === 0) continue;

    if (tokens.length === 1) {
      // Bare lexeme – Postgres will stem it via the 'english' dictionary.
      parts.push(tokens[0]);
    } else {
      // Phrase: connect adjacent tokens with the Postgres phrase adjacency
      // operator (<->) so a bigram like "financial services" only matches
      // when those tokens appear next to each other in the document.
      parts.push(tokens.join(" <-> "));
    }
  }

  return parts.length > 0 ? parts.join(" | ") : null;
}

// ---------------------------------------------------------------------------
// RankRow
// Shape returned by the batched $queryRaw call.
// ---------------------------------------------------------------------------
interface RankRow {
  sic_node_id: string;
  rank: number;
}

// ---------------------------------------------------------------------------
// applyTextSearchBoost
//
// Enhances deterministic NodeScore.finalScore values with a Postgres
// full-text search rank.  A single batched SQL query handles all scored nodes
// so we avoid issuing one query per node (which, at ~792 nodes, would be
// extremely expensive).
//
// Algorithm:
//   1. Fetch core + phrase signals for every node present in nodeScores.
//   2. Build a per-node to_tsquery string from those signals.
//   3. Issue ONE $queryRaw that unnests two parallel arrays (node IDs and
//      query strings) and cross-joins against document_texts to call
//      ts_rank once per node, all in a single round-trip.
//   4. Add BOOST_FACTOR * ts_rank to each node's finalScore in-place.
//
// The deterministic score is never reset or overwritten – the FTS component
// is purely additive, preserving the integrity of the signal-based ranking.
//
// @param documentId  UUID of the document whose tsv column is queried.
// @param nodeScores  Live map from scoreSignals(); mutated in-place.
// ---------------------------------------------------------------------------
export async function applyTextSearchBoost(
  documentId: string,
  nodeScores: Map<string, NodeScore>,
): Promise<void> {
  if (nodeScores.size === 0) return;

  const nodeIds = Array.from(nodeScores.keys());

  // ── 1. Fetch core + phrase signals for all relevant nodes ─────────────────
  // We intentionally limit to 'core' and 'phrase' signal types:
  //   • core   → single content-rich nouns highly specific to the industry
  //   • phrase → bigram/trigram phrases that are the strongest FTS signals
  //   • verb, synonym, negative, boost – less reliable as tsquery terms and
  //     would dilute the FTS query with generic or negative terms.
  const rawSignals = await prisma.sicSignal.findMany({
    where: {
      sicNodeId: { in: nodeIds },
      type: { in: ["core", "phrase"] },
      isActive: true,
    },
    select: {
      sicNodeId: true,
      normalizedValue: true,
    },
  });

  // ── 2. Group signals by node and build tsquery strings ────────────────────
  const signalsByNode = new Map<string, string[]>();
  for (const { sicNodeId, normalizedValue } of rawSignals) {
    if (!normalizedValue) continue;
    const existing = signalsByNode.get(sicNodeId);
    if (existing) {
      existing.push(normalizedValue);
    } else {
      signalsByNode.set(sicNodeId, [normalizedValue]);
    }
  }

  // Build two parallel arrays: node IDs and their corresponding tsquery
  // expression strings.  Nodes with no derivable expression are omitted so
  // they don't produce a syntactically invalid to_tsquery call.
  const batchNodeIds: string[] = [];
  const batchQueryStrings: string[] = [];

  for (const nodeId of nodeIds) {
    const nodeSignals = signalsByNode.get(nodeId);
    if (!nodeSignals || nodeSignals.length === 0) continue;

    const queryString = buildTsQueryString(nodeSignals);
    if (!queryString) continue;

    batchNodeIds.push(nodeId);
    batchQueryStrings.push(queryString);
  }

  if (batchNodeIds.length === 0) return;

  // ── 3. Single batched ts_rank query ───────────────────────────────────────
  //
  // Strategy: unnest two parallel text[] arrays into (sic_node_id, query_text)
  // rows, then CROSS JOIN against the single document_texts row for this
  // document.  This keeps the query to ONE round-trip regardless of how many
  // nodes are in nodeScores.
  //
  // to_tsquery('english', ...) stems and normalises each expression using the
  // same English dictionary that was used when the tsv column was populated
  // (see migration 20260223120000_add_fts_to_document_texts).
  //
  // ts_rank returns a float4 in [0, 1] that reflects how frequently and
  // prominently the query terms appear in the tsvector.  A zero rank means
  // none of the node's signals appear in the document at all.
  const rows = await prisma.$queryRaw<RankRow[]>`
    SELECT
      nq.sic_node_id,
      ts_rank(dt."tsv", to_tsquery('english', nq.query_text)) AS rank
    FROM
      unnest(
        ${batchNodeIds}::text[],
        ${batchQueryStrings}::text[]
      ) AS nq(sic_node_id, query_text)
    CROSS JOIN "document_texts" dt
    WHERE
      dt."documentId" = ${documentId}
      AND dt."tsv" IS NOT NULL
  `;

  // ── 4. Apply boost in-place ────────────────────────────────────────────────
  // We add to finalScore rather than recalculating it so that the deterministic
  // baseline is always preserved.  A node with zero FTS rank receives no boost.
  //
  // Prisma's $queryRaw may deserialise Postgres float4/float8 as strings or
  // BigInt depending on the driver version, so we coerce to Number explicitly.
  for (const { sic_node_id, rank } of rows) {
    const node = nodeScores.get(sic_node_id);
    if (!node) continue;

    node.finalScore += BOOST_FACTOR * Number(rank);
  }
}
