import { CompareClient } from "@/components/compare/compare-client";
import type { ProductListing } from "@/lib/types";

export default function ComparePage({
  searchParams
}: {
  searchParams: { q?: string; ids?: string; items?: string };
}) {
  const query = searchParams.q?.trim() ?? "";
  const ids = searchParams.ids?.split(",").filter(Boolean) ?? [];
  const initialProducts = parseProducts(searchParams.items);

  return <CompareClient query={query} ids={ids} initialProducts={initialProducts} />;
}

function parseProducts(value?: string): ProductListing[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value) as ProductListing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
