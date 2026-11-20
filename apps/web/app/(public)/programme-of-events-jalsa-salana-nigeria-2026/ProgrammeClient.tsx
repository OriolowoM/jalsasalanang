"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Download,
  Search,
  Sparkles,
  Users,
  Printer,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  Share2,
  Check,
  Music,
  Star,
  CalendarPlus,
  Quote,
  Award,
} from "lucide-react";
import SoundOfJalsaCard from "@/components/public/audio/SoundOfJalsaCard";
import LiveProgrammeStrip from "@/components/public/programme/LiveProgrammeStrip";
import JalsaLectureVault from "@/components/public/programme/JalsaLectureVault";
import CircuitPhotoFinder from "@/components/public/gallery/CircuitPhotoFinder";
import {
  JALSA_2026_META,
  PROGRAMME_DAYS,
  type Category,
  type ProgrammeItem,
} from "@/lib/programme-2026";
import {
  generateICalendar,
  downloadICalendarFile,
  getGoogleCalendarUrl,
} from "@/lib/programme-calendar";

const CATEGORIES: Category[] = [
  "All",
  "Lecture",
  "Prayer",
  "Recitation & Poem",
  "Ceremony & Awards",
  "Meal",
  "Translation & Q&A",
];

function openJalsaAI(prompt: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("jalsa-ai:ask", { detail: { prompt } })
    );
    window.dispatchEvent(
      new CustomEvent("open-jalsa-ai", { detail: { query: prompt } })
    );
  }
}

export default function ProgrammeOfEvents2026Page() {
  const [activeDay, setActiveDay] = useState<string>("friday");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [starredIds, setStarredIds] = useState<string[]>([]);
  const [showOnlyStarred, setShowOnlyStarred] = useState(false);

  // Load starred items from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("jalsa_2026_starred_ids");
        if (saved) setStarredIds(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const toggleStar = (id: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem("jalsa_2026_starred_ids", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleExportCalendar = () => {
    const starredItemsWithDates: { item: ProgrammeItem; dateISO: string }[] = [];
    for (const day of PROGRAMME_DAYS) {
      for (const item of day.items) {
        if (starredIds.includes(item.id)) {
          starredItemsWithDates.push({ item, dateISO: day.dateISO });
        }
      }
    }

    // If no items starred, export all keynote lectures by default
    const itemsToExport =
      starredItemsWithDates.length > 0
        ? starredItemsWithDates
        : PROGRAMME_DAYS.flatMap((day) =>
            day.items
              .filter((it) => it.highlight || it.category === "Lecture")
              .map((it) => ({ item: it, dateISO: day.dateISO }))
          );

    const icsContent = generateICalendar(itemsToExport);
    downloadICalendarFile("My-Jalsa-2026-Schedule.ics", icsContent);
  };

  const currentDay = useMemo(
    () => PROGRAMME_DAYS.find((d) => d.id === activeDay) ?? PROGRAMME_DAYS[0],
    [activeDay]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let baseItems = showOnlyStarred
      ? PROGRAMME_DAYS.flatMap((d) => d.items).filter((it) =>
          starredIds.includes(it.id)
        )
      : currentDay.items;

    return baseItems.filter((item) => {
      if (
        !showOnlyStarred &&
        activeCategory !== "All" &&
        item.category !== activeCategory
      ) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.titleSuffix,
        item.topic,
        item.facilitator,
        item.session,
        item.time,
        ...(item.panel ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [currentDay, activeCategory, query, showOnlyStarred, starredIds]);

  const groupedBySession = useMemo(() => {
    const groups: { session: string; items: ProgrammeItem[] }[] = [];
    for (const item of filteredItems) {
      const last = groups[groups.length - 1];
      if (last && last.session === item.session) {
        last.items.push(item);
      } else {
        groups.push({ session: item.session, items: [item] });
      }
    }
    return groups;
  }, [filteredItems]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: "72nd Jalsa Salana Nigeria 2026 Programme of Events",
          text: `Official Programme of Events: “${JALSA_2026_META.theme}” — 18th–20th December 2026 at Jamia Ahmadiyya Ilaro.`,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9f7] text-[#11241f] font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-[#002828] text-[#b0e892] border-b border-[#024542] px-5 py-2.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hover:text-white transition"
            >
              Delegate Dashboard
            </Link>
            <span className="text-[#c5a049]">•</span>
            <Link
              href="/market"
              className="hover:text-white transition"
            >
              Jalsa Market Booking
            </Link>
          </div>
        </div>
      </div>

      {/* Ceremonial Hero Masthead */}
      <section className="relative overflow-hidden bg-[#003333] text-white border-b-4 border-[#c5a049]">
        <div className="max-w-6xl mx-auto px-5 py-12 md:py-18">
          <p
            dir="rtl"
            className="text-center text-xl md:text-2xl text-[#e2c67b] font-serif mb-4 select-none"
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-[0.2em] uppercase text-[#b0e892] font-semibold mb-4">
            <span>{JALSA_2026_META.organization}</span>
            <span className="text-[#c5a049]">•</span>
            <span>72nd Annual Convention</span>
          </div>

          <h1 className="text-center font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Programme of Events — Jalsa Salana Nigeria 2026
          </h1>

          <div className="mt-6 max-w-3xl mx-auto rounded-2xl border border-[#c5a049]/40 bg-[#024542]/70 px-6 py-4 text-center shadow-lg">
            <span className="block text-[11px] uppercase tracking-[0.18em] text-[#b0e892] font-semibold mb-1">
              Official Convention Theme
            </span>
            <p className="text-lg md:text-xl font-serif italic text-[#f8f4e6]">
              “{JALSA_2026_META.theme}”
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-[#d6e7e1]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 border border-white/10">
              <Calendar className="w-4 h-4 text-[#b0e892]" />
              {JALSA_2026_META.datesDisplay}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 border border-white/10">
              <Users className="w-4 h-4 text-[#b0e892]" />
              {JALSA_2026_META.venue}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/10 transition"
              title="Share Programme"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#b0e892]" /> Copied Link
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#b0e892]" /> Share
                </>
              )}
            </button>
          </div>

          {/* Primary Action Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={JALSA_2026_META.pdfDownloadUrl}
              download
              className="inline-flex items-center gap-2.5 rounded-full bg-[#c5a049] hover:bg-[#d6b25b] text-[#002626] font-bold px-6 py-3 text-sm transition shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Official Programme (PDF)
            </a>

            <button
              type="button"
              onClick={() =>
                openJalsaAI(
                  "Give me a quick overview of the 72nd Jalsa Salana Nigeria 2026 programme highlights."
                )
              }
              className="inline-flex items-center gap-2.5 rounded-full border-2 border-[#c5a049] bg-[#002828] hover:bg-[#024542] text-white font-semibold px-6 py-3 text-sm transition"
            >
              <Sparkles className="w-4 h-4 text-[#b0e892]" />
              <span>Ask Jalsa AI</span>
              <span className="rounded-full bg-[#027c68]/60 border border-[#b0e892]/40 px-2 py-0.5 text-[10px] tracking-wider uppercase text-[#e6d194]">
                Guide
              </span>
            </button>

            <button
              type="button"
              onClick={handleExportCalendar}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#b0e892]/80 bg-[#003838] hover:bg-[#024d4a] text-white px-5 py-3 text-sm font-semibold transition shadow-sm"
              title="Download standard .ics calendar for iPhone, Android, and Outlook"
            >
              <CalendarPlus className="w-4 h-4 text-[#b0e892]" />
              <span>Export Calendar (.ics)</span>
            </button>

            <a
              href="#lecture-vault"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:bg-white/10 text-white px-4 py-3 text-sm font-medium transition"
            >
              <Quote className="w-4 h-4 text-[#c5a049]" />
              Lecture Vault
            </a>

            <a
              href="#sound-of-jalsa"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:bg-white/10 text-white px-4 py-3 text-sm font-medium transition"
            >
              <Music className="w-4 h-4 text-[#b0e892]" />
              Sound of Jalsa
            </a>

            <button
              type="button"
              onClick={() => typeof window !== "undefined" && window.print()}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 hover:bg-white/10 text-white px-4 py-3 text-sm font-medium transition"
            >
              <Printer className="w-4 h-4" />
              Print Schedule
            </button>
          </div>
        </div>
      </section>

      {/* Live "Happening Now & Up Next" Sticky Bar */}
      <LiveProgrammeStrip
        onSelectDay={(dayId) => {
          setActiveDay(dayId);
          setShowOnlyStarred(false);
        }}
      />

      {/* Sticky Day Tabs, Search & Category Filter */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-[#dde5e1] shadow-xs">
        <div className="max-w-6xl mx-auto px-5 py-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {PROGRAMME_DAYS.map((day) => {
                const selected = !showOnlyStarred && day.id === activeDay;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => {
                      setActiveDay(day.id);
                      setShowOnlyStarred(false);
                    }}
                    className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      selected
                        ? "bg-[#003333] text-white border border-[#c5a049] shadow-xs"
                        : "bg-[#f1f5f3] text-[#1f3b34] hover:bg-[#e3ece8]"
                    }`}
                  >
                    {day.shortLabel}
                  </button>
                );
              })}

              {/* One-Tap "My Jalsa" Personal Schedule Tab */}
              <button
                type="button"
                onClick={() => setShowOnlyStarred(!showOnlyStarred)}
                className={`rounded-xl px-4 py-2.5 text-sm font-bold transition flex items-center gap-1.5 ${
                  showOnlyStarred
                    ? "bg-[#c5a049] text-[#002626] shadow-sm font-extrabold"
                    : starredIds.length > 0
                    ? "bg-[#fff7e6] text-[#8a5d00] border border-[#f0c36d] hover:bg-[#ffeec2]"
                    : "bg-[#f1f5f3] text-[#1f3b34] hover:bg-[#e3ece8]"
                }`}
                title="Filter to your starred programme sessions"
              >
                <Star
                  className={`w-4 h-4 ${
                    showOnlyStarred || starredIds.length > 0
                      ? "fill-[#c5a049] text-[#c5a049]"
                      : "text-[#526c65]"
                  }`}
                />
                <span>My Jalsa ({starredIds.length})</span>
              </button>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#526c65] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search speaker, lecture, prayer..."
                className="w-full rounded-xl border border-[#cfdcd6] bg-[#f8faf9] pl-10 pr-4 py-2.5 text-sm text-[#11241f] focus:outline-none focus:border-[#027c68]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-[#027c68] text-white"
                    : "bg-[#eef3f0] text-[#35524a] hover:bg-[#dfeae5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Timetable Body */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        {/* Personal Checklist Banner (when "My Jalsa" is filtered) */}
        {showOnlyStarred && (
          <div className="mb-8 rounded-2xl bg-[#003333] border-2 border-[#c5a049] p-5 sm:p-6 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b0e892]">
                <Star className="w-4 h-4 fill-[#c5a049] text-[#c5a049]" />
                My Jalsa Personal Schedule Checklist
              </div>
              <h3 className="font-display font-extrabold text-xl text-white mt-1">
                {starredIds.length} Starred Convention Session{starredIds.length === 1 ? "" : "s"}
              </h3>
              <p className="text-xs sm:text-sm text-[#d4e7e0] mt-1 max-w-2xl leading-relaxed">
                Your personal itinerary is stored safely on your device. Export these sessions to your iPhone, Android, or Outlook calendar to receive automatic 15-minute alerts before each session.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleExportCalendar}
                disabled={starredIds.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-[#c5a049] hover:bg-[#d6b25b] text-[#002626] font-bold px-4 py-2.5 text-xs transition shadow-md disabled:opacity-50"
              >
                <CalendarPlus className="w-4 h-4 text-[#002626]" />
                <span>Export to Phone (.ics)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowOnlyStarred(false)}
                className="rounded-xl border border-white/30 hover:bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-white transition"
              >
                Show All Days
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-[#d9e3de] pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#027c68]">
              {showOnlyStarred ? "Personal Itinerary" : "Official Daily Schedule"}
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#003333]">
              {showOnlyStarred
                ? "My Starred Jalsa 2026 Sessions"
                : currentDay.fullLabel}
            </h2>
            <p className="text-sm text-[#4a625b] mt-1">
              {showOnlyStarred
                ? "All events you have bookmarked across Friday, Saturday, and Sunday."
                : currentDay.subtitle}
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5a7069]">
            Showing {filteredItems.length} {showOnlyStarred ? "starred" : `of ${currentDay.items.length}`} items
          </span>
        </div>

        {groupedBySession.length === 0 ? (
          <div className="rounded-2xl border border-[#d9e3de] bg-white p-10 text-center">
            <BookOpen className="w-10 h-10 text-[#027c68] mx-auto mb-3 opacity-60" />
            <p className="font-semibold text-[#003333]">
              {showOnlyStarred
                ? "You haven’t starred any sessions yet. Click the Star (★) icon next to any event to build your personal Jalsa schedule!"
                : `No matching programme items found on ${currentDay.fullLabel}.`}
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
                setShowOnlyStarred(false);
              }}
              className="mt-4 rounded-full bg-[#003333] text-white px-5 py-2 text-xs font-bold transition hover:bg-[#024542]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedBySession.map((group) => (
              <div key={group.session} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#c5a049]" />
                  <h3 className="font-display text-sm font-extrabold uppercase tracking-[0.15em] text-[#003333]">
                    {group.session}
                  </h3>
                  <div className="flex-1 h-px bg-[#dbe4df]" />
                </div>

                <div className="divide-y divide-[#e5ece8] rounded-2xl border border-[#d9e3de] bg-white overflow-hidden shadow-xs">
                  {group.items.map((item) => {
                    const isStarred = starredIds.includes(item.id);
                    return (
                      <article
                        key={item.id}
                        className={`p-5 md:p-6 flex flex-col md:flex-row md:items-start gap-4 transition ${
                          isStarred
                            ? "bg-[#fbfaf5] border-l-4 border-l-[#c5a049]"
                            : item.highlight
                            ? "bg-[#fafcfb] border-l-4 border-l-[#027c68]"
                            : "hover:bg-[#fafcfb]"
                        }`}
                      >
                        <div className="md:w-48 shrink-0">
                          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#003333]">
                            <Clock className="w-4 h-4 text-[#027c68]" />
                            <span>{item.time}</span>
                          </div>
                          <span className="mt-1.5 inline-block rounded-md bg-[#eef4f1] px-2.5 py-0.5 text-[11px] font-semibold text-[#027c68]">
                            {item.category}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-base md:text-lg font-bold text-[#0e241e]">
                            {item.title}
                            {item.inlineArabicSup && (
                              <sup
                                dir="rtl"
                                className="ml-1 font-serif text-[0.72em] font-semibold text-[#003333] align-super leading-none"
                              >
                                {item.inlineArabicSup}
                              </sup>
                            )}
                            {item.titleSuffix}
                          </h4>

                          {item.arabic && (
                            <p
                              dir="rtl"
                              className="mt-1.5 text-lg font-serif text-[#003333]"
                            >
                              {item.arabic}
                            </p>
                          )}

                          {item.topic && (
                            <p className="mt-1 text-sm md:text-base italic text-[#234138]">
                              {item.topic}
                            </p>
                          )}

                          {item.facilitator && (
                            <p className="mt-2 text-sm text-[#4a625b]">
                              <span className="font-semibold text-[#027c68]">
                                Facilitator:{" "}
                              </span>
                              {item.facilitator}
                            </p>
                          )}

                          {item.panel && (
                            <div className="mt-3 rounded-xl bg-[#f4f7f5] border border-[#e0e8e4] p-3.5">
                              <p className="text-xs font-bold uppercase tracking-wider text-[#003333] mb-2">
                                Q&amp;A Panel Team
                              </p>
                              <ul className="space-y-1 text-sm text-[#2d463e] list-disc pl-5">
                                {item.panel.map((member) => (
                                  <li key={member}>{member}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Interactive Item Action Suite: Star, G-Cal, Ask AI */}
                        <div className="shrink-0 flex flex-row md:flex-col items-center md:items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#eef2f0]">
                          <button
                            type="button"
                            onClick={() => toggleStar(item.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              isStarred
                                ? "bg-[#c5a049] text-[#002828] font-bold shadow-xs"
                                : "border border-[#003333]/20 hover:border-[#c5a049] hover:bg-[#fff9ed] text-[#24423a]"
                            }`}
                            title={
                              isStarred
                                ? "Remove from My Jalsa starred schedule"
                                : "Star & bookmark in My Jalsa checklist"
                            }
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                isStarred
                                  ? "fill-[#002828] text-[#002828]"
                                  : "text-[#c5a049]"
                              }`}
                            />
                            <span>{isStarred ? "Starred" : "Star"}</span>
                          </button>

                          <a
                            href={getGoogleCalendarUrl(item, currentDay.dateISO)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-gray-200 hover:border-[#027c68] hover:bg-[#f0f7f4] px-3 py-1 text-[11px] font-medium text-[#2d4740] transition"
                            title="Add 15m alert to Google Calendar"
                          >
                            <CalendarPlus className="w-3 h-3 text-[#027c68]" />
                            <span>G-Cal</span>
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              openJalsaAI(
                                `Tell me about "${item.title}${item.titleSuffix ?? ""}" on ${currentDay.fullLabel} at ${item.time}.`
                              )
                            }
                            className="inline-flex items-center gap-1 rounded-full border border-[#003333]/20 hover:border-[#027c68] hover:bg-[#eef6f3] px-3 py-1 text-[11px] font-semibold text-[#003333] transition"
                          >
                            <Sparkles className="w-3 h-3 text-[#027c68]" />
                            <span>Ask AI</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Searchable Jalsa Q&A & Lecture Vault */}
        <div id="lecture-vault" className="mt-14">
          <JalsaLectureVault />
        </div>

        {/* Sound of Jalsa 2026 — 4-Language Audio Experience */}
        <div id="sound-of-jalsa" className="mt-14 -mx-4 sm:mx-0">
          <SoundOfJalsaCard />
        </div>

        {/* Circuit Photo & Awardee Finder */}
        <div id="circuit-finder" className="mt-14">
          <CircuitPhotoFinder />
        </div>

        {/* Closing Benediction Banner */}
        <div className="mt-12 rounded-2xl bg-[#003333] border-2 border-[#c5a049] px-6 py-8 text-center text-white shadow-xl">
          <p className="font-serif text-base md:text-lg tracking-wide text-[#f2dfaa] font-semibold">
            {JALSA_2026_META.closingBenediction}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={JALSA_2026_META.pdfDownloadUrl}
              download
              className="inline-flex items-center gap-2 rounded-full bg-[#b0e892] hover:bg-[#c3f1aa] text-[#003333] font-bold px-5 py-2.5 text-xs transition"
            >
              <Download className="w-4 h-4" />
              Download Full Programme PDF
            </a>
            <button
              type="button"
              onClick={handleExportCalendar}
              className="inline-flex items-center gap-2 rounded-full bg-[#c5a049] hover:bg-[#d6b25b] text-[#002626] font-bold px-5 py-2.5 text-xs transition"
            >
              <CalendarPlus className="w-4 h-4 text-[#002626]" />
              Export My Jalsa Calendar (.ics)
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 hover:bg-white/10 text-white font-semibold px-5 py-2.5 text-xs transition"
            >
              View Personalized Dashboard
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
