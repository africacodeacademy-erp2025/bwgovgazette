import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/libs/utils/authHelpers";
import { documentService } from "@/libs/services/documentService";

export async function GET(request: NextRequest){
  try {
    // Authenticate user
    const { authenticated, user, error } = await authenticateRequest(request);
    if (!authenticated) {
      return error;
    }

    const {searchParams} = new URL(request.url);

    const sourceType = searchParams.get('sourceType');
    const limit = Number(searchParams.get('limit') ?? 20);
    const offset = Number(searchParams.get('offset') ?? 0 );

    const result = await documentService.getAllDocuments({
        sourceType: sourceType || undefined,
        limit,
        offset,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch documents" },
      { status: 500 },
    );
  }
}