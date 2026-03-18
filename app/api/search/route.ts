import { NextResponse } from "next/server";
import { searchService } from "@/libs/services/searchService";

/**
 * GET /api/search
 *
 * Query parameters:
 *   q            (required) – search text
 *   limit        (optional, default 20, max 50)
 *   offset       (optional, default 0)
 *   sourceType   (optional) – e.g. "gazette" or "all"
 *   tags         (optional) – comma-separated list, e.g. "tax,revenue"
 *                             All supplied tags must be present on the document (AND logic)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = (searchParams.get("q") ?? "").trim();
  const limit = Number(searchParams.get("limit") ?? 20);
  const offset = Number(searchParams.get("offset") ?? 0);
  const sourceType = searchParams.get("sourceType") ?? undefined;

  const tagsRaw = searchParams.get("tags");
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required and must not be empty." },
      { status: 400 },
    );
  }

  if (isNaN(limit) || limit < 1) {
    return NextResponse.json(
      { error: "'limit' must be a positive integer." },
      { status: 400 },
    );
  }

  if (isNaN(offset) || offset < 0) {
    return NextResponse.json(
      { error: "'offset' must be a non-negative integer." },
      { status: 400 },
    );
  }

  try {
    const result = await searchService.search({
      query,
      limit,
      offset,
      sourceType,
      tags,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/search] Search failed:", error);
    return NextResponse.json(
      { error: "Search failed. Please try again later." },
      { status: 500 },
    );
  }
}
