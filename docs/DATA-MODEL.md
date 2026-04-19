# Data model

All shared types live in [`lib/types.ts`](../lib/types.ts). They split into
three groups:

1. **Raw upstream shapes** — `snake_case`, mirror Quran Foundation responses.
2. **Internal normalised shapes** — `camelCase`, what the rest of the app
   imports.
3. **User / persistence shapes** — what we serialise into `localStorage`.

Normalisation happens once, inside `lib/quran.ts`. Components never see
snake-case fields.

---

## 1. Internal Verse model

```ts
interface Verse {
  id: number;                     // Quran Foundation row id
  verseKey: string;               // "2:255"
  verseNumber: number;            // 255
  chapterId: number;              // 2
  pageNumber: number;             // Mushaf page
  juzNumber: number;              // 1–30
  arabicText: string;             // Uthmanic script
  translation: string;            // Saheeh International by default
  translationResourceId: number;  // 20 = Saheeh
  audioUrl: string | null;        // Per-ayah CDN url, prefixed if relative
  tafsir: string | null;          // Plain text (HTML stripped)
  tafsirResourceId: number | null;// 169 = Ibn Kathir English
}
```

Notes:

- `arabicText` is `text_uthmani` upstream — not `text_imlaei`.
- `audioUrl` may be `null` if the chosen reciter has no per-ayah file. The
  player only renders when a URL is present.
- `tafsir` is HTML-stripped through `stripHtml()`; the Reflection panel and
  `/api/tafsir` both go through the same sanitiser so the UI never has to.

## 2. Internal Chapter model

```ts
interface Chapter {
  id: number;
  nameSimple: string;              // "Al-Baqarah"
  nameArabic: string;              // "البقرة"
  nameTranslation: string;         // "The Cow"
  versesCount: number;             // 286
  revelationPlace: "makkah" | "madinah";
}
```

Currently used by helpers only — no UI surfaces it yet.

## 3. User goal

```ts
type GoalType = "finish_in_days" | "memorize_per_week";

interface UserGoal {
  type: GoalType;
  value: number;                   // days OR ayahs/week (see GOAL_DESCRIPTIONS)
  startedAt: string;               // ISO 8601
}
```

Validation lives in [`lib/goal-constants.ts`](../lib/goal-constants.ts):

```ts
GOAL_DESCRIPTIONS = {
  finish_in_days:    { min: 30,  max: 3650, defaultVal: 365, unit: "days" },
  memorize_per_week: { min: 1,   max: 100,  defaultVal: 5,   unit: "ayahs per week" },
};
```

The Onboarding wizard and the Settings goal editor both clamp `value` against
this table.

## 4. Reading progress

```ts
interface ReadingProgress {
  lastVerseKey: string;            // "2:255" — the last completed ayah
  lastReadAt: string;              // ISO 8601
  totalVersesRead: number;         // monotonically increasing
  streakDays: number;              // computed by updateProgress()
  lastStreakDate: string | null;   // "YYYY-MM-DD" of last streak bump
}
```

Streak rules — see [`storage.updateProgress`](../lib/storage.ts):

| Last streak date            | Outcome             |
|------------------------------|---------------------|
| `null` (first ever read)     | streak = 1          |
| equal to today               | unchanged           |
| equal to yesterday           | streak += 1         |
| anything else                | streak = 1 (reset)  |

`updateProgress` is the *only* function permitted to mutate streak fields.
Other code reads `loadLocalUserState().progress` and treats it as immutable.

## 5. Bookmarks

```ts
interface Bookmark {
  verseKey: string;
  arabicText: string;
  translation: string;
  savedAt: string;                 // ISO 8601
}
```

Stored at `qc:bookmarks` as `Bookmark[]` (newest first). `addBookmark` is a
no-op when the verse key is already present.

## 6. Saved reflections

```ts
interface SavedReflection {
  verseKey: string;
  reflection: string;              // user-authored body
  savedAt: string;
  remotePostId?: number;           // set after successful sync to QuranReflect
}
```

`addReflection` replaces any existing entry for the same verse key (one
reflection per ayah, latest wins).

## 7. The big bag

```ts
interface LocalUserState {
  goal: UserGoal | null;
  progress: ReadingProgress | null;
  bookmarks: Bookmark[];
  reflections: SavedReflection[];
}
```

`loadLocalUserState()` returns this in one call. Most client components read
once on mount and then update individual slices via the slice-specific helpers
(`saveGoal`, `addBookmark`, `removeBookmark`, etc.).

## 8. Upstream raw shapes

Documented in `lib/types.ts` under "Quran Foundation Content API — raw shapes"
and "Quran Foundation User API — raw shapes". These exist purely to type
`fetch().json()` results inside `lib/quran.ts` and `lib/user.ts`. Nothing
outside those two files should import them.

## 9. localStorage keys

```
qc:goal          → UserGoal | null
qc:progress      → ReadingProgress | null
qc:bookmarks     → Bookmark[]
qc:reflections   → SavedReflection[]
```

All keys are prefixed `qc:`. Add new keys under the same prefix and they will
be wiped automatically by the destructive Reset (which iterates every
`localStorage` and `sessionStorage` key starting with `qc:`).
