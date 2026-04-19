# Quran Coach

> A calm, local-first Qur'an companion. Daily reading goals, scholarly tafsir,
> per-ayah audio, bookmarks, and a quiet streak tracker — built on the
> [Quran Foundation Content API](https://api-docs.quran.foundation) and
> Next.js 14.

Submitted to the **Quran Foundation Hackathon** (April 2026).

---

## Table of contents

1. [What it does](#what-it-does)
2. [Live demo](#live-demo)
3. [Tech stack](#tech-stack)
4. [Quick start](#quick-start)
5. [Environment variables](#environment-variables)
6. [npm scripts](#npm-scripts)
7. [Project layout](#project-layout)
8. [Routes](#routes)
9. [Data flow at a glance](#data-flow-at-a-glance)
10. [Design language](#design-language)
11. [Local-first philosophy](#local-first-philosophy)
12. [Further reading](#further-reading)

---

## What it does

Quran Coach turns a personal reading goal into a tiny daily session, then gets
out of the way.

- **Onboarding** — pick "finish the Qur'an in N days" or "memorise N ayahs per
  week". The plan is saved to `localStorage` and (optionally) synced to the
  Quran Foundation User API.
- **Daily Read** — fetches today's assigned verses (Arabic + Saheeh
  International translation), per-ayah audio (Mishary Alafasy by default), and
  on-demand Ibn Kathir tafsir.
- **Reflection panel** — collapsible scholarly commentary loaded server-side
  through `/api/tafsir`.
- **Bookmarks & streak** — verses can be starred and re-opened in a focus view;
  streak math runs locally and is reconciled with the remote streak when a
  token is present.
- **Settings** — change the goal, or wipe every `qc:*` key from the browser
  with a one-word reset confirmation.

The four "rituals" featured on the landing page (daily reading plan,
word-by-word, comprehension checks, tafsir) describe the long-term feature
surface; the current build ships the daily plan, audio, tafsir, bookmarks, and
streaks.

## Live demo

Production: deployed via Vercel. Set `QURAN_USER_TOKEN` (and optionally the
client credential pair) in the project's environment variables to enable
remote sync; the app degrades cleanly to local-only mode without them.

## Tech stack

| Layer       | Choice                                               |
|-------------|-------------------------------------------------------|
| Framework   | [Next.js 14](https://nextjs.org/) App Router          |
| Runtime     | React 18, Server Components + selected `"use client"` |
| Styling     | Tailwind CSS 3 + custom CSS variables (`globals.css`) |
| Fonts       | Outfit (display) + Newsreader (italic accents)        |
| Data layer  | Quran Foundation Content API v4 (public, anonymous)   |
| User sync   | Quran Foundation User API v4 (optional, bearer token) |
| Persistence | `window.localStorage`, namespaced under `qc:*`        |
| Hosting     | Vercel (zero config)                                  |
| Lint        | `eslint-config-next`                                  |
| Types       | TypeScript 5 strict                                   |

No database. No auth. No analytics. All state worth keeping lives in the
browser; remote sync is best-effort.

## Quick start

```bash
git clone https://github.com/jibberswrld/Quran-Foundation-Hackathon-Submission.git
cd "Quran Hackathon App"
npm install
cp .env.local.example .env.local   # optional — see below
npm run dev
```

Open http://localhost:3000.

The app works fully without any environment variables — the Content API is
publicly readable, and all user data persists in `localStorage`. Tokens only
unlock remote streak / bookmark / goal sync.

## Environment variables

| Variable             | Purpose                                                    | Required? |
|----------------------|------------------------------------------------------------|-----------|
| `QURAN_USER_TOKEN`   | Bearer token for streaks, bookmarks, goals, posts          | No        |
| `QURAN_CLIENT_ID`    | `x-client-id` header for tiered Content API access         | No        |
| `QURAN_AUTH_TOKEN`   | `x-auth-token` header for tiered Content API access        | No        |

See [`.env.local.example`](./.env.local.example) for the canonical template.

## npm scripts

| Command            | What it does                                  |
|--------------------|-----------------------------------------------|
| `npm run dev`      | Start the Next.js dev server on port 3000     |
| `npm run build`    | Production build (`.next/`)                   |
| `npm start`        | Run the production build locally              |
| `npm run lint`     | Run `next lint`                               |
| `npm run typecheck`| `tsc --noEmit` strict type check              |

## Project layout

```
app/                    Next.js App Router
├── layout.tsx          Root HTML shell, fonts, NavBar
├── page.tsx            Landing page (server) → <LandingPage/>
├── icon.svg            Auto-served favicon (32×32)
├── apple-icon.svg      Auto-served apple-touch-icon (180×180)
├── globals.css         Design tokens, animations, primitives
├── api/
│   └── tafsir/route.ts GET /api/tafsir?verse=2:255 — server proxy
├── dashboard/          /dashboard — streak + bookmarks
├── onboarding/         /onboarding — 3-step goal wizard
├── read/               /read — today's session or focused verse
└── settings/           /settings — goal editor + destructive reset

components/             Pure UI building blocks (mostly client)
├── LandingPage.tsx     Marketing hero, bento grid, quiet CTA
├── NavBar.tsx          Sticky glass nav with route pills
├── NavBrand.tsx        Logo lockup
├── BrandMark.tsx       Stand-alone crescent SVG
├── VerseCard.tsx       Arabic + translation + actions
├── AudioPlayer.tsx     Single-verse <audio> with play / scrub
├── ReflectionPanel.tsx Collapsible tafsir reader
├── StreakTracker.tsx   Streak number + verses-completed delta
├── GoalEditorSection.tsx  Settings form
└── RequireGoal.tsx     Client gate that redirects to /onboarding

lib/                    Pure TypeScript, framework-agnostic where possible
├── types.ts            All shared TypeScript shapes (raw + normalised)
├── quran.ts            Content API client + verse-range planner
├── user.ts             User API client (best-effort, token-gated)
├── reflection.ts       Tiny client wrapper for /api/tafsir
├── storage.ts          localStorage helpers, streak math, reset
└── goal-constants.ts   GOAL_DESCRIPTIONS validation table

docs/                   Architecture, data model, API reference, etc.
```

## Routes

| Path             | Type   | Notes                                               |
|------------------|--------|-----------------------------------------------------|
| `/`              | Public | Landing page                                        |
| `/onboarding`    | Public | Auto-redirects to `/read` if a goal already exists  |
| `/dashboard`     | Gated  | `RequireGoal` → `/onboarding` if no goal saved      |
| `/read`          | Gated  | Today's verses; `?verse=2:255` opens focus view     |
| `/settings`      | Public | Shows "Start onboarding?" card if no goal           |
| `/api/tafsir`    | Route  | `GET ?verse=2:255` → `{ text: string \| null }`     |

## Data flow at a glance

```
┌──────────────┐   click "Start"   ┌──────────────┐
│   Landing    │ ────────────────▶ │  Onboarding  │
└──────────────┘                   └──────┬───────┘
                                          │ saveGoal()
                                          ▼
                                   ┌──────────────┐  computeTodayVerseRange()
                                   │ localStorage │ ─────────┐
                                   │   qc:goal    │          │
                                   └──────┬───────┘          ▼
                                          │            ┌──────────────────┐
                                          │            │ lib/quran.ts     │
                                          │            │  fetchVerses()   │
                                          ▼            └──────┬───────────┘
                                   ┌──────────────┐           │
                                   │  Dashboard   │           ▼
                                   └──────┬───────┘    ┌──────────────────┐
                                          │            │ Quran Foundation │
                                          ▼            │  Content API v4  │
                                   ┌──────────────┐    └──────────────────┘
                                   │     Read     │
                                   │ ┌──────────┐ │    ┌──────────────────┐
                                   │ │ Reflect  │ │ ─▶ │ /api/tafsir      │
                                   │ └──────────┘ │    │ → fetchVerseTafsir│
                                   └──────┬───────┘    └──────────────────┘
                                          │ updateProgress()
                                          ▼
                                   ┌──────────────┐
                                   │ qc:progress  │
                                   │ qc:bookmarks │
                                   │ qc:reflections│
                                   └──────────────┘
```

The optional User API sync runs in the background from `lib/user.ts` and
never blocks the UI — failures are swallowed and the local copy wins.

## Design language

Defined in `app/globals.css`:

- Dark canvas with a single warm accent (`--gold` `#e8b64c`), a sage support
  (`--sage`), and a plum tertiary.
- Display type in **Outfit**, italic flourishes in **Newsreader**.
- Arabic uses the `arabic` utility class with extra leading.
- Animations are short (200–500 ms), opacity-led, and respect
  `prefers-reduced-motion`.
- Brand crescent is a gold-gradient SVG used at three scales: nav lockup
  (`NavBrand`), landing orbit (`CrescentOrbit`), and onboarding moon.

## Local-first philosophy

1. **Anything the user creates persists locally first.** Goal, progress,
   bookmarks, and reflections are written synchronously to `localStorage`
   under the `qc:` namespace.
2. **Remote sync is best-effort.** Each function in `lib/user.ts` returns
   `null` / void on failure and the UI never depends on it.
3. **Reset must mean reset.** `clearAllCoachLocalStorage()` removes every
   `qc:*` key in both `localStorage` and `sessionStorage` and the Settings
   page hard-reloads to `/onboarding` so React state is also discarded.
4. **No goal → no gated page.** `RequireGoal` redirects an unmoneyed visitor
   to `/onboarding` before the client paints; conversely, a returning visitor
   who taps "Begin your journey" is bounced from `/onboarding` straight to
   `/read`.

## Further reading

- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — request flow, gating,
  rendering boundaries.
- [`docs/DATA-MODEL.md`](./docs/DATA-MODEL.md) — every shape in `lib/types.ts`
  with annotated field semantics.
- [`docs/API.md`](./docs/API.md) — every upstream Quran Foundation endpoint
  used and every internal route exposed.
- [`docs/COMPONENTS.md`](./docs/COMPONENTS.md) — component-by-component
  reference with props.
- [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) — local workflow, testing,
  conventions.
- [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) — Vercel deployment notes.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — coding standards, commit style.

## License

MIT. Quranic text, translation, audio, and tafsir resources belong to their
respective copyright holders and are accessed via the Quran Foundation
Content API.
