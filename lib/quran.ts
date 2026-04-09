/**
 * Quran Foundation Content API helpers
 * Base URL: https://api.quran.com/api/v4
 *
 * All functions use native fetch with async/await and return strict types.
 * External snake_case response fields are normalised into the internal Verse
 * shape so the rest of the app never depends on API-level naming.
 */

import type {
  QuranApiVerse,
  QuranApiChapter,
  QuranApiTafsir,
  Verse,
  Chapter,
  UserGoal,
  ReadingProgress,
} from "./types";

// ─── Constants ───────────────────────────────────────────────────────────────

const BASE_URL = "https://api.quran.com/api/v4";

/** Default English translation resource (Saheeh International, id=20) */
const DEFAULT_TRANSLATION_ID = 20;

/** Default reciter for audio (Mishary Rashid Alafasy, id=7) */
const DEFAULT_RECITER_ID = 7;

/** Default tafsir resource (Ibn Kathir English, id=169) */
const DEFAULT_TAFSIR_ID = 169;

/** Total number of ayahs in the Quran */
const TOTAL_VERSES = 6236;

// ─── Error type ──────────────────────────────────────────────────────────────

export class QuranApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = "QuranApiError";
  }
}

// ─── Shared fetch helper ─────────────────────────────────────────────────────

async function quranFetch<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
    },
    // Content API responses are publicly cacheable; revalidate every 24 h in
    // Next.js server components but don't cache at the edge for user-specific
    // calls (handled separately in lib/user.ts)
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    throw new QuranApiError(
      `Quran API request failed: ${res.statusText} (${path})`,
      res.status
    );
  }

  return res.json() as Promise<T>;
}

// ─── Chapter fetchers ─────────────────────────────────────────────────────────

/**
 * Fetch metadata for a single chapter (surah).
 */
export async function fetchChapter(chapterId: number): Promise<Chapter> {
  const data = await quranFetch<{ chapter: QuranApiChapter }>(
    `/chapters/${chapterId}`
  );
  return normaliseChapter(data.chapter);
}

/**
 * Fetch metadata for all 114 chapters.
 */
export async function fetchAllChapters(): Promise<Chapter[]> {
  const data = await quranFetch<{ chapters: QuranApiChapter[] }>("/chapters");
  return data.chapters.map(normaliseChapter);
}

function normaliseChapter(raw: QuranApiChapter): Chapter {
  return {
    id: raw.id,
    nameSimple: raw.name_simple,
    nameArabic: raw.name_arabic,
    nameTranslation: raw.translated_name.name,
    versesCount: raw.verses_count,
    revelationPlace: raw.revelation_place,
  };
}

// ─── Verse fetchers ───────────────────────────────────────────────────────────

interface FetchVersesRawResponse {
  verses: QuranApiVerse[];
}

/**
 * Fetch a range of verses from a chapter with Arabic text, translation, and audio.
 *
 * @param chapterId - Chapter (surah) number 1–114
 * @param verseFrom - First verse number in the range (1-indexed)
 * @param verseTo   - Last verse number in the range (inclusive)
 */
export async function fetchVerses(
  chapterId: number,
  verseFrom: number,
  verseTo: number,
  options?: {
    translationId?: number;
    reciterId?: number;
    tafsirId?: number;
  }
): Promise<Verse[]> {
  const translationId = options?.translationId ?? DEFAULT_TRANSLATION_ID;
  const reciterId = options?.reciterId ?? DEFAULT_RECITER_ID;
  const tafsirId = options?.tafsirId ?? DEFAULT_TAFSIR_ID;

  const params: Record<string, string> = {
    translations: String(translationId),
    audio: String(reciterId),
    tafsirs: String(tafsirId),
    fields: "text_uthmani,verse_key,verse_number,page_number,juz_number,hizb_number",
    verse_start: String(verseFrom),
    verse_end: String(verseTo),
    per_page: String(verseTo - verseFrom + 1),
    page: "1",
  };

  const data = await quranFetch<FetchVersesRawResponse>(
    `/verses/by_chapter/${chapterId}`,
    params
  );

  return data.verses.map((v) => normaliseVerse(v, translationId, tafsirId));
}

/**
 * Fetch a single verse by its verse key (e.g. "2:255").
 */
export async function fetchVerseByKey(
  verseKey: string,
  options?: {
    translationId?: number;
    reciterId?: number;
    tafsirId?: number;
  }
): Promise<Verse> {
  const translationId = options?.translationId ?? DEFAULT_TRANSLATION_ID;
  const reciterId = options?.reciterId ?? DEFAULT_RECITER_ID;
  const tafsirId = options?.tafsirId ?? DEFAULT_TAFSIR_ID;

  const params: Record<string, string> = {
    translations: String(translationId),
    audio: String(reciterId),
    tafsirs: String(tafsirId),
    fields: "text_uthmani,verse_key,verse_number,page_number,juz_number",
  };

  const data = await quranFetch<{ verse: QuranApiVerse }>(
    `/verses/by_key/${verseKey}`,
    params
  );

  return normaliseVerse(data.verse, translationId, tafsirId);
}

/**
 * Fetch verses by juz number.
 */
export async function fetchVersesByJuz(
  juzNumber: number,
  options?: { translationId?: number; reciterId?: number; tafsirId?: number }
): Promise<Verse[]> {
  const translationId = options?.translationId ?? DEFAULT_TRANSLATION_ID;
  const reciterId = options?.reciterId ?? DEFAULT_RECITER_ID;
  const tafsirId = options?.tafsirId ?? DEFAULT_TAFSIR_ID;

  const params: Record<string, string> = {
    translations: String(translationId),
    audio: String(reciterId),
    tafsirs: String(tafsirId),
    fields: "text_uthmani,verse_key,verse_number,page_number,juz_number",
    per_page: "50",
    page: "1",
  };

  const data = await quranFetch<FetchVersesRawResponse>(
    `/verses/by_juz/${juzNumber}`,
    params
  );

  return data.verses.map((v) => normaliseVerse(v, translationId, tafsirId));
}

// ─── Audio fetchers ───────────────────────────────────────────────────────────

interface RecitationAyah {
  verse_key: string;
  url: string;
}

interface RecitationResponse {
  audio_files: RecitationAyah[];
}

/**
 * Fetch per-ayah audio URLs for a chapter from a specific reciter.
 * Returns a Map keyed by verse_key (e.g. "2:1") → audio URL.
 */
export async function fetchChapterAudioUrls(
  chapterId: number,
  reciterId: number = DEFAULT_RECITER_ID
): Promise<Map<string, string>> {
  const data = await quranFetch<RecitationResponse>(
    `/recitations/${reciterId}/by_chapter/${chapterId}`
  );

  const map = new Map<string, string>();
  for (const item of data.audio_files) {
    // The API may return relative paths; prepend the CDN base if needed
    const fullUrl = item.url.startsWith("http")
      ? item.url
      : `https://verses.quran.com/${item.url}`;
    map.set(item.verse_key, fullUrl);
  }
  return map;
}

/**
 * Fetch a single verse's audio URL.
 * Convenience wrapper used when individual verse audio is needed.
 */
export async function fetchVerseAudioUrl(
  verseKey: string,
  reciterId: number = DEFAULT_RECITER_ID
): Promise<string | null> {
  const [chapterStr] = verseKey.split(":");
  const chapterId = Number(chapterStr);
  const map = await fetchChapterAudioUrls(chapterId, reciterId);
  return map.get(verseKey) ?? null;
}

// ─── Tafsir fetchers ──────────────────────────────────────────────────────────
// Same Quran Foundation catalogue used by the official Quran MCP (mcp.quran.ai).

/** `GET /tafsirs/{id}/by_chapter/{chapter}` — array of per-ayah records */
interface TafsirChapterResponse {
  tafsirs?: QuranApiTafsir[] | null;
}

/**
 * `GET /tafsirs/{resource_id}/by_ayah/{ayah_key}` (e.g. `2:255`).
 * Current API returns a single `tafsir` object with HTML `text` and a `verses` map;
 * older responses used a `tafsirs` array. See:
 * https://api-docs.quran.foundation/docs/content_apis_versioned/list-ayah-tafsirs/
 */
interface TafsirByAyahResponse {
  tafsir?: {
    text?: string;
    verses?: Record<string, { id?: number }>;
    resource_id?: number;
    resource_name?: string;
  } | null;
  tafsirs?: QuranApiTafsir[] | null;
}

/**
 * Fetch tafsir for a specific verse.
 * Returns the plain-text tafsir string or null if unavailable.
 */
export async function fetchVerseTafsir(
  verseKey: string,
  tafsirId: number = DEFAULT_TAFSIR_ID
): Promise<string | null> {
  const data = await quranFetch<TafsirByAyahResponse>(
    `/tafsirs/${tafsirId}/by_ayah/${verseKey}`
  );

  const embedded = data.tafsir?.text?.trim();
  if (embedded) return stripHtml(embedded);

  const list = data.tafsirs ?? [];
  const row = list.find((t) => t.verse_key === verseKey);
  if (!row?.text) return null;
  return stripHtml(row.text);
}

/**
 * Fetch tafsir for all verses in a chapter range.
 * Returns a Map keyed by verse_key → tafsir text.
 */
export async function fetchChapterTafsir(
  chapterId: number,
  tafsirId: number = DEFAULT_TAFSIR_ID
): Promise<Map<string, string>> {
  const data = await quranFetch<TafsirChapterResponse>(
    `/tafsirs/${tafsirId}/by_chapter/${chapterId}`
  );

  const map = new Map<string, string>();
  for (const t of data.tafsirs ?? []) {
    if (t.verse_key && t.text) map.set(t.verse_key, stripHtml(t.text));
  }
  return map;
}

// ─── Reading assignment helper ────────────────────────────────────────────────

export interface DailyVerseRange {
  chapterId: number;
  verseFrom: number;
  verseTo: number;
  versesPerDay: number;
}

/**
 * Compute today's verse range given the user's goal and current progress.
 *
 * Logic:
 * - For finish_in_days goals: divide 6,236 verses evenly across the goal days,
 *   then advance from where the user left off.
 * - For memorize_per_week goals: assign a small daily set derived from the
 *   weekly memorisation target.
 *
 * Returns an object with chapterId + verseFrom/To that can be passed directly
 * to fetchVerses().
 */
export function computeTodayVerseRange(
  goal: UserGoal,
  progress: ReadingProgress | null
): DailyVerseRange {
  const versesPerDay =
    goal.type === "finish_in_days"
      ? Math.max(1, Math.ceil(TOTAL_VERSES / goal.value))
      : Math.max(1, Math.ceil(goal.value / 7));

  // Determine the global verse index to start from (0-indexed)
  const startGlobalIndex = progress
    ? verseKeyToGlobalIndex(progress.lastVerseKey) + 1
    : 0;

  // Wrap around if the user has completed the Quran
  const clampedStart = startGlobalIndex % TOTAL_VERSES;
  const endGlobalIndex = Math.min(
    clampedStart + versesPerDay - 1,
    TOTAL_VERSES - 1
  );

  // Convert global index → chapter:verse
  const { chapterId, verseNumber: verseFrom } =
    globalIndexToVerseRef(clampedStart);
  const { verseNumber: verseTo } = globalIndexToVerseRef(endGlobalIndex);

  return { chapterId, verseFrom, verseTo, versesPerDay };
}

// ─── Normalisation helpers ────────────────────────────────────────────────────

function normaliseVerse(
  raw: QuranApiVerse,
  translationId: number,
  tafsirId: number
): Verse {
  const translation =
    raw.translations?.find((t) => t.resource_id === translationId)?.text ??
    raw.translations?.[0]?.text ??
    "";

  const audioUrl = resolveAudioUrl(raw.audio);

  const tafsirEntry = raw.tafsirs?.find((t) => t.resource_id === tafsirId);
  const tafsir = tafsirEntry ? stripHtml(tafsirEntry.text) : null;

  const [chapterStr] = raw.verse_key.split(":");
  const chapterId = Number(chapterStr);

  return {
    id: raw.id,
    verseKey: raw.verse_key,
    verseNumber: raw.verse_number,
    chapterId,
    pageNumber: raw.page_number,
    juzNumber: raw.juz_number,
    arabicText: raw.text_uthmani,
    translation: stripHtml(translation),
    translationResourceId: translationId,
    audioUrl,
    tafsir,
    tafsirResourceId: tafsirId,
  };
}

function resolveAudioUrl(audio?: QuranApiVerse["audio"]): string | null {
  if (!audio) return null;
  const raw = audio.audio_url ?? audio.url;
  if (!raw) return null;
  return raw.startsWith("http") ? raw : `https://verses.quran.com/${raw}`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── Verse key ↔ global index utilities ──────────────────────────────────────

/**
 * Approximate verse counts per chapter (1–114).
 * These are the canonical Uthmanic verse counts used by the Quran Foundation API.
 */
const VERSE_COUNTS_PER_CHAPTER: readonly number[] = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128,
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73,
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60,
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44,
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30,
  20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5,
  4, 5, 6,
] as const;

/** Convert a verse key like "2:255" to a 0-based global verse index. */
function verseKeyToGlobalIndex(verseKey: string): number {
  const [chapterStr, verseStr] = verseKey.split(":");
  const chapterId = Number(chapterStr);
  const verseNum = Number(verseStr);

  let index = 0;
  for (let c = 1; c < chapterId; c++) {
    index += VERSE_COUNTS_PER_CHAPTER[c - 1] ?? 0;
  }
  index += verseNum - 1;
  return index;
}

/** Convert a 0-based global verse index back to { chapterId, verseNumber }. */
function globalIndexToVerseRef(globalIndex: number): {
  chapterId: number;
  verseNumber: number;
} {
  let remaining = globalIndex;
  for (let c = 1; c <= 114; c++) {
    const count = VERSE_COUNTS_PER_CHAPTER[c - 1] ?? 0;
    if (remaining < count) {
      return { chapterId: c, verseNumber: remaining + 1 };
    }
    remaining -= count;
  }
  // Fallback: beginning of Quran
  return { chapterId: 1, verseNumber: 1 };
}
