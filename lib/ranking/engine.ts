import type { ProductListing, SearchFilters, SortOption } from "@/lib/types";
import { clamp } from "@/lib/utils";

const weights = {
  price: 0.34,
  rating: 0.24,
  discount: 0.17,
  trust: 0.17,
  shipping: 0.08
};

function normalizePriceScore(price: number, minPrice: number, maxPrice: number) {
  if (minPrice === maxPrice) return 1;
  return 1 - (price - minPrice) / (maxPrice - minPrice);
}

export function scoreListings(listings: ProductListing[]) {
  if (listings.length === 0) return [];

  const prices = listings.map((item) => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return listings.map((listing) => {
    const priceScore = normalizePriceScore(listing.price, minPrice, maxPrice);
    const ratingScore = clamp(listing.rating / 5, 0, 1);
    const discountScore = clamp(listing.discountPercentage / 50, 0, 1);
    const trustScore = clamp(listing.trustScore, 0, 1);
    const shippingScore = clamp(listing.shippingAdvantage, 0, 1);

    const overallScore =
      (priceScore * weights.price +
        ratingScore * weights.rating +
        discountScore * weights.discount +
        trustScore * weights.trust +
        shippingScore * weights.shipping) *
      100;

    return {
      ...listing,
      normalizedPriceScore: Number((priceScore * 100).toFixed(1)),
      overallScore: Number(overallScore.toFixed(1))
    };
  });
}

export function filterListings(listings: ProductListing[], filters: SearchFilters) {
  return listings.filter((listing) => {
    if (filters.minPrice !== undefined && listing.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && listing.price > filters.maxPrice) return false;
    if (filters.minRating !== undefined && listing.rating < filters.minRating) return false;
    if (filters.inStockOnly && !listing.inStock) return false;
    if (filters.stores?.length && !filters.stores.includes(listing.source)) return false;
    return true;
  });
}

export function sortListings(listings: ProductListing[], sortBy: SortOption = "overall") {
  const sorted = [...listings];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "discount":
        return b.discountPercentage - a.discountPercentage;
      case "trustworthiness":
        return b.trustScore - a.trustScore;
      case "overall":
      default:
        return b.overallScore - a.overallScore;
    }
  });
  return sorted;
}
