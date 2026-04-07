import type { SearchFilters, SearchResponse } from "@/lib/types";
import { aggregateListings } from "@/lib/providers";
import { cacheSearchResult, saveSearch } from "@/lib/history";
import { scoreListings, filterListings, sortListings } from "@/lib/ranking/engine";
import { summarizeDeals } from "@/lib/ai/openai";

export async function runSearch(query: string, filters: SearchFilters = {}): Promise<SearchResponse> {
  const normalized = scoreListings(await aggregateListings(query));
  const filtered = filterListings(normalized, filters);
  const sorted = sortListings(filtered, filters.sortBy);
  const summary = await summarizeDeals(query, sorted);
  const availableStores = [...new Set(normalized.map((item) => item.source))];
  const demoMode = false;

  await Promise.all([
    saveSearch(query, sorted.length),
    cacheSearchResult(query, JSON.stringify(sorted.slice(0, 12)))
  ]);

  return {
    query,
    results: sorted,
    summary,
    availableStores,
    totalCount: sorted.length,
    demoMode
  };
}
