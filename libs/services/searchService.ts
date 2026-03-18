import { Prisma } from "@prisma/client";
import { prisma } from "../prisma";
import { embeddingService, generateEmbedding } from "./embeddingService";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchParams {
  /** The search string entered by the user. */
  query: string;
  /** Max results to return. Clamped to 50. Default 20. */
  limit?: number;
  /** Zero-based page offset. Default 0. */
  offset?: number;
  /** Optional: filter by sourceType (e.g. "gazette"). "all" is treated as no filter. */
  sourceType?: string;
  /** Optional: filter by tags. All supplied tags must be present (AND logic). */
  tags?: string[];
}

export interface SearchResultItem {
  id: string;
  fileName: string;
  fileUrl: string;
  sourceType: string;
  processingStatus: string;
  createdAt: Date;
  summary: string | null;
  /** Highlighted text excerpt from extracted content (FTS-only). */
  snippet: string | null;
  tags: string[];
  /** Merged relevance score in range [0, 1]. */
  score: number;
  /** Which retrieval method(s) matched this document. */
  matchedBy: ("fts" | "semantic")[];
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalCount: number;
  query: string;
  /** "hybrid" when semantic search ran; "fts_only" as fallback. */
  searchMode: "hybrid" | "fts_only";
  pagination: {
    limit: number;
    offset: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ---------------------------------------------------------------------------
// Internal row shapes returned by raw SQL
// ---------------------------------------------------------------------------

interface FtsRow {
  id: string;
  fileName: string;
  fileUrl: string;
  sourceType: string;
  processingStatus: string;
  createdAt: Date;
  summary: string | null;
  snippet: string | null;
  fts_score: number;
}

interface SemanticRow {
  id: string;
  semantic_score: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Normalise a score map so the highest value becomes 1.0. */
function normalizeScores(scores: Map<string, number>): Map<string, number> {
  const values = [...scores.values()];
  const max = Math.max(...values, 0.0001);
  const out = new Map<string, number>();
  scores.forEach((v, k) => out.set(k, v / max));
  return out;
}

// ---------------------------------------------------------------------------
// SearchService
// ---------------------------------------------------------------------------

export class SearchService {
  /**
   * Hybrid search: Postgres full-text search (FTS) + optional pgvector
   * semantic search. Results are merged with a weighted score and paginated.
   *
   * Weights: FTS 60 % + Semantic 40 %
   * Falls back to FTS-only when OPENAI_API_KEY is not configured.
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    const { query } = params;
    const limit = clamp(params.limit ?? 20, 1, 50);
    const offset = clamp(params.offset ?? 0, 0, Number.MAX_SAFE_INTEGER);
    const sourceType =
      params.sourceType && params.sourceType !== "all"
        ? params.sourceType
        : null;
    const tags = params.tags ?? [];

    if (!query.trim()) {
      return {
        results: [],
        totalCount: 0,
        query,
        searchMode: "fts_only",
        pagination: { limit, offset, hasNext: false, hasPrev: offset > 0 },
      };
    }

    // ------------------------------------------------------------------
    // 1. Full-text search (always runs)
    // ------------------------------------------------------------------
    const ftsRows = await this.runFtsQuery(query, sourceType, tags);

    // ------------------------------------------------------------------
    // 2. Semantic search (runs only when embeddings are available)
    // ------------------------------------------------------------------
    let semanticRows: SemanticRow[] = [];
    let searchMode: "hybrid" | "fts_only" = "fts_only";

    if (embeddingService.isReady()) {
      const queryEmbedding = await generateEmbedding(query);
      if (queryEmbedding.length > 0) {
        semanticRows = await this.runSemanticQuery(
          queryEmbedding,
          sourceType,
          tags,
        );
        searchMode = "hybrid";
      }
    }

    // ------------------------------------------------------------------
    // 3. Merge + rank
    // ------------------------------------------------------------------
    const FTS_WEIGHT = 0.6;
    const SEM_WEIGHT = 0.4;

    const normFts = normalizeScores(
      new Map(ftsRows.map((r) => [r.id, Number(r.fts_score)])),
    );
    const normSem = normalizeScores(
      new Map(semanticRows.map((r) => [r.id, Number(r.semantic_score)])),
    );

    // Union of all matched document IDs
    const allIds = new Set([...normFts.keys(), ...normSem.keys()]);

    const ranked = [...allIds]
      .map((id) => ({
        id,
        score:
          (normFts.get(id) ?? 0) * FTS_WEIGHT +
          (normSem.get(id) ?? 0) * SEM_WEIGHT,
        matchedBy: [
          ...(normFts.has(id) ? (["fts"] as const) : []),
          ...(normSem.has(id) ? (["semantic"] as const) : []),
        ],
      }))
      .sort((a, b) => b.score - a.score);

    const totalCount = ranked.length;
    const page = ranked.slice(offset, offset + limit);

    if (page.length === 0) {
      return {
        results: [],
        totalCount,
        query,
        searchMode,
        pagination: {
          limit,
          offset,
          hasNext: false,
          hasPrev: offset > 0,
        },
      };
    }

    // ------------------------------------------------------------------
    // 4. Hydrate results with full document metadata
    // ------------------------------------------------------------------
    const ftsRowMap = new Map(ftsRows.map((r) => [r.id, r]));
    const pageIds = page.map((p) => p.id);

    // Fetch tags for the current page in one query
    const tagRows = await prisma.documentTag.findMany({
      where: { documentId: { in: pageIds } },
    });
    const tagsByDocId = new Map<string, string[]>();
    tagRows.forEach((t) => {
      if (!tagsByDocId.has(t.documentId)) tagsByDocId.set(t.documentId, []);
      tagsByDocId.get(t.documentId)!.push(t.tag);
    });

    // For IDs that came from semantic-only (not in FTS results), fetch metadata
    const semanticOnlyIds = pageIds.filter((id) => !ftsRowMap.has(id));
    const extraDocMap = new Map<
      string,
      {
        fileName: string;
        fileUrl: string;
        sourceType: string;
        processingStatus: string;
        createdAt: Date;
        text?: { summary: string | null } | null;
      }
    >();

    if (semanticOnlyIds.length > 0) {
      const extraDocs = await prisma.document.findMany({
        where: { id: { in: semanticOnlyIds } },
        include: { text: { select: { summary: true } } },
      });
      extraDocs.forEach((d) => extraDocMap.set(d.id, d));
    }

    const results: SearchResultItem[] = page.map(({ id, score, matchedBy }) => {
      const ftsRow = ftsRowMap.get(id);

      if (ftsRow) {
        return {
          id,
          fileName: ftsRow.fileName,
          fileUrl: ftsRow.fileUrl,
          sourceType: ftsRow.sourceType,
          processingStatus: ftsRow.processingStatus,
          createdAt: ftsRow.createdAt,
          summary: ftsRow.summary,
          snippet: ftsRow.snippet,
          tags: tagsByDocId.get(id) ?? [],
          score: parseFloat(score.toFixed(4)),
          matchedBy,
        };
      }

      // Semantic-only hit — no FTS snippet available
      const doc = extraDocMap.get(id)!;
      return {
        id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        sourceType: doc.sourceType,
        processingStatus: doc.processingStatus,
        createdAt: doc.createdAt,
        summary: doc.text?.summary ?? null,
        snippet: null,
        tags: tagsByDocId.get(id) ?? [],
        score: parseFloat(score.toFixed(4)),
        matchedBy,
      };
    });

    return {
      results,
      totalCount,
      query,
      searchMode,
      pagination: {
        limit,
        offset,
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
      },
    };
  }

  // -------------------------------------------------------------------------
  // Private: Full-text search query
  // -------------------------------------------------------------------------
  private async runFtsQuery(
    query: string,
    sourceType: string | null,
    tags: string[],
  ): Promise<FtsRow[]> {
    const conditions: Prisma.Sql[] = [
      Prisma.sql`dt.tsv @@ plainto_tsquery('english', ${query})`,
    ];

    if (sourceType) {
      conditions.push(Prisma.sql`d."sourceType" = ${sourceType}`);
    }

    if (tags.length > 0) {
      // All supplied tags must exist on the document (AND logic)
      conditions.push(
        Prisma.sql`(
          SELECT COUNT(*) FROM document_tags dtag
          WHERE dtag."documentId" = d.id
            AND dtag.tag = ANY(${tags}::text[])
        ) = ${tags.length}`,
      );
    }

    const where = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;

    return prisma.$queryRaw<FtsRow[]>`
      SELECT
        d.id,
        d."fileName",
        d."fileUrl",
        d."sourceType",
        d."processingStatus",
        d."createdAt",
        dt.summary,
        ts_headline(
          'english',
          COALESCE(dt.content, ''),
          plainto_tsquery('english', ${query}),
          'MaxWords=35, MinWords=15, ShortWord=3, HighlightAll=false'
        ) AS snippet,
        ts_rank(dt.tsv, plainto_tsquery('english', ${query})) AS fts_score
      FROM documents d
      JOIN document_texts dt ON dt."documentId" = d.id
      ${where}
      ORDER BY fts_score DESC
      LIMIT 200
    `;
  }

  // -------------------------------------------------------------------------
  // Private: Semantic (vector) search query
  // -------------------------------------------------------------------------
  private async runSemanticQuery(
    queryEmbedding: number[],
    sourceType: string | null,
    tags: string[],
  ): Promise<SemanticRow[]> {
    const embeddingLiteral = `[${queryEmbedding.join(",")}]`;

    const conditions: Prisma.Sql[] = [Prisma.sql`dt.embedding IS NOT NULL`];

    if (sourceType) {
      conditions.push(Prisma.sql`d."sourceType" = ${sourceType}`);
    }

    if (tags.length > 0) {
      conditions.push(
        Prisma.sql`(
          SELECT COUNT(*) FROM document_tags dtag
          WHERE dtag."documentId" = d.id
            AND dtag.tag = ANY(${tags}::text[])
        ) = ${tags.length}`,
      );
    }

    const where = Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`;

    return prisma.$queryRaw<SemanticRow[]>`
      SELECT
        d.id,
        (1 - (dt.embedding <=> ${embeddingLiteral}::vector))::float AS semantic_score
      FROM documents d
      JOIN document_texts dt ON dt."documentId" = d.id
      ${where}
      ORDER BY dt.embedding <=> ${embeddingLiteral}::vector
      LIMIT 100
    `;
  }
}

export const searchService = new SearchService();
