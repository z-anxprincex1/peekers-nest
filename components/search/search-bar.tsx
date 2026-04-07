"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar({
  initialValue = "",
  compact = false
}: {
  initialValue?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`glass-panel flex w-full flex-col gap-3 rounded-[2rem] p-3 ${compact ? "md:flex-row" : "md:flex-row md:p-4"}`}
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search deals, products, or use a natural language shopping query..."
          className="h-14 border-transparent bg-slate-900/70 pl-11"
        />
      </div>
      <Button type="submit" size="lg" className="h-14 min-w-36">
        Scout Deals
      </Button>
    </form>
  );
}
