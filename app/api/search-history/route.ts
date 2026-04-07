import { NextResponse } from "next/server";
import { clearSearchHistory, getSearchHistory } from "@/lib/history";

export async function GET() {
  const history = await getSearchHistory(10);
  return NextResponse.json(history);
}

export async function DELETE() {
  await clearSearchHistory();
  return NextResponse.json({ ok: true });
}
