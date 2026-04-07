import Link from "next/link";
import { SearchX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <SearchX className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>
        <Button asChild className="mt-6">
          <Link href="/">Back home</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
