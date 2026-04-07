import type { ComponentType } from "react";
import { BadgeDollarSign, SearchCheck, Sparkles } from "lucide-react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchHistoryList } from "@/components/search/search-history-list";
import { Card, CardContent } from "@/components/ui/card";
import { getSearchHistory } from "@/lib/history";

export default async function HomePage() {
  const history = await getSearchHistory();

  return (
    <main className="pb-16">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="metro-panel rounded-[2rem] p-6 sm:p-8">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex rounded-sm border border-white/15 bg-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
                  Deal Scout
                </div>
                <div className="space-y-3">
                  <h1 className="font-display max-w-4xl text-balance text-5xl font-semibold uppercase leading-[0.92] tracking-[-0.04em] sm:text-7xl">
                    Less browsing.
                    <br />
                    Better buys.
                  </h1>
                  <p className="max-w-xl text-sm uppercase tracking-[0.18em] text-muted-foreground">
                    Search. Rank. Compare.
                  </p>
                </div>
                <SearchBar />
              </div>
            </div>
          </div>

          <div className="min-h-full lg:pt-10">
            <SearchHistoryList items={history} />
          </div>
        </div>
      </section>

      <section className="page-shell mt-4">
        <Card className="metro-panel shadow-none">
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <FooterMetric icon={SearchCheck} label="Live eBay retrieval" />
            <FooterMetric icon={BadgeDollarSign} label="Weighted ranking" />
            <FooterMetric icon={Sparkles} label="AI comparison summaries" />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function FooterMetric({
  icon: Icon,
  label
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-white text-black">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
    </div>
  );
}
