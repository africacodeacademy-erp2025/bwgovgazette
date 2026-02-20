import OpenAI from "openai";

class SummaryService {
  private openai: OpenAI | null = null;

  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log("Summary service ready");
    }
  }

  isReady() {
    return !!this.openai;
  }

  async generateSummary(
    text: string,
    options: {
      maxWords?: number;
      style?: "concise" | "bullet-points" | "executive";
      includeKeyPoints?: boolean;
    } = {},
  ) {
    const input = text.slice(0, 8000);

    const completion = await this.openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: this.buildPrompt(
            options.maxWords,
            options.style,
            options.includeKeyPoints,
          ),
        },
        {
          role: "user",
          content: input,
        },
      ],
      max_tokens: Math.min(800, (options.maxWords ?? 100) * 2),
    });

    const summary = completion.choices[0]?.message?.content?.trim();

    if (!summary) return null;

    return {
      summary,
      wordCount: summary.split(" ").length,
      truncated: text.length > 8000,
      tokensUsed: completion.usage?.total_tokens ?? 0,
      model: completion.model,
    };
  }

  private buildPrompt(
    maxWords: number = 100,
    style?: "concise" | "bullet-points" | "executive",
    includeKeyPoints: boolean = true,
  ) {
    let prompt = `Summarize the document in at most ${maxWords} words.`;

    if (style === "bullet-points") prompt += " Use bullet points.";
    if (style === "executive") prompt += " Write an executive summary";
    if (includeKeyPoints) prompt += " Highlight key takeaways.";

    return prompt;
  }
}
declare global {
  var summaryService: SummaryService | undefined;
}
export const summaryService = globalThis.summaryService ?? (globalThis.summaryService = new SummaryService());
