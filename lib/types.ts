// ─── Quran Foundation Content API — raw shapes (snake_case) ─────────────────

export interface QuranApiVerse {
  id: number;
  verse_number: number;
  verse_key: string; // e.g. "2:255"
  hizb_number: number;
  rub_el_hizb_number: number;
  ruku_number: number;
  manzil_number: number;
  sajdah_number: number | null;
  page_number: number;
  juz_number: number;
  text_uthmani: string;
  text_imlaei: string;
  translations: QuranApiTranslation[];
  audio?: QuranApiAudio;
  tafsirs?: QuranApiTafsir[];
  words?: QuranApiWord[];
}

export interface QuranApiTranslation {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  verse_id: number;
}

export interface QuranApiAudio {
  url: string;
  duration?: number;
  format?: string;
  audio_url?: string;
}

export interface QuranApiTafsir {
  id: number;
  resource_id: number;
  resource_name: string;
  text: string;
  verse_key: string;
}

export interface QuranApiWord {
  id: number;
  position: number;
  text_uthmani: string;
  transliteration?: { text: string };
  translation?: { text: string };
  audio?: { url: string };
}

export interface QuranApiChapter {
  id: number;
  revelation_place: "makkah" | "madinah";
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  name_translation: string;
  verses_count: number;
  pages: [number, number];
  translated_name: { language_name: string; name: string };
}

// ─── Normalised internal shapes ─────────────────────────────────────────────

export interface Verse {
  id: number;
  verseKey: string; // "2:255"
  verseNumber: number;
  chapterId: number;
  pageNumber: number;
  juzNumber: number;
  arabicText: string;
  translation: string;
  translationResourceId: number;
  audioUrl: string | null;
  tafsir: string | null;
  tafsirResourceId: number | null;
}

export interface Chapter {
  id: number;
  nameSimple: string;
  nameArabic: string;
  nameTranslation: string;
  versesCount: number;
  revelationPlace: "makkah" | "madinah";
}

// ─── User / local-storage shapes ────────────────────────────────────────────

export type GoalType = "finish_in_days" | "memorize_per_week";

export interface UserGoal {
  type: GoalType;
  /** For finish_in_days: total days target. For memorize_per_week: ayahs per week */
  value: number;
  /** ISO date string when the goal was created */
  startedAt: string;
}

export interface ReadingProgress {
  /** Last verse key the user completed, e.g. "2:255" */
  lastVerseKey: string;
  /** ISO date string of the last read session */
  lastReadAt: string;
  /** Total verses completed since goal started */
  totalVersesRead: number;
  /** Streak in days */
  streakDays: number;
  /** ISO date of the last day a read was recorded */
  lastStreakDate: string | null;
}

export interface Bookmark {
  verseKey: string;
  arabicText: string;
  translation: string;
  savedAt: string;
}

export interface SavedReflection {
  verseKey: string;
  reflection: string;
  savedAt: string;
  /** If synced as a post to Quran Foundation User API, its remote id */
  remotePostId?: number;
}

export interface LocalUserState {
  goal: UserGoal | null;
  progress: ReadingProgress | null;
  bookmarks: Bookmark[];
  reflections: SavedReflection[];
}

// ─── Claude API route types ──────────────────────────────────────────────────

export interface ClaudeReflectionRequest {
  verseKey: string;
  arabicText: string;
  translation: string;
  tafsir: string | null;
}

export interface ClaudeReflectionResponse {
  reflection: string;
  verseKey: string;
}

export interface ClaudeApiError {
  error: string;
}

// ─── Quran Foundation User API — raw shapes ──────────────────────────────────

export interface QuranUserBookmark {
  id: number;
  verse_key: string;
  created_at: string;
}

export interface QuranUserStreak {
  current_streak: number;
  max_streak: number;
  last_read_at: string | null;
}

export interface QuranUserGoal {
  id: number;
  goal_type: string;
  goal_value: number;
  created_at: string;
}

export interface QuranUserPost {
  id: number;
  body: string;
  verse_key: string;
  created_at: string;
}
