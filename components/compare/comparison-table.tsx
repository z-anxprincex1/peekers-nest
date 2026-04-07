import type { ProductListing } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const rows = [
  { key: "price", label: "Price" },
  { key: "discountPercentage", label: "Discount" },
  { key: "rating", label: "Rating" },
  { key: "reviewCount", label: "Review count" },
  { key: "source", label: "Store" },
  { key: "trustScore", label: "Trust score" },
  { key: "shippingInfo", label: "Shipping" },
  { key: "overallScore", label: "Deal score" }
] as const;

export function ComparisonTable({ products }: { products: ProductListing[] }) {
  if (!products.length) return null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Attribute</th>
              {products.map((product) => (
                <th key={product.id} className="min-w-56 px-6 py-4 font-medium">
                  {product.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-white/5">
                <td className="px-6 py-4 text-muted-foreground">{row.label}</td>
                {products.map((product) => (
                  <td key={`${product.id}-${row.key}`} className="px-6 py-4">
                    {formatCell(product, row.key)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-white/5">
              <td className="px-6 py-4 text-muted-foreground">Key specs</td>
              {products.map((product) => (
                <td key={`${product.id}-specs`} className="px-6 py-4">
                  <div className="space-y-1">
                    {product.specs.slice(0, 4).map((spec) => (
                      <p key={spec}>{spec}</p>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function formatCell(product: ProductListing, key: (typeof rows)[number]["key"]) {
  switch (key) {
    case "price":
      return formatCurrency(product.price);
    case "discountPercentage":
      return `${product.discountPercentage}%`;
    case "rating":
      return `${product.rating} / 5`;
    case "reviewCount":
      return product.reviewCount.toLocaleString("en-US");
    case "trustScore":
      return `${Math.round(product.trustScore * 100)} / 100`;
    case "overallScore":
      return `${product.overallScore}`;
    case "shippingInfo":
      return product.shippingInfo ?? "N/A";
    case "source":
      return product.source;
  }
}
