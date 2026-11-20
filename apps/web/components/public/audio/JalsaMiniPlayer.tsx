"use client";

import React from "react";
import { Play, Pause, X, Music, Radio, Tv, ExternalLink } from "lucide-react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { JALSA_JINGLES_2026, type JingleLanguageId } from "@/lib/jingles-2026";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function JalsaMiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playTrack,
    isMiniPlayerActive,
    dismissMiniPlayer,
  } = useAudioPlayer();

  if (!isMiniPlayerActive) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const scrollToMainPlayer = () => {
    if (typeof window !== "undefined") {
      const el = document.getElementById("sound-of-jalsa");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <aside
      aria-label="Sound of Jalsa Mini Player"
      className="fixed z-30 transition-all duration-300
        bottom-3 left-3 right-3
        sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md sm:w-full
        animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="relative rounded-2xl bg-[#002626]/95 backdrop-blur-md border border-[#c5a049]/50 shadow-2xl overflow-hidden p-3 sm:p-3.5 text-white">
        {/* Thin Gold Progress Line on Top Edge */}
        <div className="absolute top-0 inset-x-0 h-[2.5px] bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#c5a049] to-[#b0e892] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Track Info (clickable to scroll to main player) */}
          <div
            onClick={scrollToMainPlayer}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
            title="Click to view full player"
          >
            <div className="w-9 h-9 rounded-xl bg-[#003333] border border-[#c5a049]/40 flex items-center justify-center shrink-0 text-[#b0e892]">
              <Music className={`w-4 h-4 ${isPlaying ? "animate-pulse" : ""}`} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#b0e892]">
                  {currentTrack.label}
                </span>
                <span className="text-[9px] text-[#c5a049]">• Jalsa 2026</span>
              </div>
              <p className="text-xs font-bold text-white truncate group-hover:text-[#b0e892] transition-colors">
                {currentTrack.subtitle}
              </p>
            </div>
          </div>

          {/* Language Switcher Mini Pills & MTA Live Toggle */}
          <div className="hidden xs:flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10">
            {JALSA_JINGLES_2026.tracks.map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => playTrack(track.id, true)}
                className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition ${
                  currentTrack.id === track.id
                    ? "bg-[#027c68] text-white shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
                title={`Switch to ${track.label}`}
              >
                {track.id.toUpperCase()}
              </button>
            ))}

            <a
              href="https://www.mta.tv/live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-[10px] font-bold shadow-xs transition active:scale-95"
              title="Watch MTA International Live Broadcast Stream"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>MTA LIVE</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>

          {/* Time & Play/Pause Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[11px] text-[#b0e892] hidden sm:inline">
              {formatTime(currentTime)}
            </span>

            {/* Play/Pause Button (min 44px tap target) */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause audio" : "Play audio"}
              className="w-11 h-11 rounded-full bg-[#c5a049] hover:bg-[#d8b55e] text-[#002626] flex items-center justify-center shadow-md transition active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Dismiss / Close Button */}
            <button
              type="button"
              onClick={dismissMiniPlayer}
              aria-label="Close mini player"
              className="p-1.5 text-white/50 hover:text-white rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center"
              title="Close mini player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
