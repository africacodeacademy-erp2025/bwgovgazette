import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { PDFParse } from "pdf-parse";
import { embeddingService } from "@/libs/services/embeddingService";
import {
  classifyDocument,
  type ClassificationResult,
} from "@/libs/services/classificationService";
import { classificationExplanationService } from "@/libs/services/classificationExplanationService";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";

export const runtime = "nodejs";

const DEFAULT_MAX_FILE_BYTES = 25 * 1024 * 1024; // 25MB
const MAX_FILE_BYTES = Number.parseInt(
  process.env.UPLOAD_MAX_FILE_BYTES ?? "",
  10,
);
const EFFECTIVE_MAX_FILE_BYTES = Number.isFinite(MAX_FILE_BYTES)
  ? MAX_FILE_BYTES
  : DEFAULT_MAX_FILE_BYTES;

function coerceFile(value: FormDataEntryValue | null): File | null {
  if (!value) return null;
  if (typeof value === "string") return null;
  return value as File;
}

function safeErrorDetails(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function POST(request: Request) {
  // Lazily initialize Supabase client to avoid requiring env at build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Supabase config missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
    return NextResponse.json(
      {
        error:
          "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 },
    );
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  let createdDocumentId: string | null = null;

  try {
    const formData = await request.formData();
    const file = coerceFile(formData.get("file"));
    const sourceType = (formData.get("sourceType") as string) || "gazette";
    const tagsStr = (formData.get("tags") as string) || "";
    const tags = tagsStr
      ? tagsStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > EFFECTIVE_MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: "File too large",
          details: `Max allowed is ${EFFECTIVE_MAX_FILE_BYTES} bytes`,
        },
        { status: 413 },
      );
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF and images are supported." },
        { status: 400 },
      );
    }

    // Generate unique filename
    const fileExt = path.extname(file.name);
    const uniqueFilename = `${randomUUID()}${fileExt}`;
    const storagePath = `documents/${uniqueFilename}`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file to storage" },
        { status: 500 },
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    // 5. Create Document record (pending)
    const document = await prisma.document.create({
      data: {
        fileName: uniqueFilename,
        fileUrl: urlData.publicUrl,
        mimeType: file.type,
        fileSize: file.size,
        sourceType,
        processingStatus: "pending",
        tags:
          tags.length > 0
            ? {
                create: tags.map((tag) => ({ tag })),
              }
            : undefined,
      },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        mimeType: true,
        fileSize: true,
        sourceType: true,
        processingStatus: true,
        createdAt: true,
      },
    });

    createdDocumentId = document.id;

    // 4. Extract text using pdf-parse (PDF) or OCR (images)
    let extractedText = "";
    let ocrConfidence: number | null = null;
    let extractionMethod: "pdf-parse" | "ocr" = "ocr";

    let tempPath: string | null = null;
    try {
      if (file.type === "application/pdf") {
        extractionMethod = "pdf-parse";
        const parser = new PDFParse({ data: buffer });
        try {
          const textResult = await parser.getText();
          extractedText = (textResult.text ?? "").trim();
        } finally {
          await parser.destroy().catch(() => {});
        }
      } else {
        // Save to temporary local path for OCR processing
        const tempDir = path.join(process.cwd(), "uploads");
        await mkdir(tempDir, { recursive: true });
        tempPath = path.join(tempDir, uniqueFilename);
        await writeFile(tempPath, buffer);

        const { ocrService } = await import("@/libs/services/ocrService");
        const ocrResult = await ocrService.extractText(tempPath, file.type);
        extractedText = (ocrResult.text ?? "").trim();
        ocrConfidence =
          typeof ocrResult.confidence === "number"
            ? ocrResult.confidence
            : null;
      }
    } catch (extractionError) {
      console.error("Text extraction error:", extractionError);
      await prisma.document.update({
        where: { id: document.id },
        data: { processingStatus: "failed" },
      });
      return NextResponse.json(
        {
          error: "Failed to extract text",
          details: safeErrorDetails(extractionError),
        },
        { status: 500 },
      );
    } finally {
      if (tempPath) {
        await unlink(tempPath).catch(() => {});
      }
    }

    if (!extractedText) {
      await prisma.document.update({
        where: { id: document.id },
        data: { processingStatus: "failed" },
      });
      return NextResponse.json(
        {
          error: "No text extracted",
          details: "The document contained no extractable text.",
        },
        { status: 422 },
      );
    }

    // 6. Create / upsert DocumentText record
    await prisma.documentText.upsert({
      where: { documentId: document.id },
      create: {
        documentId: document.id,
        content: extractedText,
      },
      update: {
        content: extractedText,
      },
    });

    // 7. Generate embedding for DocumentText (required) and persist it BEFORE classification.
    // Keep the request snappy: run lexical tsv update + embedding generation concurrently.
    if (!embeddingService.isReady()) {
      await prisma.document.update({
        where: { id: document.id },
        data: { processingStatus: "failed" },
      });
      return NextResponse.json(
        {
          error: "Embedding service not configured",
          details: "Set OPENAI_API_KEY to enable embeddings.",
        },
        { status: 503 },
      );
    }

    const tsvUpdatePromise = prisma.$executeRawUnsafe(
      `UPDATE "document_texts" SET tsv = to_tsvector('english', COALESCE(content, '')) WHERE "documentId" = $1`,
      document.id,
    );
    const embeddingPromise = embeddingService.generateEmbedding(extractedText);

    const [, embedding] = await Promise.all([
      tsvUpdatePromise,
      embeddingPromise,
    ]);
    console.info("upload: embedding generated", {
      documentId: document.id,
      length: Array.isArray(embedding) ? embedding.length : 0,
    });

    if (!Array.isArray(embedding) || embedding.length === 0) {
      await prisma.document.update({
        where: { id: document.id },
        data: { processingStatus: "failed" },
      });
      return NextResponse.json(
        {
          error: "Failed to generate embedding",
          details: "OpenAI embedding returned no vector.",
        },
        { status: 502 },
      );
    }

    const vec = `[${embedding.join(",")}]`;
    await prisma.$executeRawUnsafe(
      `UPDATE "document_texts" SET embedding = $1::vector WHERE "documentId" = $2`,
      vec,
      document.id,
    );

    // 10. Update status: text_extracted
    await prisma.document.update({
      where: { id: document.id },
      data: { processingStatus: "text_extracted" },
    });

    // 8. Call classifyDocument(documentId) (wrapped in try/catch)
    let ranked: ClassificationResult[];
    try {
      ranked = await classifyDocument(document.id);
    } catch (classificationError) {
      console.error("Classification error:", classificationError);
      await prisma.document.update({
        where: { id: document.id },
        data: { processingStatus: "failed" },
      });
      return NextResponse.json(
        {
          error: "Failed to classify document",
          details: safeErrorDetails(classificationError),
        },
        { status: 500 },
      );
    }

    // 9. Enrich with LLM explanations (optional, best-effort)
    let explanations: Map<string, string> | null = null;
    try {
      const sicNodeIds = ranked.map((r) => r.sicNodeId);
      const sicNodes = await prisma.sicNode.findMany({
        where: { id: { in: sicNodeIds } },
        select: { id: true, code: true, title: true, description: true },
      });
      explanations =
        (await classificationExplanationService?.generateExplanations({
          documentText: extractedText,
          results: ranked.map((r) => ({
            sicNodeId: r.sicNodeId,
            score: r.finalScore,
            confidence: r.confidence,
            matches: r.topSignals.map((s) => ({
              signal: s.signal,
              frequency: 0,
              weight: 0,
              specificity: 0,
              contribution: s.contribution,
            })),
          })),
          sicNodes,
        })) ?? null;
    } catch (explainError) {
      console.warn("Explanation generation failed:", explainError);
      explanations = null;
    }

    // 10. Build response results with full breakdown for frontend
    const responseResults = ranked.map((r) => ({
      sicNodeId: r.sicNodeId,
      code: r.code,
      title: r.title,
      finalScore: r.finalScore,
      confidence: r.confidence,
      breakdown: r.breakdown,
      explanation: explanations?.get(r.sicNodeId) ?? r.explanation,
      topSignals: r.topSignals,
    }));

    const finalDocument = await prisma.document.findUnique({
      where: { id: document.id },
      select: {
        id: true,
        fileName: true,
        fileUrl: true,
        mimeType: true,
        fileSize: true,
        sourceType: true,
        processingStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      document: finalDocument,
      text: {
        method: extractionMethod,
        ocrConfidence,
        charsExtracted: extractedText.length,
      },
      classification: {
        topN: responseResults.length,
        results: responseResults,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);

    if (createdDocumentId) {
      await prisma.document
        .update({
          where: { id: createdDocumentId },
          data: { processingStatus: "failed" },
        })
        .catch(() => {});
    }

    const details = safeErrorDetails(error);

    return NextResponse.json(
      { error: "Failed to upload file", details },
      { status: 500 },
    );
  }
}
