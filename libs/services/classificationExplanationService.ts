import OpenAI from "openai";
import type { RankedResult } from "../utils/rankResults";
import type { SignalMatch } from "../utils/scoreSignals";

type SicNodeMeta = {
  id: string;
  code: string | null;
  title: string | null;
  description: string | null;
};

function topSignals(matches: SignalMatch[], limit = 6) {
  return matches
    .slice()
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, limit)
    .map((m) => ({
      signal: m.signal,
      frequency: m.frequency,
      contribution: Math.round(m.contribution * 100) / 100,
    }));
}

function truncate(text: string, maxChars: number) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "…";
}

class ClassificationExplanationService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      console.log("Classification explanation service ready");
    }
  }

  isReady() {
    return !!this.openai;
  }

  async generateExplanations(input: {
    documentText: string;
    results: RankedResult[];
    sicNodes: SicNodeMeta[];
  }): Promise<Map<string, string> | null> {
    if (!this.openai) return null;
    if (!input.results.length) return new Map();

    const docExcerpt = truncate(
      input.documentText.trim().replace(/\s+/g, " "),
      2500,
    );

    const sicById = new Map(input.sicNodes.map((n) => [n.id, n] as const));

    const candidates = input.results.map((r) => {
      const sic = sicById.get(r.sicNodeId);
      return {
        sicNodeId: r.sicNodeId,
        code: sic?.code ?? null,
        title: sic?.title ?? null,
        description: sic?.description ?? null,
        confidence: Math.round(r.confidence * 1000) / 1000,
        topSignals: topSignals(r.matches ?? []),
      };
    });

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You write short, cautious explanations for SIC classification. " +
            "Return STRICT JSON: an object mapping sicNodeId to an explanation string. " +
            "Each explanation must be 1–2 sentences, grounded only in the provided document excerpt and signals. " +
            "Do not mention scoring, confidence numbers, or the word 'signal'. Do not add extra keys.",
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              documentExcerpt: docExcerpt,
              candidates,
            },
            null,
            2,
          ),
        },
      ],
      max_tokens: 350,
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) return null;

    // Try to parse strict JSON; if the model wrapped it in text, attempt to extract.
    const parsed = safeParseJsonObject(content);
    if (!parsed) return null;

    const map = new Map<string, string>();
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof key !== "string") continue;
      if (typeof value !== "string") continue;
      map.set(key, value.trim());
    }

    return map;
  }
}

function safeParseJsonObject(text: string): Record<string, unknown> | null {
  try {
    const direct = JSON.parse(text);
    if (direct && typeof direct === "object" && !Array.isArray(direct)) {
      return direct as Record<string, unknown>;
    }
  } catch {
    // fallthrough
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    const sliced = text.slice(start, end + 1);
    const obj = JSON.parse(sliced);
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return obj as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

declare global {
  var classificationExplanationService:
    | ClassificationExplanationService
    | undefined;
}

export const classificationExplanationService =
  globalThis.classificationExplanationService ??
  (globalThis.classificationExplanationService =
    new ClassificationExplanationService());
