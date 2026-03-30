import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/libs/services/documentService";
import { requireAuth } from "@/libs/authMiddleware";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  // Require authentication
  const authUser = await requireAuth(request);
  if (authUser instanceof NextResponse) {
    return authUser;
  }

  const { id } = await context.params;
  const document = await documentService.getDocumentById(id, authUser.userId);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
