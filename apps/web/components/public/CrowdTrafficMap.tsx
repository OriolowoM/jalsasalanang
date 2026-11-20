'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import useSWR from 'swr';
import {
  MapPin,
  Users,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Utensils,
  Droplets,
  Compass,
  CheckCircle2,
  Navigation,
  Car,
  HeartPulse,
  Info,
  ExternalLink,
  Layers,
  Footprints,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const GOOGLE_MAPS_CONVENTION_URL =
  'https://www.google.com/maps/place/Jalsa+Salana+Convention/@6.8613071,3.0148361,215m/data=!3m1!1e3!4m6!3m5!1s0x103b0f00606a77ef:0x742b31c844fa0745!8m2!3d6.8619744!4d3.0122307!16s%2Fg%2F11y2fqwp_k?entry=ttu';

export const CONVENTION_COORDINATES = {
  lat: 6.8619744,
  lng: 3.0122307,
  label: 'Jamia Ahmadiyya Ilaro, Ogun State, Nigeria',
};

export interface ZoneNode {
  id: string;
  zoneKey: string;
  name: string;
  sector: 'LEFT_MALE' | 'RIGHT_FEMALE' | 'CENTRAL' | 'PERIMETER';
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
  mapCoordinates: { x: number; y: number; label: string };
  lastUpdatedBy?: string;
}

// Canonical Default Convention Zones with exact Sector Placement
const DEFAULT_ZONES: ZoneNode[] = [
  {
    id: 'zone-male-gah',
    zoneKey: 'male-jalsa-gah',
    name: 'Jalsa Male Gah (Main Arena & Tahajjud)',
    sector: 'LEFT_MALE',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 8400,
    maxCapacity: 12000,
    mapCoordinates: { x: 30, y: 62, label: 'Male Gah (Left)' },
    alternateNote: 'Main convention marquee on the LEFT sector. Holds Tahajjud, Friday Jumu’ah, keynote lectures, and closing prayers.',
  },
  {
    id: 'zone-female-gah',
    zoneKey: 'female-jalsa-gah',
    name: 'Female Gah (Lajna Pavilion & Crèche)',
    sector: 'RIGHT_FEMALE',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 6200,
    maxCapacity: 9500,
    mapCoordinates: { x: 68, y: 38, label: 'Female Gah (Right)' },
    alternateNote: 'Dedicated Lajna Ima’illah marquee on the RIGHT sector with mother-care rooms, audio relays, and security protocol.',
  },
  {
    id: 'zone-central-stage',
    zoneKey: 'central-stage',
    name: 'Central Podium & Scholar Rostrum',
    sector: 'CENTRAL',
    type: 'PRAYER',
    status: 'GREEN',
    currentOccupancy: 120,
    maxCapacity: 180,
    mapCoordinates: { x: 48, y: 48, label: 'Central Stage' },
    alternateNote: 'Official dais for Amir Sahib, Missionary In-Charge, scholars, guest royal fathers, and award presentations.',
  },
  {
    id: 'zone-clinic',
    zoneKey: 'central-clinic',
    name: 'Central Medical Clinic & 24/7 Ambulance Bay',
    sector: 'CENTRAL',
    type: 'CLINIC',
    status: 'GREEN',
    currentOccupancy: 28,
    maxCapacity: 150,
    mapCoordinates: { x: 50, y: 26, label: 'Central Clinic' },
    alternateNote: 'Emergency triage post, ambulance bay, and pharmacy team staffed around the clock.',
  },
  {
    id: 'zone-gate-1',
    zoneKey: 'gate-north-1',
    name: 'Gate 1 (North Expressway Entry)',
    sector: 'PERIMETER',
    type: 'ENTRANCE',
    status: 'GREEN',
    currentOccupancy: 2400,
    maxCapacity: 5000,
    mapCoordinates: { x: 82, y: 16, label: 'Gate 1 (North Entry)' },
    alternateNote: 'Primary vehicular access road from the Ilaro Expressway. Marshals guide convoys to peripheral parking.',
  },
  {
    id: 'zone-gate-2',
    zoneKey: 'gate-west-2',
    name: 'Gate 2 (West Registration Hub)',
    sector: 'PERIMETER',
    type: 'ENTRANCE',
    status: 'GREEN',
    currentOccupancy: 1600,
    maxCapacity: 4500,
    mapCoordinates: { x: 14, y: 46, label: 'Gate 2 (West Hub)' },
    alternateNote: 'Interstate coach terminal with 8 rapid biometric accreditation lanes and digital gate pass scanners.',
  },
  {
    id: 'zone-dining-male',
    zoneKey: 'main-dining-male',
    name: 'Men’s Main Dining Marquee',
    sector: 'LEFT_MALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 1450,
    maxCapacity: 2500,
    alternateZoneId: 'zone-dining-aux-b',
    alternateZone: {
      id: 'zone-dining-aux-b',
      zoneKey: 'aux-dining-male',
      name: 'Auxiliary Dining Marquee B',
      status: 'GREEN',
      currentOccupancy: 340,
      maxCapacity: 1200,
    },
    mapCoordinates: { x: 22, y: 80, label: 'Men’s Dining' },
    alternateNote: 'Catering hub for male delegates. If at peak capacity, delegates are rerouted to Auxiliary Marquee B.',
  },
  {
    id: 'zone-dining-aux-b',
    zoneKey: 'aux-dining-male',
    name: 'Auxiliary Dining Marquee B',
    sector: 'LEFT_MALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 340,
    maxCapacity: 1200,
    mapCoordinates: { x: 36, y: 84, label: 'Aux Dining B' },
    alternateNote: 'Overflow catering pavilion adjacent to the Men’s accommodation grounds.',
  },
  {
    id: 'zone-dining-lajna',
    zoneKey: 'lajna-dining-main',
    name: 'Lajna Ladies’ Dining Pavilion',
    sector: 'RIGHT_FEMALE',
    type: 'DINING',
    status: 'GREEN',
    currentOccupancy: 1250,
    maxCapacity: 2200,
    mapCoordinates: { x: 78, y: 58, label: 'Lajna Dining' },
    alternateNote: 'Dedicated catering pavilion situated securely within the Lajna grounds enclosure on the right.',
  },
  {
    id: 'zone-wudhu-men',
    zoneKey: 'sanitary-men-a',
    name: 'Men’s Central Wudhu Complex',
    sector: 'LEFT_MALE',
    type: 'SANITARY',
    status: 'GREEN',
    currentOccupancy: 180,
    maxCapacity: 400,
    mapCoordinates: { x: 24, y: 36, label: 'Men’s Wudhu' },
    alternateNote: 'Ablution bays and modern sanitary facilities located west of the main prayer marquee.',
  },
  {
    id: 'zone-wudhu-lajna',
    zoneKey: 'sanitary-lajna',
    name: 'Lajna Wudhu & Comfort Station',
    sector: 'RIGHT_FEMALE',
    type: 'SANITARY',
    status: 'GREEN',
    currentOccupancy: 140,
    maxCapacity: 350,
    mapCoordinates: { x: 74, y: 26, label: 'Lajna Wudhu' },
    alternateNote: 'Dedicated ablution bays and nursery facilities enclosed within the female sector.',
  },
];

// Interactive Wayfinding Paths
const WAYFINDING_ROUTES: Record<string, Record<string, { duration: string; distance: string; instructions: string[] }>> = {
  gate2: {
    male_gah: {
      duration: '2 mins',
      distance: '180m',
      instructions: [
        'Proceed east from Gate 2 accreditation tent along the paved main avenue.',
        'Keep left following the green signs marked "Men’s Convention Sector (Left)".',
        'Enter through Portals A–D into Jalsa Male Gah.',
      ],
    },
    female_gah: {
      duration: '4 mins',
      distance: '320m',
      instructions: [
        'Proceed east from Gate 2 past the Central Clinic roundabout.',
        'Turn right toward the designated Female Gah perimeter road.',
        'Security marshals verify Lajna credentials at the official Ladies Entrance.',
      ],
    },
    clinic: {
      duration: '2 mins',
      distance: '140m',
      instructions: [
        'Walk directly east along Central Avenue.',
        'The Central Medical Clinic & 24/7 Ambulance Bay is situated on your left.',
      ],
    },
    dining: {
      duration: '3 mins',
      distance: '230m',
      instructions: [
        'Head southeast past the Men’s ablution complex toward the rear marquees.',
        'Men’s Main Dining Marquee is immediately adjacent to Auxiliary Dining B.',
      ],
    },
  },
  gate1: {
    male_gah: {
      duration: '5 mins',
      distance: '380m',
      instructions: [
        'Enter via Gate 1 and follow the north-south perimeter road.',
        'At the Central Clinic junction, take the western pathway leading to the LEFT sector.',
        'Arrival at Jalsa Male Gah main courtyard.',
      ],
    },
    female_gah: {
      duration: '2 mins',
      distance: '160m',
      instructions: [
        'Enter via Gate 1 off the expressway.',
        'Proceed south along the eastern paved corridor directly into the RIGHT sector.',
        'Female Gah (Lajna Pavilion) is immediately ahead on your right.',
      ],
    },
    clinic: {
      duration: '3 mins',
      distance: '210m',
      instructions: [
        'Head southwest along the main service road toward the central grounds tower.',
        'Emergency Clinic and First Aid tents are centrally positioned.',
      ],
    },
    dining: {
      duration: '5 mins',
      distance: '420m',
      instructions: [
        'Take the perimeter transit path south past the Lajna Pavilion to the dedicated dining complexes.',
      ],
    },
  },
};

export default function CrowdTrafficMap() {
  const [viewMode, setViewMode] = useState<'satellite' | 'schematic'>('satellite');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [activeZone, setActiveZone] = useState<ZoneNode | null>(DEFAULT_ZONES[0]);
  const [startPoint, setStartPoint] = useState<string>('gate2');
  const [endPoint, setEndPoint] = useState<string>('male_gah');

  // Poll /api/v1/zones every 30 seconds with fallback to canonical default zones
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/v1/zones', fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });

  const apiZones: ZoneNode[] = data?.data?.zones || [];
  const zones: ZoneNode[] = useMemo(() => {
    if (apiZones.length > 0) {
      return apiZones.map((z) => {
        const fallback = DEFAULT_ZONES.find((d) => d.zoneKey === z.zoneKey);
        return {
          ...z,
          sector: z.sector || fallback?.sector || (z.name.toLowerCase().includes('lajna') || z.name.toLowerCase().includes('female') ? 'RIGHT_FEMALE' : 'LEFT_MALE'),
          mapCoordinates: z.mapCoordinates || fallback?.mapCoordinates || { x: 50, y: 50, label: z.name },
        };
      });
    }
    return DEFAULT_ZONES;
  }, [apiZones]);

  // Filter zones by type and sector
  const filteredZones = useMemo(() => {
    return zones.filter((z) => {
      const matchType = selectedType === 'ALL' || z.type === selectedType;
      const matchSector =
        selectedSector === 'ALL' ||
        (selectedSector === 'LEFT_MALE' && (z.sector === 'LEFT_MALE' || z.name.toLowerCase().includes('men') || z.name.toLowerCase().includes('male'))) ||
        (selectedSector === 'RIGHT_FEMALE' && (z.sector === 'RIGHT_FEMALE' || z.name.toLowerCase().includes('lajna') || z.name.toLowerCase().includes('female'))) ||
        (selectedSector === 'CENTRAL' && z.sector === 'CENTRAL');
      return matchType && matchSector;
    });
  }, [zones, selectedType, selectedSector]);

  const criticalZones = zones.filter((z) => z.status === 'RED' && z.alternateZone);

  const getStatusColor = (status: 'GREEN' | 'ORANGE' | 'RED') => {
    switch (status) {
      case 'GREEN':
        return {
          bg: 'bg-emerald-500',
          ring: 'ring-emerald-400/30',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          text: 'Available (Smooth Flow)',
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

  const currentRoute = WAYFINDING_ROUTES[startPoint]?.[endPoint];

  return (
    <div className="w-full space-y-6">
      {/* ── Official Google Maps Direct Navigation Card ── */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003333] via-[#024542] to-[#002626] text-white p-5 sm:p-6 shadow-xl border border-[#c5a049]/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#c5a049]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-display font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#c5a049] text-[#002626]">
                Official Venue Coordinates
              </span>
              <span className="text-xs text-[#b0e892] font-mono">
                6.8619744° N, 3.0122307° E
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white">
              Jalsa Salana Convention Grounds · Jamia Ahmadiyya Ilaro
            </h2>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Official ground division: <strong>Jalsa Male Gah on the LEFT</strong> and <strong>Female Gah (Lajna Pavilion) on the RIGHT</strong>. 
              Tap below to launch live GPS turn-by-turn navigation in Google Maps on your phone or device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={GOOGLE_MAPS_CONVENTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#c5a049] to-[#d8b55e] text-[#002626] font-display font-black text-xs sm:text-sm hover:brightness-105 transition-all shadow-lg active:scale-95 group"
            >
              <Navigation className="w-4 h-4 fill-current group-hover:rotate-45 transition-transform" />
              <span>Open Live Navigation in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  navigator.clipboard?.writeText(
                    'https://www.google.com/maps/place/Jalsa+Salana+Convention/@6.8613071,3.0148361,215m/data=!3m1!1e3!4m6!3m5!1s0x103b0f00606a77ef:0x742b31c844fa0745!8m2!3d6.8619744!4d3.0122307!16s%2Fg%2F11y2fqwp_k?entry=ttu'
                  );
                  alert('Google Maps convention location copied to clipboard!');
                }
              }}
              className="px-3.5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition-colors"
              title="Copy location link"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* ── Dynamic Alternate Routing Banner (Shown when a zone hits RED) ── */}
      <AnimatePresence>
        {criticalZones.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden"
          >
            <div className="bg-gradient-to-r from-rose-900/90 via-rose-800 to-rose-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-rose-400/30 backdrop-blur-md">
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
                      <span className="text-xs text-rose-200">Updated moments ago</span>
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

      {/* ── View Switcher & Filter Controls ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border border-surface-border shadow-soft">
        {/* View Mode Toggle: Satellite vs Schematic */}
        <div className="flex items-center gap-1 bg-surface-muted p-1 rounded-2xl border border-surface-border w-fit">
          <button
            type="button"
            onClick={() => setViewMode('satellite')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all ${
              viewMode === 'satellite'
                ? 'bg-[#003333] text-white shadow-soft'
                : 'text-ink-muted hover:text-[#003333]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#b0e892]" />
            <span>🛰️ Aerial Satellite View</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('schematic')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all ${
              viewMode === 'schematic'
                ? 'bg-[#003333] text-white shadow-soft'
                : 'text-ink-muted hover:text-[#003333]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#c5a049]" />
            <span>🗺️ Schematic Density View</span>
          </button>
        </div>

        {/* Sector Filter: Left (Male), Right (Female), All */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-ink-muted px-1 uppercase tracking-wider">
            Sector:
          </span>
          {[
            { id: 'ALL', label: 'All Grounds' },
            { id: 'LEFT_MALE', label: '👈 Left (Male Gah)' },
            { id: 'RIGHT_FEMALE', label: '👉 Right (Female Gah)' },
            { id: 'CENTRAL', label: 'Central Hub' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSector(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSector === sec.id
                  ? 'bg-teal text-white shadow-xs'
                  : 'bg-surface-bg text-ink-body hover:bg-surface-muted border border-surface-border'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Live Status & Refresh */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-ink-muted bg-surface-bg px-3 py-1.5 rounded-xl border border-surface-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-[#003333]">Telemetry Active</span>
          </div>
          <button
            onClick={() => mutate()}
            disabled={isValidating}
            className="p-2 bg-surface-bg hover:bg-surface-muted text-ink-muted hover:text-[#003333] rounded-xl border border-surface-border transition-colors"
            title="Refresh capacity status"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin text-teal' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Main Map Canvas: Aerial Satellite or Schematic ── */}
      <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#001818] via-[#002626] to-[#001010] border-2 border-[#c5a049]/40 shadow-2xl p-3 sm:p-6">
        
        {/* Top Floating Compass & Sector Delineation Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 relative z-20">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#002626]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-xs font-bold text-white shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>WEST / LEFT: Jalsa Male Gah</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#002626]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#c5a049]/60 text-xs font-bold text-[#c5a049] shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#c5a049] animate-pulse" />
              <span>EAST / RIGHT: Female Gah (Lajna)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#002626]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[11px] font-mono text-[#b0e892]">
            <Navigation className="w-3.5 h-3.5 text-[#b0e892] rotate-45" />
            <span>North Top: Ilaro Expressway (Gate 1)</span>
          </div>
        </div>

        {/* Map View Container */}
        <div className="relative w-full aspect-[16/11] sm:aspect-[16/9] min-h-[460px] max-h-[640px] rounded-2xl overflow-hidden border border-[#c5a049]/30 bg-black/60 shadow-inner">
          
          {viewMode === 'satellite' ? (
            /* ── SATELLITE AERIAL PHOTOGRAPH VIEW ── */
            <div className="relative w-full h-full">
              <Image
                src="/images/jalsa-grounds-satellite.jpg"
                alt="Jamia Ahmadiyya Ilaro Jalsa Salana Convention Grounds Aerial Satellite View"
                fill
                priority
                className="object-cover object-center filter brightness-95 contrast-105"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />

              {/* Delineation Boundary Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Left Sector: Men's Zone Highlight Box */}
                <div className="absolute left-[8%] top-[25%] w-[42%] h-[68%] rounded-2xl border-2 border-dashed border-emerald-400/50 bg-emerald-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-start">
                  <span className="inline-block text-[10px] font-display font-black tracking-wider uppercase bg-emerald-700/80 text-white px-2 py-0.5 rounded-md w-fit shadow">
                    👈 Jalsa Male Gah (Left Sector)
                  </span>
                </div>

                {/* Right Sector: Female Zone Highlight Box */}
                <div className="absolute right-[8%] top-[15%] w-[38%] h-[78%] rounded-2xl border-2 border-dashed border-[#c5a049]/60 bg-[#c5a049]/10 backdrop-blur-[1px] p-2 flex flex-col justify-start items-end">
                  <span className="inline-block text-[10px] font-display font-black tracking-wider uppercase bg-[#c5a049] text-[#002626] px-2 py-0.5 rounded-md w-fit shadow">
                    👉 Female Gah / Lajna (Right Sector)
                  </span>
                </div>

                {/* Central Perimeter Corridor Divider */}
                <div className="absolute left-[49.5%] top-[12%] bottom-[12%] w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          ) : (
            /* ── SCHEMATIC VECTOR DENSITY VIEW ── */
            <div className="relative w-full h-full bg-[#002222]">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* North Expressway */}
                <line x1="0" y1="12" x2="100" y2="12" stroke="#027c68" strokeWidth="1.5" strokeDasharray="2,2" opacity="0.7" />
                <text x="3" y="9" fill="#80d9c8" fontSize="2.4" fontWeight="bold">LAGOS-IBADAN / ILARO EXPRESSWAY (GATE 1)</text>

                {/* Central Perimeter Roads */}
                <path d="M 82 16 L 75 55 L 75 90" fill="none" stroke="#c5a049" strokeWidth="1.5" opacity="0.5" />
                <path d="M 14 46 L 48 48 L 75 55" fill="none" stroke="#b0e892" strokeWidth="1.2" strokeDasharray="1,1" opacity="0.5" />
                <path d="M 30 62 L 22 80" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="1,2" opacity="0.4" />

                {/* Men's Zone Box */}
                <rect x="10" y="22" width="38" height="68" rx="3" fill="#027c68" fillOpacity="0.12" stroke="#027c68" strokeWidth="0.8" strokeDasharray="1,1" />
                <text x="12" y="27" fill="#b0e892" fontSize="2.2" fontWeight="bold">MEN’S CONVENTION SECTOR (LEFT)</text>

                {/* Lajna Zone Box */}
                <rect x="58" y="18" width="36" height="72" rx="3" fill="#c5a049" fillOpacity="0.08" stroke="#c5a049" strokeWidth="0.8" strokeDasharray="1,1" />
                <text x="60" y="23" fill="#c5a049" fontSize="2.2" fontWeight="bold">LAJNA FEMALE SECTOR (RIGHT)</text>
              </svg>
            </div>
          )}

          {/* ── Interactive Ground Hotspots (Rendered in both views) ── */}
          {filteredZones.map((zone) => {
            const coords = zone.mapCoordinates || { x: 50, y: 50 };
            const statusConfig = getStatusColor(zone.status);
            const isSelected = activeZone?.id === zone.id;

            return (
              <div
                key={zone.id}
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                onClick={() => setActiveZone(zone)}
              >
                {/* Ping ripple for active hotspots */}
                <div
                  className={`absolute -inset-2 rounded-full ${statusConfig.bg} opacity-40 ${
                    zone.status === 'RED' ? 'animate-ping' : 'group-hover:animate-ping'
                  }`}
                />

                {/* Hotspot Badge Pin */}
                <div
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-xl backdrop-blur-md transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-[#002626] scale-110 border-[#c5a049] ring-4 ring-[#c5a049]/50 z-40'
                      : 'bg-[#002626]/95 text-white border-white/25 hover:scale-105 hover:border-[#b0e892]'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.bg} shrink-0`} />
                  <span className="text-[10px] font-display font-extrabold tracking-tight whitespace-nowrap">
                    {zone.mapCoordinates.label || zone.name.replace(/^(Main|Lajna|Auxiliary|West|Central|North)\s/, '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Selected Hotspot Detailed Telemetry Drawer ── */}
        <AnimatePresence>
          {activeZone && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.2 }}
              className="mt-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#c5a049]/30 shadow-xl text-forest"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-[#003333] text-[#b0e892] shadow-soft shrink-0">
                    {getTypeIcon(activeZone.type)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-display font-extrabold text-base sm:text-lg text-[#003333]">
                        {activeZone.name}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {activeZone.sector === 'LEFT_MALE'
                          ? '👈 Left Sector (Male)'
                          : activeZone.sector === 'RIGHT_FEMALE'
                          ? '👉 Right Sector (Lajna)'
                          : 'Central Zone'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          getStatusColor(activeZone.status).badge
                        }`}
                      >
                        {getStatusColor(activeZone.status).text}
                      </span>
                    </div>

                    <p className="text-xs text-ink-muted mt-1 leading-relaxed max-w-2xl">
                      {activeZone.alternateNote}
                    </p>
                  </div>
                </div>

                {/* Occupancy Progress Gauge */}
                <div className="flex flex-col sm:items-end min-w-[220px] bg-surface-bg p-3 rounded-xl border border-surface-border">
                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-bold mb-1 w-full">
                    <span className="text-ink-muted font-medium">Live Attendance</span>
                    <span className="text-[#003333]">
                      {activeZone.currentOccupancy.toLocaleString()} / {activeZone.maxCapacity.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden border border-surface-border">
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

                  <div className="text-[10px] text-ink-light mt-1 font-mono">
                    {Math.round((activeZone.currentOccupancy / activeZone.maxCapacity) * 100)}% occupancy capacity
                  </div>
                </div>
              </div>

              {/* Reroute Alert if RED */}
              {activeZone.status === 'RED' && activeZone.alternateZone && (
                <div className="mt-3 p-3 bg-rose-50 rounded-xl border border-rose-200 flex flex-wrap items-center justify-between gap-3 text-xs text-rose-900">
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      High density alert: Delegates are advised to divert to <strong>{activeZone.alternateZone.name}</strong>.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const alt = zones.find((z) => z.id === activeZone.alternateZone?.id);
                      if (alt) setActiveZone(alt);
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs hover:bg-rose-700 transition-colors shrink-0"
                  >
                    View Alternate Zone
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Interactive On-Ground Wayfinding Assistant ── */}
      <div className="rounded-3xl bg-white p-5 sm:p-6 border border-surface-border shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-[#003333]">
                On-Ground Walking Wayfinder
              </h3>
              <p className="text-xs text-ink-muted">
                Step-by-step navigation between Jamia Ilaro gates and convention sectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#c5a049]">
            <Clock className="w-3.5 h-3.5" />
            <span>Est. Walking Time: {currentRoute?.duration || '3 mins'}</span>
          </div>
        </div>

        {/* Start / Destination Selector Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Starting From:
            </label>
            <select
              value={startPoint}
              onChange={(e) => setStartPoint(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-bg text-xs font-bold text-[#003333] focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="gate2">Gate 2 (West Registration Hub & Coach Terminal)</option>
              <option value="gate1">Gate 1 (North Expressway Entry Road)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink-muted uppercase tracking-wider mb-1.5">
              Navigate To:
            </label>
            <select
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-bg text-xs font-bold text-[#003333] focus:outline-none focus:ring-2 focus:ring-teal"
            >
              <option value="male_gah">👈 Jalsa Male Gah (Left Sector)</option>
              <option value="female_gah">👉 Female Gah / Lajna Pavilion (Right Sector)</option>
              <option value="clinic">Central Medical Clinic & First Aid</option>
              <option value="dining">Dining Marquees & Catering</option>
            </select>
          </div>
        </div>

        {/* Route Steps Card */}
        {currentRoute && (
          <div className="bg-surface-bg rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center justify-between text-xs font-bold text-[#003333] mb-3">
              <span>Walking Route Guidance</span>
              <span className="text-teal font-mono">Approx. {currentRoute.distance}</span>
            </div>
            <ol className="space-y-2">
              {currentRoute.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-ink-body">
                  <span className="w-5 h-5 rounded-full bg-[#003333] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* ── Key Cards Grid: Key Venue Nodes ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.slice(0, 6).map((zone) => {
          const status = getStatusColor(zone.status);
          const ratio = Math.round((zone.currentOccupancy / zone.maxCapacity) * 100);

          return (
            <div
              key={zone.id}
              onClick={() => setActiveZone(zone)}
              className="p-4 rounded-2xl bg-white border border-surface-border hover:border-[#c5a049]/60 transition-all hover:shadow-soft cursor-pointer group"
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
                <div style={{ width: `${ratio}%` }} className={`h-full rounded-full ${status.bg}`} />
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
