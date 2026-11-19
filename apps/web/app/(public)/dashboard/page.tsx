'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  QrCode,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  CloudSun,
  Compass,
  ArrowRight,
  Shield,
  User,
  Navigation,
  RefreshCw,
  Bell,
  Sliders,
  Check,
  Printer,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SyncedJalsaSchedule from '@/components/dashboard/SyncedJalsaSchedule';

interface ItinerarySession {
  day: string;
  time: string;
  session: string;
  location: string;
  highlight: string;
}

export default function AttendeeDashboardPage() {
  // Attendee profile state (supports interactive role switching to demonstrate AI tailoring)
  const [userName, setUserName] = useState('Honored Delegate');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [attendeeRole, setAttendeeRole] = useState('Interstate Delegate');
  const [travelOrigin, setTravelOrigin] = useState('Lagos State, Nigeria');
  const [selectedDay, setSelectedDay] = useState('Day 1');
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jalsa_delegate_name');
      if (saved && saved.trim()) {
        setUserName(saved);
        setNameInput(saved);
      }
    } catch (_) {}
  }, []);

  const [itineraryData, setItineraryData] = useState<{
    recommendedGate: string;
    welcomeMessage: string;
    itinerary: ItinerarySession[];
    practicalTips: string[];
  }>({
    recommendedGate: 'Gate 2 (West Registration Hub)',
    welcomeMessage:
      'Welcome to the 72nd Jalsa Salana Nigeria. We pray your journey to Jamia Ahmadiyya Ilaro is blessed, peaceful, and safe. Your digital pass and itinerary are tailored below.',
    itinerary: [
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '1:05 PM – 1:50 PM',
        session: "Jumu'at Services and Asr Prayer",
        location: 'Main Convention Arena',
        highlight: 'Congregational Jumu’ah followed by Live Huzur’s Sermon broadcast at 2:00 PM.',
      },
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '5:00 PM',
        session: 'Hoisting of Flags & Opening First Session',
        location: 'Main Convention Grounds',
        highlight: 'Official flag hoisting (Liwa-i-Ahmadiyya & Nigeria National Flag) followed by Inaugural Address and Lecture One.',
      },
      {
        day: 'Day 1 (Friday, Dec 18)',
        time: '5:40 PM – 6:20 PM',
        session: 'Lecture One: Message from Hazrat Khalifatul Masih V (aba)',
        location: 'Main Convention Marquee',
        highlight: 'Inaugural Address delivered by Amir Sahib Alhaji Alatoye Folorunso Azeez with Yoruba & Hausa translations.',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '10:40 AM – 11:30 AM',
        session: 'Lecture Two: Official Convention Theme',
        location: 'Main Convention Arena',
        highlight: '“Observing Justice and Human Rights: The foundation for true Global Peace” by Hafiz Yunus Omotayo Sahib.',
      },
      {
        day: 'Day 2 (Saturday, Dec 19)',
        time: '4:30 PM – 6:30 PM',
        session: 'Third Session: Speeches to Dignitaries & Academic Awards',
        location: 'Main Convention Marquee',
        highlight: 'Addresses by royal fathers, special guest dignitaries, and Jama’at academic merit awards.',
      },
      {
        day: 'Day 3 (Sunday, Dec 20)',
        time: '6:30 AM – 7:40 AM',
        session: 'Closing Session & Final Concluding Address',
        location: 'Main Convention Arena',
        highlight: 'Concluding address and silent prayers led by Amir Sahib, followed by breakfast and safe departure.',
      },
    ],
    practicalTips: [
      'Download your Digital ID Pass beforehand on jalsa.ahmadiyyanigeria.net for instant gate access.',
      'Check the Live Crowd Map before proceeding to dining halls during meal hours.',
      'Ablution Complex B (behind the Minaret) generally has faster queues than Front Courtyard Complex A.',
    ],
  });

  // Fetch or regenerate dynamic itinerary using Gemini backend
  const fetchTailoredItinerary = async (role: string, origin: string) => {
    setLoadingItinerary(true);
    try {
      const res = await fetch('/api/v1/ai/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          travelOrigin: origin,
          category: role,
          userName,
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setItineraryData(json.data);
      }
    } catch (err) {
      console.warn('Failed to fetch tailored itinerary:', err);
    } finally {
      setLoadingItinerary(false);
    }
  };

  const handleRoleChange = (newRole: string, newOrigin: string) => {
    setAttendeeRole(newRole);
    setTravelOrigin(newOrigin);
    fetchTailoredItinerary(newRole, newOrigin);
  };

  const filteredSessions = itineraryData.itinerary.filter((s) =>
    s.day.toLowerCase().includes(selectedDay.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-bg py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Title & Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-surface-border">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-teal uppercase tracking-widest mb-1.5">
              <span>Personalized Delegate Dashboard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-lime" />
              <span className="text-forest">72nd Jalsa Salana 2026</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display font-black text-2xl sm:text-4xl text-forest tracking-tight">
                Assalamu Alaikum, {userName}
              </h1>
              <button
                type="button"
                onClick={() => {
                  setNameInput(userName === 'Honored Delegate' ? '' : userName);
                  setIsEditingName(!isEditingName);
                }}
                className="text-xs text-teal hover:text-forest bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3 py-1 rounded-xl font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-teal" />
                <span>{userName === 'Honored Delegate' ? 'Personalize with Your Name' : 'Change Name'}</span>
              </button>
            </div>

            {isEditingName && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (nameInput.trim()) {
                    setUserName(nameInput.trim());
                    try {
                      localStorage.setItem('jalsa_delegate_name', nameInput.trim());
                    } catch (_) {}
                    setIsEditingName(false);
                  }
                }}
                className="mt-3 flex items-center gap-2 max-w-md p-2 bg-white rounded-2xl border border-teal/40 shadow-soft"
              >
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your full name or title..."
                  className="px-3 py-1.5 text-xs rounded-xl border border-surface-border focus:outline-none focus:ring-1 focus:ring-teal w-full bg-surface-bg text-ink-body font-medium"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs bg-teal text-white rounded-xl font-bold hover:bg-teal/90 whitespace-nowrap shadow-xs"
                >
                  Save Badge
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-2.5 py-1.5 text-xs text-ink-muted hover:text-ink-body whitespace-nowrap"
                >
                  Cancel
                </button>
              </form>
            )}

            <p className="text-xs sm:text-sm text-ink-muted mt-2">
              Your personalized itinerary, digital access credential, and live venue guidance for Jamia Ilaro.
            </p>
          </div>

          {/* Quick Action Profile Selector (Live Demonstration Control) */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-surface-border shadow-soft">
            <span className="text-[10px] font-bold text-ink-muted uppercase tracking-wider pl-2 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-teal" /> Role:
            </span>
            {[
              { role: 'Interstate Delegate', origin: 'Kano State' },
              { role: 'VIP / Dignitary Guest', origin: 'Abuja FCT' },
              { role: 'Khidmat Volunteer', origin: 'Lagos State' },
              { role: 'General Member', origin: 'Ogun State' },
            ].map((preset) => (
              <button
                key={preset.role}
                onClick={() => handleRoleChange(preset.role, preset.origin)}
                disabled={loadingItinerary}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  attendeeRole === preset.role
                    ? 'bg-teal text-white shadow-xs'
                    : 'text-ink-body hover:bg-surface-muted'
                }`}
              >
                {preset.role.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* ── Bento-Box Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ── BENTO CARD 1: Digital Attendance Badge (Smart Wallet Pass) [4 cols] ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#003333] via-[#002626] to-[#001a1a] text-white p-6 sm:p-7 border border-teal/30 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-lime/50 transition-all duration-300"
          >
            {/* Background watermarked crest */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 pointer-events-none">
              <Image src="/images/jalsa-emblem.png" alt="Crest" width={180} height={180} />
            </div>

            <div>
              {/* Top Badge Ribbon */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
                  <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-lime">
                    Official Digital Pass
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-white/80 border border-white/15">
                  #72-2026-98421
                </span>
              </div>

              {/* Delegate Photo & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-teal/20 border-2 border-gold/50 flex items-center justify-center text-gold shadow-soft">
                  <User className="w-7 h-7 text-lime" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">
                    {userName}
                  </h2>
                  <div className="text-xs text-lime font-medium mt-0.5">
                    {attendeeRole}
                  </div>
                  <div className="text-[10px] text-white/60">
                    Origin: {travelOrigin}
                  </div>
                </div>
              </div>

              {/* QR Code Simulation Area */}
              <div className="bg-white p-4 rounded-2xl text-center shadow-inner mb-6">
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 relative border-4 border-forest p-1 rounded-xl">
                    {/* Simulated SVG QR Matrix */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-forest">
                      <rect width="100" height="100" fill="white" />
                      <path
                        fill="currentColor"
                        d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v20 h-10 z M50,30 h20 v10 h-20 z M40,60 h30 v10 h-30 z M80,60 h10 v20 h-10 z M60,80 h20 v10 h-20 z M40,40 h20 v10 h-20 z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-ink-muted">
                  GATE SCAN VALID • VERIFIED VIA PORTAL
                </div>
              </div>

              {/* Assigned Entry Gate info */}
              <div className="p-3 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between text-xs mb-4">
                <span className="text-white/70">Recommended Entry:</span>
                <span className="font-bold text-lime flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {itineraryData.recommendedGate}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSavedBadge(true);
                  setTimeout(() => setSavedBadge(false), 2500);
                }}
                className="flex-1 py-2.5 rounded-xl bg-lime hover:bg-lime-400 text-forest-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                {savedBadge ? (
                  <>
                    <Check className="w-4 h-4 text-forest-950" /> Saved to Wallet
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Save Pass to Phone
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => typeof window !== 'undefined' && window.print()}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Print Digital Badge"
              >
                <Printer className="w-4 h-4" />
              </button>

              <Link
                href="/registration"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Edit Registration"
              >
                <Share2 className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* ── BENTO CARD 2: Personalized Schedule & Timeline [8 cols] ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 rounded-3xl bg-white p-6 sm:p-7 border border-surface-border shadow-soft flex flex-col justify-between"
          >
            <div>
              {/* Header with Day Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-surface-border">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-extrabold text-xl text-forest">
                      Personalized 3-Day Itinerary
                    </h2>
                    {loadingItinerary && (
                      <RefreshCw className="w-4 h-4 text-teal animate-spin" />
                    )}
                  </div>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Tailored for your role: <strong>{attendeeRole}</strong> from <strong>{travelOrigin}</strong>
                  </p>
                </div>

                {/* Day Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-surface-muted p-1 rounded-2xl border border-surface-border">
                  {['Day 1', 'Day 2', 'Day 3'].map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedDay === day
                          ? 'bg-forest text-white shadow-xs'
                          : 'text-ink-muted hover:text-forest'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome Message Card */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 mb-6 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" />
                <p className="text-xs text-forest leading-relaxed font-medium">
                  {itineraryData.welcomeMessage}
                </p>
              </div>

              {/* Timeline Session Cards */}
              <div className="space-y-3.5">
                {filteredSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-surface-border hover:border-teal/40 transition-all hover:shadow-soft bg-surface-bg/40 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-display font-bold text-xs flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-display font-bold text-sm text-forest">
                            {session.session}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted leading-relaxed">
                          {session.highlight}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col sm:items-end justify-between text-xs text-ink-muted flex-shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-border">
                      <span className="font-bold text-teal flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {session.time}
                      </span>
                      <span className="text-[11px] text-ink-light flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {session.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Advice from AI */}
            <div className="mt-6 pt-4 border-t border-surface-border">
              <div className="text-[11px] font-bold uppercase tracking-wider text-teal mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Attendee Logistical Advisory
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-ink-muted">
                {itineraryData.practicalTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-lime text-base leading-none">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* ── BENTO CARD 3: Jamia Ilaro Live Weather & Prayer Times [4 cols] ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4 rounded-3xl bg-white p-6 border border-surface-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-teal uppercase tracking-widest flex items-center gap-1.5">
                  <CloudSun className="w-4 h-4" /> Live Weather
                </span>
                <span className="text-[10px] font-mono text-ink-light">Jamia Ilaro, Ogun</span>
              </div>

              {/* Weather Display */}
              <div className="flex items-center justify-between bg-gradient-to-br from-teal-50 to-lime-50/50 p-4 rounded-2xl border border-teal-100 mb-6">
                <div>
                  <div className="font-display font-extrabold text-3xl text-forest">31°C</div>
                  <div className="text-xs text-teal font-semibold">Partly Cloudy • Humid</div>
                  <div className="text-[10px] text-ink-muted mt-0.5">Humidity: 68% • Wind: 12 km/h NE</div>
                </div>
                <CloudSun className="w-12 h-12 text-teal/80" />
              </div>

              {/* Prayer Times Schedule */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-forest mb-2 flex items-center justify-between">
                  <span>Congregational Prayer Times</span>
                  <span className="text-[10px] text-lime-700 bg-lime-100 font-bold px-2 py-0.5 rounded-full">Next: Dhuhr</span>
                </div>

                {[
                  { name: 'Fajr & Tahajjud', time: '05:45 AM', passed: true },
                  { name: "Dhuhr & Jumu'ah", time: '01:15 PM', current: true },
                  { name: 'Asr', time: '04:30 PM', passed: false },
                  { name: 'Maghrib & Isha', time: '06:45 PM', passed: false },
                ].map((prayer) => (
                  <div
                    key={prayer.name}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors ${
                      prayer.current
                        ? 'bg-teal text-white font-bold'
                        : 'bg-surface-bg text-ink-body'
                    }`}
                  >
                    <span>{prayer.name}</span>
                    <span className="font-mono">{prayer.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-surface-border text-[10px] text-ink-light flex items-center justify-between">
              <span>Prayer Marquee audio monitored</span>
              <span className="text-teal font-medium">MTA Live Audio</span>
            </div>
          </motion.div>

          {/* ── BENTO CARD 4: Live Crowd Status Quick Monitor [4 cols] ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-4 rounded-3xl bg-white p-6 border border-surface-border shadow-soft flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-teal uppercase tracking-widest flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" /> Live Venue Zones
                </span>
                <Link
                  href="/live-crowd"
                  className="text-[10px] font-bold text-forest hover:text-teal flex items-center gap-0.5"
                >
                  Full Map <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Quick Status Cards */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-surface-bg border border-surface-border">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Main Dining Hall (Men)</span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      RED • Reroute to Aux B
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[98%] h-full bg-rose-500 rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-bg border border-surface-border">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Auxiliary Dining B</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      GREEN • 380 Present
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[25%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-surface-bg border border-surface-border">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Gate 2 (West Reg Hub)</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      GREEN • Fast Scan
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[30%] h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/live-crowd"
              className="mt-4 w-full py-2.5 rounded-xl bg-forest hover:bg-forest-900 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              Open Live Crowd Map
            </Link>
          </motion.div>

          {/* ── BENTO CARD 5: Jalsa Companion AI Launchpad [4 cols] ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-teal-900 to-forest p-6 text-white shadow-soft flex flex-col justify-between border border-teal-700"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-lime" />
                <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-lime">
                  On-Demand AI Assistant
                </span>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2">
                Need Help on the Grounds?
              </h3>
              <p className="text-xs text-white/80 leading-relaxed mb-4">
                Ask the Jalsa Companion for lodging locations, shuttle schedules, lost and found inquiries, or medical post directions.
              </p>

              <div className="p-3 rounded-xl bg-white/10 text-xs text-white/90 font-medium border border-white/10 mb-4">
                &ldquo;Where can I collect my delegate tag if I lost my phone battery?&rdquo;
              </div>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(
                    new CustomEvent('open-jalsa-ai', {
                      detail: { query: 'Where is the attendee support desk at Jamia Ilaro?' },
                    })
                  );
                }
              }}
              className="w-full py-2.5 rounded-xl bg-white text-forest font-bold text-xs hover:bg-lime hover:text-forest-950 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal" /> Ask Jalsa Companion
            </button>
          </motion.div>
        </div>

        {/* ── Synced Jalsa Salana 2026 Programme Schedule (Single Source of Truth) ── */}
        <div className="mt-8">
          <SyncedJalsaSchedule />
        </div>
      </div>
    </div>
  );
}
