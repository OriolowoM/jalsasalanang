"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  JALSA_JINGLES_2026,
  type JalsaJingleTrack,
  type JingleLanguageId,
  getTrackById,
  getTrackByHash,
} from "@/lib/jingles-2026";

interface AudioPlayerContextType {
  currentTrack: JalsaJingleTrack;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isMiniPlayerDismissed: boolean;
  mainPlayerInView: boolean;
  isMiniPlayerActive: boolean;
  playTrack: (id: JingleLanguageId, autoPlay?: boolean) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  toggleMute: () => void;
  dismissMiniPlayer: () => void;
  setMainPlayerInView: (inView: boolean) => void;
  hasInteracted: boolean;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentTrack, setCurrentTrack] = useState<JalsaJingleTrack>(
    JALSA_JINGLES_2026.tracks[0]
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMiniPlayerDismissed, setIsMiniPlayerDismissed] = useState<boolean>(false);
  const [mainPlayerInView, setMainPlayerInView] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sync track when deep link hash is present
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const matched = getTrackByHash(hash);
        if (matched) {
          setCurrentTrack(matched);
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Listen to external custom event: jalsa-audio:play
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleExternalAudio = (event: any) => {
      const lang = (event?.detail?.language || event?.detail?.trackId) as JingleLanguageId | undefined;
      const auto = event?.detail?.autoPlay ?? true;
      if (lang) {
        playTrack(lang, auto);
      } else {
        togglePlay();
      }
    };

    window.addEventListener("jalsa-audio:play", handleExternalAudio);
    return () => window.removeEventListener("jalsa-audio:play", handleExternalAudio);
  }, [currentTrack, isPlaying]);

  const playTrack = useCallback(
    (id: JingleLanguageId, autoPlay: boolean = true) => {
      setHasInteracted(true);
      setIsMiniPlayerDismissed(false);
      const nextTrack = getTrackById(id);
      const isSwitching = nextTrack.id !== currentTrack.id;

      setCurrentTrack(nextTrack);

      const audio = audioRef.current;
      if (!audio) return;

      if (isSwitching) {
        audio.src = nextTrack.audioUrl;
        audio.currentTime = 0;
        setCurrentTime(0);
      }

      if (autoPlay || isPlaying) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn("Audio play prevented:", err);
            setIsPlaying(false);
          });
      }
    },
    [currentTrack.id, isPlaying]
  );

  const togglePlay = useCallback(() => {
    setHasInteracted(true);
    setIsMiniPlayerDismissed(false);
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      // Ensure audio source is set
      if (!audio.src || !audio.src.includes(currentTrack.audioUrl)) {
        audio.src = currentTrack.audioUrl;
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio play interrupted:", err);
          setIsPlaying(false);
        });
    }
  }, [isPlaying, currentTrack.audioUrl]);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(seconds, audio.duration || 180));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const dismissMiniPlayer = useCallback(() => {
    setIsMiniPlayerDismissed(true);
  }, []);

  // HTML5 audio event bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, []);

  const isMiniPlayerActive = isPlaying && !mainPlayerInView && !isMiniPlayerDismissed;

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        isMuted,
        isMiniPlayerDismissed,
        mainPlayerInView,
        isMiniPlayerActive,
        playTrack,
        togglePlay,
        seek,
        toggleMute,
        dismissMiniPlayer,
        setMainPlayerInView,
        hasInteracted,
      }}
    >
      {/* Global Singleton Audio Element: strictly preload="none", zero browser controls */}
      <audio
        ref={audioRef}
        preload="none"
        playsInline
        aria-hidden="true"
        className="hidden"
      />
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
}
