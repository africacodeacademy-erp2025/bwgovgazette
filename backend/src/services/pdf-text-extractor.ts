
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

export class PDFTextExtractor {
  static async extract(
    input: Buffer | ArrayBuffer | Uint8Array | Blob | File
  ): Promise<string> {
    // Normalize to Uint8Array for pdfjs
    let uint8: Uint8Array;
    if (input instanceof Uint8Array) {
      uint8 = input;
    } else if (input instanceof ArrayBuffer) {
      uint8 = new Uint8Array(input);
    } else if (typeof (input as Blob).arrayBuffer === "function") {
      const ab = await (input as Blob).arrayBuffer();
      uint8 = new Uint8Array(ab);
    } else if (
      typeof Buffer !== "undefined" &&
      Buffer.isBuffer(input as unknown)
    ) {
      uint8 = new Uint8Array(input as unknown as Buffer);
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

    // Fallback: render each page to a DOM canvas and OCR with Tesseract (browser)
    let ocrText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });

      // Browser canvas (React environment)
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(viewport.width);
      canvas.height = Math.ceil(viewport.height);
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Unable to get 2D context from canvas");

      // pdfjs expects both canvas and canvasContext (browser types match)
      await page.render({ canvasContext: context, viewport, canvas }).promise;

      // Convert to Blob and run Tesseract
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) continue;

      const { data: ocrData } = await Tesseract.recognize(blob, "eng");
      ocrText += ocrData.text + "\n";
    }

    return ocrText.trim();
  }
}
