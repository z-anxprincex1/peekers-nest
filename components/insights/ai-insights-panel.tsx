"use client";

import { useState, type ComponentType } from "react";
import { Sparkles, Trophy, Wallet, Gem, ArrowRightLeft, ChevronDown } from "lucide-react";
import type { AiComparisonSummary, AiDealSummary } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

export function AiInsightsPanel({
  summary,
  comparison
}: {
  summary?: AiDealSummary;
  comparison?: AiComparisonSummary;
}) {
  if (!summary && !comparison) return null;

  const [open, setOpen] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-6">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-4 text-left"
          onClick={() => setOpen((value) => !value)}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">OpenAI insight</p>
              <h2 className="text-xl font-semibold">
                {summary?.headline ?? comparison?.headline}
              </h2>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && summary ? (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              <InsightCard icon={Trophy} label="Best overall" value={summary.bestOverallPick} />
              <InsightCard icon={Wallet} label="Best budget" value={summary.bestBudgetPick} />
              <InsightCard icon={Gem} label="Best premium" value={summary.bestPremiumPick} />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Why these rank well
                </h3>
                <div className="space-y-3 text-sm text-foreground/90">
                  {summary.rankedReasons.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Tradeoffs
                </h3>
                <div className="space-y-3 text-sm text-foreground/90">
                  {summary.tradeoffs.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {open && comparison ? (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <InsightCard icon={ArrowRightLeft} label="Recommended winner" value={comparison.winner} />
              <p className="text-sm text-foreground/90">{comparison.rationale}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Tradeoffs
              </h3>
              {comparison.tradeoffs.map((item) => (
                <p key={item} className="text-sm text-foreground/90">
                  {item}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function InsightCard({
  icon: Icon,
  label,
  value
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
