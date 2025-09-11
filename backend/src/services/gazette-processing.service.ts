import { FileStorageService } from "./storage/file-storage";
import { PDFTextExtractor } from "./pdf-text-extractor";
import { GazetteRepository } from "./gazette-repository";
import { FileValidator } from "./validation/file-validator";
import type { GazetteUploadResult } from "../model/types";

export class GazetteProcessingService {
  constructor(
    private fileStorage = new FileStorageService(),
    private textExtractor = new PDFTextExtractor(),
    private repository = new GazetteRepository()
  ) {}

  async processUpload(file: File): Promise<GazetteUploadResult> {
    // Validate file
    const validation = FileValidator.validate(file);
    if (!validation.valid) {
      return { success: false, error: validation.error || "Unknown error" };
    }

    let fileName: string | undefined;
    let recordId: string | undefined;

    try {
      // Step 1: Upload file to storage
      const { fileName: uploadedFileName, fileUrl } =
        await this.fileStorage.uploadFile(file);
      fileName = uploadedFileName;

      // Step 2: Create database record with pending status
      const inserted = await this.repository.createRecord({
        file_name: fileName,
        file_url: fileUrl,
        extracted_text: "", // Will be updated after processing
        processing_status: "pending",
      });
      // Ensure we got a record back
      if (!inserted || !("id" in inserted) || !inserted.id) {
        throw new Error("Database insert did not return a record with an id.");
      }

      // Use the DB-generated id for subsequent updates
      recordId = inserted.id;

      // Step 3: Extract text (async - could be moved to background job)
      const extractedText = await PDFTextExtractor.extract(file);

      // Step 4: Update record with extracted text
      if (!recordId) throw new Error("Missing database record id after insert");

      await this.repository.updateProcessingStatus(
        recordId,
        "completed",
        extractedText
      );

      return {
        success: true,
        data: {
          fileName,
          fileUrl,
          textPreview: extractedText.substring(0, 200) + "...",
        },
      };
    } catch (error) {
      // Cleanup on failure
      // Try to mark DB record as failed and delete uploaded file if present
      try {
        if (recordId) {
          await this.repository.updateProcessingStatus(recordId, "failed");
        }
        if (fileName) {
          await this.fileStorage.deleteFile(fileName);
        }
      } catch (cleanupError) {
        console.error("Cleanup failed:", cleanupError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Processing failed",
      };
    }
  }
  
}
