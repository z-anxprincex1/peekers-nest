import OpenAI from "openai";
import type { AiComparisonSummary, AiDealSummary, ProductListing } from "@/lib/types";
import {
  aiComparisonSummarySchema,
  aiDealSummarySchema
} from "@/lib/validation/schemas";
import { buildComparisonPrompt, buildDealSummaryPrompt } from "@/lib/ai/prompts";
import { safeJsonParse } from "@/lib/utils";

const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new OpenAI({ apiKey });
}

function extractText(content: unknown) {
  if (typeof content === "string") return content;
  return "";
}

export async function summarizeDeals(
  query: string,
  listings: ProductListing[]
): Promise<AiDealSummary> {
  const fallback: AiDealSummary = {
    headline: `Top matches for ${query}`,
    bestOverallPick: listings[0]?.title ?? "No overall pick available",
    bestBudgetPick:
      [...listings].sort((a, b) => a.price - b.price)[0]?.title ?? "No budget pick available",
    bestPremiumPick:
      [...listings].sort((a, b) => b.rating - a.rating || b.price - a.price)[0]?.title ??
      "No premium pick available",
    tradeoffs: [
      "Lower-priced deals can come from less trusted or lower-rated listings.",
      "Higher-rated deals may cost slightly more but usually reduce risk."
    ],
    rankedReasons: [
      "Top-ranked deals balance price, rating, discount, trust, and shipping advantages."
    ]
  };

  const client = getClient();
  if (!client || listings.length === 0) return fallback;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: buildDealSummaryPrompt(query, listings)
    });

    const raw = extractText(completion.choices[0]?.message?.content);
    const parsed = safeJsonParse<AiDealSummary>(raw);
    return aiDealSummarySchema.parse(parsed);
  } catch {
    return fallback;
  }
}

export async function compareDeals(
  query: string,
  listings: ProductListing[]
): Promise<AiComparisonSummary> {
  const fallback: AiComparisonSummary = {
    headline: `Comparison for ${query}`,
    winner: listings[0]?.title ?? "No winner available",
    rationale:
      "The selected winner offers the strongest mix of value, rating confidence, and seller trust.",
    tradeoffs: [
      "Cheaper options may sacrifice ratings or shipping speed.",
      "Premium options improve quality but reduce pure value."
    ]
  };

  const client = getClient();
  if (!client || listings.length < 2) return fallback;

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: buildComparisonPrompt(query, listings)
    });

    const raw = extractText(completion.choices[0]?.message?.content);
    const parsed = safeJsonParse<AiComparisonSummary>(raw);
    return aiComparisonSummarySchema.parse(parsed);
  } catch {
    return fallback;
  }
}
