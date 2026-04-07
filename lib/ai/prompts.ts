import type { ProductListing } from "@/lib/types";

function compactListing(listing: ProductListing) {
  return {
    id: listing.id,
    title: listing.title,
    source: listing.source,
    price: listing.price,
    originalPrice: listing.originalPrice ?? null,
    discountPercentage: listing.discountPercentage,
    rating: listing.rating,
    reviewCount: listing.reviewCount,
    inStock: listing.inStock,
    shippingInfo: listing.shippingInfo ?? null,
    trustScore: listing.trustScore,
    overallScore: listing.overallScore
  };
}

export function buildDealSummaryPrompt(query: string, listings: ProductListing[]) {
  return [
    {
      role: "system" as const,
      content:
        "You are a shopping deals analyst. Respond with strict JSON only. Keep advice concise, deterministic, and grounded in the provided data."
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        task: "Summarize the best deals for the query and identify top picks.",
        query,
        listings: listings.slice(0, 8).map(compactListing),
        instructions: {
          bestOverallPick: "Choose the listing with the strongest value balance.",
          bestBudgetPick: "Favor lowest price while maintaining acceptable ratings.",
          bestPremiumPick: "Favor highest quality or feature set even if more expensive.",
          tradeoffs: "Mention cheapest vs best-rated vs best-trusted seller when relevant.",
          rankedReasons: "Explain why top results rank highly based on score, rating, price, discount, and trust."
        },
        jsonShape: {
          headline: "string",
          bestOverallPick: "string",
          bestBudgetPick: "string",
          bestPremiumPick: "string",
          tradeoffs: ["string"],
          rankedReasons: ["string"]
        }
      })
    }
  ];
}

export function buildComparisonPrompt(query: string, listings: ProductListing[]) {
  return [
    {
      role: "system" as const,
      content:
        "You compare shopping products. Return strict JSON only. Base every point only on provided product data."
    },
    {
      role: "user" as const,
      content: JSON.stringify({
        task: "Compare products side by side and recommend a winner.",
        query,
        listings: listings.map(compactListing),
        jsonShape: {
          headline: "string",
          winner: "string",
          rationale: "string",
          tradeoffs: ["string"]
        }
      })
    }
  ];
}
