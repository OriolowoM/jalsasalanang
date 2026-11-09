'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, Gauge, Headphones } from 'lucide-react';

interface Props {
  title: string;
  content: string;
}

export default function ArticleAudioPlayer({ title, content }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Extract clean reading text without HTML tags
  const cleanText = React.useMemo(() => {
    const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (tempDiv) {
      tempDiv.innerHTML = content;
      return `${title}. ${tempDiv.textContent || tempDiv.innerText || ''}`;
    }
    return `${title}. ${content.replace(/<[^>]+>/g, ' ')}`;
  }, [title, content]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.lang = 'en-GB';

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = newRate;
      utterance.lang = 'en-GB';
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-primary-50 via-white to-primary-50/30 border border-primary/20 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left: Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Headphones className="w-5 h-5 text-gold" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary block">
            Audio Article Reader
          </span>
          <span className="text-xs font-semibold text-charcoal flex items-center gap-2">
            <span>Listen to this publication</span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                Playing
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 text-[11px] font-bold text-gray-600">
          <Gauge className="w-3 h-3 text-gray-400 ml-1" />
          {[1.0, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => handleRateChange(s)}
              className={`px-2 py-0.5 rounded transition-colors ${
                rate === s ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Play / Pause Button */}
        <button
          onClick={handlePlayPause}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold transition-all shadow-sm"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Listen</span>
            </>
          )}
        </button>

        {/* Stop Button */}
        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            title="Stop audio"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
