"use client";

import { useRef, useState, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  verseKey: string;
}

type PlayState = "idle" | "loading" | "playing" | "paused" | "error";

export default function AudioPlayer({ audioUrl, verseKey }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setPlayState("idle");
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playState === "playing") {
      audio.pause();
      setPlayState("paused");
    } else {
      setPlayState("loading");
      audio.play().catch(() => setPlayState("error"));
    }
  }

  function handleTimeUpdate() {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (audioRef.current) setDuration(audioRef.current.duration);
  }

  function handlePlaying() {
    setPlayState("playing");
  }

  function handleEnded() {
    setPlayState("idle");
    setCurrentTime(0);
  }

  function handleError() {
    setPlayState("error");
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const t = Number(e.target.value);
    audio.currentTime = t;
    setCurrentTime(t);
  }

  function formatTime(s: number) {
    if (!isFinite(s)) return "0:00";
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className="overflow-hidden rounded-xl px-5 py-4 animate-fade-up anim-delay-2"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="section-label mb-3">Recitation</p>

      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlaying={handlePlaying}
        onEnded={handleEnded}
        onError={handleError}
        preload="none"
        aria-label={`Audio recitation for verse ${verseKey}`}
      />

      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          disabled={playState === "loading" || playState === "error"}
          aria-label={
            playState === "playing" ? "Pause recitation" : "Play recitation"
          }
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "var(--accent)",
            color: "var(--accent-fg)",
          }}
        >
          {playState === "loading" ? (
            <svg
              className="h-4 w-4"
              style={{ animation: "spin 1s linear infinite" }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : playState === "playing" ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
            >
              <rect x="2" y="1" width="3.5" height="12" rx="1" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="currentColor"
            >
              <path d="M3.5 2.2l9.5 4.8-9.5 4.8V2.2z" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={duration === 0}
            aria-label="Seek"
            className="w-full mb-1.5 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, var(--text) ${progress}%, var(--border) ${progress}%)`,
            }}
          />
          <div
            className="flex justify-between text-xs tabular-nums"
            style={{ color: "var(--text-dim)" }}
          >
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {playState === "error" && (
        <p className="mt-3 text-xs" style={{ color: "var(--error)" }}>
          Failed to load audio. Check your connection and try again.
        </p>
      )}
    </div>
  );
}
