// services/text-splitter.ts
export function splitTextIntoChunks(
  text: string,
  approxWordsPerChunk = 300,
  overlapWords = 50
): string[] {
  if (!text) return [];

  // Normalize line breaks, split into paragraphs so we don't break mid-sentence too often
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let bufferWords: string[] = [];

  function flushBuffer() {
    if (bufferWords.length) {
      chunks.push(bufferWords.join(" "));
      bufferWords = [];
    }
  }

  for (const para of paragraphs) {
    const words = para.split(/\s+/);
    if (bufferWords.length + words.length <= approxWordsPerChunk) {
      bufferWords.push(...words);
    } else {
      // if buffer is non-empty, flush as a chunk
      if (bufferWords.length) {
        chunks.push(bufferWords.join(" "));
      }
      // start a fresh chunk with current paragraph; if paragraph too large, break it
      if (words.length <= approxWordsPerChunk) {
        bufferWords = words.slice();
      } else {
        // paragraph too big: split by word windows
        for (let i = 0; i < words.length; i += (approxWordsPerChunk - overlapWords)) {
          const piece = words.slice(i, i + approxWordsPerChunk).join(" ");
          chunks.push(piece);
        }
        bufferWords = [];
      }
    }
  }

  // flush remaining
  if (bufferWords.length) {
    chunks.push(bufferWords.join(" "));
  }

  // dedupe empty chunks and return
  return chunks.map(c => c.trim()).filter(Boolean);
}
