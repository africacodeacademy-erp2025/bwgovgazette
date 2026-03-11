import OpenAI from "openai";

const EMBEDDING_MODEL = "text-embedding-3-small" as const;
const MAX_EMBEDDING_CHARS = 4_000;

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey });
  }

  return openaiClient;
}

function truncateForEmbedding(text: string): string {
  return text.slice(0, MAX_EMBEDDING_CHARS);
}

function toErrorMeta(err: unknown): { message?: string; status?: number } {
  const error = err as {
    message?: string;
    status?: number;
    response?: { status?: number };
  };
  return {
    message: error?.message,
    status: error?.status ?? error?.response?.status,
  };
}

// Reusable utility for both SicNode + DocumentText embedding.
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient();
  const normalized = truncateForEmbedding(text ?? "").trim();

  if (!normalized) return [];
  if (!client) {
    console.warn(
      "generateEmbedding: OPENAI_API_KEY not set; returning empty embedding.",
    );
    return [];
  }

  try {
    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: normalized,
    });

    return response.data[0]?.embedding ?? [];
  } catch (err: unknown) {
    const meta = toErrorMeta(err);
    console.error("generateEmbedding: OpenAI embedding request failed", meta);
    return [];
  }
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const client = getOpenAIClient();
  const inputs = (texts ?? []).map((t) => truncateForEmbedding(t ?? "").trim());

  if (inputs.length === 0) return [];
  if (!client) {
    console.warn(
      "generateEmbeddings: OPENAI_API_KEY not set; returning empty embeddings.",
    );
    return inputs.map(() => []);
  }

  try {
    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: inputs,
    });

    return response.data.map((d) => d.embedding);
  } catch (err: unknown) {
    const meta = toErrorMeta(err);
    console.error("generateEmbeddings: OpenAI embedding request failed", meta);
    return inputs.map(() => []);
  }
}

class EmbeddingService {
  isReady() {
    return !!getOpenAIClient();
  }

  splitTextIntoChunks(text: string, maxSize = 1000) {
    const sentences = text.split(/[.!?]+/);
    const chunks: string[] = [];
    let current = "";

    for (const sentence of sentences) {
      if (current.length + sentence.length > maxSize) {
        const trimmed = current.trim();
        if (trimmed) chunks.push(trimmed);
        current = sentence;
      } else {
        current += (current ? "." : "") + sentence;
      }
    }

    const trimmed = current.trim();
    if (trimmed) chunks.push(trimmed);
    return chunks;
  }

  async generateEmbeddingzForChunks(
    chunks: string[],
  ): Promise<(number[] | null)[]> {
    if (chunks.length === 0) return [];

    const embeddings = await generateEmbeddings(chunks);
    return embeddings.map((e) => (e.length ? e : null));
  }

  async generateEmbedding(text: string): Promise<number[]> {
    return generateEmbedding(text);
  }
}

declare global {
  var embeddingService: EmbeddingService | undefined;
}

export const embeddingService =
  globalThis.embeddingService ??
  (globalThis.embeddingService = new EmbeddingService());
