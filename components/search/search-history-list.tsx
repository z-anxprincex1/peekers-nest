"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Clock3, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SearchHistoryItem } from "@/lib/types";

export function SearchHistoryList({ items }: { items: SearchHistoryItem[] }) {
  const [history, setHistory] = useState(items);
  const [open, setOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    try {
      const response = await fetch("/api/search-history", {
        method: "DELETE"
      });

      if (response.ok) {
        setHistory([]);
        setOpen(false);
      }
    } finally {
      setClearing(false);
    }
  };

  return (
    <Card className="metro-panel shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="flex flex-1 items-center gap-2 text-left"
            onClick={() => setOpen((value) => !value)}
          >
            <Clock3 className="h-3.5 w-3.5 text-white/75" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
              Recent searches
            </h2>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/55 transition ${open ? "rotate-180" : ""}`}
            />
          </button>

          {history.length ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full px-3 text-[10px] uppercase tracking-[0.18em] text-white/70"
              onClick={handleClear}
              disabled={clearing}
            >
              <Trash2 className="mr-1.5 h-3 w-3" />
              {clearing ? "Clearing" : "Clear"}
            </Button>
          ) : null}
        </div>

        {open ? (
          <div className="mt-4 space-y-3">
            {history.length ? (
              history.map((item) => (
              <Link
                key={item.id}
                href={`/search?q=${encodeURIComponent(item.query)}`}
                className="flex items-center justify-between rounded-[1rem] border border-white/8 bg-white/[0.025] px-3 py-2.5 transition hover:bg-white/[0.06]"
              >
                <span className="max-w-[70%] truncate text-xs uppercase tracking-[0.08em] text-white/82">
                  {item.query}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {item.resultCount} results
                </span>
              </Link>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">
                Search history will appear here after the first queries are saved.
              </p>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
