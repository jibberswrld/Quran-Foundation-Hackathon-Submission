/**
 * Client-safe localStorage helpers.
 *
 * All functions guard against SSR by checking typeof window.
 * They must only be called from client components or useEffect hooks.
 */

import type {
  LocalUserState,
  UserGoal,
  ReadingProgress,
  Bookmark,
  SavedReflection,
} from "./types";

// ─── Storage keys ─────────────────────────────────────────────────────────────

const KEYS = {
  GOAL: "qc:goal",
  PROGRESS: "qc:progress",
  BOOKMARKS: "qc:bookmarks",
  REFLECTIONS: "qc:reflections",
} as const;

// ─── Low-level helpers ────────────────────────────────────────────────────────

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently ignore storage quota errors
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Silently ignore
  }
}

// ─── Full state loader ────────────────────────────────────────────────────────

export function loadLocalUserState(): LocalUserState {
  return {
    goal: getItem<UserGoal>(KEYS.GOAL),
    progress: getItem<ReadingProgress>(KEYS.PROGRESS),
    bookmarks: getItem<Bookmark[]>(KEYS.BOOKMARKS) ?? [],
    reflections: getItem<SavedReflection[]>(KEYS.REFLECTIONS) ?? [],
  };
}

// ─── Goal ─────────────────────────────────────────────────────────────────────

export function saveGoal(goal: UserGoal): void {
  setItem(KEYS.GOAL, goal);
}

export function loadGoal(): UserGoal | null {
  return getItem<UserGoal>(KEYS.GOAL);
}

export function clearGoal(): void {
  removeItem(KEYS.GOAL);
}

// ─── Reading progress ─────────────────────────────────────────────────────────

export function loadProgress(): ReadingProgress | null {
  return getItem<ReadingProgress>(KEYS.PROGRESS);
}

/**
 * Record that a set of verses was completed.
 * Updates the streak if today's date is different from the last streak date.
 * Returns the new ReadingProgress.
 */
export function updateProgress(
  lastVerseKey: string,
  versesReadThisSession: number
): ReadingProgress {
  const existing = loadProgress();
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

  let streakDays = existing?.streakDays ?? 0;
  const lastStreakDate = existing?.lastStreakDate ?? null;

  if (lastStreakDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastStreakDate === yesterdayStr) {
      // Continued streak
      streakDays += 1;
    } else if (lastStreakDate === null) {
      // First ever read
      streakDays = 1;
    } else {
      // Gap — streak resets
      streakDays = 1;
    }
  }

  const updated: ReadingProgress = {
    lastVerseKey,
    lastReadAt: new Date().toISOString(),
    totalVersesRead: (existing?.totalVersesRead ?? 0) + versesReadThisSession,
    streakDays,
    lastStreakDate: today,
  };

  setItem(KEYS.PROGRESS, updated);
  return updated;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export function loadBookmarks(): Bookmark[] {
  return getItem<Bookmark[]>(KEYS.BOOKMARKS) ?? [];
}

/**
 * Add a bookmark. No-ops if the verse is already bookmarked.
 * Returns the updated bookmarks array.
 */
export function addBookmark(bookmark: Bookmark): Bookmark[] {
  const current = loadBookmarks();
  if (current.some((b) => b.verseKey === bookmark.verseKey)) {
    return current;
  }
  const updated = [bookmark, ...current];
  setItem(KEYS.BOOKMARKS, updated);
  return updated;
}

/**
 * Remove a bookmark by verse key.
 * Returns the updated bookmarks array.
 */
export function removeBookmark(verseKey: string): Bookmark[] {
  const updated = loadBookmarks().filter((b) => b.verseKey !== verseKey);
  setItem(KEYS.BOOKMARKS, updated);
  return updated;
}

// ─── Reflections ──────────────────────────────────────────────────────────────

export function loadReflections(): SavedReflection[] {
  return getItem<SavedReflection[]>(KEYS.REFLECTIONS) ?? [];
}

/**
 * Save a reflection. Replaces any existing reflection for the same verse key.
 * Returns the updated reflections array.
 */
export function addReflection(reflection: SavedReflection): SavedReflection[] {
  const current = loadReflections().filter(
    (r) => r.verseKey !== reflection.verseKey
  );
  const updated = [reflection, ...current];
  setItem(KEYS.REFLECTIONS, updated);
  return updated;
}

/**
 * Update a saved reflection with a remote post ID after syncing.
 */
export function setReflectionRemoteId(
  verseKey: string,
  remotePostId: number
): void {
  const updated = loadReflections().map((r) =>
    r.verseKey === verseKey ? { ...r, remotePostId } : r
  );
  setItem(KEYS.REFLECTIONS, updated);
}

/** Clear all Quran Coach local data (e.g. after account deletion or sign-out cleanup). */
export function clearAllCoachLocalStorage(): void {
  removeItem(KEYS.GOAL);
  removeItem(KEYS.PROGRESS);
  removeItem(KEYS.BOOKMARKS);
  removeItem(KEYS.REFLECTIONS);

  if (typeof window === "undefined") return;
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith("qc:")) toRemove.push(key);
    }
    toRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Silently ignore
  }
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < window.sessionStorage.length; i++) {
      const key = window.sessionStorage.key(i);
      if (key && key.startsWith("qc:")) toRemove.push(key);
    }
    toRemove.forEach((k) => window.sessionStorage.removeItem(k));
  } catch {
    // Silently ignore
  }
}
