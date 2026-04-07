import Link from "next/link";
import { Bird, History, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-primary/90 text-primary-foreground">
            <Bird className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold uppercase tracking-[0.18em]">PeekersNest</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/search?q=wireless%20noise%20cancelling%20headphones">
              <History className="mr-2 h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/compare">
              <Scale className="mr-2 h-4 w-4" />
              Compare
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
