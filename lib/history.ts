import type { SearchHistoryItem } from "@/lib/types";

const runtimeHistory: SearchHistoryItem[] = [];
const cachedPayloads = new Map<string, string>();

export async function getSearchHistory(limit = 6) {
  return runtimeHistory.slice(0, limit);
}

export async function saveSearch(query: string, resultCount: number) {
  const existingIndex = runtimeHistory.findIndex((item) => item.query.toLowerCase() === query.toLowerCase());
  const nextItem: SearchHistoryItem = {
    id: `history-${Date.now()}`,
    query,
    resultCount,
    createdAt: new Date()
  };

  if (existingIndex >= 0) {
    runtimeHistory.splice(existingIndex, 1);
  }

  runtimeHistory.unshift(nextItem);

  if (runtimeHistory.length > 10) {
    runtimeHistory.length = 10;
  }
}

export async function cacheSearchResult(query: string, payload: string) {
  cachedPayloads.set(query, payload);
}

export async function clearSearchHistory() {
  runtimeHistory.length = 0;
}
