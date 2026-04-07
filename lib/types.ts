export type StoreName = "Amazon" | "Best Buy" | "Walmart" | "Target" | "eBay";

export type SortOption =
  | "overall"
  | "price"
  | "rating"
  | "discount"
  | "trustworthiness";

export interface ProductListing {
  id: string;
  query: string;
  providerId: string;
  source: StoreName;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  shippingInfo?: string | null;
  inStock: boolean;
  url: string;
  trustScore: number;
  shippingAdvantage: number;
  tags: string[];
  specs: string[];
  aiSummary?: string;
  pros?: string[];
  cons?: string[];
  comparisonNotes?: string[];
  overallScore: number;
  normalizedPriceScore: number;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  stores?: StoreName[];
  inStockOnly?: boolean;
  sortBy?: SortOption;
}

export interface SearchResponse {
  query: string;
  results: ProductListing[];
  summary: AiDealSummary;
  availableStores: StoreName[];
  totalCount: number;
  demoMode: boolean;
}

export interface ComparisonResponse {
  products: ProductListing[];
  summary: AiComparisonSummary;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  resultCount: number;
  createdAt: Date;
}

export interface AiDealSummary {
  headline: string;
  bestOverallPick: string;
  bestBudgetPick: string;
  bestPremiumPick: string;
  tradeoffs: string[];
  rankedReasons: string[];
}

export interface AiComparisonSummary {
  headline: string;
  winner: string;
  rationale: string;
  tradeoffs: string[];
}

export interface ProductProvider {
  id: string;
  name: StoreName;
  trustScore: number;
  search(query: string): Promise<ProviderProduct[]>;
}

export interface ProviderProduct {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewCount: number;
  shippingInfo?: string | null;
  inStock: boolean;
  url: string;
  tags: string[];
  specs: string[];
}
