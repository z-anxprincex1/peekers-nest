"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ErrorState({
  title,
  description,
  onRetry
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <Card>
      <CardContent className="py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10">
          <AlertTriangle className="h-7 w-7 text-rose-300" />
        </div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{description}</p>
        {onRetry ? (
          <Button className="mt-6" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
