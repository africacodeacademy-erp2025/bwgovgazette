import OpenAI from "openai";
import { Prisma, SignalType, SicNode } from "@prisma/client";
import { prisma } from "../prisma";
import { normalizeSignal } from "./generateSignals";

// ---------------------------------------------------------------------------
// Weight defaults for AI-enriched signal types
// ---------------------------------------------------------------------------
const WEIGHT: Record<string, number> = {
  synonym: 2,
  negative: -4,
  boost: 6,
};

// ---------------------------------------------------------------------------
// EnrichmentResponse – expected JSON shape returned by the model
// ---------------------------------------------------------------------------
interface EnrichmentResponse {
  synonyms: string[];
  negative: string[];
  boost: string[];
}

// ---------------------------------------------------------------------------
// BATCH_SIZE – number of nodes to process before pausing (rate-limit safety)
// ---------------------------------------------------------------------------
const BATCH_SIZE = 5;

// ---------------------------------------------------------------------------
// buildPrompt
// Constructs the user prompt sent to OpenAI for a single SicNode.
// ---------------------------------------------------------------------------
function buildPrompt(
  title: string,
  description: string,
  existingSignals: string[],
): string {
  return [
    `Industry title: ${title}`,
    `Description: ${description}`,
    `Existing signals: ${existingSignals.join(", ")}`,
    "",
    "Return a JSON object with three arrays (max 10 items each):",
    "  synonyms  – alternative terms, abbreviations, or colloquial names people use for this industry",
    "  negative  – terms that look related but actually belong to a different industry (false positives)",
    "  boost     – highly distinctive terms that strongly indicate this specific industry",
    "",
    "Rules:",
    "- JSON only, no explanations or markdown fences",
    "- Each value must be a lowercase string",
    "- Do not repeat any existing signal",
  ].join("\n");
}

// ---------------------------------------------------------------------------
// ENRICHED_TYPES – the signal types inserted by this enrichment step.
// Used to check idempotency: if a node already has at least one of these
// signal types we skip it.
// ---------------------------------------------------------------------------
const ENRICHED_TYPES = ["synonym", "negative", "boost"] as const;

// ---------------------------------------------------------------------------
// isSignalEligible – determines whether a SicNode should be processed.
// ---------------------------------------------------------------------------
function isSignalEligible(node: SicNode): boolean {
  if (node.description === null) {
    return false;
  }

  if (node.description.trim().length <= 40) {
    return false;
  }

  if (node.isActive === false) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// enrichSignals
//
// For every active SicNode that has NOT already been enriched (idempotent):
//   1. Collects the node's title, description, and existing core/phrase signals.
//   2. Calls OpenAI (gpt-4o-mini) to generate synonym, negative, and boost
//      signal suggestions.
//   3. Normalises and deduplicates the returned signals.
//   4. Inserts them into the SicSignal table with the appropriate weights.
//
// The function is safe to re-run: nodes that already have enriched signals
// (synonym | negative | boost) are skipped entirely.
// ---------------------------------------------------------------------------
export async function enrichSignals(): Promise<{
  enrichedNodes: number;
  totalSignalsCreated: number;
  skippedNodes: number;
  errors: { nodeId: string; error: string }[];
}> {
  // ── OpenAI client ───────────────────────────────────────────────────────
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }
  const openai = new OpenAI({ apiKey });

  // ── Fetch eligible SicNodes and their existing signals ─────────────────
  const eligibleIds = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    SELECT n.id
    FROM "SicNode" n
    WHERE n."isActive" = true
      AND n."description" IS NOT NULL
      AND length(trim(n."description")) > 40
  `);

  const nodes = await prisma.sicNode.findMany({
    where: { id: { in: eligibleIds.map((row) => row.id) } },
    include: {
      signals: {
        select: { signalValue: true, normalizedValue: true, type: true },
      },
    },
  });

  const eligibleNodes = nodes.filter((node) => isSignalEligible(node));
  console.log(`[enrichSignals] Eligible SicNode(s): ${eligibleNodes.length}.`);

  let enrichedNodes = 0;
  let totalSignalsCreated = 0;
  let skippedNodes = 0;
  const errors: { nodeId: string; error: string }[] = [];

  for (let i = 0; i < eligibleNodes.length; i += BATCH_SIZE) {
    const batch = eligibleNodes.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (node) => {
        // ── Idempotency check ──────────────────────────────────────────
        if (node.signals.length === 0) {
          skippedNodes++;
          return;
        }

        const hasEnriched = node.signals.some((s: { type: string }) =>
          (ENRICHED_TYPES as readonly string[]).includes(s.type),
        );
        if (hasEnriched) {
          skippedNodes++;
          return;
        }

        const title = node.title ?? "";
        const description = node.description ?? "";

        const existingSignals = node.signals
          .filter(
            (s: { type: string }) => s.type === "core" || s.type === "phrase",
          )
          .map((s: { signalValue: string }) => s.signalValue);

        try {
          // ── Call OpenAI ────────────────────────────────────────────────
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            messages: [
              {
                role: "system",
                content:
                  "You are an industry classification expert. Respond with valid JSON only. No markdown, no explanations.",
              },
              {
                role: "user",
                content: buildPrompt(title, description, existingSignals),
              },
            ],
            max_tokens: 1024,
          });

          const raw = completion.choices[0]?.message?.content?.trim();
          if (!raw) {
            errors.push({
              nodeId: node.id,
              error: "Empty response from model",
            });
            return;
          }

          // ── Parse JSON ─────────────────────────────────────────────────
          // Strip potential markdown fences the model might slip in
          const cleaned = raw
            .replace(/^```json?\s*/i, "")
            .replace(/```\s*$/i, "");
          let parsed: EnrichmentResponse;
          try {
            parsed = JSON.parse(cleaned);
          } catch {
            errors.push({
              nodeId: node.id,
              error: `Invalid JSON: ${cleaned.slice(0, 200)}`,
            });
            return;
          }

          // ── Normalise, deduplicate, and prepare inserts ────────────────
          const existingSet = new Set(existingSignals);
          const newSignals: {
            sicNodeId: string;
            signalValue: string;
            normalizedValue: string;
            weight: number;
            type: SignalType;
            specificity: number;
          }[] = [];

          const seen = new Set<string>();

          function collect(items: unknown, type: SignalType) {
            if (!Array.isArray(items)) return;
            for (const item of items.slice(0, 10)) {
              if (typeof item !== "string") continue;
              const normalised = normalizeSignal(item);
              if (
                !normalised ||
                existingSet.has(normalised) ||
                seen.has(normalised)
              )
                continue;
              seen.add(normalised);
              newSignals.push({
                sicNodeId: node.id,
                signalValue: item,
                normalizedValue: normalised,
                weight: WEIGHT[type],
                type,
                specificity: 1,
              });
            }
          }

          collect(parsed.synonyms, SignalType.synonym);
          collect(parsed.negative, SignalType.negative);
          collect(parsed.boost, SignalType.boost);

          if (newSignals.length > 0) {
            await prisma.sicSignal.createMany({ data: newSignals });
            totalSignalsCreated += newSignals.length;
          }

          enrichedNodes++;
          console.log(
            `[${i + batch.indexOf(node) + 1}/${eligibleNodes.length}] Enriched "${title}" — ${newSignals.length} signals`,
          );
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          errors.push({ nodeId: node.id, error: message });
          console.error(`[${node.id}] Error enriching "${title}": ${message}`);
        }
      }),
    );
  }

  console.log(
    `\nEnrichment complete: ${enrichedNodes} enriched, ${skippedNodes} skipped, ${errors.length} errors, ${totalSignalsCreated} signals created`,
  );

  return { enrichedNodes, totalSignalsCreated, skippedNodes, errors };
}
