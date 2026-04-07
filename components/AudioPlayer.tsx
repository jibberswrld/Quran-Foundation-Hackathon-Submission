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
    // Reset when the verse changes
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
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-5 py-4">
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
          className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {playState === "loading" ? (
            <span className="animate-spin text-sm">⟳</span>
          ) : playState === "playing" ? (
            <span className="text-sm">⏸</span>
          ) : (
            <span className="text-sm pl-0.5">▶</span>
          )}
        </button>

        {/* Scrubber */}
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
            className="w-full h-1.5 appearance-none bg-stone-200 rounded-full cursor-pointer accent-emerald-600 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #059669 ${progress}%, #e7e5e4 ${progress}%)`,
            }}
          />
          <div className="flex justify-between text-xs text-stone-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {playState === "error" && (
        <p className="mt-2 text-xs text-red-500">
          Failed to load audio. Please check your connection and try again.
        </p>
      )}
    </div>
  );
}
