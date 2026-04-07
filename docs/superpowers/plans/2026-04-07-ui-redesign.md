# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every page and component to a dark-mode, Linear/Vercel/Stripe premium aesthetic with green accent, frosted glass navbar, skeleton loaders, elegant Arabic verse display, and consistent spacing/typography throughout.

**Architecture:** Visual-only changes — Tailwind class replacements and structural HTML tweaks only. No logic, API calls, hooks, or state changes. Work file-by-file in dependency order (globals → layout → shared components → pages).

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3, TypeScript TSX. Google Fonts (Amiri) for Arabic via CSS @import.

---

## Color & Design Token Reference

Use these exact values throughout — do not deviate:

| Token | Value |
|---|---|
| Body bg | `bg-zinc-950` (`#09090b`) |
| Surface/card | `bg-zinc-900` (`#111113`) |
| Surface deep | `bg-zinc-950` |
| Border | `border-zinc-800` (`#1f1f23`) |
| Border subtle | `border-white/[0.06]` |
| Text primary | `text-zinc-50` |
| Text secondary | `text-zinc-400` |
| Text muted | `text-zinc-600` |
| Accent | `text-emerald-400` / `bg-emerald-500` |
| Accent hover | `bg-emerald-600` |
| Accent text on bg | `text-emerald-950` |
| Accent subtle bg | `bg-emerald-500/10` |
| Accent subtle border | `border-emerald-500/20` |

---

### Task 1: globals.css — Base styles, Arabic font, shimmer animation

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
/* app/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    color-scheme: dark;
  }

  body {
    @apply bg-zinc-950 text-zinc-50 antialiased;
  }

  ::selection {
    @apply bg-emerald-500/30 text-emerald-50;
  }

  * {
    @apply border-zinc-800;
  }
}

@layer components {
  .arabic {
    font-family: 'Amiri', 'Scheherazade New', 'Traditional Arabic', serif;
    font-feature-settings: 'kern' 1;
    line-height: 2.2;
  }

  .card {
    @apply bg-zinc-900 border border-zinc-800 rounded-2xl;
  }

  .btn-primary {
    @apply bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-semibold rounded-xl
           transition-all duration-150 shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_4px_16px_rgba(34,197,94,0.15)]
           hover:shadow-[0_0_0_1px_rgba(34,197,94,0.5),0_4px_20px_rgba(34,197,94,0.25)];
  }

  .btn-ghost {
    @apply bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100
           border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all duration-150;
  }

  .input-field {
    @apply w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5
           text-zinc-100 placeholder:text-zinc-600 text-sm
           focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20
           transition-colors duration-150;
  }

  .section-label {
    @apply text-xs font-semibold uppercase tracking-widest text-zinc-600;
  }

  .page-container {
    @apply max-w-5xl mx-auto px-4;
  }

  .page-container-sm {
    @apply max-w-3xl mx-auto px-4;
  }
}

@layer utilities {
  .skeleton {
    @apply bg-zinc-800 rounded-lg relative overflow-hidden;
  }

  .skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.04) 50%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .glow-green {
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3), 0 4px 16px rgba(34, 197, 94, 0.15);
  }

  .glow-green-hover:hover {
    box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.5), 0 4px 24px rgba(34, 197, 94, 0.25);
  }

  .card-glow::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    pointer-events: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/jabirouldmohamed/Quran Hackathon App"
git add app/globals.css
git commit -m "style: dark base styles, Arabic font, shimmer skeleton, utility classes"
```

---

### Task 2: layout.tsx — Body background and font class

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Quran Coach",
  description:
    "Your personal Quran reading companion — daily verses, streaks, reflections, and progress tracking.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="py-5 text-center text-xs text-zinc-700 border-t border-zinc-900">
          © {new Date().getFullYear()} Quran Coach · Powered by Quran Foundation &amp; Claude
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/layout.tsx
git commit -m "style: dark layout body, footer"
```

---

### Task 3: NavBar — Frosted glass, dark links, green logo

**Files:**
- Modify: `components/NavBar.tsx`

- [ ] **Step 1: Replace NavBar**

```tsx
// components/NavBar.tsx
import Link from "next/link";
import AuthNav from "@/components/AuthNav";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-30 border-b border-white/[0.06] bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[15px] font-bold tracking-tight text-zinc-50 hover:text-white transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_4px_12px_rgba(34,197,94,0.2)]">
            ☽
          </span>
          Quran Coach
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Dashboard
          </Link>
          <Link
            href="/read"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Read
          </Link>
          <Link
            href="/onboarding"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
          >
            Goals
          </Link>
        </div>

        {/* Auth */}
        <AuthNav />
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/NavBar.tsx
git commit -m "style: frosted glass navbar, dark links, green gradient logo"
```

---

### Task 4: AuthNav — Dark auth controls

**Files:**
- Modify: `components/AuthNav.tsx`

- [ ] **Step 1: Replace AuthNav**

```tsx
// components/AuthNav.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AuthNav() {
  const configured = isSupabaseConfigured();
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!configured) {
      setUser(null);
      return;
    }

    const supabase = createBrowserSupabaseClient();

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      setUser(u);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  async function handleSignOut() {
    if (!configured) return;
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/auth/login");
    router.refresh();
  }

  if (!configured) return null;

  // Loading skeleton
  if (user === undefined) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-24 skeleton" aria-hidden />
        <div className="h-7 w-16 skeleton rounded-lg" aria-hidden />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-emerald-950 transition-all hover:bg-emerald-400 shadow-[0_0_0_1px_rgba(34,197,94,0.3)]"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span
        className="max-w-[140px] truncate text-xs text-zinc-600"
        title={user.email ?? ""}
      >
        {user.email}
      </span>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-all hover:bg-white/[0.06] hover:text-zinc-100"
      >
        Sign out
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AuthNav.tsx
git commit -m "style: dark auth nav, skeleton loader, green sign up button"
```

---

### Task 5: RootRedirect — Branded loading screen

**Files:**
- Modify: `components/RootRedirect.tsx`

- [ ] **Step 1: Replace RootRedirect**

```tsx
// components/RootRedirect.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadLocalUserState } from "@/lib/storage";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function RootRedirect() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createBrowserSupabaseClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) {
            router.replace("/auth/login");
            return;
          }
        } catch {
          router.replace("/auth/login");
          return;
        }
      }

      if (cancelled) return;
      const state = loadLocalUserState();
      if (state.goal) {
        router.replace("/dashboard");
      } else {
        router.replace("/onboarding");
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
        ☽
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/RootRedirect.tsx
git commit -m "style: branded loading screen with green icon and bounce dots"
```

---

### Task 6: VerseCard — Hero Arabic text, dark card

**Files:**
- Modify: `components/VerseCard.tsx`

- [ ] **Step 1: Replace VerseCard**

```tsx
// components/VerseCard.tsx
"use client";

import type { Verse } from "@/lib/types";

interface VerseCardProps {
  verse: Verse;
  onBookmark?: (verse: Verse) => void;
  isBookmarked?: boolean;
}

export default function VerseCard({
  verse,
  onBookmark,
  isBookmarked = false,
}: VerseCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* Top edge highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 px-5 py-3">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          {verse.verseKey}
        </span>
        <div className="flex items-center gap-4">
          <div className="flex gap-3 text-xs text-zinc-600">
            <span>Juz {verse.juzNumber}</span>
            <span>Page {verse.pageNumber}</span>
          </div>
          {onBookmark && (
            <button
              onClick={() => onBookmark(verse)}
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark verse"}
              className={`text-lg transition-all duration-150 active:scale-90 ${
                isBookmarked
                  ? "text-emerald-400"
                  : "text-zinc-700 hover:text-zinc-400"
              }`}
            >
              {isBookmarked ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>

      {/* Arabic text — hero element */}
      <div
        className="relative px-8 py-10 text-right"
        style={{
          background:
            "radial-gradient(ellipse at 65% 50%, rgba(34,197,94,0.05) 0%, transparent 65%)",
        }}
      >
        <p
          className="arabic text-4xl text-zinc-100 sm:text-5xl"
          lang="ar"
          dir="rtl"
        >
          {verse.arabicText}
        </p>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-zinc-800/50" />

      {/* Translation */}
      <div className="px-6 py-5">
        <p className="text-[15px] italic leading-relaxed text-zinc-400">
          &ldquo;{verse.translation}&rdquo;
        </p>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/VerseCard.tsx
git commit -m "style: dark verse card, hero Arabic text with radial glow, metadata"
```

---

### Task 7: AudioPlayer — Dark minimal player

**Files:**
- Modify: `components/AudioPlayer.tsx`

- [ ] **Step 1: Read current file**

Read `components/AudioPlayer.tsx` to understand existing structure before replacing.

- [ ] **Step 2: Replace AudioPlayer**

```tsx
// components/AudioPlayer.tsx
"use client";

import { useRef, useState } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  verseKey: string;
}

export default function AudioPlayer({ audioUrl, verseKey }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
    } else {
      void el.play();
    }
    setPlaying(!playing);
  }

  function handleTimeUpdate() {
    const el = audioRef.current;
    if (!el || !el.duration) return;
    setProgress(el.currentTime / el.duration);
  }

  function handleLoadedMetadata() {
    const el = audioRef.current;
    if (!el) return;
    setDuration(el.duration);
  }

  function handleEnded() {
    setPlaying(false);
    setProgress(0);
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const el = audioRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    el.currentTime = ratio * el.duration;
    setProgress(ratio);
  }

  function formatTime(s: number) {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        aria-label={`Recitation of verse ${verseKey}`}
      />

      <div className="flex items-center gap-4">
        {/* Play/pause */}
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause recitation" : "Play recitation"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-emerald-950 transition-all hover:bg-emerald-400 shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_4px_12px_rgba(34,197,94,0.2)] hover:shadow-[0_0_0_1px_rgba(34,197,94,0.5),0_4px_16px_rgba(34,197,94,0.3)]"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="4" height="12" rx="1" />
              <rect x="8" y="1" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 2l9 5-9 5V2z" />
            </svg>
          )}
        </button>

        {/* Progress + time */}
        <div className="flex flex-1 flex-col gap-1.5">
          <div
            className="relative h-1 cursor-pointer rounded-full bg-zinc-800"
            onClick={handleSeek}
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Audio progress"
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${progress * 100}%`,
                boxShadow: progress > 0 ? "0 0 8px rgba(34,197,94,0.5)" : "none",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-600">
            <span>{formatTime(progress * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/AudioPlayer.tsx
git commit -m "style: dark minimal audio player with green play button and progress bar"
```

---

### Task 8: ReflectionBox — Dark card, skeleton loader, Claude badge

**Files:**
- Modify: `components/ReflectionBox.tsx`

- [ ] **Step 1: Replace ReflectionBox**

```tsx
// components/ReflectionBox.tsx
"use client";

import { useState } from "react";
import type { Verse, ClaudeReflectionResponse } from "@/lib/types";

interface ReflectionBoxProps {
  verse: Verse;
  onSave?: (verseKey: string, reflection: string) => void;
}

type ReflectionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; reflection: string }
  | { status: "saved" }
  | { status: "error"; message: string };

export default function ReflectionBox({ verse, onSave }: ReflectionBoxProps) {
  const [state, setState] = useState<ReflectionState>({ status: "idle" });

  async function generateReflection() {
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verseKey: verse.verseKey,
          arabicText: verse.arabicText,
          translation: verse.translation,
          tafsir: verse.tafsir ?? null,
        }),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as ClaudeReflectionResponse;
      setState({ status: "ready", reflection: data.reflection });
    } catch (err) {
      setState({
        status: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  function handleSave() {
    if (state.status !== "ready") return;
    onSave?.(verse.verseKey, state.reflection);
    setState({ status: "saved" });
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-base text-emerald-400">✦</span>
        <h3 className="text-sm font-semibold text-zinc-100">AI Reflection</h3>
        <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
          Claude
        </span>
      </div>

      {/* Idle */}
      {state.status === "idle" && (
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">
            Generate a personalised reflection on this verse using Claude AI.
          </p>
          <button
            onClick={generateReflection}
            className="btn-primary w-full py-2.5 text-sm"
          >
            Generate reflection
          </button>
        </div>
      )}

      {/* Loading — skeleton */}
      {state.status === "loading" && (
        <div className="space-y-3 py-1">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-[90%]" />
          <div className="skeleton h-3.5 w-[75%]" />
          <div className="skeleton mt-2 h-3.5 w-[85%]" />
          <div className="skeleton h-3.5 w-[60%]" />
        </div>
      )}

      {/* Error */}
      {state.status === "error" && (
        <div className="space-y-3">
          <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-4 py-3 text-sm text-red-400">
            {state.message}
          </p>
          <button
            onClick={generateReflection}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Try again →
          </button>
        </div>
      )}

      {/* Ready */}
      {state.status === "ready" && (
        <div className="space-y-4">
          <blockquote className="border-l-2 border-emerald-500/60 pl-4 text-sm italic leading-relaxed text-zinc-300">
            {state.reflection}
          </blockquote>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary flex-1 py-2.5 text-sm"
            >
              Save reflection
            </button>
            <button
              onClick={generateReflection}
              className="btn-ghost px-4 py-2.5 text-sm"
            >
              ↺
            </button>
          </div>
        </div>
      )}

      {/* Saved */}
      {state.status === "saved" && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <span>✓</span>
          <span>Reflection saved to your journal.</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ReflectionBox.tsx
git commit -m "style: dark reflection box, skeleton loader, Claude badge, green blockquote"
```

---

### Task 9: StreakTracker — Dark stat cards with icon badges

**Files:**
- Modify: `components/StreakTracker.tsx`

- [ ] **Step 1: Replace StreakTracker**

```tsx
// components/StreakTracker.tsx
"use client";

import type { ReadingProgress, UserGoal } from "@/lib/types";

interface StreakTrackerProps {
  progress: ReadingProgress | null;
  goal: UserGoal | null;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="relative h-1 w-full overflow-hidden rounded-full bg-zinc-800">
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-500"
        style={{
          width: `${pct}%`,
          boxShadow: pct > 0 ? "0 0 8px rgba(34,197,94,0.5)" : "none",
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`${pct}% complete`}
      />
    </div>
  );
}

export default function StreakTracker({ progress, goal }: StreakTrackerProps) {
  if (!progress && !goal) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-2xl">
          📖
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-300">No progress yet</p>
          <p className="mt-0.5 text-xs text-zinc-600">Set a goal to get started!</p>
        </div>
      </div>
    );
  }

  const streakDays = progress?.streakDays ?? 0;
  const totalRead = progress?.totalVersesRead ?? 0;

  let weeklyTarget = 0;
  let weeklyLabel = "";
  if (goal) {
    if (goal.type === "finish_in_days") {
      weeklyTarget = Math.ceil((6236 / goal.value) * 7);
      weeklyLabel = `${weeklyTarget} verses / week to finish in ${goal.value} days`;
    } else {
      weeklyTarget = goal.value;
      weeklyLabel = `${goal.value} ayahs / week to memorise`;
    }
  }

  const thisWeekRead =
    weeklyTarget > 0 ? totalRead % weeklyTarget : totalRead;

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-base">
            🔥
          </div>
          <p className="text-3xl font-bold tracking-tight text-zinc-50">
            {streakDays}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Day streak
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-base">
            📖
          </div>
          <p className="text-3xl font-bold tracking-tight text-zinc-50">
            {totalRead.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Verses completed
          </p>
        </div>
      </div>

      {/* Weekly progress */}
      {goal && weeklyTarget > 0 && (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">Weekly progress</span>
            <span className="text-xs text-zinc-600">
              {thisWeekRead} / {weeklyTarget}
            </span>
          </div>
          <ProgressBar value={thisWeekRead} max={weeklyTarget} />
          <p className="mt-2.5 text-xs text-zinc-600">{weeklyLabel}</p>
        </div>
      )}

      {progress?.lastReadAt && (
        <p className="text-right text-xs text-zinc-700">
          Last read{" "}
          {new Date(progress.lastReadAt).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/StreakTracker.tsx
git commit -m "style: dark streak tracker, icon badges, glowing progress bar"
```

---

### Task 10: Onboarding pages — Dark wizard, centered layout

**Files:**
- Modify: `app/onboarding/page.tsx`
- Modify: `app/onboarding/OnboardingClient.tsx`

- [ ] **Step 1: Replace onboarding page.tsx**

```tsx
// app/onboarding/page.tsx
import OnboardingClient from "./OnboardingClient";

export const metadata = {
  title: "Set your goal · Quran Coach",
  description: "Choose your reading pace and start your journey.",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <OnboardingClient />
    </div>
  );
}
```

- [ ] **Step 2: Replace OnboardingClient.tsx**

```tsx
// app/onboarding/OnboardingClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GoalType, UserGoal } from "@/lib/types";
import { saveGoal } from "@/lib/storage";
import { syncGoalToApi } from "@/lib/user";
import { upsertUserGoalAction } from "@/app/actions/user-data";

type Step = "type" | "value" | "confirm";

const GOAL_DESCRIPTIONS: Record<
  GoalType,
  { label: string; unit: string; min: number; max: number; defaultVal: number }
> = {
  finish_in_days: {
    label: "Finish the Quran in",
    unit: "days",
    min: 30,
    max: 3650,
    defaultVal: 365,
  },
  memorize_per_week: {
    label: "Memorise",
    unit: "ayahs per week",
    min: 1,
    max: 100,
    defaultVal: 5,
  },
};

export default function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("type");
  const [goalType, setGoalType] = useState<GoalType>("finish_in_days");
  const [goalValue, setGoalValue] = useState<number>(365);
  const [saving, setSaving] = useState(false);

  function handleTypeSelect(type: GoalType) {
    setGoalType(type);
    setGoalValue(GOAL_DESCRIPTIONS[type].defaultVal);
    setStep("value");
  }

  function handleValueConfirm() {
    setStep("confirm");
  }

  async function handleSave() {
    setSaving(true);

    const goal: UserGoal = {
      type: goalType,
      value: goalValue,
      startedAt: new Date().toISOString(),
    };

    saveGoal(goal);

    try {
      await syncGoalToApi(goal);
    } catch {
      // Silently continue; local-first state is already saved
    }

    void upsertUserGoalAction(goal);

    setSaving(false);
    router.push("/dashboard");
  }

  const desc = GOAL_DESCRIPTIONS[goalType];

  return (
    <div className="w-full max-w-md">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-3xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
          ☽
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
          Welcome to Quran Coach
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Set your reading goal and we&apos;ll build a personalised daily plan.
        </p>
      </div>

      {/* Step: type */}
      {step === "type" && (
        <div className="space-y-3">
          <p className="section-label mb-3">What&apos;s your goal?</p>
          {(Object.keys(GOAL_DESCRIPTIONS) as GoalType[]).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className="group w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4 text-left transition-all hover:border-emerald-500/40 hover:bg-zinc-900/80"
            >
              <span className="block font-semibold text-zinc-100 transition-colors group-hover:text-emerald-400">
                {type === "finish_in_days"
                  ? "Finish the Quran"
                  : "Memorise ayahs"}
              </span>
              <span className="mt-1 block text-sm text-zinc-500">
                {type === "finish_in_days"
                  ? "Complete a Khatmah at your own pace"
                  : "Build a weekly memorisation habit"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Step: value */}
      {step === "value" && (
        <div className="space-y-6">
          <button
            onClick={() => setStep("type")}
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            ← Back
          </button>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <label
              htmlFor="goal-value"
              className="section-label block mb-3"
            >
              {desc.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                id="goal-value"
                type="number"
                min={desc.min}
                max={desc.max}
                value={goalValue}
                onChange={(e) =>
                  setGoalValue(
                    Math.max(desc.min, Math.min(desc.max, Number(e.target.value)))
                  )
                }
                className="w-32 rounded-xl border border-zinc-700 bg-zinc-950 py-2 text-center text-2xl font-bold text-emerald-400 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
              <span className="text-sm text-zinc-500">{desc.unit}</span>
            </div>
            {goalType === "finish_in_days" && (
              <p className="mt-4 text-xs text-zinc-600">
                That&apos;s roughly{" "}
                <strong className="text-zinc-400">
                  {Math.ceil(6236 / goalValue)} verses
                </strong>{" "}
                per day (6,236 total ayahs).
              </p>
            )}
          </div>
          <button
            onClick={handleValueConfirm}
            className="btn-primary w-full py-3 text-sm"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step: confirm */}
      {step === "confirm" && (
        <div className="space-y-6">
          <button
            onClick={() => setStep("value")}
            className="text-sm text-zinc-600 transition-colors hover:text-zinc-400"
          >
            ← Back
          </button>
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 text-center">
            <p className="text-xs text-zinc-600 mb-1">Your goal</p>
            <p className="text-xl font-bold tracking-tight text-emerald-400">
              {goalType === "finish_in_days"
                ? `Finish in ${goalValue} days`
                : `Memorise ${goalValue} ayahs / week`}
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Starting{" "}
              {new Date().toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : "Start my journey →"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/onboarding/page.tsx app/onboarding/OnboardingClient.tsx
git commit -m "style: dark onboarding wizard, green logo, goal cards with hover border"
```

---

### Task 11: Dashboard pages — Stat grid, bookmarks, reflections

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `app/dashboard/DashboardClient.tsx`

- [ ] **Step 1: Replace dashboard page.tsx**

```tsx
// app/dashboard/page.tsx
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard · Quran Coach",
  description: "Your streaks, progress, and bookmarked verses.",
};

export default function DashboardPage() {
  return (
    <div className="page-container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Dashboard</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Your reading journey at a glance.</p>
      </div>
      <DashboardClient />
    </div>
  );
}
```

- [ ] **Step 2: Replace DashboardClient.tsx**

```tsx
// app/dashboard/DashboardClient.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { LocalUserState } from "@/lib/types";
import { loadLocalUserState, removeBookmark } from "@/lib/storage";
import StreakTracker from "@/components/StreakTracker";
import { fetchRemoteStreak } from "@/lib/user";

export default function DashboardClient() {
  const [userState, setUserState] = useState<LocalUserState>({
    goal: null,
    progress: null,
    bookmarks: [],
    reflections: [],
  });
  const [remoteStreakDays, setRemoteStreakDays] = useState<number | null>(null);

  useEffect(() => {
    setUserState(loadLocalUserState());

    fetchRemoteStreak()
      .then((s) => {
        if (s) setRemoteStreakDays(s.current_streak);
      })
      .catch(() => {});
  }, []);

  function handleRemoveBookmark(verseKey: string) {
    removeBookmark(verseKey);
    setUserState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.verseKey !== verseKey),
    }));
  }

  const mergedProgress =
    userState.progress && remoteStreakDays !== null
      ? { ...userState.progress, streakDays: remoteStreakDays }
      : userState.progress;

  return (
    <div className="space-y-10">
      {/* Progress + CTA */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <p className="section-label mb-4">Progress</p>
          <StreakTracker progress={mergedProgress} goal={userState.goal} />
          <Link
            href="/read"
            className="btn-primary mt-5 block w-full py-3 text-center text-sm"
          >
            Start today&apos;s reading →
          </Link>
        </section>

        {/* Bookmarks */}
        <section>
          <p className="section-label mb-4">Bookmarked Verses</p>

          {userState.bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-xl">
                🔖
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">No bookmarks yet</p>
                <p className="mt-0.5 text-xs text-zinc-600">
                  Star a verse while reading to save it here.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {userState.bookmarks.map((b) => (
                <li
                  key={b.verseKey}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 flex gap-3 items-start transition-colors hover:border-zinc-700"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
                  <div className="flex-1 min-w-0">
                    <p className="mb-1 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
                      {b.verseKey}
                    </p>
                    <p className="text-sm italic text-zinc-500 line-clamp-2">
                      &ldquo;{b.translation}&rdquo;
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveBookmark(b.verseKey)}
                    aria-label={`Remove bookmark for ${b.verseKey}`}
                    className="flex-shrink-0 text-zinc-700 transition-colors hover:text-red-400 text-lg mt-0.5"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Saved reflections */}
      {userState.reflections.length > 0 && (
        <section>
          <p className="section-label mb-4">Saved Reflections</p>
          <ul className="space-y-3">
            {userState.reflections.map((r) => (
              <li
                key={`${r.verseKey}-${r.savedAt}`}
                className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  {r.verseKey}
                  <span className="text-zinc-700 font-normal normal-case tracking-normal">
                    ·{" "}
                    {new Date(r.savedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <blockquote className="border-l-2 border-emerald-500/40 pl-4 text-sm italic leading-relaxed text-zinc-400">
                  {r.reflection}
                </blockquote>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/page.tsx app/dashboard/DashboardClient.tsx
git commit -m "style: dark dashboard, stat grid, designed empty states, reflection list"
```

---

### Task 12: Read pages — Hero verse layout, skeleton, progress bar

**Files:**
- Modify: `app/read/page.tsx`
- Modify: `app/read/ReadClient.tsx`

- [ ] **Step 1: Replace read page.tsx**

```tsx
// app/read/page.tsx
import ReadClient from "./ReadClient";

export const metadata = {
  title: "Daily Read · Quran Coach",
  description: "Today's assigned verses, audio, and AI reflection.",
};

export default function ReadPage() {
  return (
    <div className="page-container-sm py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-50">Daily Read</h1>
        <p className="mt-1.5 text-sm text-zinc-500">Your assigned verses for today.</p>
      </div>
      <ReadClient />
    </div>
  );
}
```

- [ ] **Step 2: Replace ReadClient.tsx**

```tsx
// app/read/ReadClient.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Verse, LocalUserState } from "@/lib/types";
import { loadLocalUserState, addBookmark, addReflection, updateProgress } from "@/lib/storage";
import { computeTodayVerseRange } from "@/lib/quran";
import { fetchVerses } from "@/lib/quran";
import VerseCard from "@/components/VerseCard";
import AudioPlayer from "@/components/AudioPlayer";
import ReflectionBox from "@/components/ReflectionBox";

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; verses: Verse[] }
  | { status: "error"; message: string };

function VerseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* header */}
      <div className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-950/40 px-5 py-3">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-3 w-24" />
      </div>
      {/* arabic block */}
      <div className="px-8 py-10 text-right space-y-3">
        <div className="skeleton h-8 w-[90%] ml-auto" />
        <div className="skeleton h-8 w-[75%] ml-auto" />
        <div className="skeleton h-8 w-[55%] ml-auto" />
      </div>
      {/* translation */}
      <div className="px-6 py-5 space-y-2 border-t border-zinc-800/50">
        <div className="skeleton h-3.5 w-full" />
        <div className="skeleton h-3.5 w-[85%]" />
        <div className="skeleton h-3.5 w-[70%]" />
      </div>
    </div>
  );
}

export default function ReadClient() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const [userState, setUserState] = useState<LocalUserState>({
    goal: null,
    progress: null,
    bookmarks: [],
    reflections: [],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  const load = useCallback(async () => {
    setLoadState({ status: "loading" });
    const state = loadLocalUserState();
    setUserState(state);

    if (!state.goal) {
      setLoadState({
        status: "error",
        message: "No reading goal set. Go to Goals to create one.",
      });
      return;
    }

    try {
      const range = computeTodayVerseRange(state.goal, state.progress);
      const verses = await fetchVerses(range.chapterId, range.verseFrom, range.verseTo);
      setLoadState({ status: "ready", verses });
    } catch (err) {
      setLoadState({
        status: "error",
        message: err instanceof Error ? err.message : "Failed to load verses.",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleBookmark(verse: Verse) {
    const isAlreadyBookmarked = userState.bookmarks.some(
      (b) => b.verseKey === verse.verseKey
    );
    if (isAlreadyBookmarked) return;

    const updated = addBookmark({
      verseKey: verse.verseKey,
      arabicText: verse.arabicText,
      translation: verse.translation,
      savedAt: new Date().toISOString(),
    });
    setUserState((prev) => ({ ...prev, bookmarks: updated }));
  }

  function handleSaveReflection(verseKey: string, reflection: string) {
    const updated = addReflection({
      verseKey,
      reflection,
      savedAt: new Date().toISOString(),
    });
    setUserState((prev) => ({ ...prev, reflections: updated }));
  }

  function handleNextVerse(verses: Verse[]) {
    if (activeIndex < verses.length - 1) {
      setActiveIndex((i) => i + 1);
    } else {
      const lastVerse = verses[verses.length - 1];
      const newProgress = updateProgress(lastVerse.verseKey, verses.length);
      setUserState((prev) => ({ ...prev, progress: newProgress }));
    }
  }

  if (loadState.status === "idle" || loadState.status === "loading") {
    return (
      <div className="space-y-4">
        {/* Progress bar skeleton */}
        <div className="flex items-center gap-3">
          <div className="skeleton h-2.5 w-16 rounded" />
          <div className="flex-1 h-0.5 rounded-full bg-zinc-800" />
          <div className="skeleton h-2.5 w-12 rounded" />
        </div>
        <VerseCardSkeleton />
        {/* Button skeletons */}
        <div className="flex gap-3">
          <div className="skeleton h-12 flex-1 rounded-xl" />
        </div>
      </div>
    );
  }

  if (loadState.status === "error") {
    return (
      <div className="rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-sm text-red-400 space-y-3">
        <p>{loadState.message}</p>
        <button
          onClick={load}
          className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm"
        >
          Retry →
        </button>
      </div>
    );
  }

  const { verses } = loadState;
  const activeVerse = verses[activeIndex];
  const isComplete =
    userState.progress?.lastVerseKey === verses[verses.length - 1]?.verseKey;
  const progressPct = ((activeIndex + 1) / verses.length) * 100;

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-600">
          {activeIndex + 1} / {verses.length}
        </span>
        <div className="relative flex-1 h-0.5 rounded-full bg-zinc-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${progressPct}%`,
              boxShadow: "0 0 6px rgba(34,197,94,0.5)",
            }}
          />
        </div>
        <span className="text-xs text-zinc-600">{activeVerse.verseKey}</span>
      </div>

      {/* Verse nav dots */}
      {verses.length > 1 && (
        <div className="flex gap-1.5 justify-center">
          {verses.map((v, i) => (
            <button
              key={v.verseKey}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to verse ${v.verseKey}`}
              className={`rounded-full transition-all duration-200 ${
                i === activeIndex
                  ? "h-1.5 w-4 bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                  : "h-1.5 w-1.5 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>
      )}

      {/* Verse card */}
      <VerseCard
        verse={activeVerse}
        onBookmark={handleBookmark}
        isBookmarked={userState.bookmarks.some(
          (b) => b.verseKey === activeVerse.verseKey
        )}
      />

      {/* Audio */}
      {activeVerse.audioUrl && (
        <AudioPlayer
          audioUrl={activeVerse.audioUrl}
          verseKey={activeVerse.verseKey}
        />
      )}

      {/* Reflection */}
      <ReflectionBox verse={activeVerse} onSave={handleSaveReflection} />

      {/* Navigation */}
      <div className="flex gap-3 pt-1">
        {activeIndex > 0 && (
          <button
            onClick={() => setActiveIndex((i) => i - 1)}
            className="btn-ghost flex-1 py-3 text-sm font-medium"
          >
            ← Previous
          </button>
        )}
        <button
          onClick={() => handleNextVerse(verses)}
          disabled={isComplete}
          className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-150 ${
            isComplete
              ? "cursor-default border border-zinc-800 bg-zinc-900 text-zinc-600"
              : "btn-primary"
          }`}
        >
          {activeIndex < verses.length - 1
            ? "Next verse →"
            : isComplete
            ? "Session complete ✓"
            : "Complete session →"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/read/page.tsx app/read/ReadClient.tsx
git commit -m "style: dark read page, hero verse card, skeleton loader, pill nav dots, green progress bar"
```

---

### Task 13: Auth — Login page

**Files:**
- Modify: `app/auth/login/page.tsx`
- Modify: `app/auth/login/LoginForm.tsx`

- [ ] **Step 1: Replace login page.tsx**

```tsx
// app/auth/login/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in · Quran Coach",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-md space-y-4">
            <div className="skeleton h-10 w-32 mx-auto rounded-xl" />
            <div className="skeleton h-64 w-full rounded-2xl" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Replace LoginForm.tsx**

```tsx
// app/auth/login/LoginForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errFromUrl = searchParams.get("error");
  const nextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(errFromUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      const safeNext =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : "/";
      router.replace(safeNext);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-amber-900/40 bg-amber-950/30 p-6 text-sm text-amber-400">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 text-amber-500/70">
          Add{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            NEXT_PUBLIC_SUPABASE_URL
          </code>{" "}
          and{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            NEXT_PUBLIC_SUPABASE_ANON_KEY
          </code>{" "}
          to{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">
            .env.local
          </code>
          , then restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo + heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
          ☽
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Sign in to continue your journey.
        </p>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 60%)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {error && (
            <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-600">
        No account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Create one →
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/auth/login/page.tsx app/auth/login/LoginForm.tsx
git commit -m "style: dark login page with green icon, glassmorphic card, dark inputs"
```

---

### Task 14: Auth — Signup page

**Files:**
- Modify: `app/auth/signup/page.tsx`
- Modify: `app/auth/signup/SignupForm.tsx`

- [ ] **Step 1: Replace signup page.tsx**

```tsx
// app/auth/signup/page.tsx
import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create account · Quran Coach",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <SignupForm />
    </div>
  );
}
```

- [ ] **Step 2: Replace SignupForm.tsx**

```tsx
// app/auth/signup/SignupForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const AFTER_AUTH_PATH = "/onboarding";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setError("Supabase is not configured. Add keys to .env.local.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Type the same password twice.");
      return;
    }

    setLoading(true);
    try {
      const origin = window.location.origin;
      const supabase = createBrowserSupabaseClient();
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(AFTER_AUTH_PATH)}`,
        },
      });
      if (signError) {
        setError(signError.message);
        return;
      }
      if (data.session) {
        router.replace(AFTER_AUTH_PATH);
        router.refresh();
        return;
      }
      setMessage(
        "We sent a confirmation email. Open the link in any browser — you'll be taken to onboarding to set your reading goal. Check spam if you don't see it."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-amber-900/40 bg-amber-950/30 p-6 text-sm text-amber-400">
        <p className="font-semibold">Supabase not configured</p>
        <p className="mt-2 text-amber-500/70">
          Add Supabase URL and anon key to{" "}
          <code className="rounded bg-amber-900/30 px-1 text-amber-400">.env.local</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Logo + heading */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
          ☽
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-zinc-500">
          Next you&apos;ll set your daily goal and reading pace.
        </p>
      </div>

      {/* Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.05) 0%, transparent 60%)",
          }}
        />

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {error && (
            <p className="rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-400">
              {error}
            </p>
          )}
          {message && (
            <p className="rounded-xl border border-emerald-900/30 bg-emerald-950/40 px-3 py-2.5 text-sm text-emerald-400">
              {message}
            </p>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-zinc-500">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="At least 8 characters"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1.5 block text-xs font-medium text-zinc-500"
            >
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Same as password"
              aria-invalid={
                confirmPassword.length > 0 && password !== confirmPassword
              }
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <p className="mt-1.5 text-xs text-amber-500">
                Passwords must match.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2.5 text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Create account & continue"}
          </button>
        </form>
      </div>

      <details className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-4 py-3 text-xs text-zinc-600">
        <summary className="cursor-pointer font-medium text-zinc-500">
          Confirmation email / different browser?
        </summary>
        <p className="mt-2 leading-relaxed">
          If the link errors in another browser, open Supabase Dashboard →
          Authentication → Email templates → <strong className="text-zinc-400">Confirm signup</strong> and
          set the confirmation URL to include{" "}
          <code className="rounded bg-zinc-800 px-1 text-zinc-400">token_hash</code>. Example:{" "}
          <code className="break-all rounded bg-zinc-800 px-1 text-zinc-400">
            /auth/callback?token_hash=&#123;&#123; .TokenHash &#125;&#125;&amp;type=signup&amp;next=%2Fonboarding
          </code>
        </p>
      </details>

      <p className="text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Sign in →
        </Link>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/auth/signup/page.tsx app/auth/signup/SignupForm.tsx
git commit -m "style: dark signup page, dark inputs, green confirmation message"
```

---

### Task 15: Auth — Callback page

**Files:**
- Modify: `app/auth/callback/page.tsx`
- Modify: `app/auth/callback/AuthCallbackClient.tsx`

- [ ] **Step 1: Replace callback page.tsx**

```tsx
// app/auth/callback/page.tsx
import type { Metadata } from "next";
import AuthCallbackClient from "./AuthCallbackClient";

export const metadata: Metadata = {
  title: "Confirming… · Quran Coach",
};

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-start justify-center pt-24">
      <AuthCallbackClient />
    </div>
  );
}
```

- [ ] **Step 2: Replace AuthCallbackClient.tsx**

```tsx
// app/auth/callback/AuthCallbackClient.tsx
"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type VerifyOtpType =
  | "signup"
  | "email"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change";

const DEFAULT_NEXT = "/onboarding";

function isSafeRelativePath(path: string): path is `/${string}` {
  return path.startsWith("/") && !path.startsWith("//");
}

function normalizeNext(raw: string | null): `/${string}` {
  if (raw && isSafeRelativePath(raw)) return raw;
  return DEFAULT_NEXT;
}

function parseHashParams(hash: string): URLSearchParams {
  const normalized = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(normalized);
}

const OTP_TYPES: readonly VerifyOtpType[] = [
  "signup",
  "email",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
];

function parseOtpType(raw: string | null): VerifyOtpType | null {
  if (!raw) return null;
  return OTP_TYPES.includes(raw as VerifyOtpType) ? (raw as VerifyOtpType) : null;
}

function AuthCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState<string>("Confirming your account…");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const next = normalizeNext(searchParams.get("next"));

    async function complete() {
      const supabase = createBrowserSupabaseClient();

      const token_hash = searchParams.get("token_hash");
      const type = parseOtpType(searchParams.get("type"));
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type });
        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setMessage(
            "This confirmation link uses a one-time code that only works in the same browser and session where you signed up. Open the link in that browser, or ask for a new confirmation email and update your Supabase "Confirm signup" template to use token_hash."
          );
          return;
        }
        router.replace(next);
        router.refresh();
        return;
      }

      if (typeof window !== "undefined" && window.location.hash) {
        const hp = parseHashParams(window.location.hash);
        const access_token = hp.get("access_token");
        const refresh_token = hp.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`
          );
          router.replace(next);
          router.refresh();
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        router.replace("/");
        router.refresh();
        return;
      }

      setStatus("error");
      setMessage(
        "Invalid or expired link. Request a new confirmation email from the sign-in page, or sign up again."
      );
    }

    void complete();
  }, [router, searchParams]);

  return (
    <div className="mx-auto w-full max-w-md px-4 text-center">
      {status === "working" ? (
        <div className="space-y-5">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl shadow-[0_0_0_1px_rgba(34,197,94,0.25),0_8px_24px_rgba(34,197,94,0.2)]">
            ☽
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-300">{message}</p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-red-900/40 bg-red-950/30 p-6 text-left">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
          <p className="mb-2 font-semibold text-red-400">Could not confirm</p>
          <p className="mb-4 text-sm text-red-500/80">{message}</p>
          <button
            type="button"
            onClick={() => router.replace("/auth/login")}
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackClient() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-md px-4 text-center">
          <div className="skeleton mx-auto mb-4 h-12 w-12 rounded-2xl" />
          <div className="skeleton mx-auto h-4 w-40 rounded" />
        </div>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/auth/callback/page.tsx app/auth/callback/AuthCallbackClient.tsx
git commit -m "style: dark auth callback, branded loading state, dark error card"
```

---

### Task 16: Final — Verify build and visual QA

- [ ] **Step 1: Run type check**

```bash
cd "/Users/jabirouldmohamed/Quran Hackathon App"
npm run typecheck
```

Expected: no errors. Fix any TypeScript complaints in the flagged files — only type annotation or JSX attribute fixes, no logic changes.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: no errors. Fix any unused import warnings.

- [ ] **Step 3: Start dev server and do visual QA**

```bash
npm run dev
```

Open http://localhost:3000 and check each route:
- `/auth/login` — dark card, green icon, dark inputs
- `/auth/signup` — same pattern, confirm password validation styling
- `/auth/callback` — loading state with bounce dots
- `/onboarding` — 3-step wizard, dark goal cards
- `/dashboard` — stat cards, empty states, bookmarks list
- `/read` — skeleton loader, large Arabic verse, audio player, reflection box
- Navbar on all pages — frosted glass, green logo

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "style: complete dark UI redesign — Linear/Vercel aesthetic with green accent"
```
