// services/embedding-service.ts
import OpenAI from "openai";
import { supabase } from "../utils/supabase/supabase-client";
import { splitTextIntoChunks } from "./text-splitter";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processGazetteChunks(
  gazetteId: string,
  extractedText: string,
  opts?: { model?: string; batchSize?: number; approxWordsPerChunk?: number; overlapWords?: number }
) {
  const model = opts?.model ?? "text-embedding-3-small";
  const batchSize = opts?.batchSize ?? 16;
  const chunkWords = opts?.approxWordsPerChunk ?? 300;
  const overlap = opts?.overlapWords ?? 50;

  const chunks = splitTextIntoChunks(extractedText, chunkWords, overlap);

  if (chunks.length === 0) return;

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);

    // call embeddings API with multiple inputs at once (more efficient)
    const resp = await client.embeddings.create({
      model,
      input: batch,
    });

    // resp.data is array of objects with .embedding
    const embeddings = resp.data.map(d => d.embedding);

    // prepare rows for single bulk insert
    const rows = batch.map((content, idx) => ({
      gazette_id: gazetteId,
      chunk_index: i + idx,
      content,
      embedding: embeddings[idx],
    }));

    const { error } = await supabase.from("gazette_chunks").insert(rows);

    if (error) {
      // you can do more advanced error handling / retries here
      throw new Error(`Failed to insert gazette_chunks: ${error.message}`);
    }
  }
}
