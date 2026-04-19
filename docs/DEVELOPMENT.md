# Development guide

## Prerequisites

- Node.js ≥ 18.18 (Next.js 14 requirement)
- npm ≥ 9
- Git

## First-time setup

```bash
git clone https://github.com/jibberswrld/Quran-Foundation-Hackathon-Submission.git
cd "Quran Hackathon App"
npm install
cp .env.local.example .env.local      # optional, see below
npm run dev
```

Visit <http://localhost:3000>.

The app boots in **local-only mode** without env vars. Add a
`QURAN_USER_TOKEN` to enable the optional remote sync paths in
`lib/user.ts`.

## Daily workflow

| Task                   | Command                |
|-------------------------|------------------------|
| Run dev server         | `npm run dev`          |
| Type check             | `npm run typecheck`    |
| Lint                   | `npm run lint`         |
| Production build       | `npm run build`        |
| Preview prod build     | `npm start`            |

The dev server uses Next's Fast Refresh; saving any file under
`app/`, `components/`, or `lib/` updates the browser without losing client
state.

## Branching

`main` is always deployable. Push directly to `main` for hackathon-pace
work; create a feature branch + PR for anything risky (auth, billing, etc.
— none of which exist today).

## Conventions

### TypeScript

- `strict: true` in `tsconfig.json` — no `any`, no implicit returns.
- Prefer narrow union types (`type LoadState = ...`) for component-local
  state machines.
- Co-locate types with their producer when they're used in one file;
  promote to `lib/types.ts` when they're shared.

### React

- Server Components are the default. Add `"use client"` only when you
  reach for hooks, refs, or browser APIs.
- Keep client trees small; lift purely-static layout into a server parent.
- Use `useLayoutEffect` for redirect/gate logic that must run before paint
  (`RequireGoal`, `OnboardingClient`).

### Styling

- Tailwind utility classes for layout, spacing, and typography.
- `globals.css` defines the design tokens (`--gold`, `--sage`, `--plum`,
  `--bg`, `--text*`, etc.) and reusable primitives (`.btn-primary`,
  `.btn-ghost`, `.card`, `.chip`, `.section-label`, `.input-field`,
  `.skeleton`, `.crosshair`, animations).
- Use the CSS variables for colour so dark/accent tweaks are one-line
  changes. Avoid hex values inline unless they're truly one-off.

### Animations

- All transition durations live between **150 ms** (interaction) and
  **500 ms** (page-level fade-up).
- Animation classes (`animate-fade-up`, `animate-blur-in`, `animate-float`,
  `animate-spin-slow`, `animate-gradient-pan`) live in `globals.css`.
- Use `anim-delay-{1..6}` to stagger appearance.

### File naming

- React components: `PascalCase.tsx`.
- Pure libs: `kebab-case.ts` or `lower-case.ts`. Match the existing
  surrounding files.
- App routes follow the App Router convention (`page.tsx`, `route.ts`,
  `layout.tsx`).

## Testing

There is no test runner wired in yet. The most valuable verification today
is `npm run typecheck && npm run lint && npm run build`. Run all three
before pushing.

For runtime checks, the dev server is enough — exercise:

1. Onboarding wizard end-to-end.
2. `/read` happy path + the focused-verse mode (`?verse=2:255`).
3. Bookmark a verse, return to `/dashboard`, click it, land in focus mode.
4. Settings → reset → confirm you land on `/onboarding`.
5. Hard refresh `/dashboard` without a saved goal → confirm you bounce to
   `/onboarding`.

## Adding a new feature

A typical feature (say, "save reflection to QuranReflect") touches:

1. **Types** — add the shape to `lib/types.ts`.
2. **Storage** — extend `lib/storage.ts` with a `saveX` / `loadX` helper.
3. **Remote sync** — add the matching `syncXToApi` in `lib/user.ts`,
   following the `if (!hasUserToken()) return null;` + `try { ... } catch
   { return null; }` pattern.
4. **Server route** (optional) — add `app/api/<thing>/route.ts` if the
   call needs CORS bypass or tier headers.
5. **UI** — build the smallest client leaf necessary. Reuse `card`,
   `btn-primary`, etc.

Always add the new key under the `qc:*` namespace so the destructive Reset
button picks it up automatically.

## Git etiquette

- Conventional, body-led commit messages. The first line is the *what*,
  the body is the *why*. Use HEREDOCs to keep formatting:

  ```bash
  git commit -m "$(cat <<'EOF'
  Short imperative summary

  Why this change matters, plus any non-obvious trade-offs.
  EOF
  )"
  ```

- Never commit `.env.local`. The `.gitignore` already excludes it.
- Never push `--force` to `main`.
