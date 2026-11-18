'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Smartphone,
  Users,
  QrCode,
  Bus,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Maximize2,
  X,
  Download,
} from 'lucide-react';

const HIGHLIGHT_POINTS = [
  {
    code: 'F01',
    badge: 'WALLET PASS',
    icon: Smartphone,
    title: 'Digital Tag on Your Phone',
    desc: 'No paper slips required. Download your delegate badge directly to your device with offline Apple & Google Wallet access.',
  },
  {
    code: 'F02',
    badge: 'HOUSEHOLD',
    icon: Users,
    title: 'Whole Family Registration',
    desc: 'Household heads can register spouse, children, and elderly relatives in one single seamless submission.',
  },
  {
    code: 'F04',
    badge: 'GATE QR',
    icon: QrCode,
    title: 'Self Check-In at Ilaro Gates',
    desc: 'Scan gate QR posters upon arrival at Jamia Ilaro to verify attendance and skip long manual verification queues.',
  },
  {
    code: 'F05',
    badge: 'CONVOY BUS',
    icon: Bus,
    title: 'Conveyance & Group Forms',
    desc: 'Circuit coordinators can register chartered buses and check in entire convoys with one single scan.',
  },
];

const SINGLE_FEATURED_FLYER = {
  title: 'Official 72nd Jalsa Salana Registration Poster',
  desc: 'Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony — Official publicity design for the 72nd Annual Convention.',
  flyerFeed: '/images/registration/jalsa2026-flyer-01-the-arch_feed.webp',
  flyerStatus: '/images/registration/jalsa2026-flyer-01-the-arch_status.webp',
};

export default function RegistrationShowcase() {
  const portalUrl = 'https://jalsa.ahmadiyyanigeria.net/';
  const [selectedFlyer, setSelectedFlyer] = useState<any | null>(null);
  const [modalFormat, setModalFormat] = useState<'feed' | 'status'>('feed');

  return (
    <section className="py-20 sm:py-28 bg-forest text-white relative overflow-hidden">
      {/* Subtle organic background mesh */}
      <div className="absolute inset-0 bg-islamic-stars opacity-20 pointer-events-none" />

      {/* Soft gradient aura */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-teal/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[550px] h-[550px] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main 2-Column Showcase: Features on Left, Exactly ONE Featured Flyer on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-16">
          {/* Left Column (7 cols): Information, Core Highlights, and CTAs */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/20 text-lime border border-teal/30 text-[11px] font-display font-semibold tracking-widest uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5 text-lime" />
              <span>Official Delegate Registration Portal</span>
            </div>

            <h2 className="font-display font-extrabold text-display-lg text-white leading-tight">
              Register for Jalsa Salana Nigeria 2026
            </h2>

            <p className="text-base sm:text-lg text-white/70 mt-3 max-w-2xl leading-relaxed">
              Your spiritual journey to Jamia Ahmadiyya Ilaro begins with registration. Secure your digital tag, household badge, lodging allocation, and meal access in advance.
            </p>

            {/* Core Benefits 2x2 Grid — Clean Cards without Clutter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-8">
              {HIGHLIGHT_POINTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-forest-950/60 backdrop-blur-md rounded-2xl border border-white/10 p-4 hover:border-teal/40 transition-colors group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-xl bg-teal/20 border border-teal/30 flex items-center justify-center text-lime flex-shrink-0">
                        <Icon className="w-4 h-4 text-lime" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-lime/90 uppercase tracking-wider block">
                          {item.badge}
                        </span>
                        <h3 className="font-display font-bold text-sm text-white group-hover:text-lime transition-colors leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed font-sans">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Register on Portal Now</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <Link
                href="/registration"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-colors border border-white/15"
              >
                <span>Full Registration Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Exactly ONE Featured Flyer */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md bg-forest-950/70 backdrop-blur-md rounded-3xl border border-white/15 p-5 shadow-2xl group hover:border-teal/50 transition-all">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-[10px] font-display font-bold uppercase tracking-widest text-lime flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-lime" />
                  Official Convention Flyer
                </span>
                <span className="text-[10px] font-mono text-white/50 bg-white/10 px-2 py-0.5 rounded">
                  72nd Jalsa
                </span>
              </div>

              {/* The Single Flyer Artwork */}
              <div
                onClick={() => {
                  setSelectedFlyer(SINGLE_FEATURED_FLYER);
                  setModalFormat('feed');
                }}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-forest-900/60 shadow-inner cursor-pointer ring-1 ring-white/10 group-hover:ring-teal/40 transition-all"
              >
                <Image
                  src={SINGLE_FEATURED_FLYER.flyerFeed}
                  alt={SINGLE_FEATURED_FLYER.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Hover Zoom Prompt */}
                <div className="absolute inset-0 bg-forest-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white backdrop-blur-[2px]">
                  <Maximize2 className="w-4 h-4 text-lime" />
                  <span>Click to Enlarge Flyer</span>
                </div>
              </div>

              <div className="pt-3 mt-3 flex items-center justify-between text-xs">
                <span className="text-white/70 text-[11px] font-sans">
                  Tap artwork to inspect &amp; download
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFlyer(SINGLE_FEATURED_FLYER);
                    setModalFormat('feed');
                  }}
                  className="text-lime hover:underline font-bold text-xs flex items-center gap-1"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View Fullsize</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Trust Badges Strip: Subdued Background Blocking */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-lime font-display font-bold text-xs uppercase tracking-wider block">100% Free Entry</span>
            <span className="text-xs text-white/60 mt-0.5 block">Zero registration fees</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-lime font-display font-bold text-xs uppercase tracking-wider block">Langar Meals</span>
            <span className="text-xs text-white/60 mt-0.5 block">Breakfast, lunch &amp; dinner</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-lime font-display font-bold text-xs uppercase tracking-wider block">Marquee Lodging</span>
            <span className="text-xs text-white/60 mt-0.5 block">Designated auxiliary sectors</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-lime font-display font-bold text-xs uppercase tracking-wider block">Digital Wallet</span>
            <span className="text-xs text-white/60 mt-0.5 block">Offline Apple &amp; Google pass</span>
          </div>
        </div>

        {/* Bottom Banner with Verification Callout */}
        <div className="bg-forest-950/70 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal/20 border border-teal/30 flex items-center justify-center text-lime flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-lime" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Official Convention Registration Link
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                Always ensure you complete your registration directly via{' '}
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime font-mono hover:underline font-bold"
                >
                  jalsa.ahmadiyyanigeria.net
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/registration#faqs"
              className="text-xs text-white/70 hover:text-white underline font-medium whitespace-nowrap"
            >
              Registration FAQs
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/registration#steps"
              className="text-xs text-white/70 hover:text-white underline font-medium whitespace-nowrap"
            >
              How to Register
            </Link>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto md:ml-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal text-white font-bold text-xs uppercase tracking-wider hover:bg-teal-500 transition-all shadow-glow-teal"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* High-Resolution Flyer Lightbox Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-forest-950 border border-teal/30 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-lime uppercase tracking-wider">
                  OFFICIAL ARTWORK
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedFlyer.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFlyer(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Format Selector Toggle */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-forest-900/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setModalFormat('feed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  modalFormat === 'feed' ? 'bg-teal text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Square / Feed (4:5)
              </button>
              <button
                type="button"
                onClick={() => setModalFormat('status')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  modalFormat === 'status' ? 'bg-teal text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Story / WhatsApp Status (9:16)
              </button>
            </div>

            {/* Flyer Image Container */}
            <div
              className={`relative mx-auto rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 ${
                modalFormat === 'feed' ? 'aspect-[4/5] max-h-[380px]' : 'aspect-[9/16] max-h-[440px]'
              }`}
            >
              <Image
                src={modalFormat === 'feed' ? selectedFlyer.flyerFeed : selectedFlyer.flyerStatus}
                alt={selectedFlyer.title}
                fill
                className="object-contain"
              />
            </div>

            <p className="text-xs text-white/70 mt-4 leading-relaxed text-center font-sans">
              {selectedFlyer.desc}
            </p>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={modalFormat === 'feed' ? selectedFlyer.flyerFeed : selectedFlyer.flyerStatus}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-lime" />
                <span>Save Artwork</span>
              </a>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-teal text-white font-bold text-xs uppercase tracking-wider hover:bg-teal-500 transition-all shadow-glow-teal"
              >
                <span>Register on Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
