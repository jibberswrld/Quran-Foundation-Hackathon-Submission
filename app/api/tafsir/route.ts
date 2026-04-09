import { NextResponse } from "next/server";
import { fetchVerseTafsir, QuranApiError } from "@/lib/quran";

/**
 * Server-side tafsir for the Reflection UI.
 * Uses Quran.com API v4 — the same canonical Quran Foundation data exposed
 * through the official Quran MCP (https://mcp.quran.ai).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const verse = searchParams.get("verse")?.trim();
  if (!verse || !/^\d{1,3}:\d{1,3}$/.test(verse)) {
    return NextResponse.json(
      { error: "Expected verse query like 2:255" },
      { status: 400 }
    );
  }

  try {
    const text = await fetchVerseTafsir(verse);
    return NextResponse.json({ text });
  } catch (e) {
    const status = e instanceof QuranApiError ? e.statusCode ?? 502 : 502;
    const message =
      e instanceof Error ? e.message : "Failed to load tafsir";
    return NextResponse.json({ error: message }, { status });
  }
}
