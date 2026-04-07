import { getDiscountPercentage } from "@/lib/utils";
import type { ProductListing, ProductProvider, ProviderProduct } from "@/lib/types";

interface ScraperApiEbayItem {
  title?: string;
  product_title?: string;
  price?: number | string;
  current_price?: number | string;
  old_price?: number | string;
  original_price?: number | string;
  extracted_price?: number;
  extracted_old_price?: number;
  item_price?: {
    value?: number | string;
    currency?: string;
  };
  item_link?: string;
  link?: string;
  url?: string;
  product_url?: string;
  image?: string;
  thumbnail?: string;
  seller?: string;
  seller_name?: string;
  shop_name?: string;
  rating?: number | string;
  reviews?: number | string;
  review_count?: number | string;
  seller_rating?: number | string;
  seller_rating_count?: number | string;
  shipping?: string;
  shipping_cost?: string;
  condition?: string;
  availability?: string;
  extra_info?: string;
  free_returns?: string;
}

interface ScraperApiEbayResponse {
  results?: ScraperApiEbayItem[];
  organic_results?: ScraperApiEbayItem[];
  items?: ScraperApiEbayItem[];
}

const ebayProvider: ProductProvider = {
  id: "ebay",
  name: "eBay",
  trustScore: 0.79,
  async search(query: string) {
    const apiKey = process.env.SCRAPERAPI_KEY;
    if (!apiKey) {
      throw new Error("SCRAPERAPI_KEY is not configured.");
    }

    const url = new URL("https://api.scraperapi.com/structured/ebay/search/v2");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("query", query);

    const response = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`ScraperAPI eBay request failed with ${response.status}`);
    }

    const payload = (await response.json()) as ScraperApiEbayResponse | ScraperApiEbayItem[];
    const items = Array.isArray(payload)
      ? payload
      : payload.results ?? payload.organic_results ?? payload.items ?? [];

    return items
      .map((item, index) => mapEbayItem(item, index, query))
      .filter((product): product is ProviderProduct => Boolean(product));
  }
};

export function createEbayProvider() {
  return ebayProvider;
}

export function normalizeEbayListing(query: string, product: ProviderProduct): ProductListing {
  const shippingAdvantage = /free|pickup|delivery/i.test(product.shippingInfo ?? "") ? 0.8 : 0.4;

  return {
    id: `${ebayProvider.id}-${product.id}`,
    query,
    providerId: ebayProvider.id,
    source: ebayProvider.name,
    title: product.title,
    description: product.description,
    category: product.category,
    image: product.image,
    price: product.price,
    originalPrice: product.originalPrice,
    discountPercentage: getDiscountPercentage(product.price, product.originalPrice),
    rating: product.rating,
    reviewCount: product.reviewCount,
    shippingInfo: product.shippingInfo,
    inStock: product.inStock,
    url: product.url,
    trustScore: ebayProvider.trustScore,
    shippingAdvantage,
    tags: product.tags,
    specs: product.specs,
    overallScore: 0,
    normalizedPriceScore: 0
  };
}

function mapEbayItem(item: ScraperApiEbayItem, index: number, query: string): ProviderProduct | null {
  const title = cleanText(item.title ?? item.product_title ?? "");
  if (!title) return null;

  const price =
    toNumber(item.extracted_price ?? item.item_price?.value ?? item.current_price ?? item.price);
  if (price === null) return null;

  const url = resolveEbayListingUrl(
    item.product_url ?? item.item_link ?? item.link ?? item.url ?? ""
  );
  if (!url) return null;

  const originalPrice =
    toNumber(item.extracted_old_price ?? item.original_price ?? item.old_price) ?? undefined;
  const rating = toNumber(item.rating ?? item.seller_rating) ?? 0;
  const reviewCount = toInteger(item.review_count ?? item.reviews ?? item.seller_rating_count) ?? 0;
  const seller = cleanText(item.seller ?? item.seller_name ?? item.shop_name ?? "eBay seller");
  const shippingInfo = cleanText(
    item.shipping ?? item.shipping_cost ?? item.free_returns ?? `Seller: ${seller}`
  );
  const availability = cleanText(item.availability ?? "");
  const condition = cleanText(item.condition ?? item.extra_info ?? "");
  const inStock = availability ? !/out of stock|unavailable|sold/i.test(availability) : true;
  const image = item.image ?? item.thumbnail ?? placeholderImage(title);

  return {
    id: `ebay-${index}-${slugify(title)}`,
    title,
    description: `${seller} listing found on eBay for ${query}.`,
    category: query,
    image,
    price,
    originalPrice,
    rating,
    reviewCount,
    shippingInfo,
    inStock,
    url,
    tags: query.toLowerCase().split(/\s+/).filter(Boolean),
    specs: [
      "Source: eBay via ScraperAPI",
      `Seller: ${seller}`,
      condition ? `Condition: ${condition}` : "Condition: Not specified"
    ]
  };
}

function resolveEbayListingUrl(rawUrl: string) {
  if (!rawUrl) return "";

  const decoded = decodeURIComponent(rawUrl);
  const directMatch = decoded.match(/https?:\/\/(?:www\.)?ebay\.[^/\s]+\/itm\/[^\s"'&?]+/i);
  if (directMatch?.[0]) return directMatch[0];

  try {
    const url = new URL(decoded);
    const candidate =
      url.searchParams.get("url") ??
      url.searchParams.get("target") ??
      url.searchParams.get("q");

    if (candidate) {
      const nestedMatch = decodeURIComponent(candidate).match(
        /https?:\/\/(?:www\.)?ebay\.[^/\s]+\/itm\/[^\s"'&?]+/i
      );
      if (nestedMatch?.[0]) return nestedMatch[0];
    }

    if (/ebay\./i.test(url.hostname) && /\/itm\//i.test(url.pathname)) {
      return url.toString();
    }

    return "";
  } catch {
    return "";
  }
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return null;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function toInteger(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return Math.round(value);
  if (typeof value !== "string") return null;
  const cleaned = value.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const parsed = Number.parseInt(cleaned, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function placeholderImage(title: string) {
  return `https://placehold.co/600x400/0f172a/f8fafc/png?text=${encodeURIComponent(title)}`;
}
