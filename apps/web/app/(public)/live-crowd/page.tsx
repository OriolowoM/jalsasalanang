import React from 'react';
import { Metadata } from 'next';
import CrowdTrafficMap from '@/components/public/CrowdTrafficMap';
import { MapPin, Navigation, Shield, Compass, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Live Crowd & Venue Traffic Routing | Jalsa Salana Nigeria 2026',
  description:
    'Real-time venue capacity tracking, live crowd density monitor, and smart traffic routing for Jamia Ahmadiyya Ilaro during the 72nd Jalsa Salana convention.',
};

export default function LiveCrowdPage() {
  return (
    <div className="min-h-screen bg-surface-bg py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-teal uppercase tracking-widest mb-3">
            <Link href="/" className="hover:text-forest transition-colors">Home</Link>
            <span>/</span>
            <span className="text-forest">Smart Logistics &amp; Crowd Routing</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-forest tracking-tight mb-4">
            Smart Venue Map &amp; Crowd Routing
          </h1>

          <p className="text-ink-muted text-base sm:text-lg leading-relaxed">
            Real-time capacity monitors across Jamia Ahmadiyya Ilaro convention grounds. Live telemetry updates every 30 seconds to help you navigate dining halls, ablution complexes, and arrival gates with zero delays.
          </p>
        </div>

        {/* Live Vector Map Component */}
        <CrowdTrafficMap />

        {/* Advisory Tips Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mb-4">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Gate Selection
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Interstate buses and charter convoys are recommended to enter via <strong>Gate 2 (West Registration Hub)</strong> which features 8 rapid biometric lanes.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-lime-100 text-forest flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Dining Protocol
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              If Main Dining Hall reaches capacity (RED), grounds marshals activate <strong>Auxiliary Marquee B</strong> with identical full catering services.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-surface-border shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base text-forest mb-2">
              Medical &amp; Lost Child
            </h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Central Medical Clinic operates 24/7 adjacent to the Main Minaret. For urgent assistance, contact the secretariat on <strong>+234-803-JALSA-NG</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
