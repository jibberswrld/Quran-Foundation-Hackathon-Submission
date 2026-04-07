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
    <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

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
        {/* Play / Pause button */}
        <button
          onClick={togglePlay}
          disabled={playState === "loading" || playState === "error"}
          aria-label={playState === "playing" ? "Pause recitation" : "Play recitation"}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-emerald-950 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 shadow-[0_0_0_1px_rgba(34,197,94,0.3),0_4px_12px_rgba(34,197,94,0.2)]"
        >
          {playState === "loading" ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : playState === "playing" ? (
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

        {/* Scrubber */}
        <div className="flex-1 min-w-0">
          <div className="relative mb-1.5">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={duration === 0}
              aria-label="Seek"
              className="w-full h-1 cursor-pointer appearance-none rounded-full bg-zinc-700 disabled:cursor-not-allowed [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
              style={{
                background: `linear-gradient(to right, #10b981 ${progress}%, #3f3f46 ${progress}%)`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {playState === "error" && (
        <p className="mt-3 text-xs text-red-400">
          Failed to load audio. Please check your connection and try again.
        </p>
      )}
    </div>
  );
}
