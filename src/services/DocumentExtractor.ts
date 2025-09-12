import { createWorker } from 'tesseract.js';

interface ExtractionResult {
  text: string;
  confidence?: number;
  method: 'text' | 'ocr' | 'hybrid';
}

export class DocumentExtractor {
  private static tesseractWorker: any = null;

  private static async initializeTesseract() {
    if (!this.tesseractWorker) {
      this.tesseractWorker = await createWorker('eng');
    }
    return this.tesseractWorker;
  }

  static async extractText(file: File): Promise<ExtractionResult> {
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    try {
      // Handle PDF files
      if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractFromPDF(file);
      }

      // Handle image files
      if (fileType.startsWith('image/') || this.isImageFile(fileName)) {
        return await this.extractFromImage(file);
      }

      // Handle text files
      if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
        const text = await file.text();
        return { text, method: 'text' };
      }

      // Handle Word documents (basic text extraction)
      if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        // For now, attempt basic text extraction
        // In production, you'd want to use a proper Word parser
        const text = await file.text();
        return { text, method: 'text' };
      }

      throw new Error('Unsupported file type');
    } catch (error) {
      console.error('Document extraction error:', error);
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async extractFromPDF(file: File): Promise<ExtractionResult> {
    try {
      // First, try to extract text directly from PDF
      const arrayBuffer = await file.arrayBuffer();
      const textContent = await this.extractPDFText(arrayBuffer);
      
      if (textContent && textContent.trim().length > 50) {
        return { text: textContent, method: 'text' };
      }

      // If direct text extraction fails or yields little content,
      // convert PDF to images and use OCR
      return await this.extractPDFWithOCR(arrayBuffer);
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private static async extractPDFText(arrayBuffer: ArrayBuffer): Promise<string> {
    // Use browser-based PDF text extraction
    // This is a simplified approach - in production, you might want to use pdf-lib
    try {
      const uint8Array = new Uint8Array(arrayBuffer);
      const text = new TextDecoder().decode(uint8Array);
      
      // Extract readable text from PDF content
      const textMatches = text.match(/\(([^)]+)\)/g);
      if (textMatches) {
        return textMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\\[0-9]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      return '';
    } catch (error) {
      console.error('Direct PDF text extraction failed:', error);
      return '';
    }
  }

  private static async extractPDFWithOCR(arrayBuffer: ArrayBuffer): Promise<ExtractionResult> {
    try {
      // Convert PDF to canvas images and apply OCR
      const pdf = await this.loadPDFFromArrayBuffer(arrayBuffer);
      const allText: string[] = [];
      let totalConfidence = 0;
      const maxPages = Math.min(pdf.numPages, 10); // Limit to first 10 pages

      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        
        const imageData = canvas.toDataURL('image/png');
        const ocrResult = await this.performOCR(imageData);
        
        if (ocrResult.text.trim()) {
          allText.push(ocrResult.text);
          totalConfidence += ocrResult.confidence || 0;
        }
      }

      const combinedText = allText.join('\n\n');
      const averageConfidence = totalConfidence / maxPages;

      return {
        text: combinedText,
        confidence: averageConfidence,
        method: 'ocr'
      };
    } catch (error) {
      console.error('PDF OCR extraction failed:', error);
      throw new Error('Failed to extract text from PDF using OCR');
    }
  }

  private static async loadPDFFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<any> {
    // Dynamically import pdfjsLib to avoid build issues
    const pdfjsLib = await import('pdfjs-dist');
    return pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  }

  private static async extractFromImage(file: File): Promise<ExtractionResult> {
    try {
      const imageUrl = URL.createObjectURL(file);
      const result = await this.performOCR(imageUrl);
      URL.revokeObjectURL(imageUrl);
      
      return {
        text: result.text,
        confidence: result.confidence,
        method: 'ocr'
      };
    } catch (error) {
      console.error('Image OCR error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  private static async performOCR(imageSource: string): Promise<{ text: string; confidence: number }> {
    try {
      const worker = await this.initializeTesseract();
      const { data } = await worker.recognize(imageSource);
      
      return {
        text: data.text,
        confidence: data.confidence
      };
    } catch (error) {
      console.error('OCR processing error:', error);
      throw new Error('OCR processing failed');
    }
  }

  private static isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'];
    return imageExtensions.some(ext => fileName.endsWith(ext));
  }

  static async cleanup() {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }
}