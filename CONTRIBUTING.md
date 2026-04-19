# Contributing

Quran Coach is a small project. The bar for changes is **calmness** — no
dependency creep, no premature abstraction, no UI noise. If a change
doesn't make the daily reading experience clearer or quieter, it probably
doesn't belong.

## Before you start

1. Read [`README.md`](./README.md) and skim
   [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) so you understand the
   local-first contract.
2. Make sure you can run the dev server (`npm run dev`) and the build
   pipeline (`npm run typecheck && npm run lint && npm run build`).

## Coding standards

See [`docs/DEVELOPMENT.md`](./docs/DEVELOPMENT.md) for the full set.
The short version:

- TypeScript strict; no `any`.
- Server Components by default; `"use client"` only at the leaves that
  need browser APIs.
- Tailwind utilities + CSS variables from `globals.css`. Avoid inline
  hex colours.
- Animations stay subtle: 150–500 ms, opacity-led, respect
  `prefers-reduced-motion`.
- Local-first: every user-created entity persists to `localStorage` under
  the `qc:*` namespace **before** any best-effort remote sync.

## Commit messages

Conventional, body-led, written in the imperative.

```
Short one-line summary

Why the change matters. Trade-offs and constraints. Anything a future
reader needs to understand the diff without re-deriving it.
```

Use a HEREDOC so the body keeps formatting:

```bash
git commit -m "$(cat <<'EOF'
Drop "AI reflection" card from landing bento

Surface only the rituals we actually ship today; the bento now reads
"Four rituals, woven together" and the unused SparkIcon was removed
to keep the landing bundle small.
EOF
)"
```

## Pull requests

Hackathon-pace work pushes directly to `main`. For anything riskier:

1. Branch off `main`.
2. Run `npm run typecheck && npm run lint && npm run build` locally.
3. Open a PR with a one-paragraph summary and a manual-test checklist.
4. Squash-merge.

## What not to add

- Auth providers, databases, sign-in walls.
- Telemetry that names the user.
- Heavy animation libraries (Framer Motion is overkill for what we do).
- Component libraries that fight the existing design tokens. shadcn-style
  composables are fine; chrome-heavy kits are not.

## Bug reports

Open a GitHub issue with:

1. What you did.
2. What you expected.
3. What happened.
4. Browser + OS.

Screenshots welcome. Logs from the browser console are gold.

## License

Contributions are accepted under the project's MIT license. Quranic text,
translation, audio, and tafsir resources remain the property of their
respective copyright holders and are accessed via the Quran Foundation
Content API.
