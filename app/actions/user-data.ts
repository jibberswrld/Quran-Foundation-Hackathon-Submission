"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { UserGoal } from "@/lib/types";

/**
 * Upserts the current user's reading goal into Supabase (RLS: own row only).
 */
export async function upsertUserGoalAction(goal: UserGoal): Promise<
  | { ok: true }
  | { ok: false; reason: "not_configured" | "not_authenticated" | "db"; message?: string }
> {
  if (!isSupabaseConfigured()) {
    return { ok: false, reason: "not_configured" };
  }

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, reason: "not_authenticated" };
    }

    const { error } = await supabase.from("user_goals").upsert(
      {
        user_id: user.id,
        goal_type: goal.type,
        goal_value: goal.value,
        started_at: goal.startedAt,
      },
      { onConflict: "user_id" }
    );

    if (error) {
      return { ok: false, reason: "db", message: error.message };
    }
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, reason: "db", message };
  }
}
