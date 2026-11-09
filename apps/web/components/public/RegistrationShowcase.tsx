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

const HIGHLIGHTS = [
  {
    code: 'F01',
    badge: 'WALLET PASS',
    icon: Smartphone,
    title: 'Digital Tag on Your Phone',
    desc: 'No paper slips required. Download your delegate badge directly to your device with offline access.',
    flyerFeed: '/images/registration/jalsa2026-feature-01-your-tag-on-your-phone_feed.webp',
    flyerStatus: '/images/registration/jalsa2026-feature-01-your-tag-on-your-phone_status.webp',
  },
  {
    code: 'F02',
    badge: 'HOUSEHOLD',
    icon: Users,
    title: 'Whole Family Registration',
    desc: 'Household heads can register spouse, children, and elders in one seamless submission.',
    flyerFeed: '/images/registration/jalsa2026-feature-02-whole-family_feed.webp',
    flyerStatus: '/images/registration/jalsa2026-feature-02-whole-family_status.webp',
  },
  {
    code: 'F04',
    badge: 'GATE QR',
    icon: QrCode,
    title: 'Self Check-In at Ilaro Gates',
    desc: 'Scan gate QR posters upon arrival at Jamia Ilaro to verify attendance and skip long queues.',
    flyerFeed: '/images/registration/jalsa2026-feature-04-self-check-in_feed.webp',
    flyerStatus: '/images/registration/jalsa2026-feature-04-self-check-in_status.webp',
  },
  {
    code: 'F05',
    badge: 'CONVOY BUS',
    icon: Bus,
    title: 'Conveyance & Group Forms',
    desc: 'Circuit coordinators can register chartered buses and check in entire convoys with one scan.',
    flyerFeed: '/images/registration/jalsa2026-feature-05-travel-group-form_feed.webp',
    flyerStatus: '/images/registration/jalsa2026-feature-05-travel-group-form_status.webp',
  },
];

export default function RegistrationShowcase() {
  const portalUrl = 'https://jalsa.ahmadiyyanigeria.net/';
  const [selectedFlyer, setSelectedFlyer] = useState<any | null>(null);
  const [modalFormat, setModalFormat] = useState<'feed' | 'status'>('feed');

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-primary-night via-primary-dark to-primary-950 text-white relative overflow-hidden border-y-2 border-gold/40">
      {/* Subtle Islamic Stars Background Overlay */}
      <div className="absolute inset-0 bg-islamic-stars opacity-35 pointer-events-none" />

      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Badge & Navigation */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-white/10 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold-metallic border border-gold/40 text-xs font-cinzel font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>OFFICIAL DELEGATE REGISTRATION PORTAL</span>
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-[1.15] tracking-tight">
              Register for Jalsa Salana 2026
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 max-w-2xl leading-relaxed font-serif">
              Your spiritual journey to Jamia Ahmadiyya Ilaro begins with registration. Secure your digital tag, lodging allocation, and meal access in advance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 flex-shrink-0">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-metallic hover:from-gold-hover hover:to-gold text-primary-950 font-black text-xs uppercase tracking-wider transition-all shadow-gold-glow hover:scale-105 active:scale-95"
            >
              <span>Register on Portal Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/registration"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
            >
              <span>Full Information Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Feature Highlights Grid with Flyer Preview Lightbox */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-gradient-to-b from-white/10 via-black/30 to-black/50 backdrop-blur-md rounded-2xl border border-gold/30 p-5 hover:border-gold transition-all duration-500 group flex flex-col justify-between shadow-2xl hover:-translate-y-1.5"
              >
                <div>
                  {/* Interactive Flyer Card with Click-to-Enlarge */}
                  <div
                    onClick={() => {
                      setSelectedFlyer(item);
                      setModalFormat('feed');
                    }}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-black/50 shadow-inner cursor-pointer ring-1 ring-white/10 group-hover:ring-gold/50"
                  >
                    <Image
                      src={item.flyerFeed}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    {/* Top Tag Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-primary-950/90 backdrop-blur-sm border border-gold/40 flex items-center justify-center text-gold shadow">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-cinzel font-black uppercase tracking-wider bg-gold text-primary-950 px-2 py-0.5 rounded shadow">
                        {item.badge}
                      </span>
                    </div>

                    {/* Hover Zoom Prompt */}
                    <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-bold text-white backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4 text-gold" />
                      <span>Preview Flyer</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-gold-metallic bg-gold/15 px-1.5 py-0.5 rounded border border-gold/30">
                      {item.code}
                    </span>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-gold transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed font-serif">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gold-metallic font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                    <span>Portal Integrated</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlyer(item);
                      setModalFormat('feed');
                    }}
                    className="text-gray-400 hover:text-white transition-colors underline text-[10px]"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 4 Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-gold font-bold text-xs uppercase tracking-wider block">100% Free Entry</span>
            <span className="text-[11px] text-gray-400">Zero registration fees</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-gold font-bold text-xs uppercase tracking-wider block">Langar Meals</span>
            <span className="text-[11px] text-gray-400">Breakfast, lunch &amp; dinner</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-gold font-bold text-xs uppercase tracking-wider block">Marquee Lodging</span>
            <span className="text-[11px] text-gray-400">Designated auxiliary sectors</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="text-gold font-bold text-xs uppercase tracking-wider block">Digital Wallet</span>
            <span className="text-[11px] text-gray-400">Offline Apple &amp; Google pass</span>
          </div>
        </div>

        {/* Bottom Banner with Verification Callout */}
        <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-md rounded-3xl border border-gold/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0 shadow-gold-glow">
              <ShieldCheck className="w-6 h-6 text-gold-metallic" />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Official Convention Registration Link
              </h4>
              <p className="text-xs text-gray-300 mt-0.5 font-serif">
                Always ensure you complete your registration directly via{' '}
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-metallic font-mono hover:underline font-bold"
                >
                  jalsa.ahmadiyyanigeria.net
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/registration#faqs"
              className="text-xs text-gray-300 hover:text-white underline font-medium whitespace-nowrap"
            >
              Registration FAQs
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/registration#steps"
              className="text-xs text-gray-300 hover:text-white underline font-medium whitespace-nowrap"
            >
              How to Register
            </Link>
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto md:ml-2 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-metallic text-primary-950 font-black text-xs uppercase tracking-wider hover:from-gold-hover hover:to-gold transition-all shadow-gold-glow"
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
          <div className="relative max-w-lg w-full bg-primary-night border border-gold/40 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
                  {selectedFlyer.code} · {selectedFlyer.badge}
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
            <div className="flex items-center justify-center gap-2 mb-4 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setModalFormat('feed')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  modalFormat === 'feed' ? 'bg-gold text-primary-950 shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Square / Feed (4:5)
              </button>
              <button
                type="button"
                onClick={() => setModalFormat('status')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  modalFormat === 'status' ? 'bg-gold text-primary-950 shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Story / WhatsApp Status (9:16)
              </button>
            </div>

            {/* Flyer Image Container */}
            <div
              className={`relative mx-auto rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-gold/30 ${
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

            <p className="text-xs text-gray-300 mt-4 leading-relaxed text-center font-serif">
              {selectedFlyer.desc}
            </p>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={modalFormat === 'feed' ? selectedFlyer.flyerFeed : selectedFlyer.flyerStatus}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Save Artwork</span>
              </a>
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-gold to-gold-metallic text-primary-950 font-black text-xs uppercase tracking-wider hover:from-gold-hover hover:to-gold transition-all shadow-gold-glow"
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
