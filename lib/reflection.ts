/**
 * Client helper: load scholarly tafsir for the Reflection panel.
 * Data is fetched via our API route, which uses Quran.com v4 (Quran Foundation —
 * same sources as the official Quran MCP at https://mcp.quran.ai).
 */

export async function fetchReflectionTafsir(
  verseKey: string
): Promise<string | null> {
  const res = await fetch(
    `/api/tafsir?verse=${encodeURIComponent(verseKey)}`
  );
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  const data = (await res.json()) as { text: string | null };
  return data.text ?? null;
}
