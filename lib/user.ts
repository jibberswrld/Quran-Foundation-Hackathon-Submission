/**
 * Quran Foundation User API helpers (hybrid local-first).
 *
 * Each function attempts to sync with the remote User API using
 * QURAN_USER_TOKEN. On failure it logs the error and returns a local fallback
 * so the UI always remains usable even without a valid token.
 *
 * These helpers are designed to be called from client components or server
 * actions.
 */

import type {
  UserGoal,
  QuranUserStreak,
  QuranUserBookmark,
  QuranUserGoal,
  QuranUserPost,
  Bookmark,
  SavedReflection,
} from "./types";

// ─── Constants ────────────────────────────────────────────────────────────────

const USER_API_BASE = "https://api.quran.com/api/v4";

// ─── Auth header helper ───────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token =
    typeof process !== "undefined"
      ? process.env.QURAN_USER_TOKEN
      : undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function hasUserToken(): boolean {
  return Boolean(
    typeof process !== "undefined" && process.env.QURAN_USER_TOKEN
  );
}

// ─── User API fetch helper ────────────────────────────────────────────────────

async function userApiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${USER_API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options?.headers as Record<string, string> | undefined),
    },
  });

  if (!res.ok) {
    throw new Error(
      `User API error ${res.status}: ${res.statusText} (${path})`
    );
  }

  return res.json() as Promise<T>;
}

// ─── Streak ───────────────────────────────────────────────────────────────────

/**
 * Fetch the user's current streak from the remote API.
 * Returns null if the token is missing or the request fails.
 */
export async function fetchRemoteStreak(): Promise<QuranUserStreak | null> {
  if (!hasUserToken()) return null;
  try {
    const data = await userApiFetch<{ streak: QuranUserStreak }>(
      "/streaks/current"
    );
    return data.streak;
  } catch {
    return null;
  }
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

/**
 * Fetch all bookmarks from the remote API.
 * Returns an empty array if unavailable.
 */
export async function fetchRemoteBookmarks(): Promise<QuranUserBookmark[]> {
  if (!hasUserToken()) return [];
  try {
    const data = await userApiFetch<{ bookmarks: QuranUserBookmark[] }>(
      "/bookmarks"
    );
    return data.bookmarks ?? [];
  } catch {
    return [];
  }
}

/**
 * Sync a local bookmark to the remote API.
 * Silently ignores errors — local state is always the source of truth.
 */
export async function syncBookmarkToApi(
  bookmark: Bookmark
): Promise<void> {
  if (!hasUserToken()) return;
  try {
    await userApiFetch("/bookmarks", {
      method: "POST",
      body: JSON.stringify({ verse_key: bookmark.verseKey }),
    });
  } catch {
    // Local-first: failure is non-fatal
  }
}

/**
 * Delete a bookmark from the remote API.
 */
export async function deleteRemoteBookmark(verseKey: string): Promise<void> {
  if (!hasUserToken()) return;
  try {
    // The User API uses verse_key as the identifier for DELETE
    await userApiFetch(`/bookmarks/${encodeURIComponent(verseKey)}`, {
      method: "DELETE",
    });
  } catch {
    // Non-fatal
  }
}

// ─── Goals ────────────────────────────────────────────────────────────────────

/**
 * Sync the user's onboarding goal to the remote Activity & Goals API.
 * Returns the created remote goal or null on failure.
 */
export async function syncGoalToApi(
  goal: UserGoal
): Promise<QuranUserGoal | null> {
  if (!hasUserToken()) return null;
  try {
    const data = await userApiFetch<{ goal: QuranUserGoal }>("/goals", {
      method: "POST",
      body: JSON.stringify({
        goal_type: goal.type,
        goal_value: goal.value,
      }),
    });
    return data.goal;
  } catch {
    return null;
  }
}

/**
 * Fetch the user's current goals from the remote API.
 */
export async function fetchRemoteGoals(): Promise<QuranUserGoal[]> {
  if (!hasUserToken()) return [];
  try {
    const data = await userApiFetch<{ goals: QuranUserGoal[] }>("/goals");
    return data.goals ?? [];
  } catch {
    return [];
  }
}

// ─── Posts (saved reflections) ────────────────────────────────────────────────

/**
 * Save a reflection as a post on Quran Reflect.
 * Returns the created post id or null if unavailable.
 */
export async function syncReflectionToApi(
  reflection: SavedReflection
): Promise<number | null> {
  if (!hasUserToken()) return null;
  try {
    const data = await userApiFetch<{ post: QuranUserPost }>(
      "/quran-reflect/v1/posts",
      {
        method: "POST",
        body: JSON.stringify({
          verse_key: reflection.verseKey,
          body: reflection.reflection,
        }),
      }
    );
    return data.post.id;
  } catch {
    return null;
  }
}

/**
 * Fetch the user's saved posts from Quran Reflect.
 */
export async function fetchRemotePosts(): Promise<QuranUserPost[]> {
  if (!hasUserToken()) return [];
  try {
    const data = await userApiFetch<{ posts: QuranUserPost[] }>(
      "/quran-reflect/v1/posts?scope=user"
    );
    return data.posts ?? [];
  } catch {
    return [];
  }
}

// ─── Reading activity (streak update) ────────────────────────────────────────

/**
 * Record a reading activity event so the remote streak counter advances.
 * Accepts a verse key representing the last-read verse of the session.
 */
export async function recordReadingActivity(verseKey: string): Promise<void> {
  if (!hasUserToken()) return;
  try {
    await userApiFetch("/activity_log", {
      method: "POST",
      body: JSON.stringify({
        verse_key: verseKey,
        source: "quran_coach",
      }),
    });
  } catch {
    // Non-fatal
  }
}
