"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  MessageCircle,
  HelpCircle,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  MapPin,
  Ban,
  Droplet,
  Flame,
  BookX,
  Wine,
} from "lucide-react";

export default function JalsaMarketPage() {
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedAccount(id);
      setTimeout(() => setCopiedAccount(null), 2500);
    }
  };

  const openJalsaAI = (query: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("open-jalsa-ai", { detail: { query } })
      );
      window.dispatchEvent(
        new CustomEvent("jalsa-ai:ask", { detail: { prompt: query } })
      );
    }
  };

  const categories = [
    {
      code: "A",
      title: "Real / Solid Meals",
      description: "Cooked food, rice dishes, swallow, soups, and traditional solid meals.",
    },
    {
      code: "B",
      title: "Soft Drinks, Snacks & Pastries",
      description: "Non-alcoholic beverages, chilled drinks, meat pies, puff-puff, pap, akara, moimoi.",
    },
    {
      code: "C",
      title: "Clothes, Textiles & Gift Items",
      description: "Sub-categories: Islamic Men's attire, Islamic Women's attire, Islamic Mixed, or General clothing.",
    },
    {
      code: "D",
      title: "Fruits & Fresh Produce",
      description: "Fresh oranges, apples, pineapples, bananas, and assorted healthy varieties.",
    },
    {
      code: "E",
      title: "Herbs & Traditional Remedies",
      description: "Natural herbal remedies, approved traditional oils, and health seasonings.",
    },
    {
      code: "F",
      title: "Pepper Grinder (Elero)",
      description: "Dedicated grinding services operating under authorized environmental safety rules.",
    },
    {
      code: "G",
      title: "Provisions & Daily Toiletries",
      description: "Packaged biscuits, milk, tea, soaps, toothpaste, detergents, and travel essentials.",
    },
    {
      code: "H",
      title: "Phone Charging & Public Calls",
      description: "Electrical multi-point device recharging and urgent airtime/call services.",
    },
  ];

  const liaisonOfficers = [
    {
      id: "ilaro-officer",
      name: "Bro. Alaka Mahmud",
      role: "Central Market Officer & Ground Allocation",
      region: "Ilaro & Western Hub",
      location: "Jamia Ahmadiyya Ilaro Grounds",
      phone: "07063374914",
      telLink: "tel:+2347063374914",
      whatsappLink: "https://wa.me/2347063374914?text=Assalamu%20Alaikum%20Bro.%20Mahmud,%20I%20would%20like%20to%20register%20for%20a%20stall%20at%20Jalsa%20Salana%202026%20Market.",
    },
    {
      id: "lagos-officer",
      name: "Bro. Olawale Utman",
      role: "Regional Liaison Officer",
      region: "Lagos State Operations",
      location: "Amu Ojokoro Circuit Centre",
      phone: "08083127892",
      telLink: "tel:+2348083127892",
      whatsappLink: "https://wa.me/2348083127892?text=Assalamu%20Alaikum%20Bro.%20Utman,%20I%20am%20in%20Lagos%20and%20need%20a%20Jalsa%202026%20Market%20form.",
    },
    {
      id: "abeokuta-officer",
      name: "Bro. Muiz Ajayi",
      role: "Regional Liaison Officer",
      region: "Abeokuta & Ogun Circuits",
      location: "Abeokuta Circuit Secretariat",
      phone: "08067493314",
      telLink: "tel:+2348067493314",
      whatsappLink: "https://wa.me/2348067493314?text=Assalamu%20Alaikum%20Bro.%20Ajayi,%20I%20would%20like%20to%20register%20for%20Jalsa%202026%20Market%20in%20Abeokuta.",
    },
  ];

  const centres = [
    {
      city: "ILARO",
      location: "Jamia Ahmadiyya Ilaro Ground",
      officer: "Bro. Alaka Mahmud",
      phone: "07063374914",
      telLink: "tel:+2347063374914",
    },
    {
      city: "LAGOS",
      location: "Amu Ojokoro Circuit Centre",
      officer: "Bro. Olawale Utman",
      phone: "08083127892",
      telLink: "tel:+2348083127892",
    },
    {
      city: "ABEOKUTA",
      location: "Abeokuta Circuit Secretariat",
      officer: "Bro. Muiz Ajayi",
      phone: "08067493314",
      telLink: "tel:+2348067493314",
    },
    {
      city: "IBADAN",
      location: "Oyo State Coordination",
      officer: "Main Market WhatsApp Helpdesk",
      phone: "08122715410 / 07063374914",
      telLink: "tel:+2348122715410",
      note: "Contact official WhatsApp for pickup instructions",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf8] text-[#11241f] font-sans">
      {/* Top Breadcrumb Header */}
      <div className="bg-[#002626] text-[#b0e892] border-b border-[#024542] px-4 sm:px-6 lg:px-8 py-3 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="hover:text-white transition flex items-center gap-1.5"
          >
            ← Return to Jalsa Salana Home
          </Link>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/programme-of-events-jalsa-salana-nigeria-2026"
              className="hover:text-white transition"
            >
              Programme of Events
            </Link>
            <span className="text-[#c5a049]">•</span>
            <Link
              href="/dashboard"
              className="hover:text-white transition"
            >
              Delegate Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#003333] via-[#012f2f] to-[#022828] text-white py-16 sm:py-20 border-b-4 border-[#c5a049]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#024542] border border-[#c5a049]/40 px-4 py-1.5 text-xs font-semibold text-[#b0e892] uppercase tracking-widest mb-6">
            <Store className="w-3.5 h-3.5 text-[#c5a049]" />
            Official Vendor Guidelines · 72nd Jalsa Salana 2026
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Secure Your Space at the <br className="hidden sm:inline" />
            <span className="text-[#e6c97a]">Jalsa Salana 2026 Market!</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#d0e4dc] max-w-3xl mx-auto leading-relaxed font-serif italic">
            Join us in serving the thousands of honorable guests of the Promised Messiah (as). Book your stall or open space today for a well-organized, spirit-filled, and profitable Jalsa experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#pricing"
              className="px-6 py-3.5 rounded-full bg-[#c5a049] hover:bg-[#d8b55e] text-[#002828] font-bold text-sm transition shadow-lg inline-flex items-center gap-2"
            >
              View Stalls &amp; Fees <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/2347063374914?text=Assalamu%20Alaikum,%20I%20am%20interested%20in%20booking%20a%20stall%20at%20Jalsa%20Salana%202026%20Market."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-full border-2 border-[#b0e892] bg-[#003838] hover:bg-[#024a4a] text-white font-bold text-sm transition inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#b0e892]" />
              Inquire via WhatsApp
            </a>
            <button
              onClick={() => openJalsaAI("What are the pricing, rules and collection centres for the Jalsa Salana 2026 Market?")}
              className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#b0e892]" />
              Ask Market AI
            </button>
          </div>
        </div>
      </section>

      {/* Critical Notice & Timeline Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border-2 border-[#c5a049] shadow-md hover:shadow-lg transition">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#027c68] mb-1">
              <Calendar className="w-4 h-4 text-[#c5a049]" />
              Deadline for Form Submission
            </div>
            <div className="text-xl font-extrabold text-[#003333]">
              1st December 2026
            </div>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              All completed forms and proof of payment must be returned on or before this date. First-come, first-served.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#027c68] mb-1">
              <Clock className="w-4 h-4 text-[#027c68]" />
              Operating Hours
            </div>
            <div className="text-xl font-extrabold text-[#003333]">
              7:00 AM – 10:00 PM Daily
            </div>
            <p className="text-xs text-amber-700 font-semibold mt-1.5 leading-relaxed">
              ⚠️ Strictly closed during all Jalsa sessions, speeches, and congregational prayers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-xl">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-[#027c68] mb-1">
              <ShieldAlert className="w-4 h-4 text-[#c5a049]" />
              Mandatory Briefing
            </div>
            <div className="text-xl font-extrabold text-[#003333]">
              5 Days Before Jalsa
            </div>
            <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
              Nazim Market conducts a compulsory orientation on market ethics and grounds safety for all approved traders.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing & Booking Details */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#027c68]">
            Transparent Pricing
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#003333] mt-1">
            Market Space Categories &amp; Fees
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Pricing includes allocation on the official Jalsa Market grounds at Jamia Ahmadiyya Ilaro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Standard Stall */}
          <div className="rounded-3xl bg-white border-2 border-[#003333] p-8 shadow-soft relative flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-[#b0e892] text-[#003333] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#027c68]">
                Constructed Space
              </div>
              <h3 className="font-display font-black text-2xl text-[#003333] mt-1">
                Standard Stall
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#003333]">₦16,000</span>
                <span className="text-xs text-ink-muted font-medium">/ 3-day convention</span>
              </div>
              <div className="mt-2 text-xs text-ink-muted">
                + ₦1,000 non-refundable form &amp; ethics guide fee
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[#2d463e]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Designated covered perimeter stall
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Security surveillance throughout Jalsa
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Authorized vendor badge &amp; numbered space
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Official listing under chosen product category
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-border">
              <a
                href="#liaison-desk"
                className="w-full py-3 rounded-xl bg-[#003333] hover:bg-[#024542] text-white font-bold text-xs uppercase tracking-wider text-center block transition"
              >
                Connect with Liaison Officer
              </a>
            </div>
          </div>

          {/* Card 2: Open Space */}
          <div className="rounded-3xl bg-white border border-surface-border p-8 shadow-soft flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#027c68]">
                Open Perimeter
              </div>
              <h3 className="font-display font-black text-2xl text-[#003333] mt-1">
                Open Space
              </h3>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[#003333]">₦11,000</span>
                <span className="text-xs text-ink-muted font-medium">/ 3-day convention</span>
              </div>
              <div className="mt-2 text-xs text-ink-muted">
                + ₦1,000 non-refundable form &amp; ethics guide fee
              </div>

              <ul className="mt-6 space-y-3 text-sm text-[#2d463e]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Designated open-air boundary plot
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Ideal for umbrella setups or portable displays
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Authorized vendor badge &amp; allocation peg
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#027c68] shrink-0" />
                  Same operating hours (7:00 AM – 10:00 PM)
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-border">
              <a
                href="#liaison-desk"
                className="w-full py-3 rounded-xl border-2 border-[#003333] hover:bg-[#eef4f1] text-[#003333] font-bold text-xs uppercase tracking-wider text-center block transition"
              >
                Connect with Liaison Officer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Official Market Liaison & Booking Verification Desk */}
      <section id="liaison-desk" className="bg-[#002d2d] text-white py-16 border-y border-[#024542]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b0e892]">
              Direct Coordination Desk
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-1">
              Official Market Liaison Officers
            </h2>
            <p className="text-xs sm:text-sm text-[#c8ded6] mt-3 leading-relaxed">
              To ensure authentic space allocation and transparent verification, please connect directly with the designated Jama’at liaison officer for your region. Our officers coordinate physical form issuance, category verification, and payment processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liaisonOfficers.map((officer) => (
              <div
                key={officer.id}
                className="rounded-2xl bg-[#003838] border-2 border-[#c5a049]/40 p-6 flex flex-col justify-between shadow-lg hover:border-[#b0e892] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#b0e892] font-semibold mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] uppercase tracking-wider">
                      {officer.region}
                    </span>
                    <span className="text-[10px] font-bold text-[#e6c97a] uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#b0e892]" /> Verified Desk
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-white">
                    {officer.name}
                  </h3>
                  <div className="text-xs font-medium text-[#b0e892] mt-0.5">
                    {officer.role}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-[#c8ded6]">
                    <MapPin className="w-3.5 h-3.5 text-[#c5a049] shrink-0" />
                    <span>{officer.location}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm font-mono font-bold text-white">
                    <Phone className="w-3.5 h-3.5 text-[#b0e892] shrink-0" />
                    <span>{officer.phone}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
                  <a
                    href={officer.telLink}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#b0e892]" /> Call
                  </a>
                  <a
                    href={officer.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#027c68] hover:bg-[#039880] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition text-center shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#b0e892]" /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-[#002626] border border-[#c5a049]/30 p-5 text-center text-xs text-[#c8ded6] max-w-2xl mx-auto leading-relaxed">
            🛡️ <strong>Security &amp; Ethical Trading Notice:</strong> Official Jama’at banking details are provided directly by the verified liaison officers above upon review of your application and chosen goods category. Never transfer funds to personal or unverified third-party accounts.
          </div>
        </div>
      </section>

      {/* Approved Sales Categories (Strict Single Category Enforcement) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#027c68]">
            Order &amp; Discipline
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#003333] mt-1">
            Approved Sales Categories
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Traders must select <strong>EXACTLY ONE</strong> category for their space. Mixing different categories within one stall is strictly prohibited to prevent disorder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.code}
              className="rounded-2xl bg-white border border-surface-border p-5 hover:border-[#027c68] transition-all hover:shadow-soft"
            >
              <div className="w-8 h-8 rounded-xl bg-[#003333] text-white flex items-center justify-center font-bold text-xs mb-3">
                {cat.code}
              </div>
              <h4 className="font-display font-bold text-base text-[#003333] mb-1">
                {cat.title}
              </h4>
              <p className="text-xs text-ink-muted leading-relaxed">
                {cat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Strict Prohibitions & Penalties */}
      <section className="bg-red-50/70 border-y border-red-200 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-red-700 flex items-center justify-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Strictly Prohibited &amp; Zero Tolerance
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-red-950 mt-1">
              Market Prohibitions &amp; Penalties
            </h2>
            <p className="text-xs sm:text-sm text-red-900/80 mt-2">
              Any vendor found violating these fundamental rules will face immediate expulsion without refund and a permanent ban.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="rounded-2xl bg-white p-5 border border-red-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <Wine className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-red-950 mb-1">NO ALCOHOL</h4>
              <p className="text-xs text-red-900/70">
                All alcoholic beverages, in any form, packaging, or brand, are 100% prohibited across the entire convention premises.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-red-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <BookX className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-red-950 mb-1">NO BOOKS OR MEDIA</h4>
              <p className="text-xs text-red-900/70">
                Sales of religious books, literature, cassettes, CDs, and audio/video media are reserved solely for official Jama’at departments.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-red-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-red-950 mb-1">NO FIREWOOD / CHARCOAL</h4>
              <p className="text-xs text-red-900/70">
                The use of firewood or charcoal for cooking is strictly prohibited on safety, environmental, and fire hazard grounds.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-red-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <Droplet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-red-950 mb-1">ONLY LIMAN WATER</h4>
              <p className="text-xs text-red-900/70">
                The only brand of sachet or bottled pure water approved for sale within the Jalsa Market is <strong>LIMAN BRAND</strong>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 border border-red-200 text-xs sm:text-sm text-red-950 leading-relaxed max-w-4xl mx-auto space-y-2">
            <p>
              ⚖️ <strong>Defaulters Penalty:</strong> Defaulting traders will be immediately expelled from the Jalsa Market without compensation. They will be permanently banned from the Jalsa Market in person or by proxy now and in the future.
            </p>
            <p>
              🛡️ <strong>Non-Members Requirement:</strong> Traders who are not registered members of the Ahmadiyya Muslim Jama’at must present an active Jama’at member as an official guarantor who will stand for them.
            </p>
          </div>
        </div>
      </section>

      {/* Collection & Returning Centres */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#027c68]">
            Pickup &amp; Submission
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#003333] mt-1">
            Collection &amp; Returning Centres
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Obtain physical forms (₦1,000 fee) and submit completed applications with payment receipts at any of these verified centres.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centres.map((c) => (
            <div
              key={c.city}
              className="rounded-2xl bg-white border border-surface-border p-6 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#003333] text-white text-[11px] font-black uppercase tracking-wider mb-3">
                  {c.city}
                </div>
                <h4 className="font-bold text-sm text-[#003333]">{c.location}</h4>
                <p className="text-xs text-ink-muted mt-1">{c.officer}</p>
                {c.note && (
                  <p className="text-[11px] text-[#027c68] font-medium mt-1">
                    ℹ️ {c.note}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-surface-border">
                <a
                  href={c.telLink}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#027c68] hover:text-[#003333] transition"
                >
                  <Phone className="w-3.5 h-3.5" /> {c.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Contact & Helpdesk CTA */}
      <section className="bg-gradient-to-r from-[#003333] to-[#014238] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="w-8 h-8 text-[#b0e892] mx-auto mb-3" />
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Have Questions About Market Booking?
          </h2>
          <p className="text-xs sm:text-sm text-[#d6ede3] max-w-2xl mx-auto mt-2 leading-relaxed">
            Need clarity on approved categories, payment confirmation, or space allocation? Chat directly with the Market Committee or consult our instant AI assistant.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/2347063374914?text=Assalamu%20Alaikum,%20I%20need%20clarification%20on%20Jalsa%20Market%20space%20booking."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#c5a049] hover:bg-[#d8b55e] text-[#002626] font-bold text-xs uppercase tracking-wider transition inline-flex items-center gap-2 shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Market Desk (07063374914)
            </a>
            <button
              onClick={() => openJalsaAI("How much is a stall at the Jalsa Market 2026 and what are the bank account details?")}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition inline-flex items-center gap-2 border border-white/20"
            >
              <Sparkles className="w-4 h-4 text-[#b0e892]" />
              Ask Jalsa Smart AI
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
