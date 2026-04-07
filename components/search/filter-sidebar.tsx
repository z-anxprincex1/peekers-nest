"use client";

import { useMemo } from "react";
import type { SearchFilters, StoreName } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface FilterSidebarProps {
  filters: SearchFilters;
  stores: StoreName[];
  onChange: (filters: SearchFilters) => void;
}

export function FilterSidebar({ filters, stores, onChange }: FilterSidebarProps) {
  const activeStores = useMemo(() => new Set(filters.stores ?? []), [filters.stores]);

  return (
    <Card>
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Filters</h2>
          <p className="text-sm text-muted-foreground">Refine by price, seller quality, and stock.</p>
        </div>

        <div className="space-y-4">
          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Min price</span>
            <input
              type="number"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4"
              value={filters.minPrice ?? ""}
              onChange={(event) =>
                onChange({ ...filters, minPrice: event.target.value ? Number(event.target.value) : undefined })
              }
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Max price</span>
            <input
              type="number"
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4"
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                onChange({ ...filters, maxPrice: event.target.value ? Number(event.target.value) : undefined })
              }
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Minimum rating</span>
            <select
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4"
              value={filters.minRating ?? ""}
              onChange={(event) =>
                onChange({ ...filters, minRating: event.target.value ? Number(event.target.value) : undefined })
              }
            >
              <option value="">Any rating</option>
              <option value="3.5">3.5+</option>
              <option value="4">4.0+</option>
              <option value="4.5">4.5+</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-muted-foreground">Sort by</span>
            <select
              className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4"
              value={filters.sortBy ?? "overall"}
              onChange={(event) =>
                onChange({
                  ...filters,
                  sortBy: event.target.value as SearchFilters["sortBy"]
                })
              }
            >
              <option value="overall">Overall deal score</option>
              <option value="price">Lowest price</option>
              <option value="rating">Best rating</option>
              <option value="discount">Best discount</option>
              <option value="trustworthiness">Seller trustworthiness</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={Boolean(filters.inStockOnly)}
              onChange={(event) => onChange({ ...filters, inStockOnly: event.target.checked })}
            />
            In-stock only
          </label>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Stores</p>
          <div className="flex flex-wrap gap-2">
            {stores.map((store) => {
              const active = activeStores.has(store);
              return (
                <button
                  key={store}
                  type="button"
                  className={`rounded-full px-3 py-2 text-sm transition ${
                    active ? "bg-primary text-primary-foreground" : "border border-white/10 bg-white/5"
                  }`}
                  onClick={() => {
                    const next = new Set(activeStores);
                    if (active) next.delete(store);
                    else next.add(store);
                    onChange({
                      ...filters,
                      stores: next.size ? (Array.from(next) as StoreName[]) : undefined
                    });
                  }}
                >
                  {store}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => onChange({ sortBy: "overall" })}
        >
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
