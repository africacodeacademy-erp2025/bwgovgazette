import { prisma } from "../prisma";
import { embeddingService } from "./embeddingService";
import { summaryService } from "./summaryService";

export class DocumentService {
  async processDocument(
    file: {
      filename: string;
      originalname: string;
      path: string;
      mimetype: string;
      size: number;
      url: string; // Supabase URL
    },
    sourceType: string = "gazette",
    tags: string[] = [],
    userId: string, // Add userId for row-level security
  ) {
    //text extraction
    let extractedText = "";
    let ocrConfidence = 0;
    let processingMethod = "none";

    try {
      const { ocrService } = await import("./ocrService");
      const ocrResult = await ocrService.extractText(file.path, file.mimetype);
      extractedText = ocrResult.text;
      ocrConfidence = ocrResult.confidence;
      processingMethod = ocrResult.method ?? "ocr";
    } catch (extractionError) {
      console.warn("OCR failed: ", extractionError);
    }

    //Summary portion
    let summary = null;
    let summaryMetadata = null;

    if (extractedText.trim()) {
      try {
        const summarizedText = await summaryService.generateSummary(
          extractedText,
          {
            maxWords: 300,
            style: "concise",
            includeKeyPoints: true,
          },
        );
        if (summarizedText) {
          summary = summarizedText.summary;
          summaryMetadata = summarizedText;
        }
      } catch (summaryError) {
        console.warn("Summary failed: ", summaryError);
      }
    }

    // Embeddings and chunks
    let documentEmbedding = null;
    let chunks: Array<{
      text: string;
      embedding: number[] | null;
      index: number;
    }> = [];

    if (extractedText.trim() && embeddingService.isReady()) {
      const textChunks = embeddingService.splitTextIntoChunks(
        extractedText,
        800,
      );
      const chunkEmbeddings =
        await embeddingService.generateEmbeddingzForChunks(textChunks);
      documentEmbedding = await embeddingService.generateEmbedding(
        extractedText.slice(0, 2000),
      );

      chunks = textChunks.map((text, i) => ({
        text,
        embedding: chunkEmbeddings[i] || null,
        index: i,
      }));
    }

    // Create document with proper relations and userId
    const document = await prisma.document.create({
      data: {
        fileName: file.filename,
        fileUrl: file.url,
        mimeType: file.mimetype,
        fileSize: file.size,
        sourceType,
        userId, // Set userId for row-level security
        processingStatus: extractedText ? "completed" : "failed",

        // Use DocumentText relation
        text:
          extractedText || summary
            ? {
                create: {
                  content: extractedText || null,
                  summary: summary || null,
                },
              }
            : undefined,

        // Use DocumentTag relation
        tags:
          tags.length > 0
            ? {
                create: tags.map((tag) => ({ tag })),
              }
            : undefined,

        // Use DocumentChunk relation
        chunks:
          chunks.length > 0
            ? {
                create: chunks.map((chunk) => ({
                  index: chunk.index,
                  text: chunk.text,
                  embedding: chunk.embedding
                    ? JSON.parse(JSON.stringify(chunk.embedding))
                    : null,
                })),
              }
            : undefined,
      },

      include: {
        text: true,
        tags: true,
        chunks: true,
      },
    });

    return {
      document,
      extractedText,
      ocrConfidence,
      chunksCount: chunks.length,
      hasEmbeddings: !!documentEmbedding,
      processingMethod,
      summary,
      summaryMetadata,
    };
  }

  async getAllDocuments({
    userId,
    sourceType,
    limit,
    offset,
  }: {
    userId: string;
    sourceType?: string;
    limit: number;
    offset: number;
  }) {
    const where: any = { userId }; // Row-level security: only user's documents
    if (sourceType && sourceType !== "all") {
      where.sourceType = sourceType;
    }

    const [documents, totalCount] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          text: true,
          tags: true,
          _count: { select: { chunks: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      documents: documents.map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        fileUrl: doc.fileUrl,
        sourceType: doc.sourceType,
        tags: doc.tags.map((t) => t.tag),
        fileSize: doc.fileSize,
        mimeType: doc.mimeType,
        extractedText: doc.text?.content || null,
        summary: doc.text?.summary || null,
        hasEmbeddings: (doc._count?.chunks || 0) > 0,
        hasSummary: !!doc.text?.summary,
        processingStatus: doc.processingStatus,
        createdAt: doc.createdAt,
      })),

      totalCount,

      pagination: {
        limit,
        offset,
        hasNext: offset + limit < totalCount,
        hasPrev: offset > 0,
      },
    };
  }

  async getDocumentById(id: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: { id, userId }, // Row-level security: verify user owns document
      include: {
        text: true,
        tags: true,
        chunks: {
          orderBy: { index: "asc" },
        },
      },
    });

    if (!document) return null;

    return {
      id: document.id,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      sourceType: document.sourceType,
      tags: document.tags.map((t) => t.tag),
      fileSize: document.fileSize,
      mimeType: document.mimeType,
      extractedText: document.text?.content || null,
      summary: document.text?.summary || null,
      hasEmbeddings: document.chunks.length > 0,
      chunks: document.chunks.map((chunk) => ({
        id: chunk.id,
        text: chunk.text,
        index: chunk.index,
        hasEmbedding: !!chunk.embedding,
      })),
      processingStatus: document.processingStatus,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}

export const documentService = new DocumentService();
