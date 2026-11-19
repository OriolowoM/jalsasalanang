'use client';

import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';

interface Props {
  surahNumber?: number;
  verseNumber?: number;
  surahName?: string;
  englishText?: string;
  contextNote?: string;
  alislamUrl?: string;
}

export default function QuranCitationCard({
  verseNumber = 91,
  surahName = 'Surah An-Nahl (The Bee)',
  englishText = 'Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred; and forbids indecency, and evil, and rebellion. He admonishes you that you may take heed.',
  contextNote = 'Official Quranic foundation for the 72nd Jalsa Salana Nigeria 2026 Theme: "Observing Justice and Human Rights: The foundation for true Global Peace".',
  alislamUrl = 'https://www.alislam.org/quran/16:91',
}: Props) {
  return (
    <div className="my-8 sm:my-12 rounded-3xl sm:rounded-4xl bg-forest text-white p-6 sm:p-10 lg:p-12 shadow-soft-lg border border-teal/20 relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5 sm:space-y-6">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="p-2 bg-teal/20 text-lime rounded-xl border border-teal/30">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-display font-extrabold tracking-widest text-lime/80 block">
                The Holy Quran Citation
              </span>
              <span className="font-display font-bold text-sm sm:text-base text-white">
                {surahName} : Verse {verseNumber}
              </span>
            </div>
          </div>

          <a
            href={alislamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs text-lime hover:text-white font-semibold transition-colors bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl border border-white/15 hover:bg-white/15"
          >
            <span>Read on AlIslam.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* English Translation */}
        <div className="text-sm sm:text-lg text-white/90 leading-relaxed font-sans border-l-3 border-lime pl-4 sm:pl-5 py-1">
          &ldquo;{englishText}&rdquo;
          <span className="block text-[11px] sm:text-xs text-white/50 mt-2 font-normal">
            — English Translation by Maulvi Sher Ali (ra), AlIslam.org
          </span>
        </div>

        {/* Editorial Context Note */}
        {contextNote && (
          <div className="pt-2 text-xs text-white/70 font-sans leading-relaxed">
            <strong className="text-lime">Context:</strong> {contextNote}
          </div>
        )}
      </div>
    </div>
  );
}
