# Architecture

Quran Coach is a thin Next.js 14 App Router application. There are no
databases, no auth providers, and no background workers. All meaningful state
lives in the browser; the server's only jobs are to (a) render the static
shell and (b) proxy a single tafsir endpoint to keep CORS and tier-token
headers off the client.

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Browser (client)                               │
│                                                                        │
│   localStorage (qc:*)        React state             Quran Foundation  │
│  ┌────────────────┐       ┌──────────────┐         ┌─────────────────┐ │
│  │ qc:goal        │  ←→   │ Dashboard    │  ──────▶│ Content API v4  │ │
│  │ qc:progress    │       │ Read         │         │  (public)       │ │
│  │ qc:bookmarks   │       │ Reflection   │         └────────▲────────┘ │
│  │ qc:reflections │       │ Settings     │                  │          │
│  └────────────────┘       └──────────────┘                  │          │
│           │                       │                         │          │
│           │ best-effort sync      │ /api/tafsir             │          │
│           │ (lib/user.ts)         ▼                         │          │
│           │              ┌────────────────────┐             │          │
│           └──────────────│ Next.js server     │─────────────┘          │
│                          │  (Vercel function) │                        │
│                          └────────────────────┘                        │
│                                  │                                     │
│                                  ▼                                     │
│                       ┌────────────────────┐                           │
│                       │ Quran Foundation   │                           │
│                       │  User API v4       │                           │
│                       │  (token-gated)     │                           │
│                       └────────────────────┘                           │
└────────────────────────────────────────────────────────────────────────┘
```

## Rendering boundaries

The App Router defaults to **Server Components**. We mark the leaves that need
hooks, refs, or browser APIs with `"use client"`:

| File                                | Component? | Why                              |
|-------------------------------------|------------|-----------------------------------|
| `app/layout.tsx`                    | Server     | Loads fonts, mounts NavBar       |
| `app/page.tsx`                      | Server     | Just imports `<LandingPage/>`     |
| `components/LandingPage.tsx`        | Server     | All static                        |
| `app/onboarding/page.tsx`           | Server     | Wraps `<OnboardingClient/>`       |
| `app/onboarding/OnboardingClient.tsx` | **Client** | useState, useRouter, localStorage |
| `app/dashboard/page.tsx`            | Server     | Wraps in `<RequireGoal/>`         |
| `app/dashboard/DashboardClient.tsx` | **Client** | localStorage + remote streak fetch|
| `app/read/page.tsx`                 | Server     | Wraps in `<RequireGoal/>` + Suspense |
| `app/read/ReadClient.tsx`           | **Client** | useSearchParams, fetch, refs     |
| `app/settings/page.tsx`             | Server     | Imports the client wrapper       |
| `app/settings/SettingsClient.tsx`   | **Client** | Branches on local goal           |
| `app/settings/ClearLocalDataSection.tsx` | **Client** | Destructive form              |
| `components/RequireGoal.tsx`        | **Client** | Reads localStorage pre-paint     |
| `components/NavBar.tsx`             | Server     | Pure markup                       |
| `components/AudioPlayer.tsx`        | **Client** | `<audio>` ref + state            |
| `components/ReflectionPanel.tsx`    | **Client** | Lazy `fetch` to `/api/tafsir`    |
| `components/StreakTracker.tsx`      | **Client** | Receives client-side props       |
| `components/VerseCard.tsx`          | **Client** | Click handlers passed in         |

Server Components are kept at the route boundary so the JS payload stays small;
all interactive state lives in the deepest possible client leaf.

## Gating

`components/RequireGoal.tsx` is the single source of truth for "has the user
onboarded?". It runs in `useLayoutEffect` so the redirect fires before paint
when possible, avoiding the Loud Flash of Unauthorised Content™.

```ts
useLayoutEffect(() => {
  const state = loadLocalUserState();
  if (!state.goal) {
    router.replace("/onboarding");
    return;
  }
  setAllowed(true);
}, [router]);
```

The reverse gate lives inside `OnboardingClient`: if a goal is already saved,
the wizard immediately redirects to `/read`. That way every "Begin your
journey" / "Start in two minutes" CTA on the landing page Just Works whether
the visitor is brand-new or returning.

## Data fetching strategy

| Resource                 | Where it runs            | Caching                  |
|--------------------------|--------------------------|---------------------------|
| Today's verse range plan | Pure client function     | None — derived            |
| Verses (Arabic + tr)     | Client `fetch` direct    | Browser HTTP cache        |
| Verse audio (per-ayah)   | Embedded in verses call  | Browser HTTP cache        |
| Tafsir                   | Server route → upstream  | `next: { revalidate: 86400 }` |
| User streak              | Client `fetch` direct    | None — re-fetched on mount|
| User goal sync           | Fire-and-forget POST     | None                      |

The `fetch` inside `lib/quran.ts` sets `next: { revalidate: 86400 }` so when
called from a Server Component (currently only the tafsir route), Next.js will
cache and ISR-revalidate after 24 h. Client-side calls bypass this and rely on
the browser's HTTP cache.

## API route

There is a single internal API route:

```
GET /api/tafsir?verse=<chapter:ayah>
→ 200 { text: string | null }
→ 400 { error: "Expected verse query like 2:255" }
→ 502 { error: "<upstream message>" }
```

Reasons it exists rather than calling Quran Foundation directly from the
client:

1. **Tier tokens.** If `QURAN_AUTH_TOKEN` / `QURAN_CLIENT_ID` are required for
   the chosen tafsir resource, they should never reach the browser.
2. **Caching.** Server-side `fetch` with `next: { revalidate }` shares cached
   responses across all visitors hitting the same Vercel region.
3. **CORS.** Some tafsir endpoints don't return CORS headers; the proxy is the
   safe path.

## Streak math

`updateProgress(lastVerseKey, count)` in `lib/storage.ts` is the only place
streak days mutate. It compares today (`YYYY-MM-DD`) to the last streak date:

- Same day → no streak change, just bump `totalVersesRead`.
- Yesterday → streak += 1.
- Otherwise → streak resets to 1.

The Dashboard reconciles with `fetchRemoteStreak()` after mount and prefers
the remote value if available.

## Verse-range planner

`computeTodayVerseRange(goal, progress)` deterministically picks today's
verses:

1. Compute `versesPerDay` from the goal (`finish_in_days` divides 6,236
   evenly; `memorize_per_week` divides the weekly target by 7).
2. Walk forward from the global index *after* `progress.lastVerseKey`.
3. Wrap to the start of the Qur'an after the last ayah is reached.
4. Convert the start/end global index back to `{ chapterId, verseFrom,
   verseTo }` using the canonical per-chapter verse counts table.

There is a deliberate compromise: when the planned range crosses a chapter
boundary, the helper currently returns the *start chapter's* range. The
`/read` UI then fetches whatever that single chapter call returns, which keeps
the implementation honest with the API's `verses/by_chapter` shape. A future
upgrade is to fan out into multiple calls when ranges span chapters.

## Error model

- **Content API failures** raise a `QuranApiError(message, statusCode)` from
  `lib/quran.ts`. The Read page catches and renders a retry card.
- **User API failures** are swallowed in `lib/user.ts` — local copy wins.
- **Tafsir route** maps `QuranApiError` to its upstream status code (defaulting
  to 502) so the Reflection panel can show a meaningful message.

## Why no database?

The hackathon brief is a personal companion. Nothing entered is shared, so
local state is enough. The User API integration handles cross-device
continuity for users who already have a Quran Foundation account, without us
running auth ourselves.

This also keeps the entire app deployable as a single Vercel project with
zero managed services.
