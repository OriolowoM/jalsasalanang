"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Search,
  Users,
  MapPin,
  Share2,
  Check,
  ExternalLink,
  Sparkles,
  Camera,
} from "lucide-react";

export interface SpotlightItem {
  id: string;
  category: "Awardee" | "Circuit" | "Volunteer" | "Auxiliary";
  subCategory: string; // e.g. "AMJN Academic Merit", "Lagos Circuit", "Khuddam Security"
  title: string;
  subtitle: string;
  description: string;
  image: string;
  location: string;
  tags: string[];
}

const SPOTLIGHT_DATA: SpotlightItem[] = [
  {
    id: "amjn-award-science",
    category: "Awardee",
    subCategory: "AMJN Academic Merit",
    title: "AMJN First Class & Doctorate Academic Merit Honorees",
    subtitle: "72nd Annual Convention Academic Excellence Recognition",
    description:
      "Honoring undergraduate First Class graduates, PhD inductees, and national distinction scholars from circuits across Nigeria. Presented by Amir Sahib on Saturday afternoon at the Main Marquee.",
    image: "/images/jalsa_gallery/jalsa-amir-gift-presentation.jpg",
    location: "Main Convention Marquee, Jamia Ilaro",
    tags: ["Academic Merit", "AMJN Awards", "Graduates", "Education"],
  },
  {
    id: "lagos-circuit-delegation",
    category: "Circuit",
    subCategory: "Lagos State",
    title: "Lagos State Circuit Delegation & Assembly",
    subtitle: "Over 8,500 Delegates from Ojokoro, Lagos Island, Agege & Ikorodu",
    description:
      "Lagos State circuit delegates gathering during the opening Friday parade and Saturday progress report assembly. Tagged for families and circuit archives.",
    image: "/images/jalsa_gallery/jalsa-delegates-accreditation-cards.jpg",
    location: "Gate 2 Hub & Marquee Sector A",
    tags: ["Lagos", "Ojokoro", "Delegates", "Accreditation"],
  },
  {
    id: "khuddam-security-volunteers",
    category: "Volunteer",
    subCategory: "Khuddam (MKAN)",
    title: "Majlis Khuddamul Ahmadiyya Nigeria Security & Traffic Corps",
    subtitle: "Dedicated Volunteer Logistics & Crowd Safety Directorate",
    description:
      "Over 1,200 disciplined Khuddam managing vehicle conveyances along the Papalanto detour, pedestrian corridors, and 24-hour perimeter security throughout the convention.",
    image: "/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg",
    location: "Gate 1 North Expressway & Traffic Checkpoints",
    tags: ["MKAN", "Security", "Volunteers", "Discipline"],
  },
  {
    id: "ogun-ilaro-host-circuit",
    category: "Circuit",
    subCategory: "Ogun & Ilaro",
    title: "Host Circuit: Ogun State & Jamia Ahmadiyya Community",
    subtitle: "Local Organising Committee & Ground Preparations",
    description:
      "The dedicated hosting team from Ilaro, Abeokuta, Sagamu, and Ijebu Ode circuits welcoming thousands of honorable guests of the Promised Messiah (as).",
    image: "/images/jalsa_gallery/jalsa-amir-ground-inspection.jpg",
    location: "Jamia Ahmadiyya Ilaro Complex",
    tags: ["Ogun", "Ilaro", "Abeokuta", "Host"],
  },
  {
    id: "ansarullah-elders-assembly",
    category: "Auxiliary",
    subCategory: "Ansarullah",
    title: "Majlis Ansarullah Nigeria Elders Council & Traditional Dignitaries",
    subtitle: "Spiritual Guidance & Community Leadership",
    description:
      "Respected elders and traditional rulers arriving in ceremonial robes, seated in the VIP dignitary row for Friday Inaugural and Saturday Keynote addresses.",
    image: "/images/jalsa_gallery/jalsa-elders-traditional-attire.jpg",
    location: "Central Dignitary Pavilion",
    tags: ["Ansarullah", "Elders", "Traditional Rulers", "Obas"],
  },
  {
    id: "cycling-convoys-arrival",
    category: "Volunteer",
    subCategory: "Youth & Sports",
    title: "National Cycling Association Pilgrimage Arrival",
    subtitle: "Cross-Country Devotional Ride to Jalsa Conference Grounds",
    description:
      "Ahmadi Muslim youth cyclists arriving in disciplined convoy at Jamia Ilaro after endurance rides across Southwestern states to attend the annual assembly.",
    image: "/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg",
    location: "Gate 1 Main Boulevard",
    tags: ["Cycling", "Youth", "Pilgrimage", "MKAN"],
  },
  {
    id: "tahajjud-night-devotion",
    category: "Auxiliary",
    subCategory: "Spiritual Devotion",
    title: "Pre-Dawn Tahajjud & Congregation Devotion",
    subtitle: "Over 15,000 Worshippers in United Prostration",
    description:
      "Electrifying atmosphere of spiritual devotion at 4:30 AM inside the Main Marquee under the guidance of assigned Huffaz and scholars.",
    image: "/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg",
    location: "Main Men's Marquee & Open Lawns",
    tags: ["Tahajjud", "Prayer", "Sujud", "Spiritual"],
  },
];

const FILTER_PILLS = [
  "All",
  "AMJN Academic Merit",
  "Lagos State",
  "Ogun & Ilaro",
  "Khuddam (MKAN)",
  "Ansarullah",
  "Volunteers",
] as const;

export default function CircuitPhotoFinder() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SPOTLIGHT_DATA.filter((item) => {
      const matchFilter =
        activeFilter === "All" ||
        item.subCategory.toLowerCase().includes(activeFilter.toLowerCase()) ||
        (activeFilter === "Volunteers" && item.category === "Volunteer");
      if (!matchFilter) return false;
      if (!q) return true;
      const haystack = `${item.title} ${item.subtitle} ${item.description} ${item.location} ${item.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeFilter, searchQuery]);

  const handleShare = (item: SpotlightItem) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/galleries#${item.id}` : "https://jalsasalana.ng/galleries";
    const shareText = `🌟 *Jalsa Salana Nigeria Spotlight:* ${item.title}\n${item.subtitle}\n\nView photos & records: ${url}`;

    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: item.title,
          text: shareText,
          url,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText);
        setCopiedId(item.id);
        setTimeout(() => setCopiedId(null), 2500);
      }
    }
  };

  return (
    <section
      id="circuit-finder"
      aria-label="Circuit Photo & Awardee Finder"
      className="rounded-3xl bg-white border border-[#d9e3de] p-6 sm:p-10 shadow-lg"
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-6 border-b border-[#e2eae6]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#027c68] mb-2">
            <Award className="w-4 h-4 text-[#c5a049]" />
            Circuit &amp; Awardee Directory
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#003333]">
            Circuit Photo &amp; Awardee Finder
          </h2>
          <p className="mt-1 text-sm text-[#4a645d]">
            Celebrate your regional circuit delegates, volunteer teams, and AMJN Academic Merit Award recipients.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#607d75] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by circuit, name, or role..."
            className="w-full rounded-xl border border-[#cfdcd6] bg-[#f8faf9] pl-10 pr-4 py-2 text-xs text-[#11241f] focus:outline-none focus:border-[#027c68]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {FILTER_PILLS.map((pill) => (
          <button
            key={pill}
            type="button"
            onClick={() => setActiveFilter(pill)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition whitespace-nowrap ${
              activeFilter === pill
                ? "bg-[#003333] text-white shadow-xs"
                : "bg-[#f1f5f3] text-[#2c4740] hover:bg-[#e4ece8]"
            }`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <article
            key={item.id}
            id={item.id}
            className="rounded-2xl border border-[#d9e5e0] overflow-hidden bg-white shadow-xs hover:shadow-md transition flex flex-col justify-between group"
          >
            <div>
              <div className="relative aspect-[16/10] bg-[#e6eee9] overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                    <Camera className="w-3 h-3 text-[#c5a049]" />
                    {item.subCategory}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#027c68] mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a049] shrink-0" />
                  <span>{item.location}</span>
                </div>

                <h3 className="font-display font-bold text-base text-[#0e2520] group-hover:text-[#027c68] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-[#c5a049] mt-0.5">
                  {item.subtitle}
                </p>

                <p className="mt-3 text-xs text-[#4b635c] line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-[#f0f4f2] text-[10px] font-medium text-[#2d4740]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#edf2ef] mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleShare(item)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f5f3] hover:bg-[#003333] hover:text-white text-[#1a342e] px-3.5 py-1.5 text-xs font-semibold transition"
                title="Share this spotlight link on WhatsApp"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#027c68]" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Spotlight</span>
                  </>
                )}
              </button>

              <Link
                href="/galleries"
                className="text-xs font-bold text-[#027c68] hover:underline flex items-center gap-1"
              >
                <span>Full Album</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
