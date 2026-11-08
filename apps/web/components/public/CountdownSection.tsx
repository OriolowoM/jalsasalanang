'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight, ShieldCheck } from 'lucide-react';

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
    <section className="py-12 bg-gradient-to-br from-primary-950 via-primary to-primary-900 text-white relative overflow-hidden">
      {/* Background Decorative Crest Watermark */}
      <div className="absolute -right-16 -bottom-16 w-96 h-96 opacity-15 pointer-events-none">
        <Image src="/images/jalsa-emblem.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Edition Details & Arabic Calligraphy (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-light border border-gold/40 text-xs font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Special Milestone Ahead
              </div>

              {/* Official 72nd Logo Badge */}
              <div className="bg-white px-3 py-1.5 rounded-lg shadow inline-flex items-center">
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

            <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              72nd Jalsa Salana Nigeria
              <span className="block text-gold text-2xl sm:text-3xl mt-1">December 18–20, 2026</span>
            </h2>

            {/* Arabic Quranic Citation */}
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 backdrop-blur-sm">
              <div className="font-arabic text-2xl sm:text-3xl text-gold-light text-right leading-relaxed mb-2" dir="rtl">
                إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ
              </div>
              <div className="text-xs sm:text-sm text-gray-300 italic">
                &ldquo;Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred...&rdquo; (Surah An-Nahl, Verse 91)
              </div>
            </div>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              Official Theme: <strong className="text-white">Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony</strong>. Convening tens of thousands of faithful delegates, international dignitaries, and academic observers.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold" />
                Jamia Ahmadiyya Ilaro, Ogun State
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold" />
                45,000+ Expected Attendees
              </span>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/editions/2026"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-primary-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
              >
                <span>Explore 2026 Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-white/20"
              >
                About The Convention
              </Link>
            </div>
          </div>

          {/* Right Side: Animated Countdown Timers (5 cols) */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-center font-bold text-xs tracking-widest uppercase text-gold mb-6">
              Countdown to Opening Session
            </h3>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="bg-black/40 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="font-serif font-black text-2xl sm:text-4xl text-white">
                  {timeLeft.days}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Days
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="font-serif font-black text-2xl sm:text-4xl text-white">
                  {timeLeft.hours}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Hours
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="font-serif font-black text-2xl sm:text-4xl text-white">
                  {timeLeft.minutes}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Minutes
                </div>
              </div>

              <div className="bg-black/40 rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="font-serif font-black text-2xl sm:text-4xl text-gold">
                  {timeLeft.seconds}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Seconds
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-gray-300">
                Live worldwide broadcasts will be accessible on MTA International and YouTube.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
