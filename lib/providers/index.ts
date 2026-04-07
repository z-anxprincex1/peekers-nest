import { createEbayProvider, normalizeEbayListing } from "@/lib/providers/ebay";
import type { ProductListing } from "@/lib/types";

export async function aggregateListings(query: string): Promise<ProductListing[]> {
  const ebayProvider = createEbayProvider();
  const liveResults = await ebayProvider.search(query);
  return liveResults.map((product) => normalizeEbayListing(query, product));
}
