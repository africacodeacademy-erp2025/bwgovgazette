import { NextRequest, NextResponse } from "next/server";
import { documentService } from "@/libs/services/documentService";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const document = await documentService.getDocumentById(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
