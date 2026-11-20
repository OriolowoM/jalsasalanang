"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Clock,
  Sparkles,
  Volume2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Globe2,
  AlertCircle,
  Eye,
} from "lucide-react";
import {
  PROGRAMME_DAYS,
  type ProgrammeDay,
  type ProgrammeItem,
  JALSA_2026_META,
} from "@/lib/programme-2026";
import { parseSessionTimes } from "@/lib/programme-calendar";

interface SimulationPreset {
  id: string;
  name: string;
  dayId: string;
  timeDisplay: string;
  simulatedWATDate: string; // ISO with +01:00
}

const PRESETS: SimulationPreset[] = [
  {
    id: "fri-opening",
    name: "Fri 5:00 PM · Flag Hoisting & Opening",
    dayId: "friday",
    timeDisplay: "Friday 5:00 PM",
    simulatedWATDate: "2026-12-18T17:05:00+01:00",
  },
  {
    id: "sat-keynote",
    name: "Sat 10:40 AM · Keynote Lecture (Justice)",
    dayId: "saturday",
    timeDisplay: "Saturday 10:45 AM",
    simulatedWATDate: "2026-12-19T10:45:00+01:00",
  },
  {
    id: "sat-qa",
    name: "Sat 8:30 PM · Faith & Science Q&A",
    dayId: "saturday",
    timeDisplay: "Saturday 8:40 PM",
    simulatedWATDate: "2026-12-19T20:40:00+01:00",
  },
  {
    id: "sun-closing",
    name: "Sun 6:40 AM · Concluding Session",
    dayId: "sunday",
    timeDisplay: "Sunday 6:45 AM",
    simulatedWATDate: "2026-12-20T06:45:00+01:00",
  },
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

export default function LiveProgrammeStrip({
  onSelectDay,
}: {
  onSelectDay?: (dayId: string) => void;
}) {
  const [now, setNow] = useState<Date>(new Date());
  const [simulatedPresetId, setSimulatedPresetId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState<boolean>(false);

  // Tick clock every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Compute effective date (real WAT or simulated)
  const effectiveDate = useMemo(() => {
    if (simulatedPresetId) {
      const preset = PRESETS.find((p) => p.id === simulatedPresetId);
      if (preset) return new Date(preset.simulatedWATDate);
    }
    return now;
  }, [now, simulatedPresetId]);

  // Check if effective date is within convention days (Dec 18–20, 2026)
  const isConventionLive = useMemo(() => {
    const dStr = effectiveDate.toISOString();
    return (
      dStr.startsWith("2026-12-18") ||
      dStr.startsWith("2026-12-19") ||
      dStr.startsWith("2026-12-20")
    );
  }, [effectiveDate]);

  // Identify active day
  const activeDay = useMemo<ProgrammeDay | null>(() => {
    const dStr = effectiveDate.toISOString();
    if (dStr.startsWith("2026-12-18")) return PROGRAMME_DAYS[0];
    if (dStr.startsWith("2026-12-19")) return PROGRAMME_DAYS[1];
    if (dStr.startsWith("2026-12-20")) return PROGRAMME_DAYS[2];
    return null;
  }, [effectiveDate]);

  // Find Happening Now and Up Next items
  const { currentItem, nextItem, translationNotice } = useMemo(() => {
    if (!activeDay) {
      return {
        currentItem: null,
        nextItem: null,
        translationNotice: null,
      };
    }

    const t = effectiveDate.getTime();
    let current: ProgrammeItem | null = null;
    let next: ProgrammeItem | null = null;

    for (let i = 0; i < activeDay.items.length; i++) {
      const it = activeDay.items[i];
      const { startDate, endDate } = parseSessionTimes(
        it.time,
        activeDay.dateISO
      );
      const s = startDate.getTime();
      const e = endDate.getTime();

      if (t >= s && t < e) {
        current = it;
        next = activeDay.items[i + 1] || null;
        break;
      } else if (t < s) {
        if (!next) next = it;
      }
    }

    // Check for translation notice
    let trans: string | null = null;
    if (current && current.category === "Lecture") {
      trans = "Yorùbá & Hausa Translation Scheduled Next";
    } else if (next && (next.title.includes("Translation") || next.category === "Translation & Q&A")) {
      trans = `${next.title} Starts Soon (${next.time})`;
    }

    return {
      currentItem: current,
      nextItem: next,
      translationNotice: trans,
    };
  }, [activeDay, effectiveDate]);

  // Countdown to Opening (Friday Dec 18, 2026 at 15:00 WAT)
  const openingTarget = useMemo(
    () => new Date("2026-12-18T15:00:00+01:00").getTime(),
    []
  );
  const timeUntilOpening = useMemo(() => {
    const diff = openingTarget - now.getTime();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    return { days, hours, mins };
  }, [openingTarget, now]);

  return (
    <aside
      aria-label="Live Convention Timetable & Session Tracker"
      className="bg-[#002626] text-white border-b-2 border-[#c5a049] shadow-md transition-all"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        {/* Main Live Strip Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
          {/* Left: Active Session or Countdown */}
          <div className="flex items-center gap-3 min-w-0">
            {isConventionLive && currentItem ? (
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b0e892] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#b0e892]"></span>
                </span>
                <span className="rounded bg-[#024542] text-[#b0e892] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 border border-[#b0e892]/30">
                  Happening Now
                </span>
                <div className="min-w-0">
                  <span className="font-extrabold text-white text-xs sm:text-sm truncate block">
                    {currentItem.title}
                    {currentItem.titleSuffix && ` ${currentItem.titleSuffix}`}
                  </span>
                  <span className="text-[#a8c7bd] text-[11px] truncate block">
                    {currentItem.session} • {currentItem.time}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#c5a049]"></span>
                </span>
                <span className="rounded bg-[#024542] text-[#c5a049] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 border border-[#c5a049]/40">
                  Official Countdown
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-white text-xs sm:text-sm">
                    72nd Jalsa Salana Nigeria 2026
                  </span>
                  {timeUntilOpening && (
                    <span className="text-[#b0e892] text-[11px] ml-2 font-mono font-semibold">
                      {timeUntilOpening.days}d {timeUntilOpening.hours}h {timeUntilOpening.mins}m to Formal Opening
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Up Next, Translation & Action Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            {nextItem && (
              <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-[#b0e892]" />
                <span className="text-[#b0e892] font-semibold">Up Next:</span>
                <span className="text-[#e2eee9] font-medium max-w-[200px] truncate">
                  {nextItem.title} ({nextItem.time})
                </span>
              </div>
            )}

            {translationNotice && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#c5a049]/20 border border-[#c5a049]/40 text-[#f3e3ba] px-2 py-0.5 text-[10px] font-medium">
                <Globe2 className="w-3 h-3 text-[#c5a049]" />
                {translationNotice}
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                openJalsaAI(
                  currentItem
                    ? `Tell me about what is happening now: "${currentItem.title}" at ${currentItem.time}.`
                    : "What is starting next at Jalsa Salana Nigeria 2026?"
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-[#024542] hover:bg-[#035d59] border border-[#b0e892]/40 text-white px-3 py-1 text-[11px] font-semibold transition"
            >
              <Sparkles className="w-3 h-3 text-[#b0e892]" />
              <span>Ask Concierge AI</span>
            </button>

            {/* Test Simulation Mode Toggle */}
            <button
              type="button"
              onClick={() => setShowSimulator(!showSimulator)}
              className="inline-flex items-center gap-1 text-[10px] text-[#97b5ab] hover:text-[#b0e892] transition underline decoration-dotted ml-1"
              title="Preview how this strip reacts during live sessions in December 2026"
            >
              <Eye className="w-3 h-3" />
              <span>{showSimulator ? "Hide Preview" : "Preview Sessions"}</span>
            </button>
          </div>
        </div>

        {/* Optional Interactive Session Simulator Bar (For Organizers & Delegates) */}
        {showSimulator && (
          <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c5a049]">
              Simulate Live Convention Time:
            </span>
            {PRESETS.map((p) => {
              const active = simulatedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSimulatedPresetId(active ? null : p.id);
                    if (onSelectDay) onSelectDay(p.dayId);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                    active
                      ? "bg-[#c5a049] text-[#002828] font-bold"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
            {simulatedPresetId && (
              <button
                type="button"
                onClick={() => setSimulatedPresetId(null)}
                className="text-[10px] text-red-300 hover:text-white underline ml-2"
              >
                Reset to Current Time
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
