import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../utils/supabase/supabase-client";
import { PDFTextExtractor } from "./pdf-text-extractor";

interface UploadResult {
  documentId: string;
  fileName: string;
  fileUrl: string;
  extractedText: string;
  fileSize: number;
  mimeType: string;
}

interface TagGenerationResult {
  tags: string[];
  reasoning?: string;
}

interface ClassificationInput {
  nodeId: number;
  confidence?: number;
  source?: "user" | "llm" | "rule";
}

interface DocumentTag {
  tag: string;
}

interface DocumentClassification {
  node_id: number;
  confidence: number;
  source: string;
  taxonomy_nodes?: {
    id: number;
    code: string;
    label: string;
    description?: string;
    level: number;
    taxonomies?: {
      id: number;
      name: string;
      version: string;
    };
  };
}

interface DocumentRecord {
  id: string;
  source_type: string;
  file_name: string;
  file_url: string;
  mime_type: string | null;
  file_size: number | null;
  processing_status: string;
  created_at: string;
  updated_at: string;
}

interface DocumentText {
  doc_id: string;
  content: string;
  extracted_at: string;
  summary: string | null;
}

interface DocumentChunk {
  id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  created_at: string;
}

interface DocumentWithRelations extends DocumentRecord {
  document_tags?: DocumentTag[];
  document_classifications?: DocumentClassification[];
  document_texts?: DocumentText;
  document_chunks?: DocumentChunk[];
}

interface DocumentWithTexts extends DocumentRecord {
  document_texts?: DocumentText | DocumentText[];
}

interface DocumentClassificationJoin {
  document_id: string;
  documents: DocumentRecord | DocumentRecord[];
}

class DocumentService {
  // Configure multer once, reuse
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
    fileFilter: (_req, file, cb) => {
      if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"));
      }
      cb(null, true);
    },
  });

  /**
   * Uploads PDF, extracts text, and saves to database
   * @param file Multer file object
   * @param sourceType Type of document (gazette, tender, etc.)
   */
  async uploadDocument(
    file: Express.Multer.File,
    sourceType: string = "gazette"
  ): Promise<UploadResult> {
    if (!file) {
      throw new Error("No file provided");
    }

    // 1. Sanitize filename
    const originalName = path.basename(file.originalname);
    const extension = path.extname(originalName) || ".pdf";
    const uniqueFileName = `${Date.now()}-${uuidv4()}${extension}`;
    const objectPath = `pdfs/${uniqueFileName}`;

    // 2. Convert Buffer to Uint8Array
    const nodeBuffer = file.buffer as Buffer;
    const fileBytes = new Uint8Array(nodeBuffer.length);
    for (let i = 0; i < nodeBuffer.length; i++) {
      fileBytes[i] = nodeBuffer[i]!;
    }

    // 3. Extract text BEFORE uploading (fail fast if extraction fails)
    let extractedText: string;
    try {
      extractedText = await this.extractText(fileBytes);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract text from PDF");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Text extraction failed: ${message}`);
    }

    // 4. Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("gazettes")
      .upload(objectPath, fileBytes, {
        contentType: file.mimetype,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      throw new Error(`Storage upload failed: ${uploadError.message}`);
    }

    // 5. Get public URL
    const { data: publicData } = supabase.storage
      .from("gazettes")
      .getPublicUrl(objectPath);

    const fileUrl = publicData?.publicUrl;

    if (!fileUrl) {
      throw new Error("Failed to generate public URL");
    }

    // 6. Insert document record
    let documentId: string;
    try {
      documentId = await this.insertDocumentRecord({
        source_type: sourceType,
        file_name: originalName,
        file_url: fileUrl,
        mime_type: file.mimetype,
        file_size: file.size,
        processing_status: "processing",
      });
    } catch (error) {
      // Cleanup: Delete uploaded file if DB insert fails
      await supabase.storage.from("gazettes").remove([objectPath]);
      throw error;
    }

    // 7. Insert extracted text
    try {
      await this.insertDocumentText(documentId, extractedText);
    } catch (error) {
      console.error("Failed to insert document text:", error);
      // Update status to failed but don't rollback document
      await this.updateProcessingStatus(documentId, "failed");
      throw new Error("Failed to save extracted text");
    }

    // 8. Update status to completed
    await this.updateProcessingStatus(documentId, "completed");

    return {
      documentId,
      fileName: originalName,
      fileUrl: fileUrl,
      extractedText: extractedText,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
  }

  /**
   * Insert document record into documents table
   * @param documentData Document metadata
   * @returns Document ID
   */
  private async insertDocumentRecord(documentData: {
    source_type: string;
    file_name: string;
    file_url: string;
    mime_type: string;
    file_size: number;
    processing_status: string;
  }): Promise<string> {
    const { data, error } = await supabase
      .from("documents")
      .insert(documentData)
      .select("id")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return data.id;
  }

  /**
   * Insert extracted text into document_texts table
   * @param documentId Document UUID
   * @param content Extracted text content
   * @param summary Optional summary
   */
  async insertDocumentText(
    documentId: string,
    content: string,
    summary?: string
  ): Promise<void> {
    const { error } = await supabase.from("document_texts").insert({
      doc_id: documentId,
      content: content,
      summary: summary || null,
    });

    if (error) {
      console.error("Failed to insert document text:", error);
      throw new Error(`Failed to insert document text: ${error.message}`);
    }
  }

  /**
   * Insert chunks into document_chunks table
   * @param documentId Document UUID
   * @param chunks Array of text chunks with optional embeddings
   */
  async insertDocumentChunks(
    documentId: string,
    chunks: Array<{
      content: string;
      embedding?: number[];
    }>
  ): Promise<void> {
    const chunkInserts = chunks.map((chunk, index) => ({
      document_id: documentId,
      chunk_index: index,
      content: chunk.content,
      embedding: chunk.embedding || null,
    }));

    const { error } = await supabase
      .from("document_chunks")
      .insert(chunkInserts);

    if (error) {
      console.error("Failed to insert document chunks:", error);
      throw new Error(`Failed to insert document chunks: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF bytes
   */
  async extractText(fileBytes: Uint8Array): Promise<string> {
    const text = await PDFTextExtractor.extract(fileBytes);
    return text;
  }

  /**
   * Classify document by assigning taxonomy nodes
   * @param documentId Document UUID
   * @param classifications Array of node classifications
   */
  async classifyDocument(
    documentId: string,
    classifications: ClassificationInput[]
  ): Promise<void> {
    if (!classifications || classifications.length === 0) {
      throw new Error("At least one classification is required");
    }

    const classificationInserts = classifications.map((c) => ({
      document_id: documentId,
      node_id: c.nodeId,
      confidence: c.confidence ?? 1.0,
      source: c.source ?? "user",
    }));

    const { error } = await supabase
      .from("document_classifications")
      .insert(classificationInserts);

    if (error) throw error;
  }

  /**
   * Generate industry/sector tags using LLM
   * LLM independently analyzes document and generates tags based on content
   * @param documentId Document UUID
   * @param extractedText Text extracted from document
   */
  async generateAndSaveTags(
    documentId: string,
    extractedText: string
  ): Promise<string[]> {
    // 1. Call LLM to analyze text and generate tags independently
    const tagResult = await this.generateTagsWithLLM(extractedText);

    if (!tagResult.tags || tagResult.tags.length === 0) {
      return []; // No tags identified
    }

    // 2. Save tags to database
    const tagInserts = tagResult.tags.map((tag) => ({
      document_id: documentId,
      tag: tag.toLowerCase().trim(),
    }));

    const { error } = await supabase.from("document_tags").insert(tagInserts);

    if (error) throw error;

    return tagResult.tags;
  }

  /**
   * Call LLM to independently generate industry/sector tags
   * LLM acts as its own source of truth, not influenced by manual classifications
   * @param text Extracted document text
   */
  private async generateTagsWithLLM(
    text: string
  ): Promise<TagGenerationResult> {
    // TODO: Replace with your actual LLM integration (OpenAI, Anthropic, etc.)

    const prompt = `
You are an expert at analyzing government documents and identifying all industries and sectors they relate to.

Your task: Read this document and identify ALL industries, sectors, or topic areas that this document references, impacts, or relates to.

Be comprehensive - identify both primary and secondary industries mentioned. Tags should be specific, industry-standard keywords.

Examples of good tags: "agriculture", "mining", "healthcare", "telecommunications", "renewable-energy", "construction", "financial-services", "education", "tourism", "manufacturing"

Document text (truncated):
${text.substring(0, 4000)}

Respond in JSON format:
{
  "tags": ["industry1", "industry2", "industry3"],
  "reasoning": "Brief explanation of what the document is about and why these tags were chosen"
}

If no clear industry references can be identified, return:
{
  "tags": [],
  "reasoning": "Document content is too general or unclear to assign specific industry tags"
}
`;

    // Example using OpenAI (replace with your LLM)
    /*
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result;
    */

    // Placeholder return - replace with actual LLM call
    throw new Error("LLM integration not implemented. Add your API call here.");
  }

  /**
   * Get document text by document ID
   */
  async getDocumentText(documentId: string): Promise<DocumentText | null> {
    const { data, error } = await supabase
      .from("document_texts")
      .select("*")
      .eq("doc_id", documentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw error;
    }
    return data;
  }

  /**
   * Update document text summary
   */
  async updateDocumentSummary(
    documentId: string,
    summary: string
  ): Promise<void> {
    const { error } = await supabase
      .from("document_texts")
      .update({ summary })
      .eq("doc_id", documentId);

    if (error) throw error;
  }

  /**
   * Get all classifications for a document with taxonomy details
   */
  async getDocumentClassifications(documentId: string) {
    const { data, error } = await supabase
      .from("document_classifications")
      .select(
        `
        *,
        taxonomy_nodes (
          id,
          code,
          label,
          description,
          level,
          taxonomies (
            id,
            name,
            version
          )
        )
      `
      )
      .eq("document_id", documentId);

    if (error) throw error;
    return data;
  }

  /**
   * Get all tags for a document
   */
  async getDocumentTags(documentId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("document_tags")
      .select("tag")
      .eq("document_id", documentId);

    if (error) throw error;
    return data?.map((row) => row.tag) || [];
  }

  /**
   * Get all documents with optional filters
   */
  async getAllDocuments(filters?: {
    sourceType?: string;
    processingStatus?: string;
    tags?: string[];
    nodeIds?: number[];
    limit?: number;
    offset?: number;
  }): Promise<DocumentWithRelations[]> {
    let query = supabase
      .from("documents")
      .select(
        `
        *,
        document_texts(content, summary, extracted_at),
        document_tags(tag),
        document_classifications(
          node_id,
          confidence,
          source,
          taxonomy_nodes(code, label)
        )
      `
      )
      .order("created_at", { ascending: false });

    if (filters?.sourceType) {
      query = query.eq("source_type", filters.sourceType);
    }

    if (filters?.processingStatus) {
      query = query.eq("processing_status", filters.processingStatus);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(
        filters.offset,
        filters.offset + (filters.limit || 10) - 1
      );
    }

    const { data, error } = await query;

    if (error) throw error;

    let results = (data || []) as DocumentWithRelations[];

    // Filter by tags if provided (post-query filtering)
    if (filters?.tags && filters.tags.length > 0) {
      results = results.filter((doc) => {
        const docTags = doc.document_tags?.map((t) => t.tag) || [];
        return filters.tags!.some((tag) => docTags.includes(tag));
      });
    }

    // Filter by node IDs if provided (post-query filtering)
    if (filters?.nodeIds && filters.nodeIds.length > 0) {
      results = results.filter((doc) => {
        const docNodeIds =
          doc.document_classifications?.map((c) => c.node_id) || [];
        return filters.nodeIds!.some((nodeId) => docNodeIds.includes(nodeId));
      });
    }

    return results;
  }

  /**
   * Get document by ID with all related data
   */
  async getDocumentById(documentId: string): Promise<DocumentWithRelations | null> {
    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        *,
        document_texts(content, summary, extracted_at),
        document_tags(tag),
        document_classifications(
          node_id,
          confidence,
          source,
          taxonomy_nodes(
            id,
            code,
            label,
            description,
            level,
            taxonomies(name, version)
          )
        ),
        document_chunks(
          id,
          chunk_index,
          content
        )
      `
      )
      .eq("id", documentId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found
        return null;
      }
      throw error;
    }
    return data as DocumentWithRelations;
  }

  /**
   * Get chunks for a document
   */
  async getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
    const { data, error } = await supabase
      .from("document_chunks")
      .select("*")
      .eq("document_id", documentId)
      .order("chunk_index");

    if (error) throw error;
    return data || [];
  }

  /**
   * Search documents by taxonomy hierarchy
   * Get all documents classified under a node or its descendants
   */
  async getDocumentsByTaxonomyNode(
    nodeId: number,
    includeDescendants: boolean = false
  ): Promise<DocumentRecord[]> {
    // Note: includeDescendants would need a recursive CTE query
    // For now, just query the direct node
    const { data, error } = await supabase
      .from("document_classifications")
      .select(
        `
        document_id,
        documents(*)
      `
      )
      .eq("node_id", nodeId);

    if (error) throw error;

    // Handle the nested structure from Supabase join
    const typedData = data as unknown as DocumentClassificationJoin[];
    return typedData
      ?.map((item) => {
        // Handle both single document and array of documents
        if (Array.isArray(item.documents)) {
          return item.documents[0];
        }
        return item.documents;
      })
      .filter((doc): doc is DocumentRecord => doc !== undefined && doc !== null) || [];
  }

  /**
   * Delete document (cascade deletes tags, classifications, chunks, and texts)
   */
  async deleteDocument(documentId: string): Promise<void> {
    // 1. Get document to find file path
    const { data: doc, error: fetchError } = await supabase
      .from("documents")
      .select("file_url, file_name")
      .eq("id", documentId)
      .single();

    if (fetchError) throw fetchError;

    // 2. Extract storage path from URL
    const urlParts = doc.file_url.split("/gazettes/");
    const storagePath =
      urlParts.length > 1 ? urlParts[1] : `pdfs/${doc.file_name}`;

    // 3. Delete from storage
    const { error: storageError } = await supabase.storage
      .from("gazettes")
      .remove([storagePath]);

    if (storageError) {
      console.warn("Failed to delete file from storage:", storageError);
      // Continue with DB deletion even if storage fails
    }

    // 4. Delete from database (tags, classifications, chunks, texts auto-deleted via cascade)
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) throw deleteError;
  }

  /**
   * Update document processing status
   */
  async updateProcessingStatus(
    documentId: string,
    status: "pending" | "processing" | "completed" | "failed"
  ): Promise<void> {
    const { error } = await supabase
      .from("documents")
      .update({
        processing_status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    if (error) throw error;
  }

  /**
   * Get taxonomy nodes for classification dropdown
   * Useful for admin UI to select categories
   */
  async getTaxonomyNodes(taxonomyId?: number, level?: number) {
    let query = supabase
      .from("taxonomy_nodes")
      .select(
        `
        *,
        taxonomies(name, version)
      `
      )
      .order("code");

    if (taxonomyId) {
      query = query.eq("taxonomy_id", taxonomyId);
    }

    if (level) {
      query = query.eq("level", level);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  /**
   * Get available taxonomies
   */
  async getTaxonomies(countryCode?: string) {
    let query = supabase.from("taxonomies").select(`
        *,
        countries(code, name)
      `);

    if (countryCode) {
      // Use inner join syntax for filtering
      query = query.eq("countries.code", countryCode);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}

export default new DocumentService();