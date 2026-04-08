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
        Reset local data
      </h2>
      <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
        Remove your goal, reading progress, bookmarks, and reflections from this
        browser. Nothing is stored on a server. This cannot be undone.
      </p>
      <div className="mt-4">
        <label
          htmlFor="reset-confirm"
          className="mb-1.5 block text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Type{" "}
          <code
            className="rounded px-1 font-mono"
            style={{ background: "rgba(0,0,0,0.3)", color: "#f87171" }}
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
        className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          border: "1px solid rgba(153,27,27,0.5)",
          background: "rgba(80,10,10,0.4)",
          color: "#fca5a5",
        }}
      >
        {loading ? "Clearing…" : "Clear all data on this device"}
      </button>
    </div>
  );
}
