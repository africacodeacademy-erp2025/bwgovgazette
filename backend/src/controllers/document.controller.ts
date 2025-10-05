import { Request, Response } from "express";
import DocumentService from "../services/document-processing.service";

interface ClassificationInput {
  nodeId: number;
  confidence?: number;
  source?: "user" | "llm" | "rule";
}

/**
 * Upload a document (PDF), extract text, and save to database
 * POST /documents/upload
 * Body: multipart/form-data with 'file' field
 * Optional: source_type (defaults to 'gazette')
 */
export async function uploadDocument(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: "No file provided. Please upload a PDF file.",
      });
      return;
    }

    const sourceType = req.body.source_type || "gazette";

    // Upload and extract text
    const result = await DocumentService.uploadDocument(file, sourceType);

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: {
        documentId: result.documentId,
        fileName: result.fileName,
        fileUrl: result.fileUrl,
        fileSize: result.fileSize,
        textExtracted: result.extractedText.length > 0,
        textLength: result.extractedText.length,
      },
    });
  } catch (error: unknown) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload document",
    });
  }
}

/**
 * Classify a document using taxonomy nodes
 * POST /documents/:id/classify
 * Body: { classifications: [{ nodeId, confidence?, source? }] }
 */
export async function classifyDocument(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id: documentId } = req.params;
    const { classifications } = req.body as {
      classifications?: ClassificationInput[];
    };

    if (!documentId) {
      res.status(400).json({
        success: false,
        error: "Document ID is required",
      });
      return;
    }

    if (
      !classifications ||
      !Array.isArray(classifications) ||
      classifications.length === 0
    ) {
      res.status(400).json({
        success: false,
        error: "Please provide at least one classification with nodeId",
      });
      return;
    }

    // Validate each classification has nodeId
    const invalidClassifications = classifications.filter((c) => !c.nodeId);
    if (invalidClassifications.length > 0) {
      res.status(400).json({
        success: false,
        error: "All classifications must have a nodeId",
      });
      return;
    }

    await DocumentService.classifyDocument(documentId, classifications);

    // Get updated classifications to return
    const updatedClassifications =
      await DocumentService.getDocumentClassifications(documentId);

    res.json({
      success: true,
      message: "Document classified successfully",
      data: {
        documentId,
        classifications: updatedClassifications,
      },
    });
  } catch (error: unknown) {
    console.error("Classification error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to classify document",
    });
  }
}

/**
 * Generate tags for a document using LLM
 * POST /documents/:id/tags
 * Body: {} (optional, LLM generates independently)
 */
export async function generateTags(req: Request, res: Response): Promise<void> {
  try {
    const { id: documentId } = req.params;

    if (!documentId) {
      res.status(400).json({
        success: false,
        error: "Document ID is required",
      });
      return;
    }

    // Get document with extracted text
    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      res.status(404).json({
        success: false,
        error: "Document not found",
      });
      return;
    }

    // Get the text from document_texts relation
    const documentText = await DocumentService.getDocumentText(documentId);

    if (!documentText || !documentText.content) {
      res.status(400).json({
        success: false,
        error: "Document has no extracted text. Cannot generate tags.",
      });
      return;
    }

    // Update status to processing
    await DocumentService.updateProcessingStatus(documentId, "processing");

    try {
      // Generate tags independently via LLM
      const tags = await DocumentService.generateAndSaveTags(
        documentId,
        documentText.content
      );

      // Update status to completed
      await DocumentService.updateProcessingStatus(documentId, "completed");

      res.json({
        success: true,
        message:
          tags.length > 0
            ? `Generated ${tags.length} tag(s)`
            : "No tags generated - document may not reference specific industries",
        data: {
          documentId,
          tags,
        },
      });
    } catch (tagError: unknown) {
      // Update status to failed if tag generation fails
      await DocumentService.updateProcessingStatus(documentId, "failed");
      throw tagError;
    }
  } catch (error: unknown) {
    console.error("Tag generation error:", error);

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate tags",
    });
  }
}

/**
 * List all documents with optional filters
 * GET /documents?source_type=gazette&status=completed&tags=agriculture,mining&limit=20&offset=0
 */
export async function listDocuments(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { source_type, status, tags, node_ids, limit, offset } = req.query;

    interface DocumentFilters {
      limit: number;
      offset: number;
      sourceType?: string;
      processingStatus?: string;
      tags?: string[];
      nodeIds?: number[];
    }

    const filters: DocumentFilters = {
      limit: parseInt((limit as string) || "20", 10),
      offset: parseInt((offset as string) || "0", 10),
    };

    if (source_type && typeof source_type === "string") {
      filters.sourceType = source_type;
    }

    if (status && typeof status === "string") {
      filters.processingStatus = status;
    }

    if (tags && typeof tags === "string") {
      filters.tags = tags.split(",").map((t) => t.trim());
    }

    if (node_ids && typeof node_ids === "string") {
      filters.nodeIds = node_ids
        .split(",")
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id));
    }

    const documents = await DocumentService.getAllDocuments(filters);

    res.json({
      success: true,
      data: {
        documents,
        count: documents.length,
        filters: {
          source_type: filters.sourceType,
          status: filters.processingStatus,
          tags: filters.tags,
          node_ids: filters.nodeIds,
          limit: filters.limit,
          offset: filters.offset,
        },
      },
    });
  } catch (error: unknown) {
    console.error("List documents error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve documents",
    });
  }
}

/**
 * Get a single document by ID with all related data
 * GET /documents/:id
 */
export async function getDocument(req: Request, res: Response): Promise<void> {
  try {
    const { id: documentId } = req.params;

    if (!documentId) {
      res.status(400).json({
        success: false,
        error: "Document ID is required",
      });
      return;
    }

    const document = await DocumentService.getDocumentById(documentId);

    if (!document) {
      res.status(404).json({
        success: false,
        error: "Document not found",
      });
      return;
    }

    res.json({
      success: true,
      data: document,
    });
  } catch (error: unknown) {
    console.error("Get document error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to retrieve document",
    });
  }
}

/**
 * Delete a document and its associated data
 * DELETE /documents/:id
 */
export async function deleteDocument(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id: documentId } = req.params;

    if (!documentId) {
      res.status(400).json({
        success: false,
        error: "Document ID is required",
      });
      return;
    }

    await DocumentService.deleteDocument(documentId);

    res.json({
      success: true,
      message: "Document deleted successfully",
      data: {
        documentId,
      },
    });
  } catch (error: unknown) {
    console.error("Delete document error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete document",
    });
  }
}

/**
 * Get available taxonomies for classification
 * GET /documents/taxonomies?country_code=BWA
 */
export async function getTaxonomies(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { country_code } = req.query;

    const taxonomies = await DocumentService.getTaxonomies(
      typeof country_code === "string" ? country_code : undefined
    );

    res.json({
      success: true,
      data: taxonomies,
    });
  } catch (error: unknown) {
    console.error("Get taxonomies error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve taxonomies",
    });
  }
}

/**
 * Get taxonomy nodes for a specific taxonomy
 * GET /documents/taxonomies/:id/nodes?level=1
 */
export async function getTaxonomyNodes(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { id: taxonomyId } = req.params;
    const { level } = req.query;

    if (!taxonomyId) {
      res.status(400).json({
        success: false,
        error: "Taxonomy ID is required",
      });
      return;
    }

    const parsedTaxonomyId = parseInt(taxonomyId, 10);

    if (isNaN(parsedTaxonomyId)) {
      res.status(400).json({
        success: false,
        error: "Invalid taxonomy ID",
      });
      return;
    }

    const nodes = await DocumentService.getTaxonomyNodes(
      parsedTaxonomyId,
      level && typeof level === "string" ? parseInt(level, 10) : undefined
    );

    res.json({
      success: true,
      data: nodes,
    });
  } catch (error: unknown) {
    console.error("Get taxonomy nodes error:", error);
    res.status(500).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to retrieve taxonomy nodes",
    });
  }
}