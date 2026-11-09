'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Smartphone,
  Users,
  QrCode,
  Bus,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  AlertTriangle,
  Award,
  Baby,
  Home,
  Briefcase,
  Layers,
  Radio,
  FileCheck,
  Headphones,
  Info,
  Maximize2,
  X,
  Download,
} from 'lucide-react';
import AddToCalendarButton from '@/components/public/AddToCalendarButton';

// 20 Official Portal Features extracted from the campaign flyers
const PORTAL_FEATURES = [
  {
    id: 'F01',
    name: 'Your Tag on Your Phone',
    category: 'delegate',
    desc: 'Instant digital delegate tag with high-density QR code stored on your mobile device. Works completely offline with Apple Wallet and Google Wallet support.',
    flyer: '/images/registration/jalsa2026-feature-01-your-tag-on-your-phone_feed.webp',
  },
  {
    id: 'F02',
    name: 'Whole Family Registration',
    category: 'delegate',
    desc: 'Household heads can register spouse, children, and elderly relatives in one single form, avoiding repetitive data entry.',
    flyer: '/images/registration/jalsa2026-feature-02-whole-family_feed.webp',
  },
  {
    id: 'F03',
    name: 'Register on WhatsApp & SMS',
    category: 'delegate',
    desc: 'Low-friction registration via automated WhatsApp chat assistant or SMS prompt for delegates with limited smartphone connectivity.',
    flyer: '/images/registration/jalsa2026-feature-03-register-on-whatsapp_feed.webp',
  },
  {
    id: 'F04',
    name: 'Self Check-In at Gates',
    category: 'delegate',
    desc: 'Upon arriving at Jamia Ahmadiyya Ilaro, simply scan the gate QR posters to verify attendance and skip long manual verification queues.',
    flyer: '/images/registration/jalsa2026-feature-04-self-check-in_feed.webp',
  },
  {
    id: 'F05',
    name: 'Travel Group & Conveyance Form',
    category: 'travel',
    desc: 'One registration form per chartered bus, car convoy, or circuit delegation to organize arrival times and parking allocation.',
    flyer: '/images/registration/jalsa2026-feature-05-travel-group-form_feed.webp',
  },
  {
    id: 'F06',
    name: 'Volunteer Duty Registration',
    category: 'volunteer',
    desc: 'Choose your desired service department in advance: Security, Kitchen (Langar Khana), Medical, MTA/Media, Sanitation, or Traffic Control.',
    flyer: '/images/registration/jalsa2026-feature-06-volunteer_feed.webp',
  },
  {
    id: 'F07',
    name: 'Bring a Guest / Non-Ahmadi Observers',
    category: 'delegate',
    desc: 'Dedicated guest registration flow with member sponsorship, ensuring non-Ahmadi dignitaries and friends receive VIP badges and hospitality.',
    flyer: '/images/registration/jalsa2026-feature-07-bring-a-guest_feed.webp',
  },
  {
    id: 'F08',
    name: 'One Scan Per Bus Check-In',
    category: 'travel',
    desc: 'Travel coordinators can scan one master QR code at the transport reception desk to verify an entire chartered bus of 50+ delegates.',
    flyer: '/images/registration/jalsa2026-feature-08-one-scan-per-bus_feed.webp',
  },
  {
    id: 'F09',
    name: 'Stay Updated via Multi-Channel Alerts',
    category: 'delegate',
    desc: 'Real-time SMS alerts, official WhatsApp announcements, and live programme push notifications delivered directly to delegates.',
    flyer: '/images/registration/jalsa2026-feature-09-stay-updated_feed.webp',
  },
  {
    id: 'F10',
    name: 'Easy Mode & Multi-Language Support',
    category: 'delegate',
    desc: 'Simplified high-contrast large-text interface with native translation support in English, Yorùbá, and Hausa.',
    flyer: '/images/registration/jalsa2026-feature-10-easy-mode-and-languages_feed.webp',
  },
  {
    id: 'F11',
    name: 'Child Safety Barcode Wristbands',
    category: 'safety',
    desc: 'Dedicated safety wristbands issued at arrival gates paired directly with registered parents’ contact details to ensure zero lost children.',
    flyer: '/images/registration/jalsa2026-feature-11-child-wristbands_feed.webp',
  },
  {
    id: 'F12',
    name: 'Lodging Allocation on Your Tag',
    category: 'safety',
    desc: 'Your assigned residential marquee, tent sector, or dormitory block is encoded directly on your digital badge.',
    flyer: '/images/registration/jalsa2026-feature-12-lodging-on-your-tag_feed.webp',
  },
  {
    id: 'F13',
    name: 'Interactive Live Programme',
    category: 'delegate',
    desc: 'Real-time "What’s On Now & Next" session tracker, speech schedules, and prayer times throughout the 3-day convention.',
    flyer: '/images/registration/jalsa2026-feature-13-live-programme_feed.webp',
  },
  {
    id: 'F14',
    name: 'Help Desk One Tap Away',
    category: 'safety',
    desc: 'Direct one-tap contact to the Jalsa Secretariat Help Desk, emergency medical dispatch, and lost-and-found officers.',
    flyer: '/images/registration/jalsa2026-feature-14-help-one-tap-away_feed.webp',
  },
  {
    id: 'F15',
    name: 'Market & Bazaar Traders',
    category: 'volunteer',
    desc: 'Online registration, licensing, and designated stall allocation for vendors in the Jalsa commercial bazaar and food court.',
    flyer: '/images/registration/jalsa2026-feature-15-market-traders_feed.webp',
  },
  {
    id: 'F16',
    name: 'Batch Tag Collection',
    category: 'travel',
    desc: 'Circuit presidents and group leaders can pre-print or collect physical tags in batches prior to departure for Ilaro.',
    flyer: '/images/registration/jalsa2026-feature-16-collect-tags-together_feed.webp',
  },
  {
    id: 'F17',
    name: 'Walk-In Registration Assistance',
    category: 'delegate',
    desc: 'Dedicated on-site registration kiosks at Jamia Ilaro staffed by Khuddam to register elderly and non-digital delegates on arrival.',
    flyer: '/images/registration/jalsa2026-feature-17-walk-in-registration_feed.webp',
  },
  {
    id: 'F18',
    name: 'Track Your Bus & Logistics',
    category: 'travel',
    desc: 'Live convoy status, designated pick-up locations, and estimated times of arrival for regional bus departures across Nigeria.',
    flyer: '/images/registration/jalsa2026-feature-18-track-your-bus_feed.webp',
  },
  {
    id: 'F19',
    name: 'Digital Attendance Certificate',
    category: 'delegate',
    desc: 'Downloadable official certificate of participation issued post-Jalsa to document attendance at the historic 72nd convention.',
    flyer: '/images/registration/jalsa2026-feature-19-attendance-certificate_feed.webp',
  },
  {
    id: 'F20',
    name: 'Volunteer Clock-In & Shift Tracking',
    category: 'volunteer',
    desc: 'Digital check-in system for volunteer duty shifts to ensure optimal staffing across all convention security and hospitality posts.',
    flyer: '/images/registration/jalsa2026-feature-20-volunteer-clock-in_feed.webp',
  },
];

const FAQS = [
  {
    q: 'How do I register for Jalsa Salana Nigeria 2026?',
    a: 'Registration is completed through the official portal at jalsa.ahmadiyyanigeria.net. Simply visit the portal, select whether you are registering an individual, family, travel group, or guest, and provide your membership or contact details to generate your digital tag.',
  },
  {
    q: 'Are there any registration fees or charges to attend Jalsa?',
    a: 'No. Attendance, admission, convention meals from the blessed Langar Khana of the Promised Messiah (as), and standard marquee accommodation are completely free for all sincere delegates. No delegate is ever required to pay for registration tags. Any voluntary contributions towards Jalsa Salana expenses (Chanda Jalsa Salana) are managed strictly through official Jama\'at financial secretaries.',
  },
  {
    q: 'Can I register my entire family in one submission?',
    a: 'Yes! The official portal features "Whole Family Registration" (Feature F02). Household heads can add their spouse, children, and elderly relatives on a single form. Each family member will receive their own personalized tag, and children will receive safety wristbands linked to parents.',
  },
  {
    q: 'What is the "Digital Tag" and do I need to print it?',
    a: 'Your digital tag (Feature F01) contains your registration details and a high-density QR code. You can save it to your phone\'s photo gallery, Apple Wallet, or Google Wallet. While physical badge collection is available, presenting the digital tag on your smartphone is fully sufficient for gate verification.',
  },
  {
    q: 'How does self check-in at Jamia Ahmadiyya Ilaro work?',
    a: 'When you arrive at the convention grounds in Ilaro, prominent check-in posters with QR codes will be positioned at all entry gates. Simply open your phone\'s camera, scan the gate QR code, and your attendance is instantly marked, allowing you to proceed directly to your lodging marquee without waiting in registration queues.',
  },
  {
    q: 'How do chartered buses and travel groups register?',
    a: 'Circuit presidents, travel leaders, or bus coordinators should use the "Travel Group Form" (Feature F05). This registers the entire vehicle convoy and passenger manifest. Upon arrival at the bus terminal in Ilaro, the travel leader can perform a single master scan (Feature F08) to check in all 50+ passengers at once.',
  },
  {
    q: 'Can non-Ahmadi friends and observers register?',
    a: 'Yes. The Ahmadiyya Muslim Jama\'at Nigeria warmly welcomes non-Ahmadi guests, scholars, media representatives, and dignitaries. Members can sponsor their guests using the "Bring a Guest" portal feature (F07) to ensure they receive special guest badges, designated seating, and hospitality.',
  },
  {
    q: 'What if I do not have a smartphone or internet access?',
    a: 'Walk-in registration kiosks (Feature F17) will be fully operational at Jamia Ahmadiyya Ilaro. Volunteer teams from Majlis Khuddamul Ahmadiyya will assist elderly members, rural delegates, and first-time attendees in printing their badges on the spot.',
  },
];

export default function RegistrationPage() {
  const portalUrl = 'https://jalsa.ahmadiyyanigeria.net/';
  const [featureCategory, setFeatureCategory] = useState<'all' | 'delegate' | 'travel' | 'volunteer' | 'safety'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedFlyer, setSelectedFlyer] = useState<any | null>(null);
  const [modalFormat, setModalFormat] = useState<'feed' | 'status'>('feed');

  const filteredFeatures = PORTAL_FEATURES.filter((f) =>
    featureCategory === 'all' ? true : f.category === featureCategory
  );

  return (
    <div className="bg-surface-bg min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative py-14 sm:py-20 bg-gradient-to-br from-primary-night via-primary-dark to-primary-900 text-white overflow-hidden border-b-4 border-gold">
        {/* Background Islamic Stars Pattern & Glow */}
        <div className="absolute inset-0 bg-islamic-stars opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gold/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none">
          <Image src="/images/jalsa-emblem.png" alt="" fill className="object-contain" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/20 text-gold-metallic border border-gold/40 text-xs font-cinzel font-black uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>OFFICIAL REGISTRATION GUIDE &amp; PORTAL HUB</span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.12] tracking-tight">
                Register for Jalsa Salana Nigeria 2026
              </h1>

              {/* Official 72nd Logo Badge */}
              <div className="inline-block bg-white/95 p-2 sm:p-2.5 rounded-xl shadow-xl border border-gold/40 backdrop-blur-sm">
                <div className="relative h-10 sm:h-12 w-48 sm:w-56">
                  <Image
                    src="/images/jalsa72-logo.jpg"
                    alt="72nd Jalsa Salana Nigeria 2026 Official Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-serif max-w-2xl mx-auto lg:mx-0">
                Welcome to the official registration information gateway for the <strong>72nd Annual Convention</strong> of the Ahmadiyya Muslim Jama&apos;at Nigeria. Secure your digital delegate tag, household registration, and lodging allocations today.
              </p>

              {/* Event Metadata Bar */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-gray-300 pt-2">
                <span className="flex items-center gap-1.5 bg-black/40 px-3.5 py-2 rounded-xl border border-gold/30">
                  <Calendar className="w-4 h-4 text-gold" />
                  <strong className="text-white">December 18–20, 2026</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-3.5 py-2 rounded-xl border border-gold/30">
                  <MapPin className="w-4 h-4 text-gold" />
                  <strong className="text-white">Jamia Ahmadiyya Ilaro, Ogun State</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-black/40 px-3.5 py-2 rounded-xl border border-gold/30">
                  <Users className="w-4 h-4 text-gold" />
                  <strong className="text-white">45,000+ Expected Delegates</strong>
                </span>
              </div>

              {/* Hero Call to Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-metallic hover:from-gold-hover hover:to-gold text-primary-950 font-black text-sm uppercase tracking-wider transition-all shadow-gold-glow hover:scale-105 active:scale-95"
                >
                  <span>REGISTER ON PORTAL NOW</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <AddToCalendarButton />

                <a
                  href="#steps"
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
                >
                  <span>Step-by-Step Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Flyer Spotlight (5 Cols) with Click to Enlarge */}
            <div className="lg:col-span-5 flex justify-center">
              <div
                onClick={() => {
                  setSelectedFlyer({
                    id: 'F00',
                    name: '72nd Jalsa Salana Nigeria — The Arch Announcement',
                    flyer: '/images/registration/jalsa2026-flyer-01-the-arch_feed.webp',
                    desc: 'Official 72nd Convention Theme: Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony.',
                  });
                  setModalFormat('feed');
                }}
                className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-2 border-gold/60 group cursor-pointer ring-4 ring-black/30"
              >
                <Image
                  src="/images/registration/jalsa2026-flyer-01-the-arch_feed.webp"
                  alt="72nd Jalsa Salana Nigeria Official Registration Flyer - The Arch"
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-[10px] uppercase font-cinzel font-black text-gold-metallic tracking-widest block mb-1">
                    ✦ OFFICIAL PUBLICITY DESIGN 01 ✦
                  </span>
                  <p className="text-base font-display font-bold text-white leading-snug">
                    72nd Jalsa Salana Nigeria — The Arch Announcement
                  </p>
                  <p className="text-xs text-gray-300 mt-1 font-serif">
                    Theme: Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gold">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Click to inspect high-resolution artwork</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE REGISTRATION GUIDELINES & WHAT TO KNOW */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Delegate Briefing
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              Essential Registration Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Every member attending Jalsa Salana Nigeria 2026 is required to register in advance through the official digital portal to guarantee a smooth and spiritually uplifting experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Tag className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">Digital Tag &amp; Gate Entry</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your registered tag contains a unique security barcode verifying your member status. Presenting your tag on your phone skips manual entry paperwork and grants instant gate verification.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Home className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">Lodging &amp; Marquee Assignment</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Residential marquees, family dormitory blocks, and guest accommodations are allocated based on pre-registration data. Registering early ensures your sector is pre-assigned.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold">
                <Baby className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">Child Safety Protocol</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Children under 15 receive barcode wristbands paired directly with their registered parents’ phone numbers, ensuring immediate reunification in the event of separation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. STEP-BY-STEP WALKTHROUGH */}
      <section id="steps" className="py-12 sm:py-16 bg-surface-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Walkthrough
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              How to Register in 5 Simple Steps
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              The portal is engineered to take less than two minutes from your smartphone, tablet, or computer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'Open Portal',
                desc: 'Visit jalsa.ahmadiyyanigeria.net or scan the official QR code on any Jalsa publicity flyer.',
              },
              {
                step: '02',
                title: 'Select Category',
                desc: 'Choose Individual, Family/Household, Chartered Bus/Conveyance, or Non-Ahmadi Guest registration.',
              },
              {
                step: '03',
                title: 'Enter Details',
                desc: 'Provide your name, Tajneed/AIMS number, circuit, auxiliary body (Ansar, Lajna, Khuddam, Atfal, Nasirat).',
              },
              {
                step: '04',
                title: 'Generate Tag',
                desc: 'Your personalized digital delegate tag with QR code and lodging allocation is generated instantly.',
              },
              {
                step: '05',
                title: 'Save & Present',
                desc: 'Save the tag to your phone gallery or wallet. Simply scan gate posters at Jamia Ilaro upon arrival.',
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="font-serif font-black text-3xl text-gold mb-2">{s.step}</div>
                  <h3 className="font-serif font-bold text-base text-charcoal mb-2">{s.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-end text-primary">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>Begin Registration on Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 4. REGISTRATION CLASSIFICATIONS & AUXILIARY BODIES */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Classifications
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              Registration Categories &amp; Auxiliary Streams
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Every member of the community registers according to their specific auxiliary and delegation structure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Category 1: Ansarullah */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-100 text-amber-800">
                    Flyer 65
                  </span>
                  <span className="text-xs font-bold text-gray-400">Elders 40+</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Majlis Ansarullah</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Elders and senior members of the Jama&apos;at. Dedicated accommodation marquees with elder accessibility ramps and specialized medical observation posts.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Specialized Senior Citizen Accommodation
              </div>
            </div>

            {/* Category 2: Lajna Imaillah */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-purple-100 text-purple-800">
                    Flyer 66
                  </span>
                  <span className="text-xs font-bold text-gray-400">Women &amp; Ladies</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Lajna Imaillah &amp; Nasirat</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Complete privacy and autonomous women&apos;s marquee with direct video/audio transmission, dedicated dining pavilions, and mother-and-child nursing suites.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Strict Purdah &amp; Private Women&apos;s Marquee
              </div>
            </div>

            {/* Category 3: Khuddam */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                    Flyer 67
                  </span>
                  <span className="text-xs font-bold text-gray-400">Youth 15–40</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Majlis Khuddamul Ahmadiyya</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Young men serving across volunteer departments and attending intellectual symposiums. Integration with volunteer duty rosters (Feature F06 &amp; F20).
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Volunteer Duty &amp; Youth Forum Access
              </div>
            </div>

            {/* Category 4: Atfal */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                    Flyer 68 &amp; 69
                  </span>
                  <span className="text-xs font-bold text-gray-400">Children under 15</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Atfal &amp; Nasirat</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Young boys and girls attending with parents. Enrolled in child safety barcode wristband tracking (Feature F11) paired with guardian contacts.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Safety Wristband Pairing with Parents
              </div>
            </div>

            {/* Category 5: Travel Groups / Buses */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-green-100 text-green-800">
                    Feature F05 &amp; F08
                  </span>
                  <span className="text-xs font-bold text-gray-400">Circuit Buses</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Travel Groups &amp; Convoys</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Circuit coordinators can register chartered buses. Travel leaders scan one master QR code to check in entire convoys at the bus terminal in Ilaro.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Single Master Scan for Chartered Buses
              </div>
            </div>

            {/* Category 6: Guests & Traders */}
            <div className="p-6 rounded-2xl bg-surface-bg border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-gray-100 text-gray-800">
                    Feature F07 &amp; F15
                  </span>
                  <span className="text-xs font-bold text-gray-400">Observers &amp; Bazaar</span>
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Guests &amp; Commercial Bazaar</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">
                  Non-Ahmadi observers sponsored by members, and registered stallholders for the convention market and food court.
                </p>
              </div>
              <div className="pt-3 border-t border-gray-200 text-xs text-primary font-bold">
                Guest Badges &amp; Bazaar Stall Allocation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEES, CHARGES & FINANCIAL CLARIFICATIONS */}
      <section className="py-12 bg-surface-card border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-charcoal">
                  Free Admission &amp; Hospitality for All Delegates
                </h3>
                <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  No Registration Fees Charged
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              In strict accordance with the foundational principles established by the Promised Messiah (as) in 1891, <strong>attendance, admission, registration tags, standard lodging in convention marquees, and convention meals from the blessed Langar Khana are completely free</strong> for all delegates and guests.
            </p>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Important Financial Advisory:</strong> Beware of unauthorized individuals or third-party websites claiming to collect registration fees. The official registration portal (<code>jalsa.ahmadiyyanigeria.net</code>) does not charge any fee. Voluntary contributions towards Jalsa Salana expenses are made strictly through verified Jama&apos;at financial secretaries.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE 20 PORTAL FEATURES SHOWCASE */}
      <section className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Technology &amp; Innovations
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              20 Groundbreaking Portal Features
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Explore the full suite of technological innovations powering the 72nd Jalsa Salana Nigeria registration portal (Features F01 to F20).
            </p>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { key: 'all', label: 'All 20 Features' },
                { key: 'delegate', label: 'Delegates & Families' },
                { key: 'travel', label: 'Travel & Convoys' },
                { key: 'volunteer', label: 'Volunteers & Bazaar' },
                { key: 'safety', label: 'Safety & Lodging' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFeatureCategory(tab.key as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    featureCategory === tab.key
                      ? 'bg-primary text-white shadow'
                      : 'bg-surface-bg text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid with Flyer Graphics & Lightbox Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeatures.map((feat) => (
              <div
                key={feat.id}
                className="bg-surface-bg rounded-2xl border border-gray-200 p-4 hover:border-gold/80 transition-all hover:shadow-xl flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div
                    onClick={() => {
                      setSelectedFlyer(feat);
                      setModalFormat('feed');
                    }}
                    className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 bg-gray-900 shadow-sm cursor-pointer ring-1 ring-black/5 group-hover:ring-gold/50"
                  >
                    <Image
                      src={feat.flyer}
                      alt={feat.name}
                      fill
                      className="object-cover group-hover:scale-106 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-mono font-black px-2 py-0.5 rounded shadow border border-gold/30">
                      {feat.id}
                    </span>

                    {/* Hover Prompt */}
                    <div className="absolute inset-0 bg-primary-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs font-bold text-white backdrop-blur-[2px]">
                      <Maximize2 className="w-4 h-4 text-gold" />
                      <span>Inspect Flyer</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug mb-1">
                    {feat.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 font-serif">
                    {feat.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-200 flex items-center justify-between text-[11px] text-primary font-bold">
                  <span className="flex items-center gap-1 text-gold-dark font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold" />
                    <span>Portal Feature</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFlyer(feat);
                      setModalFormat('feed');
                    }}
                    className="text-xs text-gray-500 hover:text-primary underline font-medium"
                  >
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REGIONAL DELEGATION HUBS */}
      <section className="py-12 bg-surface-bg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              National Mobilization
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              Regional Delegations &amp; Convoys
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Chartered transportation networks and circuit coordination points across Nigeria (Flyers 75–80).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { city: 'Lagos', note: 'Ojokoro & Island Convoys', flyer: '75' },
              { city: 'Ogun State', note: 'Host Circuit & Ilaro Hub', flyer: '76' },
              { city: 'Ibadan', note: 'Oyo State Delegations', flyer: '77' },
              { city: 'Ilorin', note: 'Kwara & Central Corridor', flyer: '78' },
              { city: 'Kano', note: 'Northern States Transit', flyer: '79' },
              { city: 'Abuja FCT', note: 'Federal Capital Fleet', flyer: '80' },
            ].map((reg, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-xs hover:border-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary mx-auto mb-2 flex items-center justify-center font-bold text-xs">
                  <Bus className="w-4 h-4" />
                </div>
                <div className="font-serif font-bold text-sm text-charcoal">{reg.city}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{reg.note}</div>
                <div className="text-[9px] uppercase font-bold text-gold-dark mt-2">Flyer {reg.flyer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE FAQS ACCORDION */}
      <section id="faqs" className="py-12 sm:py-16 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Common Questions
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-4xl text-charcoal">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Everything you need to know about registering for the 72nd Jalsa Salana Nigeria 2026.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 overflow-hidden bg-surface-bg transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-charcoal hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. REGISTRATION SUPPORT & CONTACTS */}
      <section className="py-12 bg-surface-bg border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Need Help?
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
              Official Registration Support Desk
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Contact our digital registration team for assistance with family submissions, bus group tags, or technical inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="tel:+2348030000000"
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4 hover:border-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Telephone Helpline</span>
                <span className="text-xs font-bold text-charcoal">+234 803 000 0000</span>
              </div>
            </a>

            <a
              href="https://wa.me/2348030000000?text=Salam%2C+I+need+assistance+with+Jalsa+Salana+Nigeria+2026+registration"
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4 hover:border-emerald-600 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">WhatsApp Support Desk</span>
                <span className="text-xs font-bold text-emerald-700">Chat with Helpdesk</span>
              </div>
            </a>

            <a
              href="mailto:registration@jalsasalana.ng"
              className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-4 hover:border-primary transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-gold/15 text-gold-dark flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Email Inquiries</span>
                <span className="text-xs font-bold text-charcoal">registration@jalsasalana.ng</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION BANNER */}
      <section className="py-16 bg-gradient-to-r from-primary-950 via-primary to-primary-950 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>

          <h2 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight">
            YOUR JALSA EXPERIENCE BEGINS WITH REGISTRATION!
          </h2>

          <p className="text-sm sm:text-base text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Do not wait until the opening day. Register yourself, your household, and your travel group today to receive your digital tag and guarantee a peaceful, well-organized convention.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-10 py-5 rounded-2xl bg-gold hover:bg-gold-hover text-primary-950 font-black text-sm uppercase tracking-wider transition-all shadow-2xl hover:scale-105"
            >
              <span>PROCEED TO REGISTRATION PORTAL</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
            >
              <span>Return to Magazine Home</span>
            </Link>
          </div>

          <p className="text-[11px] text-gray-400 pt-4">
            Official Portal: <span className="font-mono text-gold">jalsa.ahmadiyyanigeria.net</span> • 72nd Jalsa Salana Nigeria (18–20 December 2026)
          </p>
        </div>
      </section>

      {/* High-Resolution Flyer Lightbox Modal */}
      {selectedFlyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative max-w-lg w-full bg-primary-night border border-gold/40 rounded-3xl p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">
                  {selectedFlyer.id} · OFFICIAL FLYER
                </span>
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedFlyer.name}
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
                src={
                  modalFormat === 'feed'
                    ? selectedFlyer.flyer.replace('_status.webp', '_feed.webp')
                    : selectedFlyer.flyer.replace('_feed.webp', '_status.webp')
                }
                alt={selectedFlyer.name}
                fill
                className="object-contain"
              />
            </div>

            <p className="text-xs text-gray-300 mt-4 leading-relaxed text-center font-serif">
              {selectedFlyer.desc}
            </p>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={
                  modalFormat === 'feed'
                    ? selectedFlyer.flyer.replace('_status.webp', '_feed.webp')
                    : selectedFlyer.flyer.replace('_feed.webp', '_status.webp')
                }
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
    </div>
  );
}
