export function LoadingState({ label = "Scanning deals..." }: { label?: string }) {
  return (
    <div className="space-y-4">
      <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div className="h-80 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
