// routes/search.ts
import { RequestHandler } from "express";
import OpenAI from "openai";
import { supabase } from "../utils/supabase/supabase-client";
import { GazetteChunk } from "../model/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const searchGazettes: RequestHandler = async (req, res) => {
  
  try {
    const { query, topK = 10 } = req.body;
    if (!query) return res.status(400).json({ error: "Missing query" });

    // 1. Embed the query
    const embeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    if (!embeddingResp.data || embeddingResp.data.length === 0) {
      throw new Error("OpenAI embedding response is empty or undefined");
    }

    const queryEmbedding = embeddingResp.data[0]?.embedding;

    // 2. Search pgvector for topK chunks
    const { data: chunks, error } = await supabase.rpc("match_chunks", {
      query_embedding: queryEmbedding,
      match_count: topK,
    });

    if (error) throw error;

    if (!Array.isArray(chunks) || chunks.length === 0) {
      throw new Error("No matching chunks found.");
    }

   const context = (chunks as GazetteChunk[])
  .filter((c): c is GazetteChunk => !!c && typeof c.content === "string")
  .map((c) => `[chunk_id=${c.id}] ${c.content.slice(0, 500)}...`)
  .join("\n\n");

    // 4. Ask LLM to summarize 
    const prompt = `
You are answering a question based on Botswana Government Gazette text.
Use ONLY the provided context. 

Question: ${query}

Context:
${context}

Answer requirements:
- Summarize in plain English.
- keep it to < 15 sentenses while providing details 
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or gpt-4-turbo
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const summary =
      completion.choices &&
      completion.choices.length > 0 &&
      completion.choices[0]?.message?.content
        ? completion.choices[0]?.message.content
        : "";

    // 5. Return structured response
    res.json({
  query,
  summary,
  citations: (chunks as GazetteChunk[]).map((c) => ({
    chunk_id: c.id,
    gazette_id: c.gazette_id,
    snippet: c.content.slice(0, 200) + "...",
    similarity: c.similarity,
  })),

    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};
