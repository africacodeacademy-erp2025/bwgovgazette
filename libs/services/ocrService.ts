import Tesseract from "tesseract.js";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { pathToFileURL } from "url";
import { createCanvas } from "canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

// Resolve the worker path at runtime pointing directly into node_modules.
// pdfjs-dist is kept as a serverExternalPackage so Node (not Turbopack)
// owns the module — the file:// URL is therefore always resolvable.
const workerPath = path.join(
  process.cwd(),
  "node_modules",
  "pdfjs-dist",
  "legacy",
  "build",
  "pdf.worker.mjs",
);
(
  pdfjsLib as typeof pdfjsLib & { GlobalWorkerOptions: { workerSrc: string } }
).GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).toString();

// Custom canvas factory for Node.js
class NodeCanvasFactory {
  create(width: number, height: number) {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return { canvas, context };
  }

  reset(
    canvasAndContext: {
      canvas: ReturnType<typeof createCanvas>;
      context: ReturnType<ReturnType<typeof createCanvas>["getContext"]>;
    },
    width: number,
    height: number,
  ) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: { canvas: ReturnType<typeof createCanvas> }) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
  }
}

class OCRService {
  private worker: Tesseract.Worker | null = null;
  private initializing = false;

  private async initializeWorker() {
    if (this.worker || this.initializing) return this.worker;

    this.initializing = true;
    console.log("Initializing OCR worker...");
    this.worker = await Tesseract.createWorker("eng");
    console.log("OCR worker ready");
    this.initializing = false;

    return this.worker;
  }

  async preprocessImage(imagePath: string) {
    try {
      const processedPath = imagePath.replace(/(\.[^.]+)$/, "_processed$1");

      await sharp(imagePath)
        .resize(null, 2000, { withoutEnlargement: true })
        .grayscale()
        .normalize()
        .sharpen()
        .jpeg({ quality: 95 })
        .toFile(processedPath);

      return processedPath;
    } catch {
      return imagePath;
    }
  }

  async extractTextFromImage(imagePath: string) {
    const worker = await this.initializeWorker();
    if (!worker) throw new Error("OCR worker not available");

    const processedPath = await this.preprocessImage(imagePath);
    const { data } = await worker.recognize(processedPath);

    if (processedPath !== imagePath) {
      await fs.unlink(processedPath).catch(() => {});
    }

    return {
      text: data.text.trim(),
      confidence: data.confidence,
      method: "ocr",
    };
  }

  async extractTextFromPDF(pdfPath: string): Promise<{
    text: string;
    confidence: number;
    pages: number;
    method: "direct" | "ocr";
  }> {
    const buffer = await fs.readFile(pdfPath);

    // Use PDF.js to extract text directly first
    const pdfDocument = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
    }).promise;

    let directText = "";
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = (textContent.items as Array<{ str?: string }>)
        .map((item: { str?: string }) => item.str ?? "")
        .join(" ");
      directText += `\n=== PAGE ${i} ===\n${pageText.trim()}`;
    }

    if (directText.trim().length > 50) {
      return {
        text: directText.trim(),
        confidence: 100,
        pages: pdfDocument.numPages,
        method: "direct",
      };
    }

    // Fallback to OCR: render pages to canvas and run Tesseract
    const numPages = pdfDocument.numPages;
    const worker = await this.initializeWorker();
    if (!worker) throw new Error("OCR worker not available");

    let text = "";
    let confidence = 0;
    const canvasFactory = new NodeCanvasFactory();
    const tempDir = path.dirname(pdfPath);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 }); // Scale for better OCR quality

      const canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height,
      );
      const renderContext = {
        canvasContext:
          canvasAndContext.context as unknown as CanvasRenderingContext2D,
        viewport,
        canvas: canvasAndContext.canvas as unknown as HTMLCanvasElement,
      };

      await page.render(renderContext).promise;

      const imgPath = path.join(tempDir, `page_${i}_${Date.now()}.png`);
      const pngBuffer = canvasAndContext.canvas.toBuffer("image/png");
      await fs.writeFile(imgPath, pngBuffer);

      try {
        const processed = await this.preprocessImage(imgPath);
        const { data } = await worker.recognize(processed);

        text += `\n=== PAGE ${i} ===\n${data.text.trim()}`;
        confidence += data.confidence;

        if (processed !== imgPath) await fs.unlink(processed).catch(() => {});
      } finally {
        await fs.unlink(imgPath).catch(() => {});
      }

      canvasFactory.destroy(canvasAndContext);
    }

    return {
      text,
      confidence: numPages ? confidence / numPages : 0,
      pages: numPages,
      method: "ocr",
    };
  }

  async extractText(filePath: string, mimeType: string) {
    if (mimeType.startsWith("image/")) {
      return this.extractTextFromImage(filePath);
    }

    if (mimeType === "application/pdf") {
      return this.extractTextFromPDF(filePath);
    }

    throw new Error(`Unsupported mimetype: ${mimeType}`);
  }
}

declare global {
  var ocrService: OCRService | undefined;
}

export const ocrService =
  globalThis.ocrService ?? (globalThis.ocrService = new OCRService());
