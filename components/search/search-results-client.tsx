"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightLeft, Database, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { FilterSidebar } from "@/components/search/filter-sidebar";
import { ProductCard } from "@/components/cards/product-card";
import { AiInsightsPanel } from "@/components/insights/ai-insights-panel";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductListing, SearchFilters, SearchResponse } from "@/lib/types";

const PAGE_SIZE = 10;

export function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: "overall" });
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ProductListing[]>([]);
  const [refreshToken, setRefreshToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const cacheKey = useMemo(
    () => `peekersnest:search:${initialQuery}:${JSON.stringify(filters)}`,
    [initialQuery, filters]
  );

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (refreshToken === 0) {
          const cached = window.sessionStorage.getItem(cacheKey);
          if (cached) {
            const payload = JSON.parse(cached) as SearchResponse;
            if (active) {
              setData(payload);
              setSelected((current) =>
                current.filter((item) => payload.results.some((next) => next.id === item.id))
              );
              setLoading(false);
            }
            return;
          }
        }

        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: initialQuery, filters })
        });

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const payload = (await response.json()) as SearchResponse;
        window.sessionStorage.setItem(cacheKey, JSON.stringify(payload));
        if (active) {
          setData(payload);
          setSelected((current) => current.filter((item) => payload.results.some((next) => next.id === item.id)));
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [cacheKey, filters, initialQuery, refreshToken]);

  const compareHref = useMemo(() => {
    if (!selected.length) return "/compare";
    const params = new URLSearchParams({
      q: initialQuery,
      ids: selected.map((item) => item.id).join(","),
      items: JSON.stringify(selected)
    });
    return `/compare?${params.toString()}`;
  }, [initialQuery, selected]);

  const totalPages = useMemo(() => {
    if (!data?.results.length) return 1;
    return Math.max(1, Math.ceil(data.results.length / PAGE_SIZE));
  }, [data?.results.length]);

  const paginatedResults = useMemo(() => {
    if (!data) return [];
    const start = (currentPage - 1) * PAGE_SIZE;
    return data.results.slice(start, start + PAGE_SIZE);
  }, [currentPage, data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data?.query, data?.totalCount]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleCompare = (product: ProductListing) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) return current.filter((item) => item.id !== product.id);
      if (current.length >= 4) return current;
      return [...current, product];
    });
  };

  return (
    <main className="page-shell py-10">
      <div className="space-y-8">
          <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
            <Database className="mr-2 h-4 w-4 text-primary" />
            {data?.demoMode === false
              ? "Live eBay results via ScraperAPI"
              : "Demo aggregation using mock providers structured for live integrations"}
          </div>
          <SearchBar initialValue={initialQuery} compact />
        </div>

        {loading ? <LoadingState /> : null}
        {error ? (
          <ErrorState
            title="Search failed"
            description={error}
            onRetry={() => {
              window.sessionStorage.removeItem(cacheKey);
              setRefreshToken((value) => value + 1);
            }}
          />
        ) : null}

        {!loading && !error && data ? (
          data.results.length ? (
            <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
              <div className="space-y-6">
                <FilterSidebar filters={filters} stores={data.availableStores} onChange={setFilters} />
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <ArrowRightLeft className="h-4 w-4 text-primary" />
                      <h3 className="font-semibold">Comparison tray</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Select between 2 and 4 products for side-by-side comparison.
                    </p>
                    <div className="space-y-2 text-sm">
                      {selected.length ? (
                        selected.map((item) => (
                          <div key={item.id} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                            {item.title}
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No products selected yet.</p>
                      )}
                    </div>
                    {selected.length >= 2 ? (
                      <Button asChild className="w-full">
                        <Link href={compareHref}>Compare selected</Link>
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        Compare selected
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-semibold">{data.totalCount} ranked results</h1>
                    <p className="text-sm text-muted-foreground">
                      Results for <span className="text-foreground">{data.query}</span>
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                  </div>
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                    <Sparkles className="mr-2 h-4 w-4" />
                    OpenAI-generated deal analysis
                  </div>
                </div>

                <AiInsightsPanel summary={data.summary} />

                <div className="grid gap-6 xl:grid-cols-2">
                  {paginatedResults.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onToggleCompare={toggleCompare}
                      isSelected={selected.some((item) => item.id === product.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    >
                      Next
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No matching deals"
              description="Try widening your price range, lowering the minimum rating, or searching with a broader product phrase."
            />
          )
        ) : null}
      </div>
    </main>
  );
}
