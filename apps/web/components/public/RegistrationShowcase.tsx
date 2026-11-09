'use client';

import React from 'react';
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
} from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: Smartphone,
    title: 'Digital Tag on Your Phone',
    desc: 'No paper slips required. Download your delegate badge directly to your device with offline access.',
    flyer: '/images/registration/jalsa2026-feature-01-your-tag-on-your-phone_feed.webp',
  },
  {
    icon: Users,
    title: 'Whole Family Registration',
    desc: 'Household heads can register spouse, children, and elders in one seamless submission.',
    flyer: '/images/registration/jalsa2026-feature-02-whole-family_feed.webp',
  },
  {
    icon: QrCode,
    title: 'Self Check-In at Ilaro Gates',
    desc: 'Scan gate QR posters upon arrival at Jamia Ilaro to verify attendance and skip long queues.',
    flyer: '/images/registration/jalsa2026-feature-04-self-check-in_feed.webp',
  },
  {
    icon: Bus,
    title: 'Conveyance & Group Forms',
    desc: 'Circuit coordinators can register chartered buses and check in entire convoys with one scan.',
    flyer: '/images/registration/jalsa2026-feature-05-travel-group-form_feed.webp',
  },
];

export default function RegistrationShowcase() {
  const portalUrl = 'https://jalsa.ahmadiyyanigeria.net/';

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-primary-950 via-primary to-primary-950 text-white relative overflow-hidden border-y-2 border-gold/40">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header Badge */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-white/10 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold-light border border-gold/40 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Official Delegate Registration Portal</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Register for Jalsa Salana 2026
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2 max-w-2xl leading-relaxed">
              Your spiritual journey to Jamia Ahmadiyya Ilaro begins with registration. Secure your digital tag, lodging allocation, and meal access in advance.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold hover:bg-gold-hover text-primary-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105"
            >
              <span>Register on Portal Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/registration"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
            >
              <span>Full Information Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 hover:border-gold/50 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-4 bg-black/40 shadow-inner">
                    <Image
                      src={item.flyer}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-primary-950/80 backdrop-blur-sm border border-gold/40 flex items-center justify-center text-gold">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-serif font-bold text-base text-white group-hover:text-gold transition-colors mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gold font-bold">
                  <span>Portal Feature</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Verification Callout */}
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-white">
                Official Convention Registration Link
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                Always ensure you complete your registration directly via{' '}
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-mono hover:underline font-bold"
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
              className="ml-auto md:ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold text-primary-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-hover transition-colors shadow"
            >
              <span>Register Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
