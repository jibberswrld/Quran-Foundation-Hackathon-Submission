"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAllCoachLocalStorage } from "@/lib/storage";

export default function ClearLocalDataSection() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const canClear = confirmText === "RESET";

  function handleClear() {
    if (!canClear) return;
    setLoading(true);
    clearAllCoachLocalStorage();
    router.replace("/onboarding");
    router.refresh();
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{
        border: "1px solid var(--error-border)",
        background: "var(--error-bg)",
      }}
    >
      <h2
        className="text-sm font-medium"
        style={{ color: "var(--error)" }}
      >
        Reset local data
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Remove your goal, reading progress, bookmarks, and reflections from
        this browser. This cannot be undone.
      </p>
      <div className="mt-4">
        <label
          htmlFor="reset-confirm"
          className="mb-1.5 block text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Type{" "}
          <code
            className="rounded px-1 py-0.5 font-mono text-xs"
            style={{
              background: "rgba(255,255,255,0.06)",
              color: "var(--error)",
            }}
          >
            RESET
          </code>{" "}
          to confirm
        </label>
        <input
          id="reset-confirm"
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="input-field"
          placeholder="RESET"
          autoComplete="off"
        />
      </div>
      <button
        type="button"
        disabled={!canClear || loading}
        onClick={handleClear}
        className="mt-4 w-full rounded-lg py-2 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30"
        style={{
          border: "1px solid var(--error-border)",
          background: "rgba(239, 68, 68, 0.12)",
          color: "var(--error)",
        }}
      >
        {loading ? "Clearing..." : "Clear all data"}
      </button>
    </div>
  );
}
