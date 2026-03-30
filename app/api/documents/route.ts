import { NextResponse, NextRequest } from "next/server";
import { documentService } from "@/libs/services/documentService";
import { requireAuth } from "@/libs/authMiddleware";

export async function GET(request: NextRequest) {
  // Require authentication
  const authUser = await requireAuth(request);
  if (authUser instanceof NextResponse) {
    return authUser;
  }

  const { searchParams } = new URL(request.url);

  const sourceType = searchParams.get("sourceType");
  const limit = Number(searchParams.get("limit") ?? 20);
  const offset = Number(searchParams.get("offset") ?? 0);

  const result = await documentService.getAllDocuments({
    userId: authUser.userId, // Pass userId for row-level security
    sourceType: sourceType || undefined,
    limit,
    offset,
  });

  return NextResponse.json(result);
}