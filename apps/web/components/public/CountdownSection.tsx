'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import AddToCalendarButton from './AddToCalendarButton';

export default function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
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
    <section className="py-10 sm:py-20 lg:py-28 bg-forest relative overflow-hidden">
      {/* Subtle organic texture */}
      <div className="absolute inset-0 bg-islamic-stars opacity-30 pointer-events-none" />

      {/* Decorative: soft gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-lime/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Background emblem watermark */}
      <div className="absolute -right-16 -bottom-16 w-[400px] h-[400px] opacity-[0.04] pointer-events-none">
        <Image src="/images/jalsa-emblem.png" alt="" fill className="object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* ── Left: Edition Details (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Badge row */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/15 text-lime border border-teal/30 text-[10px] sm:text-[11px] font-display font-bold tracking-widest uppercase">
                <span>Official 72nd National Convention</span>
              </div>

              <div className="bg-white/95 px-3 py-1 rounded-xl inline-flex items-center border border-white/20">
                <div className="relative h-7 sm:h-9 w-32 sm:w-44">
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

            {/* Main heading */}
            <div>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-lime/80 block mb-1.5">
                December 18–20, 2026 · Jamia Ahmadiyya Ilaro
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-display-xl text-white leading-tight">
                72nd Jalsa Salana Nigeria
              </h2>
            </div>

            {/* Quranic Citation Card — Clean English translation with dignified gold accent */}
            <div className="relative p-5 sm:p-7 rounded-2xl bg-forest-950/70 border border-teal/20 backdrop-blur-sm border-l-4 border-l-gold">
              <div className="text-xs sm:text-sm text-white/90 italic leading-relaxed font-sans">
                &ldquo;Verily, Allah enjoins justice, and the doing of good to others; and giving like kindred; and forbids indecency, and evil, and rebellion...&rdquo;
              </div>
              <div className="flex flex-wrap items-center justify-between text-[11px] font-sans text-lime mt-2.5 pt-2.5 border-t border-white/10 font-bold tracking-wide gap-2">
                <span>Holy Qur&apos;an, Surah An-Nahl (16:91)</span>
                <span className="text-[10px] text-white/60 uppercase tracking-widest font-medium">72nd Convention Theme Foundation</span>
              </div>
            </div>

            {/* Theme */}
            <p className="text-white/70 text-xs sm:text-base leading-relaxed max-w-2xl font-sans">
              Official Theme: <strong className="text-white">Observing Justice and Human Rights: The foundation for true Global Peace</strong>. Convening tens of thousands of delegates, international dignitaries, and academic researchers under the guidance of Khilafat-e-Ahmadiyya.
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-white/70">
              <span className="flex items-center gap-1.5 bg-teal/15 px-3 py-1.5 rounded-xl border border-teal/20">
                <MapPin className="w-3.5 h-3.5 text-lime" />
                <span>Jamia Ahmadiyya Ilaro, Ogun State</span>
              </span>
              <span className="flex items-center gap-1.5 bg-teal/15 px-3 py-1.5 rounded-xl border border-teal/20">
                <Users className="w-3.5 h-3.5 text-lime" />
                <span>45,000+ Expected Attendees</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/registration"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-600 text-white font-bold text-xs sm:text-sm transition-all shadow-glow-teal hover:shadow-lg active:scale-[0.98] text-center"
              >
                <span>Register Your Household</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/editions/2026"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/15 text-center"
              >
                <span>Explore 2026 Hub</span>
              </Link>
              <div className="hidden sm:block">
                <AddToCalendarButton />
              </div>
            </div>
          </div>

          {/* ── Right: Countdown (5 cols) ── */}
          <div className="lg:col-span-5 bg-forest-950/50 backdrop-blur-xl p-5 sm:p-8 lg:p-10 rounded-3xl sm:rounded-4xl border border-teal/15 relative">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
                <h3 className="font-display font-bold text-[11px] sm:text-xs tracking-[0.15em] uppercase text-lime">
                  Opening Session Countdown
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal/20 text-lime px-2.5 py-0.5 rounded-full border border-teal/30">
                December 18, 2026
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Mins' },
                { value: timeLeft.seconds, label: 'Secs' },
              ].map((item, idx) => (
                <div
                  key={item.label}
                  className={`bg-forest-900/80 rounded-2xl p-2.5 sm:p-4 border border-teal/15 group ${
                    idx === 3 ? 'border-teal/30' : ''
                  }`}
                >
                  <div className={`font-display font-extrabold text-2xl sm:text-4xl transition-colors ${
                    idx === 3 ? 'text-lime animate-pulse' : 'text-white group-hover:text-lime'
                  }`}>
                    {item.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-display font-bold text-white/50 uppercase tracking-wider mt-1 sm:mt-1.5">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-lime" />
                <span>MTA International Broadcast</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-lime/80 font-mono">
                Jamia Ilaro, NG
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
