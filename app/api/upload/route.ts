import { NextResponse, NextRequest } from "next/server";
import { documentService } from "@/libs/services/documentService";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { requireAuth, type AuthRequest } from "@/libs/authMiddleware";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "documents";

export async function POST(request: NextRequest) {
  // Check authentication
  const authUser = await requireAuth(request);
  if (authUser instanceof NextResponse) {
    return authUser;
  }

  // Lazily initialize Supabase client to avoid requiring env at build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "Supabase config missing: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    );
    return NextResponse.json(
      { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 },
    );
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const sourceType = (formData.get("sourceType") as string) || "gazette";
    const tagsStr = formData.get("tags") as string;
    const tags = tagsStr
      ? tagsStr
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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

    // Save to temporary local path for OCR processing
    const tempDir = path.join(process.cwd(), "uploads");
    await mkdir(tempDir, { recursive: true }); // ensure directory exists
    const tempPath = path.join(tempDir, uniqueFilename);
    await writeFile(tempPath, buffer);

    try {
      // Process document with documentService, passing userId
      const result = await documentService.processDocument(
        {
          filename: uniqueFilename,
          originalname: file.name,
          path: tempPath,
          mimetype: file.type,
          size: file.size,
          url: urlData.publicUrl,
        },
        sourceType,
        tags,
        authUser.userId, // Add userId for row-level security
      );

      // Clean up temp file
      await unlink(tempPath).catch(() => {});

      return NextResponse.json({
        success: true,
        document: result.document,
        metadata: {
          extractedText: result.extractedText,
          ocrConfidence: result.ocrConfidence,
          chunksCount: result.chunksCount,
          hasEmbeddings: result.hasEmbeddings,
          processingMethod: result.processingMethod,
          hasSummary: !!result.summary,
        },
      });
    } catch (processingError) {
      console.error("Document processing error:", processingError);

      await unlink(tempPath).catch(() => {});
      await supabase.storage.from(BUCKET).remove([storagePath]);

      const details =
        processingError instanceof Error
          ? processingError.message
          : String(processingError);

      return NextResponse.json(
        { error: "Failed to process document", details },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Upload error:", error);

    const details = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { error: "Failed to upload file", details },
      { status: 500 },
    );
  }
}
