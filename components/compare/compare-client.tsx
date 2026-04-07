"use client";

import { useEffect, useState } from "react";
import { SearchBar } from "@/components/search/search-bar";
import { AiInsightsPanel } from "@/components/insights/ai-insights-panel";
import { ComparisonTable } from "@/components/compare/comparison-table";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import type { ComparisonResponse, ProductListing } from "@/lib/types";

export function CompareClient({
  query,
  ids,
  initialProducts
}: {
  query: string;
  ids: string[];
  initialProducts: ProductListing[];
}) {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(ids.length >= 2);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length < 2 || !query) {
      setLoading(false);
      return;
    }

    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, productIds: ids, products: initialProducts })
        });

        if (!response.ok) throw new Error("Comparison request failed.");
        const payload = (await response.json()) as ComparisonResponse;
        if (active) setData(payload);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Comparison failed.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [ids, initialProducts, query]);

  return (
    <main className="page-shell py-10">
      <div className="space-y-8">
        <SearchBar initialValue={query} compact />

        {!ids.length || ids.length < 2 ? (
          <EmptyState
            title="Pick at least two products"
            description="Start from a search results page and select 2 to 4 products, then launch comparison."
          />
        ) : null}

        {loading ? <LoadingState label="Building side-by-side comparison..." /> : null}
        {error ? <ErrorState title="Comparison failed" description={error} /> : null}

        {!loading && !error && data ? (
          <div className="space-y-6">
            <AiInsightsPanel comparison={data.summary} />
            <ComparisonTable products={data.products} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
