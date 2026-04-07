import { NextResponse } from "next/server";
import { compareDeals } from "@/lib/ai/openai";
import { aggregateListings } from "@/lib/providers";
import { scoreListings, sortListings } from "@/lib/ranking/engine";
import { compareRequestSchema } from "@/lib/validation/schemas";
import type { ProductListing } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productIds, query, products } = compareRequestSchema.parse(body);
    const selected =
      products && products.length >= 2
        ? (products as ProductListing[])
        : sortListings(scoreListings(await aggregateListings(query))).filter((product) =>
            productIds.includes(product.id)
          );

    if (selected.length < 2) {
      return NextResponse.json({ error: "At least two products are required." }, { status: 400 });
    }

    const summary = await compareDeals(query, selected);
    return NextResponse.json({
      products: selected,
      summary
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to compare products." },
      { status: 400 }
    );
  }
}
