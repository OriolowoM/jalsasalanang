'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Quote } from 'lucide-react';

interface Props {
  surahNumber?: number;
  verseNumber?: number;
  surahName?: string;
  arabicText?: string;
  englishText?: string;
  contextNote?: string;
  alislamUrl?: string;
}

export default function QuranCitationCard({
  surahNumber = 16,
  verseNumber = 91,
  surahName = 'Surah An-Nahl (The Bee)',
  arabicText = 'إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ وَيَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَالْبَغْيِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ',
  englishText = 'Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred; and forbids indecency, and evil, and rebellion. He admonishes you that you may take heed.',
  contextNote = 'Official Quranic foundation for the 72nd Jalsa Salana Nigeria 2026 Theme: "Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony".',
  alislamUrl = 'https://www.alislam.org/quran/16:91',
}: Props) {
  return (
    <div className="my-8 rounded-2xl bg-gradient-to-br from-emerald-950 via-primary-950 to-primary text-white p-6 sm:p-8 shadow-xl border border-gold/30 relative overflow-hidden">
      {/* Background Decorative Emblem */}
      <div className="absolute top-2 right-2 text-white/5 pointer-events-none">
        <BookOpen className="w-48 h-48" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-gold/20 text-gold rounded-lg border border-gold/30">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-gold block">
                The Holy Quran Citation
              </span>
              <span className="font-serif font-bold text-sm text-white">
                {surahName} : Verse {verseNumber}
              </span>
            </div>
          </div>

          <a
            href={alislamUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-gold-light hover:text-white font-semibold transition-colors bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/20"
          >
            <span>Read on AlIslam.org</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Arabic Calligraphy */}
        <div className="font-arabic text-2xl sm:text-3xl lg:text-4xl text-gold-light text-right leading-loose py-2 font-normal" dir="rtl">
          {arabicText}
        </div>

        {/* English Translation */}
        <div className="text-sm sm:text-base text-gray-200 leading-relaxed font-serif italic border-l-2 border-gold pl-4 py-1">
          &ldquo;{englishText}&rdquo;
          <span className="block text-xs text-gray-400 not-italic mt-1">
            — English Translation by Maulvi Sher Ali (ra), AlIslam.org
          </span>
        </div>

        {/* Editorial Context Note */}
        {contextNote && (
          <div className="pt-2 text-xs text-gold/90 font-medium">
            <strong>Context:</strong> {contextNote}
          </div>
        )}
      </div>
    </div>
  );
}
