import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export class PDFTextExtractor {
  static async extract(
    input: Buffer | ArrayBuffer | Uint8Array | Blob | File
  ): Promise<string> {
    // Normalize to Uint8Array for pdfjs - create a proper copy to avoid detached ArrayBuffer issues
    let uint8: Uint8Array;

    if (input instanceof Uint8Array) {
      // Create a fresh copy to avoid detached ArrayBuffer issues
      uint8 = new Uint8Array(
        input.buffer.slice(
          input.byteOffset,
          input.byteOffset + input.byteLength
        )
      );
    } else if (input instanceof ArrayBuffer) {
      // Check if ArrayBuffer is detached
      try {
        uint8 = new Uint8Array(input.slice(0));
      } catch (error) {
        throw new Error("ArrayBuffer is detached and cannot be processed");
      }
    } else if (typeof (input as Blob).arrayBuffer === "function") {
      const ab = await (input as Blob).arrayBuffer();
      uint8 = new Uint8Array(ab);
    } else if (
      typeof Buffer !== "undefined" &&
      Buffer.isBuffer(input as unknown)
    ) {
      // Create a proper copy from Buffer to avoid detached ArrayBuffer issues
      const buffer = input as unknown as Buffer;
      uint8 = new Uint8Array(buffer.length);
      buffer.copy(uint8);
    } else {
      throw new Error("Unsupported input type for PDFTextExtractor.extract");
    }

    const loadingTask = pdfjsLib.getDocument({ data: uint8 });
    const pdf = await loadingTask.promise;

    // Fast path: extract selectable text via pdf.js textContent
    try {
      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: unknown) => (item as TextItem).str ?? "")
          .join(" ");

        extractedText += pageText + "\n";
      }

      if (extractedText.trim()) return extractedText.trim();
    } catch (err) {
      console.warn("pdf.js text extraction failed, falling back to OCR:", err);
    }

    // OCR fallback is not available in Node.js environment
    // For Node.js OCR, you would need to use different libraries like:
    // - node-canvas for canvas rendering
    // - tesseract.js/node or node-tesseract-ocr for OCR
    console.warn("OCR fallback not implemented for Node.js environment");

    // Return empty string if text extraction failed and OCR is not available
    return "";
  }

  /*
   *
   * Extend this to include a variety of text extraction methods from different mediums
   * text from Images
   */
}
