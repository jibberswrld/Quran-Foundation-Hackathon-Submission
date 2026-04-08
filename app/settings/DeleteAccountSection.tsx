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
    <div
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        border: "1px solid var(--red-border)",
        background: "rgba(60,10,10,0.2)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(248,113,113,0.3), transparent)",
        }}
      />
      <h2 className="text-base font-semibold" style={{ color: "#f87171" }}>
        Delete account
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Permanently delete your Quran Coach login and synced data (goal, bookmarks,
        reflections linked to your account). This cannot be undone. You stay in
        control: only you can run this while signed in.
      </p>
      <div className="mt-4">
        <label
          htmlFor="delete-confirm"
          className="mb-1.5 block text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Type{" "}
          <code
            className="rounded px-1 font-mono"
            style={{ background: "rgba(0,0,0,0.3)", color: "#f87171" }}
          >
            DELETE
          </code>{" "}
          to confirm
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
        <p
          className="mt-3 rounded-xl border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--red-border)",
            background: "var(--red-bg)",
            color: "var(--red-text)",
          }}
        >
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!canDelete || loading}
        onClick={() => void handleDelete()}
        className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          border: "1px solid rgba(153,27,27,0.5)",
          background: "rgba(80,10,10,0.4)",
          color: "#fca5a5",
        }}
      >
        {loading ? "Deleting…" : "Delete my account permanently"}
      </button>
    </div>
  );
}
