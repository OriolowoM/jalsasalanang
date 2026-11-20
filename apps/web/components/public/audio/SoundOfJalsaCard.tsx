"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Radio,
  Archive,
  ExternalLink,
  Check,
} from "lucide-react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import {
  JALSA_JINGLES_2026,
  type JingleLanguageId,
} from "@/lib/jingles-2026";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function SoundOfJalsaCard() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    playTrack,
    togglePlay,
    seek,
    toggleMute,
    setMainPlayerInView,
  } = useAudioPlayer();

  const [showLyrics, setShowLyrics] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);

  // Monitor visibility of the main card to inform persistent mini-player
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMainPlayerInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [setMainPlayerInView]);

  // Handle URL hash navigation on mount and hash changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToIfMatched = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#jingle-")) {
        const lang = hash.replace("#jingle-", "") as JingleLanguageId;
        if (["en", "yo", "ha", "ar"].includes(lang)) {
          playTrack(lang, false);
          cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    scrollToIfMatched();
    window.addEventListener("hashchange", scrollToIfMatched);
    return () => window.removeEventListener("hashchange", scrollToIfMatched);
  }, [playTrack]);

  // Static waveform heights for aesthetic stability (40 bars)
  const barHeights = useMemo(() => {
    return [
      28, 42, 60, 48, 75, 90, 65, 80, 100, 70, 85, 95, 60, 40, 75, 88, 92, 70,
      55, 80, 100, 85, 65, 90, 75, 45, 60, 85, 95, 78, 50, 65, 80, 90, 70, 55,
      40, 60, 45, 30,
    ];
  }, []);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Waveform click to seek
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    const targetSeconds = (duration || 180) * ratio;
    seek(targetSeconds);
  };

  // WhatsApp share link builder
  const whatsappShareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const siteUrl = "https://jalsasalana.ng";
    const shareMessage =
      `🎵 *Sound of Jalsa 2026 — ${currentTrack.label} Convention Jingle*\n\n` +
      `Official anthem for the *72nd Jalsa Salana Nigeria* (18th–20th Dec 2026 at Jamia Ahmadiyya Ilaro).\n\n` +
      `📜 *Theme:* “${JALSA_JINGLES_2026.theme}”\n\n` +
      `Listen & download: ${siteUrl}/${currentTrack.hash}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  }, [currentTrack]);

  const handleCopyDirectLink = () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${window.location.pathname}${currentTrack.hash}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section
      id="sound-of-jalsa"
      ref={cardRef}
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      {/* Decorative ambient backdrop */}
      <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-80 bg-gradient-to-r from-teal-900/30 via-lime-900/10 to-teal-950/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Emerald & Gold Card */}
      <div className="relative rounded-3xl bg-[#003333] border-2 border-[#c5a049]/40 text-white shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Subtle Islamic Geometry Watermark */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#c5a049]/5 pointer-events-none blur-2xl" />

        {/* Top Header Badge & Live Ticker */}
        <div className="p-6 sm:p-8 border-b border-[#024542]/80 bg-gradient-to-r from-[#002828] via-[#003333] to-[#012f2f]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#024542] border border-[#c5a049]/40 text-xs font-semibold uppercase tracking-widest text-[#b0e892]">
                <Radio className="w-3.5 h-3.5 text-[#c5a049] animate-pulse" />
                <span>Sound of Jalsa 2026 · Official Audio Experience</span>
              </div>
              <h2 className="mt-3 font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                72nd Jalsa Salana Multi-Language Jingles
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#c8ded6]">
                Four languages. One united message of peace, justice, and spiritual revival.
              </p>
            </div>

            {/* Quick Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs text-[#dcebe4] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#b0e892]" />
                <span>72nd Milestone</span>
              </span>
            </div>
          </div>

          {/* 4 Tactile Language Tabs + MTA Live Stream */}
          <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3" role="tablist">
            {JALSA_JINGLES_2026.tracks.map((track) => {
              const isActive = currentTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => playTrack(track.id, isPlaying)}
                  className={`group relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 min-h-[44px] ${
                    isActive
                      ? "bg-[#027c68] text-white shadow-glow-teal border border-[#b0e892]/60 ring-2 ring-[#b0e892]/30"
                      : "bg-[#012828] text-[#c0dad0] hover:text-white hover:bg-[#023b3b] border border-white/10"
                  }`}
                >
                  <span
                    className={
                      track.dir === "rtl"
                        ? "font-arabic text-base leading-none"
                        : "font-sans"
                    }
                  >
                    {track.label}
                  </span>
                  <span className="text-[10px] opacity-75 font-normal hidden xs:inline">
                    ({track.nativeLabel})
                  </span>

                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#b0e892] animate-ping ml-1" />
                  )}
                </button>
              );
            })}

            {/* MTA Live Video & Radio Link */}
            <a
              href="https://www.mta.tv/live"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-rose-600/90 hover:bg-rose-600 text-white shadow-md border border-rose-400/40 transition-all duration-300 min-h-[44px] active:scale-95 group"
              title="Tune in to MTA International worldwide live broadcast & Huzur's Sermon"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>🔴 MTA Live Broadcast</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Convention Live Audio/Video Broadcast Strip */}
          <div className="mt-4 p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#b0e892]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span className="font-bold text-white">MTA Live Audio &amp; Video Relay:</span>
              <span className="text-white/80 line-clamp-1">
                Live international broadcast of Huzur&apos;s Friday Sermon, MTA Africa feeds &amp; Nigeria proceedings.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://www.mta.tv/live"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#003333] hover:bg-[#b0e892] font-bold text-xs transition-colors shadow-xs"
              >
                <span>Watch on MTA.tv</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Central Audio Stage & Interactive Scrubber */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Current Playing Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#b0e892]">
                  Now Playing: {currentTrack.label} Edition
                </span>
                {currentTrack.badge && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#c5a049]/20 text-[#e6c97a] border border-[#c5a049]/40">
                    {currentTrack.badge}
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">
                {currentTrack.subtitle}
              </h3>
            </div>

            {/* Time Display */}
            <div className="font-mono text-sm sm:text-base font-bold text-[#b0e892] self-start sm:self-auto bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
              {formatTime(currentTime)} / {formatTime(duration || 180)}
            </div>
          </div>

          {/* Interactive Gold Waveform Scrubber */}
          <div className="space-y-2">
            <div
              ref={waveformRef}
              onClick={handleWaveformClick}
              className="relative h-16 sm:h-20 bg-[#002626] rounded-2xl p-3 flex items-end justify-between gap-1 sm:gap-1.5 cursor-pointer border border-[#c5a049]/30 hover:border-[#c5a049] transition shadow-inner group"
              title="Click or drag to seek"
            >
              {/* Progress Bar Indicator Fill */}
              <div
                className="absolute inset-y-0 left-0 bg-[#027c68]/15 rounded-2xl pointer-events-none transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />

              {/* 40 Waveform Bars */}
              {barHeights.map((h, index) => {
                const barRatio = (index / barHeights.length) * 100;
                const isPlayed = barRatio <= progressPercent;
                const isCurrent =
                  Math.abs(barRatio - progressPercent) < 100 / barHeights.length;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col justify-end items-center h-full relative z-10"
                  >
                    <div
                      className={`w-full rounded-full transition-all duration-150 ${
                        isPlayed
                          ? "bg-gradient-to-t from-[#c5a049] to-[#b0e892]"
                          : "bg-white/20 group-hover:bg-white/30"
                      } ${
                        isPlaying && isCurrent
                          ? "animate-pulse scale-y-110 shadow-glow-gold"
                          : ""
                      }`}
                      style={{
                        height: isPlaying
                          ? `${Math.max(15, (h * (0.8 + (index % 3) * 0.15)))}%`
                          : `${h}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Seeking helper caption */}
            <div className="flex items-center justify-between text-[11px] text-[#a0c5b8] px-1">
              <span>Interactive waveform — tap anywhere to seek</span>
              <span className="font-mono text-[#b0e892]">{Math.round(progressPercent)}%</span>
            </div>
          </div>

          {/* Player Main Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Primary Play/Pause Button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause jingle" : "Play jingle"}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#c5a049] hover:bg-[#d8b55e] text-[#002626] flex items-center justify-center font-bold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ring-4 ring-[#c5a049]/30"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                )}
              </button>

              {/* Mute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-red-300" />
                ) : (
                  <Volume2 className="w-5 h-5 text-[#b0e892]" />
                )}
              </button>
            </div>

            {/* Action Row: Download MP3, Share, Status Video, Lyrics */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {/* Download MP3 */}
              <a
                href={currentTrack.audioUrl}
                download={currentTrack.downloadFilename}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/15 min-h-[44px]"
                title={`Download ${currentTrack.label} MP3`}
              >
                <Download className="w-4 h-4 text-[#b0e892]" />
                <span>Download MP3</span>
              </a>

              {/* Share on WhatsApp */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-white text-xs font-bold transition border border-[#25D366]/40 min-h-[44px]"
                title="Share on WhatsApp"
              >
                <Share2 className="w-4 h-4 text-[#25D366]" />
                <span>Share WhatsApp</span>
              </a>

              {/* Copy Deep Link */}
              <button
                type="button"
                onClick={handleCopyDirectLink}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 text-xs font-medium transition border border-white/10 min-h-[44px]"
                title="Copy direct language link"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#b0e892]" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 text-[#c5a049]" />
                    <span className="hidden sm:inline">Copy Link</span>
                  </>
                )}
              </button>

              {/* Save Status Video (rendered only if statusVideoUrl is provided) */}
              {currentTrack.statusVideoUrl && (
                <a
                  href={currentTrack.statusVideoUrl}
                  download
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5a049]/20 hover:bg-[#c5a049]/30 text-[#e6c97a] text-xs font-bold transition border border-[#c5a049]/40 min-h-[44px]"
                  title="Save WhatsApp Status Video"
                >
                  <Video className="w-4 h-4" />
                  <span>Save Status Video</span>
                </a>
              )}

              {/* Lyrics / Script Toggle */}
              <button
                type="button"
                onClick={() => setShowLyrics(!showLyrics)}
                aria-expanded={showLyrics}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#024542] hover:bg-[#025652] text-[#b0e892] text-xs font-bold transition border border-[#b0e892]/30 min-h-[44px]"
              >
                <FileText className="w-4 h-4" />
                <span>{showLyrics ? "Hide Script" : "Lyrics & Script"}</span>
                {showLyrics ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Lyrics / Script Drawer */}
          {showLyrics && (
            <div className="pt-4 border-t border-[#024542] animate-in fade-in slide-in-from-top-2 duration-200">
              <div
                dir={currentTrack.dir}
                className={`p-5 rounded-2xl bg-[#002626] border border-[#c5a049]/30 text-[#e0eee8] text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-inner ${
                  currentTrack.dir === "rtl" ? "font-arabic text-right text-base" : "font-sans"
                }`}
              >
                {currentTrack.lyrics}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Radio Pack & Organizers ZIP download */}
        {JALSA_JINGLES_2026.promoPackZipUrl && (
          <div className="px-6 sm:px-8 py-4 bg-[#002222] border-t border-[#024542] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#a0c5b8]">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-[#c5a049]" />
              <span>
                <strong>Organizers &amp; Radio Promo Pack:</strong> Includes all 4 languages in high-fidelity broadcast MP3.
              </span>
            </div>

            <a
              href={JALSA_JINGLES_2026.promoPackZipUrl}
              download="72nd-Jalsa-Salana-Nigeria-2026-Official-Jingles-Pack.zip"
              className="inline-flex items-center gap-1.5 font-bold text-[#e6c97a] hover:text-white transition underline underline-offset-2 shrink-0 min-h-[36px]"
            >
              <Download className="w-3.5 h-3.5" />
              Download All 4 (ZIP · 10.6 MB)
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
