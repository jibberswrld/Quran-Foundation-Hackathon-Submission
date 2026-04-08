"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { clearAllCoachLocalStorage } from "@/lib/storage";

export default function DeleteAccountSection() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText === "DELETE";

  async function handleDelete() {
    if (!canDelete) return;
    setError(null);
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: rpcError } = await supabase.rpc("delete_own_account");
      if (rpcError) {
        setError(
          rpcError.message.includes("function") || rpcError.code === "PGRST202"
            ? "Account deletion is not set up yet. Run the SQL migration `20260407140000_delete_own_account_rpc.sql` in the Supabase SQL Editor."
            : rpcError.message
        );
        setLoading(false);
        return;
      }
      try {
        await supabase.auth.signOut();
      } catch {
        // Session may already be gone after auth user row is removed
      }
      clearAllCoachLocalStorage();
      router.replace("/auth/signup");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/30 bg-red-950/20 p-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <h2 className="text-lg font-semibold text-red-400">Delete account</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Permanently delete your Quran Coach login and synced data (goal, bookmarks, reflections
        linked to your account). This cannot be undone. You stay in control: only you can run
        this while signed in.
      </p>
      <div className="mt-4">
        <label htmlFor="delete-confirm" className="mb-1.5 block text-xs font-medium text-zinc-500">
          Type <span className="font-mono text-red-400">DELETE</span> to confirm
        </label>
        <input
          id="delete-confirm"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="input-field"
          placeholder="DELETE"
          autoComplete="off"
        />
      </div>
      {error && (
        <p className="mt-3 rounded-xl border border-red-900/40 bg-red-950/40 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!canDelete || loading}
        onClick={() => void handleDelete()}
        className="mt-4 w-full rounded-xl border border-red-800/50 bg-red-950/50 py-2.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-950/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Deleting…" : "Delete my account permanently"}
      </button>
    </div>
  );
}
