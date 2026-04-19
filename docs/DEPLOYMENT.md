# Deployment

Quran Coach ships to **Vercel** with zero config — it's a stock Next.js 14
App Router project with no databases, no background jobs, and one optional
serverless function (`/api/tafsir`).

## One-time Vercel setup

1. Import the GitHub repo at <https://vercel.com/new>.
2. Framework preset auto-detects "Next.js".
3. Build command: `next build` (default).
4. Output: `.next` (default).
5. Node.js version: 20 (default).

No build-time secrets are required to ship the public Content API path.

## Environment variables

Set these in **Project Settings → Environment Variables** for every
environment that should sync user state (typically *Production* and
*Preview*).

| Key                | Used by                                    | Required? |
|--------------------|---------------------------------------------|-----------|
| `QURAN_USER_TOKEN` | `lib/user.ts` (`hasUserToken`)              | optional  |
| `QURAN_CLIENT_ID`  | future tier-gated Content API calls         | optional  |
| `QURAN_AUTH_TOKEN` | future tier-gated Content API calls         | optional  |

These are read only on the server (`lib/user.ts` checks `process.env`),
which is a deliberate choice — even when set, the bearer token never
reaches the browser. Functions calling the User API run in the
`/api/tafsir` route's region for the tafsir flow; everything else is
called from the client without the token (the client paths short-circuit
when `hasUserToken()` is `false`).

> **Heads up.** If you want client-side calls to use the token, you would
> need to expose it via `NEXT_PUBLIC_*` — *don't*. Move those calls
> behind a server route instead.

## Build-time check

The CI step that matters is the standard Vercel build. Locally:

```bash
npm run typecheck
npm run lint
npm run build
```

All three must pass before pushing to `main`.

## Caching

- `lib/quran.ts` sets `next: { revalidate: 86400 }` on every Content API
  fetch. Inside the `/api/tafsir` server route this becomes shared ISR
  cache — same tafsir text served from the edge for 24 h.
- Client-side direct fetches (`fetchVerses` from `ReadClient`) rely on
  the browser HTTP cache only.
- The favicon (`app/icon.svg`) and apple-touch-icon (`app/apple-icon.svg`)
  are auto-served by Next with long-lived cache headers.

## Domains

The project ships at the default `*.vercel.app` URL during the hackathon.
Custom domain setup is the standard Vercel flow (Settings → Domains →
Add). No DNS changes are required for the app itself.

## Rollback

Vercel keeps every deployment immutable. To roll back:

1. Open the project's **Deployments** tab.
2. Find the last known-good deployment.
3. Click the kebab menu → **Promote to Production**.

Because there's no database, rollback is purely a matter of swapping
which build the `production` alias points at.

## Observability

There's none wired in. Vercel provides basic request logs and runtime
metrics out of the box. If you need more:

- Add Vercel Analytics (`@vercel/analytics`) for page-level visit
  metrics.
- Add Sentry / Logtail for the `/api/tafsir` route.

Neither is required for the hackathon submission.

## Local production preview

```bash
npm run build && npm start
```

Serves the production build at <http://localhost:3000>. Useful for
verifying the favicon, font preload, and ISR behaviour before deploying.
