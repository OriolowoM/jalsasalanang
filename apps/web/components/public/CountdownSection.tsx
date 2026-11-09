'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import AddToCalendarButton from './AddToCalendarButton';

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target: Dec 18, 2026
    const targetDate = new Date('2026-12-18T09:00:00+01:00').getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 sm:py-16 bg-gradient-to-br from-primary-night via-primary-dark to-primary-900 text-white relative overflow-hidden border-b-2 border-gold/30">
      {/* Subtle Islamic Stars Background Overlay */}
      <div className="absolute inset-0 bg-islamic-stars opacity-40 pointer-events-none" />

      {/* Background Decorative Crest Watermark */}
      <div className="absolute -right-16 -bottom-16 w-[450px] h-[450px] opacity-10 pointer-events-none">
        <Image src="/images/jalsa-emblem.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side: Edition Details & Arabic Calligraphy (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold-metallic border border-gold/40 text-[11px] font-cinzel font-bold tracking-widest">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>OFFICIAL 72ND NATIONAL CONVENTION</span>
              </div>

              {/* Official 72nd Logo Badge */}
              <div className="bg-white/95 px-3.5 py-1.5 rounded-xl shadow-md inline-flex items-center border border-gold/30 backdrop-blur-sm">
                <div className="relative h-9 w-40 sm:w-48">
                  <Image
                    src="/images/jalsa72-logo.jpg"
                    alt="Official 72nd Jalsa Salana Nigeria 2026 Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-metallic block mb-1">
                December 18–20, 2026 · Jamia Ahmadiyya Ilaro
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-[1.12]">
                72nd Jalsa Salana Nigeria
              </h2>
            </div>

            {/* Gilded Arabic Quranic Citation Box */}
            <div className="relative p-5 sm:p-6 rounded-2xl bg-black/40 border border-gold/30 backdrop-blur-md shadow-2xl">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gold/60"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold/60"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold/60"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold/60"></div>

              <div className="font-arabic text-2xl sm:text-3xl text-gold-metallic text-right leading-relaxed mb-3 drop-shadow" dir="rtl">
                إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ
              </div>
              <div className="text-xs sm:text-sm text-gray-200 italic font-serif leading-relaxed border-t border-gold/20 pt-2.5">
                &ldquo;Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred...&rdquo;
                <span className="block text-[11px] font-sans uppercase font-bold text-gold-light mt-1 not-italic">
                  — Holy Qur&apos;an, Surah An-Nahl (16:91)
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-serif">
              Official Theme: <strong className="text-white font-sans">Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony</strong>. Convening tens of thousands of delegates, international dignitaries, and academic researchers under the guidance of Khilafat-e-Ahmadiyya.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Jamia Ahmadiyya Ilaro, Ogun State</span>
              </span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Users className="w-4 h-4 text-gold" />
                <span>45,000+ Expected Attendees</span>
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/registration"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-metallic hover:from-gold-hover hover:to-gold text-primary-950 font-black text-xs uppercase tracking-wider transition-all shadow-gold-glow hover:scale-105 active:scale-95"
              >
                <span>Register Your Household</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/editions/2026"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
              >
                <span>Explore 2026 Hub</span>
              </Link>
              <AddToCalendarButton />
            </div>
          </div>

          {/* Right Side: Animated Countdown Timers with Metallic Dials (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-white/10 via-black/40 to-black/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-gold/30 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="font-cinzel font-black text-xs tracking-[0.2em] uppercase text-gold-metallic">
                  Official Opening Session
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gold/20 text-gold-light px-2 py-0.5 rounded border border-gold/40">
                Live Countdown
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
              <div className="bg-gradient-to-b from-black/80 to-black/40 rounded-2xl p-3 sm:p-4 border border-gold/30 shadow-inner group">
                <div className="font-display font-black text-2xl sm:text-4xl text-white group-hover:text-gold transition-colors">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] sm:text-[11px] font-cinzel font-bold text-gold-light uppercase tracking-wider mt-1.5">
                  Days
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/80 to-black/40 rounded-2xl p-3 sm:p-4 border border-gold/30 shadow-inner group">
                <div className="font-display font-black text-2xl sm:text-4xl text-white group-hover:text-gold transition-colors">
                  {timeLeft.hours}
                </div>
                <div className="text-[10px] sm:text-[11px] font-cinzel font-bold text-gold-light uppercase tracking-wider mt-1.5">
                  Hours
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/80 to-black/40 rounded-2xl p-3 sm:p-4 border border-gold/30 shadow-inner group">
                <div className="font-display font-black text-2xl sm:text-4xl text-white group-hover:text-gold transition-colors">
                  {timeLeft.minutes}
                </div>
                <div className="text-[10px] sm:text-[11px] font-cinzel font-bold text-gold-light uppercase tracking-wider mt-1.5">
                  Mins
                </div>
              </div>

              <div className="bg-gradient-to-b from-black/80 to-black/40 rounded-2xl p-3 sm:p-4 border border-gold/40 shadow-gold-glow group">
                <div className="font-display font-black text-2xl sm:text-4xl text-gold-metallic animate-pulse">
                  {timeLeft.seconds}
                </div>
                <div className="text-[10px] sm:text-[11px] font-cinzel font-bold text-gold-light uppercase tracking-wider mt-1.5">
                  Secs
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span>MTA International Broadcast</span>
              </span>
              <Link href="/registration" className="text-gold font-bold hover:underline">
                Portal Live &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
