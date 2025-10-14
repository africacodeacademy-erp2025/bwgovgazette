import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.type;

  if (fileType === 'text/plain') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }

  if (fileType === 'application/pdf') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          
          // Import pdfjs-dist dynamically
          const pdfjsLib = await import('pdfjs-dist');
          
          // Use a local worker file or skip worker for simple extraction
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
          
          const typedArray = new Uint8Array(arrayBuffer);
          const loadingTask = pdfjsLib.getDocument({
            data: typedArray,
            verbosity: 0
          });
          
          const pdf = await loadingTask.promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          resolve(fullText.trim());
        } catch (error) {
          console.error('PDF extraction error:', error);
          reject(new Error('Failed to extract text from PDF'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  if (fileType.startsWith('image/')) {
    const { data: { text } } = await Tesseract.recognize(file);
    return text;
  }

  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error('Unsupported file type');
};