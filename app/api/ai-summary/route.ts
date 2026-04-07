import { NextResponse } from "next/server";
import { summarizeDeals } from "@/lib/ai/openai";
import { aggregateListings } from "@/lib/providers";
import { scoreListings, sortListings } from "@/lib/ranking/engine";
import { searchRequestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query } = searchRequestSchema.parse(body);
    const listings = sortListings(scoreListings(await aggregateListings(query)));
    const summary = await summarizeDeals(query, listings);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to summarize results." },
      { status: 400 }
    );
  }
}
