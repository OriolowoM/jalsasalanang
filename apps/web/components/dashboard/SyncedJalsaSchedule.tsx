"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Download, ArrowUpRight } from "lucide-react";
import { JALSA_2026_META, PROGRAMME_DAYS } from "@/lib/programme-2026";

export function SyncedJalsaSchedule() {
  const [selectedDayId, setSelectedDayId] = useState("friday");
  const day =
    PROGRAMME_DAYS.find((d) => d.id === selectedDayId) ?? PROGRAMME_DAYS[0];
  const keyHighlights = day.items.filter(
    (item) => item.highlight || item.category === "Lecture" || item.id === "f12"
  );

  return (
    <section className="rounded-2xl border border-[#d9e3de] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5ece8] pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#027c68]">
            72nd Jalsa Salana · Official Synced Schedule
          </span>
          <h2 className="mt-1 text-xl font-extrabold text-[#003333]">
            “{JALSA_2026_META.theme}”
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={JALSA_2026_META.pdfDownloadUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-full bg-[#003333] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#024542]"
          >
            <Download className="w-3.5 h-3.5" />
            PDF
          </a>
          <Link
            href="/programme-of-events-jalsa-salana-nigeria-2026"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#003333]/20 px-4 py-2 text-xs font-bold text-[#003333] transition hover:bg-[#eef6f3]"
          >
            Full Programme
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROGRAMME_DAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelectedDayId(d.id)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              d.id === selectedDayId
                ? "bg-[#003333] text-white"
                : "bg-[#f1f5f3] text-[#1f3b34] hover:bg-[#e3ece8]"
            }`}
          >
            {d.shortLabel}
          </button>
        ))}
      </div>

      <ul className="mt-4 divide-y divide-[#eef2f0]">
        {keyHighlights.map((item) => (
          <li
            key={item.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#027c68] sm:w-40 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              {item.time}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#0e241e]">
                {item.title}
                {item.inlineArabicSup && (
                  <sup
                    dir="rtl"
                    className="ml-1 font-serif text-[0.72em] font-semibold text-[#003333]"
                  >
                    {item.inlineArabicSup}
                  </sup>
                )}
                {item.titleSuffix}
              </p>
              {item.facilitator && (
                <p className="text-xs text-[#4a625b]">{item.facilitator}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SyncedJalsaSchedule;
