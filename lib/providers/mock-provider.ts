import { mockCatalog } from "@/lib/data/mock-products";
import { getDiscountPercentage } from "@/lib/utils";
import type { ProductProvider, ProviderProduct, StoreName } from "@/lib/types";

const trustScores: Record<StoreName, number> = {
  Amazon: 0.88,
  "Best Buy": 0.91,
  Walmart: 0.83,
  Target: 0.8
};

function createProductId(source: StoreName, title: string) {
  return `${source.toLowerCase().replace(/\s+/g, "-")}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export class MockProvider implements ProductProvider {
  constructor(
    public readonly id: string,
    public readonly name: StoreName,
    public readonly trustScore: number
  ) {}

  async search(query: string): Promise<ProviderProduct[]> {
    const tokens = query
      .toLowerCase()
      .split(/\s+/)
      .map((token) => token.replace(/[^a-z0-9]/g, ""))
      .filter((token) => token.length > 1);

    const sourceProducts = mockCatalog
      .filter((product) => product.source === this.name)
      .map<ProviderProduct>((product) => ({
        id: createProductId(product.source, product.title),
        title: product.title,
        description: product.description,
        category: product.category,
        image: `https://placehold.co/600x400/0f172a/f8fafc/png?text=${encodeURIComponent(
          product.title
        )}`,
        price: product.price,
        originalPrice: product.originalPrice,
        rating: product.rating,
        reviewCount: product.reviewCount,
        shippingInfo: product.shippingInfo,
        inStock: product.inStock,
        url: `https://demo.peekersnest.app/${this.id}/${createProductId(product.source, product.title)}`,
        tags: product.tags,
        specs: product.specs
      }));

    const scored = sourceProducts
      .map((product) => {
        const haystack = [product.title, product.description, product.category, ...product.tags].join(" ").toLowerCase();
        const keywordHits = tokens.reduce((sum, token) => sum + (haystack.includes(token) ? 1 : 0), 0);
        const score = keywordHits / Math.max(tokens.length, 1);
        const isMeaningfulMatch =
          tokens.length === 0 ||
          keywordHits >= Math.min(2, tokens.length) ||
          score >= 0.6;

        return { product, score, isMeaningfulMatch };
      })
      .filter(({ isMeaningfulMatch }) => isMeaningfulMatch)
      .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
      .map(({ product }) => product);

    return scored;
  }
}

export function createMockProviders(): ProductProvider[] {
  return Object.entries(trustScores).map(
    ([name, trustScore]) =>
      new MockProvider(name.toLowerCase().replace(/\s+/g, "-"), name as StoreName, trustScore)
  );
}

export function normalizeProviderProduct(
  query: string,
  provider: ProductProvider,
  product: ProviderProduct
) {
  const discountPercentage = getDiscountPercentage(product.price, product.originalPrice);
  const shippingAdvantage =
    product.shippingInfo?.toLowerCase().includes("free") || product.shippingInfo?.toLowerCase().includes("pickup")
      ? 1
      : 0.4;

  return {
    id: `${provider.id}-${product.id}`,
    query,
    providerId: provider.id,
    source: provider.name,
    title: product.title,
    description: product.description,
    category: product.category,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercentage,
    rating: product.rating,
    reviewCount: product.reviewCount,
    shippingInfo: product.shippingInfo,
    inStock: product.inStock,
    url: product.url,
    trustScore: provider.trustScore,
    shippingAdvantage,
    tags: product.tags,
    specs: product.specs,
    overallScore: 0,
    normalizedPriceScore: 0
  };
}
