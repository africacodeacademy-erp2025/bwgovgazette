// routes/search.ts
import { RequestHandler } from "express";
import OpenAI from "openai";
import { supabase } from "../utils/supabase/supabase-client";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const searchGazettes: RequestHandler = async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "query (string) is required in body" });
    }

    // 1) Create embedding
    const embedResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    });

    // 2) Runtime-check the response to satisfy TypeScript's strict null checks
    const firstItem = embedResp.data?.[0];
    if (!firstItem || !Array.isArray(firstItem.embedding)) {
      // log full response for debugging in case the SDK shape changes or API returns an error
      console.error("Invalid embedding response from OpenAI:", embedResp);
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    // At this point TS knows firstItem.embedding exists and is an array
    const queryEmbedding = firstItem.embedding as number[];

    // 3) Query Supabase RPC (match_gazette_chunks)
    const { data, error } = await supabase.rpc("match_gazette_chunks", {
      query_embedding: queryEmbedding,
      match_count: limit,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      // some supabase errors are objects; coerce to string safely
      const message = (error && typeof error.message === "string") ? error.message : String(error);
      return res.status(500).json({ error: message });
    }

    return res.json({ results: data ?? [] });
  } catch (err: unknown) {
    // No 'any' here — narrow unknown into a message safely
    console.error("Search handler error:", err);
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
};
