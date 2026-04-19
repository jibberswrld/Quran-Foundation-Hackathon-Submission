# API reference

Two layers:

1. **Upstream** — the Quran Foundation Content & User APIs we depend on.
2. **Internal** — the only Next.js route we expose.

---

## 1. Upstream — Quran Foundation Content API v4

Base URL: `https://api.quran.com/api/v4`. Public, no auth required for the
endpoints below. Documented at <https://api-docs.quran.foundation>.

All wrappers live in [`lib/quran.ts`](../lib/quran.ts).

### Defaults

```ts
DEFAULT_TRANSLATION_ID = 20    // Saheeh International
DEFAULT_RECITER_ID     = 7     // Mishary Rashid Alafasy
DEFAULT_TAFSIR_ID      = 169   // Ibn Kathir (English)
TOTAL_VERSES           = 6236
```

Override per call via the `options` argument.

### Endpoints used

| Function                                            | HTTP                                                             |
|-----------------------------------------------------|-------------------------------------------------------------------|
| `fetchChapter(id)`                                  | `GET /chapters/:id`                                              |
| `fetchAllChapters()`                                | `GET /chapters`                                                  |
| `fetchVerses(chapterId, from, to, opts?)`           | `GET /verses/by_chapter/:id?translations=&audio=&tafsirs=`       |
| `fetchVerseByKey(verseKey, opts?)`                  | `GET /verses/by_key/:key?translations=&audio=&tafsirs=`          |
| `fetchVersesByJuz(juzNumber, opts?)`                | `GET /verses/by_juz/:n`                                          |
| `fetchChapterAudioUrls(chapterId, reciterId?)`      | `GET /recitations/:reciterId/by_chapter/:chapterId`              |
| `fetchVerseAudioUrl(verseKey, reciterId?)`          | composes from `fetchChapterAudioUrls`                             |
| `fetchVerseTafsir(verseKey, tafsirId?)`             | `GET /tafsirs/:tafsirId/by_ayah/:verseKey`                       |
| `fetchChapterTafsir(chapterId, tafsirId?)`          | `GET /tafsirs/:tafsirId/by_chapter/:chapterId`                   |

### Caching

All Content API requests pass `next: { revalidate: 86400 }`. When called from
a Server Component (currently only `/api/tafsir`), Next.js caches the
response for 24 h shared per Vercel region. Client-side calls fall back to
the standard browser HTTP cache.

### Errors

```ts
class QuranApiError extends Error {
  constructor(message: string, public readonly statusCode?: number);
}
```

Thrown when `res.ok` is false. The Read page catches and renders a retry
state; `/api/tafsir` re-emits with the same status code (defaulting to 502).

### Verse-range planner

```ts
function computeTodayVerseRange(
  goal: UserGoal,
  progress: ReadingProgress | null
): { chapterId, verseFrom, verseTo, versesPerDay }
```

Pure, deterministic. Wraps to ayah 1:1 once 114:6 is read. See
[`docs/ARCHITECTURE.md`](./ARCHITECTURE.md#verse-range-planner).

---

## 2. Upstream — Quran Foundation User API v4

Base URL: `https://api.quran.com/api/v4`. **Token required** —
`Authorization: Bearer <QURAN_USER_TOKEN>`. Without the token every helper
short-circuits and returns a benign default.

All wrappers live in [`lib/user.ts`](../lib/user.ts).

| Function                            | HTTP                                                | Token? |
|-------------------------------------|------------------------------------------------------|--------|
| `fetchRemoteStreak()`               | `GET /streaks/current`                              | yes    |
| `fetchRemoteBookmarks()`            | `GET /bookmarks`                                    | yes    |
| `syncBookmarkToApi(bookmark)`       | `POST /bookmarks { verse_key }`                     | yes    |
| `deleteRemoteBookmark(verseKey)`    | `DELETE /bookmarks/:verseKey`                       | yes    |
| `syncGoalToApi(goal)`               | `POST /goals { goal_type, goal_value }`             | yes    |
| `fetchRemoteGoals()`                | `GET /goals`                                        | yes    |
| `syncReflectionToApi(reflection)`   | `POST /quran-reflect/v1/posts { verse_key, body }`  | yes    |
| `fetchRemotePosts()`                | `GET /quran-reflect/v1/posts?scope=user`            | yes    |
| `recordReadingActivity(verseKey)`   | `POST /activity_log { verse_key, source }`          | yes    |

### Failure semantics

Every function in `lib/user.ts` follows the same shape:

```ts
export async function whatever(...): Promise<T | null> {
  if (!hasUserToken()) return null;
  try {
    return await userApiFetch(...);
  } catch {
    return null;       // never throw to callers
  }
}
```

This is what makes the app **local-first**: callers can `await` without
defensive try/catch, and the UI never blocks on a flaky network.

---

## 3. Internal — Next.js routes

### `GET /api/tafsir`

Server route at [`app/api/tafsir/route.ts`](../app/api/tafsir/route.ts).

```
GET /api/tafsir?verse=2:255

200 → { "text": "When the night had darkened over him..." }
200 → { "text": null }                ← upstream returned no body
400 → { "error": "Expected verse query like 2:255" }
502 → { "error": "Quran API request failed: ..." }
```

Validation:

```ts
/^\d{1,3}:\d{1,3}$/
```

Both chapter and ayah are 1–3 digits. Any other shape → 400.

Status mapping:

```ts
const status =
  e instanceof QuranApiError ? (e.statusCode ?? 502) : 502;
```

### Future routes

There are placeholder folders under `app/api/account/` for future user
account endpoints. Nothing is wired in yet.

---

## 4. Tier credentials

If your Quran Foundation tier requires `x-client-id` + `x-auth-token`
headers, set:

```
QURAN_CLIENT_ID=...
QURAN_AUTH_TOKEN=...
```

Wire them through `quranFetch` in `lib/quran.ts` (the headers object is
intentionally small — extend it as needed). Public anonymous access works for
the resources the current build asks for.
