# Components

Quick reference for everything in [`components/`](../components/) and the
client containers under `app/*/`.

## Layout & navigation

### `NavBar`
Sticky top bar with frosted glass background, gold hairline divider, and
three pill links (Dashboard / Read / Settings → `#reading-goal`). Server
component, pure markup.

### `NavBrand`
Logo + wordmark lockup used in the nav. Renders `BrandMark` plus the "Quran
Coach" wordmark with the italic accent.

### `BrandMark`
Stand-alone gold-gradient crescent SVG. Used by `NavBrand`, `LandingPage`,
and indirectly mirrored by the favicon (`app/icon.svg`).

## Marketing

### `LandingPage`
Single full-page hero. Sections:

1. Atmospheric floating orbs.
2. Hero with headline, Arabic flourish from 73:4, primary + secondary CTAs.
3. Stats strip (114 / 6,236 / ∞).
4. Bento grid — **four** rituals: daily plan, word-by-word, comprehension,
   tafsir.
5. Quiet CTA card with "Start in two minutes".

CTAs all link to `/onboarding`. Returning users (with a saved goal) are
bounced from `/onboarding` to `/read` automatically by `OnboardingClient`.

## Onboarding

### `OnboardingClient` (`app/onboarding/OnboardingClient.tsx`)
Three-step wizard:

1. **type** — pick `finish_in_days` or `memorize_per_week`.
2. **value** — clamp the goal value against `GOAL_DESCRIPTIONS`.
3. **confirm** — show the summary card and save.

Hooks:

```ts
useLayoutEffect(() => {
  if (loadGoal()) {
    router.replace("/read");          // returning users skip the wizard
    return;
  }
  setCheckedExisting(true);
}, [router]);
```

`handleSave` writes to `localStorage` synchronously, then fires
`syncGoalToApi(goal)` in the background and pushes to `/dashboard`.

## Gating

### `RequireGoal`
Client gate around `/dashboard` and `/read`:

```tsx
useLayoutEffect(() => {
  if (!loadLocalUserState().goal) router.replace("/onboarding");
  else setAllowed(true);
}, [router]);
```

Renders an invisible shell while the check runs so there's no branded
loader flash on slow refreshes.

## Dashboard

### `DashboardClient` (`app/dashboard/DashboardClient.tsx`)
Two columns:

- **Progress** — `<StreakTracker progress goal/>` plus a primary "Start
  today's reading" link to `/read`. Reconciles the local streak with
  `fetchRemoteStreak()` on mount, preferring the remote value when present.
- **Bookmarks** — list of saved verses. Each row is a `<Link>` to
  `/read?verse=<key>` plus a remove button. Shows an empty-state card when
  the list is empty.

### `StreakTracker`
Three states:

- No goal & no progress → "Set your first goal" card linking to
  `/onboarding`.
- Goal but no progress → "Begin your first session" prompt.
- Both → flame icon + streak number, plus verses-completed delta against the
  computed `versesPerDay` from `computeTodayVerseRange`.

## Read

### `ReadClient` (`app/read/ReadClient.tsx`)
Two modes, chosen by the `?verse=...` query string:

- **Today** — calls `computeTodayVerseRange(state.goal, state.progress)`,
  then `fetchVerses(...)`, and lets the user step through them with a
  progress bar + dot indicators. Completing the last verse calls
  `updateProgress(lastVerseKey, verses.length)`.
- **Focus** — calls `fetchVerseByKey(focusKey)` and renders one
  `VerseCard` plus an immediately-expanded `ReflectionPanel`. Used when
  opening a bookmark.

Robust against:

- No goal → "No reading goal set" error card.
- Network failure → retry button.
- Loading → animated `VerseCardSkeleton`.

### `VerseCard`
The hero card for a single ayah. Header shows `verse_key`, page, and juz.
Body shows Arabic + translation. Footer shows action buttons:

| Prop                | Behaviour                                       |
|---------------------|-------------------------------------------------|
| `onBookmark(verse)` | Triggered when the star button is tapped       |
| `isBookmarked`      | Renders the star as filled when true           |
| `onShowReflection`  | Optional — opens / scrolls the Reflection panel |

### `AudioPlayer`
Per-ayah `<audio>` controller. Local state:

```ts
type PlayState = "idle" | "loading" | "playing" | "paused" | "error";
```

Manages a single `<audio>` ref, exposes a play/pause toggle, scrub bar, and
elapsed time. Resets state when `audioUrl` changes (i.e. a new verse).

### `ReflectionPanel`
Collapsible scholarly tafsir reader.

```ts
interface ReflectionPanelProps {
  verse: Verse;
  defaultExpanded?: boolean;
  expanded?: boolean;                     // controlled mode
  onExpandedChange?: (open: boolean) => void;
}
```

When opened, it lazily calls `fetchReflectionTafsir(verse.verseKey)` →
`/api/tafsir?verse=...`. Internal state machine:

```
idle → loading → ready { text } | error { message }
```

## Settings

### `SettingsClient` (`app/settings/SettingsClient.tsx`)
Branches on whether a goal exists:

- **No goal** → renders a single "Start onboarding?" card with a CTA to
  `/onboarding`. Hides the destructive reset section so a fresh visitor
  can't trip over it.
- **Has goal** → renders `<GoalEditorSection/>` and
  `<ClearLocalDataSection/>`.

### `GoalEditorSection`
Form to update the saved goal. Loads from `loadGoal()` on mount, clamps
inputs against `GOAL_DESCRIPTIONS`, writes via `saveGoal`, then fires the
best-effort `syncGoalToApi`. Anchored at `#reading-goal` so the NavBar's
Settings link can deep-link straight to it.

### `ClearLocalDataSection`
Destructive form. The user must type `RESET` to enable the button. On
submit:

1. `clearAllCoachLocalStorage()` removes every `qc:*` key in `localStorage`
   *and* `sessionStorage`.
2. `window.location.href = "/onboarding"` does a full reload so any
   in-memory React state (Dashboard caches, Reflection panels) is also
   discarded.

The hard reload is intentional — `router.replace + router.refresh` left
mounted client trees with stale state when we tested it.
