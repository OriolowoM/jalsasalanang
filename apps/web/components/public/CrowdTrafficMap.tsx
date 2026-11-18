'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import {
  MapPin,
  Users,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Utensils,
  Droplets,
  ShieldAlert,
  Sparkles,
  Compass,
  CheckCircle2,
  Navigation,
  Car,
  HeartPulse,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ZoneNode {
  id: string;
  zoneKey: string;
  name: string;
  type: 'DINING' | 'SANITARY' | 'PRAYER' | 'PARKING' | 'ENTRANCE' | 'CLINIC';
  status: 'GREEN' | 'ORANGE' | 'RED';
  currentOccupancy: number;
  maxCapacity: number;
  alternateZoneId?: string;
  alternateNote?: string;
  alternateZone?: {
    id: string;
    zoneKey: string;
    name: string;
    status: 'GREEN' | 'ORANGE' | 'RED';
    currentOccupancy: number;
    maxCapacity: number;
  };
  mapCoordinates?: { x: number; y: number; label: string };
  lastUpdatedBy?: string;
}

export default function CrowdTrafficMap() {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [activeZone, setActiveZone] = useState<ZoneNode | null>(null);

  // Poll /api/v1/zones every 30 seconds
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/v1/zones', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const zones: ZoneNode[] = data?.data?.zones || [];
  const stats = data?.data?.stats;

  // Filter zones by type
  const filteredZones = selectedType === 'ALL' ? zones : zones.filter((z) => z.type === selectedType);

  // Quick simulation trigger for testing and demonstration
  const [simulating, setSimulating] = useState(false);
  const handleSimulate = async (scenario: string) => {
    setSimulating(true);
    try {
      await fetch('/api/v1/zones/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });
      await mutate();
    } catch (e) {
      console.warn('Simulation failed:', e);
    } finally {
      setSimulating(false);
    }
  };

  // Get active RED alerts with alternates for the Dynamic Routing Banner
  const criticalZones = zones.filter((z) => z.status === 'RED' && z.alternateZone);

  const getStatusColor = (status: 'GREEN' | 'ORANGE' | 'RED') => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-500',
          ring: 'ring-emerald-400/30',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          text: 'Available',
          hex: '#10b981',
        };
      case 'ORANGE':
        return {
          bg: 'bg-amber-500',
          ring: 'ring-amber-400/30',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          text: 'Nearing Capacity',
          hex: '#f59e0b',
        };
      case 'RED':
        return {
          bg: 'bg-rose-500',
          ring: 'ring-rose-400/30',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          text: 'At Capacity / Redirecting',
          hex: '#f43f5e',
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DINING':
        return <Utensils className="w-4 h-4" />;
      case 'SANITARY':
        return <Droplets className="w-4 h-4" />;
      case 'PRAYER':
        return <Compass className="w-4 h-4" />;
      case 'ENTRANCE':
        return <Navigation className="w-4 h-4" />;
      case 'PARKING':
        return <Car className="w-4 h-4" />;
      case 'CLINIC':
        return <HeartPulse className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full">
      {/* ── Dynamic Alternate Routing Banner (Shown when a zone hits RED) ── */}
      <AnimatePresence>
        {criticalZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-rose-900/90 via-rose-800 to-rose-950 text-white rounded-2xl p-4 sm:p-5 shadow-soft-lg border border-rose-400/30 backdrop-blur-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white/10 text-rose-200 flex-shrink-0 animate-pulse">
                    <AlertTriangle className="w-5 h-5 text-rose-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-display font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/40 text-rose-100 border border-rose-300/30">
                        Live Crowd Advisory
                      </span>
                      <span className="text-xs text-rose-200">
                        Updated moments ago
                      </span>
                    </div>

                    <div className="mt-1 font-display font-bold text-sm sm:text-base text-white">
                      {criticalZones[0].name} reached maximum capacity ({criticalZones[0].currentOccupancy.toLocaleString()} delegates)
                    </div>

                    <p className="text-xs text-rose-100/90 mt-0.5">
                      {criticalZones[0].alternateNote || 'Follow grounds marshals to the designated alternative location.'}
                    </p>
                  </div>
                </div>

                {criticalZones[0].alternateZone && (
                  <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/15 flex-shrink-0">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-rose-200">
                        Suggested Alternate
                      </div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {criticalZones[0].alternateZone.name}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const target = zones.find((z) => z.id === criticalZones[0].alternateZone?.id);
                        if (target) setActiveZone(target);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white text-rose-950 font-bold text-xs hover:bg-rose-50 transition-colors shadow-sm flex items-center gap-1"
                    >
                      View Node <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Control Header: Filters & Live Stats ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-muted/60 p-1.5 rounded-2xl border border-surface-border">
          {['ALL', 'DINING', 'ENTRANCE', 'PRAYER', 'SANITARY', 'CLINIC'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-forest text-white shadow-soft'
                  : 'text-ink-muted hover:text-forest hover:bg-white/60'
              }`}
            >
              {type === 'ALL' ? 'All Grounds' : type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Live Status Indicator, Simulation Bar & Sync Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Demonstration Simulator Pills */}
          <div className="hidden md:flex items-center gap-1 bg-surface-muted/80 p-1 rounded-xl border border-surface-border text-[10px] font-bold">
            <span className="text-ink-light px-1">Simulate:</span>
            <button
              onClick={() => handleSimulate('dining-rush')}
              disabled={simulating}
              className="px-2 py-0.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 hover:border-rose-200 border border-transparent transition-colors"
              title="Simulate Main Dining Hall Overcrowding"
            >
              Dining Rush
            </button>
            <button
              onClick={() => handleSimulate('prayer-rush')}
              disabled={simulating}
              className="px-2 py-0.5 rounded-lg bg-white hover:bg-amber-50 text-amber-700 hover:border-amber-200 border border-transparent transition-colors"
              title="Simulate Prayer Rush Overcrowding"
            >
              Prayer Rush
            </button>
            <button
              onClick={() => handleSimulate('normal')}
              disabled={simulating}
              className="px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 hover:border-emerald-200 border border-transparent transition-colors"
              title="Reset Grounds to Normal Status"
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-ink-muted bg-white px-3 py-1.5 rounded-xl border border-surface-border shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-forest">Live SWR Sync (30s)</span>
          </div>

          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="p-2 bg-white hover:bg-surface-muted text-ink-muted hover:text-forest rounded-xl border border-surface-border transition-colors shadow-xs"
            title="Refresh capacity status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-teal' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Interactive Venue Vector Map Canvas ── */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#002222] via-[#003333] to-[#001818] border border-teal/30 shadow-2xl p-4 sm:p-8">
        {/* SVG Decorative Grid & Grounds Schematic */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#b0e892" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Grounds Compass Badge */}
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2 bg-forest-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal/40 text-[10px] font-bold text-lime">
          <Navigation className="w-3.5 h-3.5 text-lime rotate-45" />
          <span>Jamia Ahmadiyya Ilaro Grounds</span>
        </div>

        {/* Stylized Vector Visual Map Representation */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[420px] max-h-[580px] rounded-2xl overflow-hidden border border-teal/20 bg-forest-950/40">
          {/* Schematic SVG Roads & Sectors */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* North Expressway */}
            <line x1="0" y1="15" x2="100" y2="15" stroke="#027c68" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.6" />
            <text x="3" y="12" fill="#80d9c8" fontSize="2.5" fontWeight="bold">LAGOS-IBADAN / ILARO EXPRESSWAY</text>

            {/* Central Avenue linking Gate 1, Marquees & Gate 2 */}
            <path d="M 22 15 Q 35 40 48 55 T 72 62" fill="none" stroke="#009933" strokeWidth="1.5" opacity="0.4" />
            <path d="M 18 65 Q 35 60 48 55" fill="none" stroke="#009933" strokeWidth="1" strokeDasharray="1,2" opacity="0.4" />

            {/* Men's Zone Boundary Box */}
            <rect x="26" y="20" width="30" height="60" rx="3" fill="#027c68" fillOpacity="0.08" stroke="#027c68" strokeWidth="0.5" strokeDasharray="1,1" />
            <text x="28" y="24" fill="#b0e892" fontSize="2" fontWeight="bold">MEN&apos;S CONVENTION SECTOR</text>

            {/* Lajna Zone Boundary Box */}
            <rect x="62" y="25" width="28" height="55" rx="3" fill="#b0e892" fillOpacity="0.05" stroke="#b0e892" strokeWidth="0.5" strokeDasharray="1,1" />
            <text x="64" y="29" fill="#b0e892" fontSize="2" fontWeight="bold">LAJNA (LADIES) SECTOR</text>

            {/* Animated Redirect Route (From Main Dining to Aux Dining) when active */}
            {criticalZones.some((z) => z.zoneKey === 'main-dining-male') && (
              <g>
                <line x1="32" y1="42" x2="38" y2="48" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" className="animate-pulse" />
                <circle cx="35" cy="45" r="0.8" fill="#f43f5e" />
              </g>
            )}
          </svg>

          {/* Interactive Zone Pins positioned using mapCoordinates */}
          {filteredZones.map((zone) => {
            const coords = zone.mapCoordinates || { x: 50, y: 50 };
            const statusConfig = getStatusColor(zone.status);
            const isSelected = activeZone?.id === zone.id;

            return (
              <div
                key={zone.id}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                onClick={() => setActiveZone(zone)}
              >
                {/* Ripple ring for active nodes */}
                <div
                  className={`absolute -inset-2 rounded-full ${statusConfig.bg} opacity-30 ${
                    zone.status === 'RED' ? 'animate-ping' : 'group-hover:animate-ping'
                  }`}
                />

                {/* Node Pill */}
                <div
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border shadow-lg backdrop-blur-md transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-forest scale-110 border-lime ring-2 ring-lime/50 z-30'
                      : 'bg-forest-950/90 text-white border-white/20 hover:scale-105 hover:border-lime/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.bg}`} />
                  <span className="text-[10px] font-display font-bold tracking-tight whitespace-nowrap">
                    {zone.name.replace(/^(Main|Lajna|Auxiliary|West|Central|North)\s/, '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Zone Detail Drawer / Card ── */}
        <AnimatePresence>
          {activeZone && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
              className="mt-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-teal/20 shadow-xl text-forest"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-forest text-white shadow-soft">
                    {getTypeIcon(activeZone.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-forest">
                        {activeZone.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          getStatusColor(activeZone.status).badge
                        }`}
                      >
                        {getStatusColor(activeZone.status).text}
                      </span>
                    </div>

                    <p className="text-xs text-ink-muted mt-0.5">
                      {activeZone.alternateNote || 'Capacity monitored live by Jalsa Ground Protocols.'}
                    </p>
                  </div>
                </div>

                {/* Occupancy Gauge */}
                <div className="flex flex-col sm:items-end min-w-[200px]">
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold mb-1 w-full">
                    <span className="text-ink-muted font-medium">Occupancy</span>
                    <span className="text-forest">
                      {activeZone.currentOccupancy.toLocaleString()} / {activeZone.maxCapacity.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden border border-surface-border">
                    <div
                      style={{ width: `${Math.min(100, (activeZone.currentOccupancy / activeZone.maxCapacity) * 100)}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        activeZone.status === 'RED'
                          ? 'bg-rose-500'
                          : activeZone.status === 'ORANGE'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>

                  <div className="text-[10px] text-ink-light mt-1">
                    {Math.round((activeZone.currentOccupancy / activeZone.maxCapacity) * 100)}% utilization
                  </div>
                </div>
              </div>

              {/* Reroute Recommendation if RED */}
              {activeZone.status === 'RED' && activeZone.alternateZone && (
                <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 flex items-center justify-between gap-3 text-xs text-rose-900">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>
                      High density alert: Redirect delegates to <strong>{activeZone.alternateZone.name}</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const alt = zones.find((z) => z.id === activeZone.alternateZone?.id);
                      if (alt) setActiveZone(alt);
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors flex-shrink-0"
                  >
                    Switch to Alternate
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Key Cards Grid: Dining & Entrance Summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {zones.slice(0, 6).map((zone) => {
          const status = getStatusColor(zone.status);
          const ratio = Math.round((zone.currentOccupancy / zone.maxCapacity) * 100);

          return (
            <div
              key={zone.id}
              onClick={() => setActiveZone(zone)}
              className="p-4 rounded-2xl bg-white border border-surface-border hover:border-teal/40 transition-all hover:shadow-soft cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-forest group-hover:text-teal transition-colors flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${status.bg}`} />
                  {zone.name}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badge}`}>
                  {ratio}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden mb-2">
                <div
                  style={{ width: `${ratio}%` }}
                  className={`h-full rounded-full ${status.bg}`}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>{zone.currentOccupancy.toLocaleString()} present</span>
                <span className="text-ink-light">Cap: {zone.maxCapacity.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
