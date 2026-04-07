import { NextResponse } from "next/server";
import { runSearch } from "@/lib/search";
import { searchRequestSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, filters } = searchRequestSchema.parse(body);
    const response = await runSearch(query, filters);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to complete search." },
      { status: 400 }
    );
  }
}
