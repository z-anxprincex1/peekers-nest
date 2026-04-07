"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import { ExternalLink, Star, ShieldCheck, Truck, Scale, CircleDollarSign } from "lucide-react";
import type { ProductListing } from "@/lib/types";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ProductCardProps {
  product: ProductListing;
  onToggleCompare?: (product: ProductListing) => void;
  isSelected?: boolean;
}

export function ProductCard({ product, onToggleCompare, isSelected = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10">
          <Image src={product.image} alt={product.title} width={600} height={400} className="h-52 w-full object-cover" />
          <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Deal score {product.overallScore}
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{product.source}</p>
            <h3 className="text-lg font-semibold leading-tight">{product.title}</h3>
          </div>
          <Badge className={product.inStock ? "text-emerald-300" : "text-rose-300"}>
            {product.inStock ? "In stock" : "Out of stock"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {product.discountPercentage > 0 ? <Badge>{product.discountPercentage}% off</Badge> : null}
          <Badge>{product.category}</Badge>
          <Badge>Trust {Math.round(product.trustScore * 100)}</Badge>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-semibold">{formatCurrency(product.price)}</p>
              {product.originalPrice ? (
                <p className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </p>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 text-primary" />
                {product.rating} ({formatCompactNumber(product.reviewCount)})
              </span>
              <span className="inline-flex items-center gap-1">
                <Truck className="h-4 w-4 text-primary" />
                {product.shippingInfo ?? "Standard shipping"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-foreground/85 sm:grid-cols-3">
          <Metric label="Price value" value={`${product.normalizedPriceScore.toFixed(0)}/100`} icon={CircleDollarSign} />
          <Metric label="Seller trust" value={`${Math.round(product.trustScore * 100)}/100`} icon={ShieldCheck} />
          <Metric label="Savings" value={`${product.discountPercentage}%`} icon={Scale} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">View details</Button>
            </DialogTrigger>
            <DialogContent>
              <ProductDetail product={product} />
            </DialogContent>
          </Dialog>

          <Button variant={isSelected ? "default" : "secondary"} onClick={() => onToggleCompare?.(product)}>
            {isSelected ? "Selected" : "Add to compare"}
          </Button>

          <Button asChild variant="ghost">
            <a href={product.url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit listing
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductDetail({ product }: { product: ProductListing }) {
  const pros = [
    product.discountPercentage > 10 ? `Solid ${product.discountPercentage}% discount` : "Competitive current price",
    `${product.rating} star rating from ${formatCompactNumber(product.reviewCount)} shoppers`,
    `${product.source} trust score ${Math.round(product.trustScore * 100)}/100`
  ];

  const cons = [
    product.price > 300 ? "Higher spend than budget-first alternatives" : "May trade off premium features",
    !product.inStock ? "Currently out of stock" : "Stock may change quickly on live providers"
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{product.source}</p>
        <h3 className="max-w-3xl text-2xl font-semibold">{product.title}</h3>
        <p className="mt-2 text-sm text-foreground/80">{product.description}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Snapshot
          </h4>
          <div className="space-y-2 text-sm">
            <p>Price: {formatCurrency(product.price)}</p>
            <p>Original: {product.originalPrice ? formatCurrency(product.originalPrice) : "N/A"}</p>
            <p>Deal score: {product.overallScore}</p>
            <p>Shipping: {product.shippingInfo ?? "N/A"}</p>
            <p>URL: {product.url}</p>
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Comparison notes
          </h4>
          <div className="space-y-2 text-sm text-foreground/85">
            {product.specs.map((spec) => (
              <p key={spec}>{spec}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Pros</h4>
          <div className="space-y-2 text-sm">
            {pros.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-300">Cons</h4>
          <div className="space-y-2 text-sm">
            {cons.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/8">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
