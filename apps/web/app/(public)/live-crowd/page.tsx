import React from 'react';
import CrowdTrafficMap, { GOOGLE_MAPS_CONVENTION_URL } from '@/components/public/CrowdTrafficMap';
import { Navigation, Compass, PhoneCall, ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Live Grounds Map & Navigation Hub — Jalsa Salana Nigeria 2026',
  description:
    'Real-time grounds map, satellite venue layout, and live traffic routing for Jamia Ahmadiyya Ilaro during the 72nd Jalsa Salana convention. Male Gah on the left, Female Gah on the right.',
  path: '/live-crowd',
});

export default function LiveCrowdPage() {
  return (
    <div className="min-h-screen bg-surface-bg py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-bold text-teal uppercase tracking-widest mb-3">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <span>/</span>
            <span className="text-forest">Grounds Navigation &amp; Crowd Telemetry</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-forest tracking-tight mb-4">
            Grounds Map &amp; Navigation Hub
          </h1>

          <p className="text-ink-muted text-base sm:text-lg leading-relaxed">
            Real-time grounds layout and crowd telemetry across the <strong>Jamia Ahmadiyya Ilaro</strong> convention grounds. 
            Official sector distribution locates <strong>Jalsa Male Gah on the LEFT</strong> and <strong>Female Gah (Lajna Pavilion) on the RIGHT</strong>. 
            Telemetry refreshes every 30 seconds to help you navigate dining halls, ablution complexes, and security gates seamlessly.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a
              href={GOOGLE_MAPS_CONVENTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#003333] text-white hover:bg-[#024542] text-xs font-bold transition-colors shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-[#b0e892]" />
              <span>Launch Google Maps GPS Directions</span>
              <ExternalLink className="w-3 h-3 text-white/70" />
            </a>

            <Link
              href="/programme-of-events-jalsa-salana-nigeria-2026"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-surface-border text-[#003333] hover:bg-surface-muted text-xs font-bold transition-colors shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-[#c5a049]" />
              <span>View Programme Schedule</span>
            </Link>
          </div>
        </div>

        {/* Live Vector & Satellite Map Component */}
        <CrowdTrafficMap />

        {/* Advisory Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mb-4">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Gate Selection &amp; Accreditation
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Interstate buses and charter convoys are recommended to enter via <strong>Gate 2 (West Registration Hub)</strong> which features 8 rapid biometric lanes and dedicated luggage screening.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-lime-100 text-forest flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Dining &amp; Langar Overflow
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              If Men&apos;s Main Dining Hall reaches peak capacity (RED status), marshals redirect delegates to <strong>Auxiliary Marquee B</strong> with identical menu and rapid food distribution lines.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Medical &amp; Emergency Helpline
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Central Medical Clinic operates 24/7 centrally between the two sectors. For ambulance or emergency dispatch on site, contact the medical desk on <strong>+234-803-JALSA-NG</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
