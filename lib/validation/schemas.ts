import { z } from "zod";

export const filtersSchema = z.object({
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minRating: z.number().min(0).max(5).optional(),
  stores: z.array(z.enum(["Amazon", "Best Buy", "Walmart", "Target", "eBay"])).optional(),
  inStockOnly: z.boolean().optional(),
  sortBy: z.enum(["overall", "price", "rating", "discount", "trustworthiness"]).optional()
});

export const searchRequestSchema = z.object({
  query: z.string().min(2),
  filters: filtersSchema.optional()
});

export const aiDealSummarySchema = z.object({
  headline: z.string(),
  bestOverallPick: z.string(),
  bestBudgetPick: z.string(),
  bestPremiumPick: z.string(),
  tradeoffs: z.array(z.string()).min(1).max(5),
  rankedReasons: z.array(z.string()).min(1).max(5)
});

export const aiComparisonSummarySchema = z.object({
  headline: z.string(),
  winner: z.string(),
  rationale: z.string(),
  tradeoffs: z.array(z.string()).min(1).max(5)
});

export const compareRequestSchema = z.object({
  productIds: z.array(z.string()).min(2).max(4),
  query: z.string().min(2),
  products: z.array(z.object({}).passthrough()).min(2).max(4).optional()
});
