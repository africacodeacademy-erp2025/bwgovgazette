import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../utils/supabase/supabase-client";
import { PDFTextExtractor } from "../services/pdf-text-extractor";
import { GazetteRepository } from "../services/gazette-repository";
import { processGazetteChunks} from "../services/embedding-service"

// Configure multer once, reuse
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// This is the handler we’ll export
export const uploadPDF = [
  upload.single("file"), // multer middleware
  async (req: Request, res: Response) => {
    try {
      const file = req.file as Express.Multer.File | undefined;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      const originalName = path.basename(file.originalname);
      const ext = path.extname(originalName) || ".pdf";
      const filename = `${Date.now()}-${uuidv4()}${ext}`;
      const objectPath = `pdfs/${filename}`;

      // Normalize Multer Buffer to Uint8Array for downstream APIs (Supabase, pdfjs)
      // Ensure we pass a plain Uint8Array (not a Node Buffer wrapper) to Supabase/pdf.js
      let uint8data: Uint8Array;
      if (
        file.buffer instanceof Uint8Array &&
        !(file.buffer instanceof Buffer)
      ) {
        uint8data = file.buffer;
      } else if (
        typeof Buffer !== "undefined" &&
        Buffer.isBuffer(file.buffer)
      ) {
        // Create a Uint8Array view over the same memory without leaving a Node Buffer type
        const buf = file.buffer as Buffer;
        uint8data = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      } else {
        // TypeScript requires an intermediate unknown cast when converting Buffer-like to ArrayBuffer
        uint8data = new Uint8Array(file.buffer as unknown as ArrayBuffer);
      }

      // Upload uint8 data to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("gazettes")
        .upload(objectPath, uint8data, {
          contentType: file.mimetype,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      // Get a public URL if the bucket is public
      const { data: publicData } = await supabase.storage
        .from("gazettes")
        .getPublicUrl(objectPath);

      // Persist a DB record with pending status so we can update it after extraction
      const repository = new GazetteRepository();
      const inserted = await repository.createRecord({
        file_name: filename,
        file_url: publicData?.publicUrl ?? objectPath,
        extracted_text: "",
        processing_status: "pending",
      });

      // 🔹 Extract text
      const extractedText = await PDFTextExtractor.extract(uint8data);

      // Update the DB record with the extracted text and mark completed
      if (inserted && inserted.id) {
        await repository.updateProcessingStatus(
          inserted.id,
          "completed",
          extractedText
        );
        
      }
      
      await processGazetteChunks(inserted.id, extractedText);
      return res.status(201).json({
        message: "Uploaded to Supabase",
        path: uploadData?.path ?? objectPath,
        publicUrl: publicData?.publicUrl ?? null,
        extractedText,
      });
    } catch (err: unknown) {
      console.error("Upload error:", err);

      if (err instanceof Error) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(500).json({ error: String(err) });
    }
  },
];
