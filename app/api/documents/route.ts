import { NextResponse } from "next/server";
import { documentService } from "@/libs/services/documentService";

export async function GET(request: Request){

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
}