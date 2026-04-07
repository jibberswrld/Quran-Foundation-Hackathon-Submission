# Quran Coach — Full UI Redesign Spec
**Date:** 2026-04-07  
**Branch:** feature/supabase-auth-db-schema  
**Scope:** Visual-only. Zero logic, API, or data-fetching changes.

---

## Design Language

**Aesthetic:** Linear / Vercel / Stripe — dark, minimal, confident.  
**Mode:** Dark only.

### Color Tokens
| Token | Value | Usage |
|---|---|---|
| Background | `#09090b` | `<body>`, page bg |
| Surface | `#111113` | cards, inputs |
| Border | `#1f1f23` | card borders, dividers |
| Border subtle | `rgba(255,255,255,0.06)` | navbar border |
| Muted | `#3f3f46` | inactive, disabled |
| Secondary text | `#71717a` | captions, meta |
| Body text | `#a1a1aa` | translations, descriptions |
| Primary text | `#fafafa` | headings, values |
| Accent | `#22c55e` | CTAs, links, active states |
| Accent dark | `#16a34a` | hover on accent buttons |
| Accent text bg | `#052e16` | text on accent buttons |
| Accent subtle | `rgba(34,197,94,0.1)` | icon backgrounds, tags |
| Accent border | `rgba(34,197,94,0.15)` | icon borders, tag borders |

### Typography
- Font: system stack (`-apple-system, BlinkMacSystemFont, 'Inter', sans-serif`)
- Arabic font: `'Amiri', 'Scheherazade New', 'Traditional Arabic', serif` via Google Fonts
- Hero Arabic: `text-5xl` (3rem+), `leading-loose`, `text-right`, `dir="rtl"`
- Page headings (H1): `text-3xl font-bold tracking-tight`
- Section headings (H2): `text-xl font-semibold tracking-tight`
- Section labels: `text-xs font-semibold uppercase tracking-widest text-zinc-600`
- Body: `text-sm` / `text-[15px]` in `text-zinc-400`
- Small/caption: `text-xs text-zinc-600`

### Spacing & Layout
- Max-width container: `max-w-5xl mx-auto px-4` (or `max-w-3xl` for read/auth pages)
- Page top padding: `pt-16` on inner content, `py-12` on auth/onboarding
- Card gap: `gap-4` or `gap-6` in grid layouts
- Card padding: `p-5` standard, `p-6` for prominent cards

### Borders & Shadows
- Card border: `border border-zinc-800`
- Card radius: `rounded-2xl` (16px)
- Inner glow (top edge): `before:` pseudo-element gradient `rgba(255,255,255,0.05)` → transparent
- Accent shadow on CTAs: `shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_4px_16px_rgba(34,197,94,0.15)]`

---

## Component Specs

### NavBar (`components/NavBar.tsx`)
- `sticky top-0 z-30`
- `bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.06]`
- Logo: green gradient icon (`#22c55e → #16a34a`) in a `rounded-lg`, "Quran Coach" bold
- Links: `text-sm font-medium text-zinc-400 hover:text-zinc-100 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors`
- Height: `h-14`

### AuthNav (`components/AuthNav.tsx`)
- Signed-out: ghost "Sign in" link + green "Sign up" pill button
- Signed-in: truncated email (muted) + "Sign out" ghost button
- Loading skeleton: `animate-pulse h-4 w-20 rounded bg-zinc-800`

### RootRedirect (`components/RootRedirect.tsx`)
- Full-screen centered loading with pulsing green dot or branded loader, not a plain text spinner

### VerseCard (`components/VerseCard.tsx`)
- Dark card (`bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden`)
- Header: `bg-zinc-950/60 px-5 py-3 border-b border-zinc-800/60` — verse key in green, meta in muted, bookmark star on right
- Arabic body: `px-6 py-8 text-right text-4xl leading-loose text-zinc-100` + subtle radial green glow in bg
- Translation: `px-6 py-5 text-[15px] italic text-zinc-400 leading-relaxed border-t border-zinc-800/50`
- Meta footer: `px-5 py-3 bg-zinc-950/40 border-t border-zinc-800/50 flex gap-4 text-xs text-zinc-600`

### AudioPlayer (`components/AudioPlayer.tsx`)
- Dark card with play/pause button (green), progress bar (green fill on zinc track), time display (muted)
- Clean minimal design — no clutter

### ReflectionBox (`components/ReflectionBox.tsx`)
- Dark card with `✦ AI Reflection` heading + `Claude` badge (green, small caps)
- Idle: description text + full-width green CTA button
- Loading: skeleton lines (shimmer animation) — no spinner
- Ready: blockquote with `border-l-2 border-emerald-500`, save + regenerate buttons
- Saved: green success pill

### StreakTracker (`components/StreakTracker.tsx`)
- Stat cards: `bg-zinc-900 border border-zinc-800 rounded-2xl p-5`
- Icon in coloured `rounded-xl` badge (green/amber/blue tints)
- Value: `text-3xl font-bold tracking-tight text-zinc-50`
- Weekly progress: thin `h-1` green bar on zinc track, `box-shadow` glow on fill

### Onboarding (`app/onboarding/OnboardingClient.tsx`)
- Centered layout, max-w-md
- Moon icon in green gradient box at top
- Goal type options: dark cards with hover green border
- Value step: large styled number input, dark
- Confirm step: green tinted summary card

### Dashboard (`app/dashboard/DashboardClient.tsx`)
- 3-column stat cards at top
- Bookmarks section: dark list items with verse key in green, translation truncated, remove button
- Reflections: blockquote style with green left border
- Empty states: dashed border card with icon, title, subtitle

### Read Page (`app/read/ReadClient.tsx`)
- Progress indicator: thin bar above verse (not dots for navigation — keep dots but style them)
- Verse nav dots: `w-1.5 h-1.5 rounded-full` — active = green with glow, inactive = zinc-700
- Main verse card is the hero — full width, generous padding
- Prev/Next buttons: full-width, prev is ghost, next is green
- Loading: skeleton of the verse card shape

### Auth Pages
- Centered, max-w-md, `py-16`
- Card: `bg-zinc-900 border border-zinc-800 rounded-2xl p-8` with subtle top radial green glow
- Logo icon at top of each auth card
- Inputs: `bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30`
- Error: `bg-red-950/50 border border-red-900/50 text-red-400 rounded-lg px-3 py-2`
- Success: `bg-emerald-950/50 border border-emerald-900/30 text-emerald-400 rounded-lg px-3 py-2`

### AuthCallback (`app/auth/callback/AuthCallbackClient.tsx`)
- Centered loading with animated green dot
- Error state: same dark red card style as auth error

### Skeleton Loader Pattern
```tsx
// shimmer class via globals.css or inline animation
className="animate-pulse bg-zinc-800 rounded-lg"
// Or shimmer via bg-gradient-to-r animation
```

### globals.css additions
- Arabic font import (Google Fonts: Amiri)
- `.arabic` class: font-family + kerning
- `@keyframes shimmer` for skeleton loaders
- CSS custom property for accent glow

---

## Files to Touch (in order)
1. `app/globals.css` — font import, base styles, shimmer keyframes, arabic class
2. `app/layout.tsx` — body bg color, font class
3. `components/NavBar.tsx`
4. `components/AuthNav.tsx`
5. `components/RootRedirect.tsx`
6. `components/VerseCard.tsx`
7. `components/AudioPlayer.tsx`
8. `components/ReflectionBox.tsx`
9. `components/StreakTracker.tsx`
10. `app/page.tsx` (RootRedirect shell)
11. `app/onboarding/page.tsx` + `OnboardingClient.tsx`
12. `app/dashboard/page.tsx` + `DashboardClient.tsx`
13. `app/read/page.tsx` + `ReadClient.tsx`
14. `app/auth/login/page.tsx` + `LoginForm.tsx`
15. `app/auth/signup/page.tsx` + `SignupForm.tsx`
16. `app/auth/callback/page.tsx` + `AuthCallbackClient.tsx`

---

## Constraints
- Tailwind CSS only — no external component libraries
- No changes to any logic, API calls, hooks, state management, or backend code
- No new dependencies added to package.json
- Preserve all existing `aria-*` attributes and semantic HTML
- All interactive states must remain functional
