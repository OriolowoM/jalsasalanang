"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  Quote,
  MessageCircle,
  ExternalLink,
  Volume2,
} from "lucide-react";

export interface VaultEntry {
  id: string;
  category: "Keynote" | "Justice & Peace" | "Prayer & Reform" | "Q&A Symposium" | "Spiritual Dars";
  title: string;
  speaker: string;
  sessionTime: string;
  coreQuote: string;
  takeaway: string;
  keyPoints: string[];
  linkHash: string;
}

const VAULT_ENTRIES: VaultEntry[] = [
  {
    id: "v-keynote-justice",
    category: "Keynote",
    title: "Observing Justice and Human Rights: The Foundation for True Global Peace",
    speaker: "Respected Hafiz Yunus Omotayo Sahib",
    sessionTime: "Saturday 19 Dec · 10:40 AM – 11:30 AM",
    coreQuote: "True peace cannot be sustained through political rhetoric or economic dominance; it demands unconditional divine justice for all nations and individuals.",
    takeaway:
      "A profound thesis examining Quranic jurisprudence (Surah An-Nahl 16:91) on global equilibrium. Hafiz Omotayo demonstrates how modern international conflicts stem from double standards, and how the teachings of Islam and Hazrat Khalifatul Masih V (aba) provide an uncompromising roadmap for human equality.",
    keyPoints: [
      "Absolute justice (Adl) must be elevated above national or tribal interests.",
      "Human rights are God-given endowments, not concessions granted by world powers.",
      "The role of Ahmadi Muslims as active ambassadors of universal peace.",
    ],
    linkHash: "sat-lecture-2",
  },
  {
    id: "v-prayer-devotion",
    category: "Prayer & Reform",
    title: "The Role of Prayer and Devotion in World Reform",
    speaker: "Maulvi Qasim Oyekola Sahib",
    sessionTime: "Saturday 19 Dec · 11:45 AM – 12:25 PM",
    coreQuote: "The greatest weapon for global reformation is not material might, but the sincere tears shed in the solitude of Tahajjud before the Creator.",
    takeaway:
      "An inspiring analysis of spiritual reformation. Maulvi Oyekola articulates how individual piety and persistent congregational prayer form the unseen foundation of moral society, urging delegates to anchor their daily lives in voluntary Tahajjud and Istighfar.",
    keyPoints: [
      "Individual spiritual reform precedes collective societal transformation.",
      "The historical potency of the Promised Messiah’s (as) prayers in defending truth.",
      "Practical disciplines for maintaining high devotion beyond convention days.",
    ],
    linkHash: "sat-lecture-3",
  },
  {
    id: "v-divine-equity",
    category: "Justice & Peace",
    title: "“...And when you judge between mankind, judge with justice...”",
    speaker: "Respected Dr. AbdulHakeem Babatunde Sahib",
    sessionTime: "Sunday 20 Dec · 6:40 AM – 7:10 AM",
    coreQuote: "When justice departs from our judiciary, communities, and households, chaos becomes inevitable. Equity is the divine shield of the oppressed.",
    takeaway:
      "A rigorous examination of Surah An-Nisa (4:59) and judicial integrity. Dr. Babatunde bridges theological ethics with contemporary Nigerian governance, advocating for transparent civic accountability and ethical leadership across public institutions.",
    keyPoints: [
      "Justice begins within the domestic home and expands into state governance.",
      "The danger of preferential treatment and nepotism in community leadership.",
      "Fulfilling trusts (Amanat) as an essential Islamic obligation.",
    ],
    linkHash: "sun-lecture-5",
  },
  {
    id: "v-morning-dars-love",
    category: "Spiritual Dars",
    title: "Love for All, Hatred for None: Championing Universal Human Rights and Dignity",
    speaker: "Respected Nabeel-Ahmad Oyekola Sahib (Muballigh Silsila, Ilaro)",
    sessionTime: "Friday 18 Dec · 6:00 AM – 6:15 AM",
    coreQuote: "Our universal motto is not a passive catchphrase—it is an active obligation to feed the hungry, protect the vulnerable, and defend the truth.",
    takeaway:
      "The opening morning Dars delivered at dawn following Tahajjud and Fajr. Muballigh Oyekola outlines the foundational humanitarian ethos of Ahmadiyyat, highlighting how compassion toward all creatures is the highest expression of Islamic worship.",
    keyPoints: [
      "Universal brotherhood without prejudice against race, creed, or tribe.",
      "Practical daily acts of charity and service to humanity in local communities.",
      "Embodying the character of the Holy Prophet Muhammad (saw).",
    ],
    linkHash: "fri-dars-1",
  },
  {
    id: "v-qa-symposium",
    category: "Q&A Symposium",
    title: "Faith, Modern Science & Contemporary Dilemmas: Saturday Night Symposium",
    speaker: "Distinguished Q&A Panel of Scholars & Scientists",
    sessionTime: "Saturday 19 Dec · 8:30 PM – 10:00 PM",
    coreQuote: "There is no contradiction between the Word of God (the Quran) and the Work of God (Nature and Scientific Discovery).",
    takeaway:
      "A high-engagement symposium addressing questions submitted by youth and delegates. The panel tackled topics ranging from technological ethics, artificial intelligence, creation and evolution, marriage dynamics in modern society, and youth leadership in the Jama'at.",
    keyPoints: [
      "Harmony between genuine scientific exploration and Islamic cosmology.",
      "Guiding youth through contemporary ideological and digital distractions.",
      "Clear scholarly answers to intricate jurisprudential and moral questions.",
    ],
    linkHash: "sat-qa-session",
  },
];

const CATEGORIES = [
  "All",
  "Keynote",
  "Justice & Peace",
  "Prayer & Reform",
  "Q&A Symposium",
  "Spiritual Dars",
] as const;

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

export default function JalsaLectureVault() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [generatingCardId, setGeneratingCardId] = useState<string | null>(null);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return VAULT_ENTRIES.filter((entry) => {
      const matchCat =
        activeCategory === "All" || entry.category === activeCategory;
      if (!matchCat) return false;
      if (!q) return true;
      const haystack = `${entry.title} ${entry.speaker} ${entry.coreQuote} ${entry.takeaway} ${entry.keyPoints.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, searchQuery]);

  // Copy 3-line takeaway for WhatsApp
  const handleCopyWhatsApp = (entry: VaultEntry) => {
    const text = `⚡ *72nd Jalsa Salana Nigeria 2026 Key Takeaway*\n` +
      `“${entry.coreQuote}”\n` +
      `— *${entry.speaker}* (${entry.title})\n\n` +
      `📖 Read full takeaways & listen to 4-language official audio:\n` +
      `https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026`;

    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Generate 1080x1080 Quote Card for WhatsApp Status
  const handleDownloadStatusCard = (entry: VaultEntry) => {
    setGeneratingCardId(entry.id);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient: Emerald #003333 to #001f1f
    const grad = ctx.createLinearGradient(0, 0, 0, 1080);
    grad.addColorStop(0, "#003333");
    grad.addColorStop(0.5, "#012828");
    grad.addColorStop(1, "#001818");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Gold ornamental border
    ctx.strokeStyle = "#c5a049";
    ctx.lineWidth = 6;
    ctx.strokeRect(50, 50, 980, 980);

    ctx.strokeStyle = "rgba(197, 160, 89, 0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(65, 65, 950, 950);

    // Header branding
    ctx.fillStyle = "#b0e892";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("72ND JALSA SALANA NIGERIA 2026", 540, 120);

    ctx.fillStyle = "#e6cf93";
    ctx.font = "italic 22px serif";
    ctx.fillText("“Observing Justice and Human Rights: The foundation for true Global Peace”", 540, 160);

    // Gold divider
    ctx.strokeStyle = "#c5a049";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(340, 195);
    ctx.lineTo(740, 195);
    ctx.stroke();

    // Quotation mark icon
    ctx.fillStyle = "rgba(197, 160, 89, 0.25)";
    ctx.font = "bold 160px serif";
    ctx.fillText("“", 540, 340);

    // Main quote text wrapping
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 38px serif";
    ctx.textAlign = "center";

    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    };

    const lines = wrapText(`“${entry.coreQuote}”`, 820);
    const startY = 430 - (lines.length * 24);
    lines.forEach((line, i) => {
      ctx.fillText(line, 540, startY + (i * 54));
    });

    // Speaker attribution
    const bottomY = startY + (lines.length * 54) + 60;
    ctx.fillStyle = "#c5a049";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(`— ${entry.speaker}`, 540, bottomY);

    ctx.fillStyle = "#a3c2b7";
    ctx.font = "22px sans-serif";
    ctx.fillText(entry.title, 540, bottomY + 40);

    // Footer Watermark
    ctx.fillStyle = "#b0e892";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("jalsasalana.ng", 540, 970);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "18px sans-serif";
    ctx.fillText("Jamia Ahmadiyya Ilaro · 18th–20th December 2026", 540, 1005);

    // Trigger download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `jalsa-2026-quote-${entry.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setGeneratingCardId(null);
    }, 300);
  };

  return (
    <section
      id="lecture-vault"
      aria-label="Jalsa Q&A and Lecture Vault"
      className="rounded-3xl bg-[#002d2d] text-white border-2 border-[#c5a049]/50 p-6 sm:p-10 shadow-2xl relative overflow-hidden"
    >
      {/* Background Islamic Geometric Motif */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#024542] border border-[#c5a049]/40 px-3.5 py-1 text-xs font-semibold text-[#b0e892] uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5 text-[#c5a049]" />
          Scholarly Knowledge &amp; Q&amp;A Vault
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-black text-white leading-tight">
          Jalsa Q&amp;A &amp; Lecture Vault
        </h2>
        <p className="mt-2 text-sm text-[#c4ded5] leading-relaxed">
          Searchable 2-minute takeaways, core theological theses, and 1-tap WhatsApp Status quote cards from the 72nd Jalsa Salana Nigeria 2026 lectures.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#c5a049] text-[#002828] shadow-sm"
                  : "bg-white/10 text-[#d8eae2] hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#8ba89f] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search takeaways or quotes..."
            className="w-full rounded-xl bg-white/10 border border-white/20 pl-10 pr-4 py-2 text-xs text-white placeholder-[#8ba89f] focus:outline-none focus:border-[#b0e892]"
          />
        </div>
      </div>

      {/* Vault Cards Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEntries.map((entry) => (
          <article
            key={entry.id}
            className="rounded-2xl bg-[#003838] border border-[#c5a049]/35 hover:border-[#b0e892] p-5 sm:p-6 flex flex-col justify-between transition-all shadow-lg group"
          >
            <div>
              {/* Card Meta */}
              <div className="flex items-center justify-between text-xs text-[#a0c5b9] mb-3">
                <span className="rounded-full bg-[#024542] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#b0e892]">
                  {entry.category}
                </span>
                <span className="text-[11px] font-medium">{entry.sessionTime}</span>
              </div>

              {/* Title & Speaker */}
              <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-[#f4e0ad] transition-colors leading-snug">
                {entry.title}
              </h3>
              <p className="text-xs font-semibold text-[#c5a049] mt-1">
                {entry.speaker}
              </p>

              {/* Core Quote Box */}
              <div className="mt-4 rounded-xl bg-[#002626] border-l-4 border-l-[#c5a049] p-3.5 text-xs sm:text-sm italic text-[#e6f1ed] leading-relaxed relative">
                <Quote className="w-5 h-5 text-[#c5a049]/40 absolute top-2 right-2" />
                “{entry.coreQuote}”
              </div>

              {/* 2-Minute Takeaway */}
              <p className="mt-4 text-xs sm:text-sm text-[#c8dfd7] leading-relaxed">
                {entry.takeaway}
              </p>

              {/* Key Bullet Takeaways */}
              <ul className="mt-3.5 space-y-1.5 text-xs text-[#dcebe4]">
                {entry.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#b0e892] font-bold mt-0.5">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Card Action Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyWhatsApp(entry)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#d8eae2] px-3 py-1.5 text-xs font-medium transition"
                  title="Copy 3-line takeaway for WhatsApp Broadcast"
                >
                  {copiedId === entry.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#b0e892]" />
                      <span className="text-[#b0e892]">Copied 3-Line Post</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy WhatsApp 3-Line</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadStatusCard(entry)}
                  disabled={generatingCardId === entry.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#c5a049] hover:bg-[#d8b55e] text-[#002828] px-3 py-1.5 text-xs font-bold transition shadow-sm disabled:opacity-50"
                  title="Generate branded 1080x1080 quote card for WhatsApp Status"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {generatingCardId === entry.id
                      ? "Rendering Card..."
                      : "WhatsApp Status Card (PNG)"}
                  </span>
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  openJalsaAI(
                    `Give me a detailed scholarly summary of ${entry.speaker}’s lecture on "${entry.title}".`
                  )
                }
                className="inline-flex items-center gap-1 text-[11px] text-[#b0e892] hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                <span>Ask AI About Lecture</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
