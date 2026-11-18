'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Shield, 
  Truck, 
  Home as HomeIcon, 
  PhoneCall, 
  FileText, 
  Video,
  Feather,
  Globe
} from 'lucide-react';
import SearchModal from './SearchModal';
import LanguageToggle from './LanguageToggle';

export default function MastheadHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menuName);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  // Close menus on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="bg-white border-b border-surface-border/60 sticky top-0 z-40 shadow-soft">
        {/* Top Prestige Edition Ribbon */}
        <div className="bg-forest-950 text-white/90 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-display font-bold tracking-[0.12em] sm:tracking-[0.2em] text-lime truncate">
                In the Name of Allah, the Most Gracious, Ever Merciful
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-[10px] font-display tracking-widest text-white/80 flex-shrink-0">
              <Link href="/live-feed" className="hidden xs:flex items-center gap-1.5 text-white hover:text-lime transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-sans font-bold uppercase tracking-wider text-[10px] text-red-300">Live</span>
              </Link>
              <span className="hidden sm:inline text-white/20">|</span>
              <span className="hidden md:inline text-white/60">OFFICIAL PUBLICATION</span>
              <span className="font-bold text-lime bg-teal/20 px-2 sm:px-2.5 py-0.5 rounded-full border border-teal/30 text-[9px] sm:text-[10px] whitespace-nowrap">
                72ND JALSA 2026
              </span>
            </div>
          </div>
        </div>

        {/* Main Masthead Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-4">
          {/* Left: Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="relative w-9 h-9 sm:w-14 sm:h-14 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/jalsa-emblem.png"
                alt="Jalsa Salana Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="font-display font-extrabold tracking-[0.05em] text-base sm:text-2xl text-forest leading-none group-hover:text-teal transition-colors truncate">
                JALSA SALANA
              </div>
              <div className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-teal mt-0.5 sm:mt-1 truncate">
                Nigeria · Official Publication
              </div>
            </div>
          </Link>

          {/* Center: Prestigious National Motto */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center px-4">
            <span className="font-display font-extrabold text-sm tracking-widest uppercase text-forest">
              Ahmadiyya Muslim Jama&apos;at Nigeria
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-8 h-[1px] bg-teal/20"></span>
              <span className="text-[10px] tracking-[0.22em] uppercase text-teal font-extrabold">
                Love for All, Hatred for None
              </span>
              <span className="w-8 h-[1px] bg-teal/20"></span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Multilingual Selector (hidden on mobile, inside mobile drawer) */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="p-2 sm:px-3.5 sm:py-2 rounded-full border border-surface-border/80 hover:border-teal/40 text-ink-muted hover:text-forest transition-all text-xs font-semibold bg-surface-bg hover:bg-white shadow-soft"
              title="Search publication"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5 text-teal" />
              <span className="hidden md:inline ml-1.5">Search</span>
              <kbd className="hidden md:inline-block ml-1 text-[9px] bg-surface-muted text-ink-muted px-1.5 py-0.5 rounded font-mono border border-surface-border">
                ⌘K
              </kbd>
            </button>

            {/* Jalsa 2026 Registration Button with Modern Teal Glow */}
            <Link
              href="/registration"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-teal hover:bg-teal-600 text-white transition-all text-xs font-bold shadow-glow-teal hover:scale-105 active:scale-95 whitespace-nowrap"
              title="72nd Jalsa Salana Nigeria Registration Hub"
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-lime animate-ping"></span>
              <span>Register</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-forest hover:text-teal focus:outline-none rounded-xl hover:bg-surface-muted transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-forest" /> : <Menu className="w-6 h-6 text-forest" />}
            </button>
          </div>
        </div>

        {/* Desktop Consolidated Navigation Bar */}
        <nav className="hidden lg:block border-t border-surface-border/40 bg-surface-card relative z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold tracking-wider uppercase font-display">
            <div className="flex items-center space-x-1 sm:space-x-6 py-3">
              
              {/* Home */}
              <Link href="/" className="text-forest hover:text-teal transition-colors py-1 relative group">
                <span>Home</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-teal scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>

              {/* Registration 2026 Primary Link */}
              <Link href="/registration" className="text-teal hover:text-forest transition-colors py-1 flex items-center gap-1.5 font-extrabold group relative">
                <span>Registration</span>
                <span className="text-[9px] bg-teal-50 text-teal border border-teal-200 px-2 py-0.5 rounded-full uppercase font-sans">2026</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-teal scale-x-100 transition-transform"></span>
              </Link>

              {/* 1. Dedicated Blog Menu */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('blog')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 py-1 transition-colors group ${
                    activeDropdown === 'blog' ? 'text-teal' : 'text-ink-heading hover:text-teal'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal" />
                  <span>Blog</span>
                  <ChevronDown className="w-3 h-3 text-ink-muted group-hover:text-teal" />
                </button>

                {activeDropdown === 'blog' && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-surface-border/60 rounded-2xl shadow-soft-lg p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] uppercase font-display text-teal px-3 py-1.5 font-bold border-b border-surface-border/40 mb-1">
                      Official Blog Categories
                    </div>
                    <Link
                      href="/blog"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">All Blog Posts</span>
                      <span className="text-[10px] text-ink-muted font-mono">148 posts</span>
                    </Link>
                    <Link
                      href="/blog?category=amirs-corner"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Amir&apos;s Corner</span>
                      <span className="text-[9px] bg-teal-50 text-teal font-bold px-2 py-0.5 rounded-md">Official</span>
                    </Link>
                    <Link
                      href="/blog?category=convention-lectures"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Convention Lectures &amp; Papers</span>
                      <span className="text-[9px] text-teal font-medium">Scholarly</span>
                    </Link>
                    <Link
                      href="/blog?category=press-conference"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Press Conferences &amp; Communiques</span>
                    </Link>
                    <Link
                      href="/blog?category=faith-spirituality"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Faith &amp; Spirituality</span>
                    </Link>
                    <Link
                      href="/blog?category=social-justice-peace"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Social Justice &amp; Peace</span>
                    </Link>
                    <Link
                      href="/blog?category=poems-reflections"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <span className="font-semibold normal-case">Poems &amp; Personal Memories</span>
                      <Feather className="w-3.5 h-3.5 text-teal" />
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. Event & Attendees Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('attendees')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 py-1 transition-colors group ${
                    activeDropdown === 'attendees' ? 'text-teal' : 'text-ink-heading hover:text-teal'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-teal" />
                  <span>Event Attendees</span>
                  <ChevronDown className="w-3 h-3 text-ink-muted group-hover:text-teal" />
                </button>

                {activeDropdown === 'attendees' && (
                  <div className="absolute top-full left-0 w-80 bg-white border border-surface-border/60 rounded-2xl shadow-soft-lg p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] uppercase font-display text-teal px-3 py-1.5 font-bold border-b border-surface-border/40 mb-1">
                      Delegate Logistics &amp; Guidelines
                    </div>
                    <Link
                      href="/programme-of-events-jalsa-salana-nigeria-2024"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <FileText className="w-4 h-4 text-teal" />
                      <div>
                        <div className="font-semibold normal-case">Programme of Events</div>
                        <div className="text-[11px] text-ink-muted font-sans normal-case">Daily session timetable &amp; schedule</div>
                      </div>
                    </Link>
                    <Link
                      href="/accommodation"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <HomeIcon className="w-4 h-4 text-teal" />
                      <div>
                        <div className="font-semibold normal-case">Accommodation Arrangements</div>
                        <div className="text-[11px] text-ink-muted font-sans normal-case">Tents, halls &amp; family lodging</div>
                      </div>
                    </Link>
                    <Link
                      href="/transportation"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <Truck className="w-4 h-4 text-teal" />
                      <div>
                        <div className="font-semibold normal-case">Transportation &amp; Routes</div>
                        <div className="text-[11px] text-ink-muted font-sans normal-case">Bus convoys &amp; parking instructions</div>
                      </div>
                    </Link>
                    <Link
                      href="/security"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors"
                    >
                      <Shield className="w-4 h-4 text-teal" />
                      <div>
                        <div className="font-semibold normal-case">Security &amp; Protocol</div>
                        <div className="text-[11px] text-ink-muted font-sans normal-case">Entry tags &amp; safety guidelines</div>
                      </div>
                    </Link>
                    <Link
                      href="/info-emergency"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-50/50 text-ink hover:text-red-700 transition-colors"
                    >
                      <PhoneCall className="w-4 h-4 text-red-600" />
                      <div>
                        <div className="font-semibold normal-case text-red-700">Info &amp; Emergencies</div>
                        <div className="text-[11px] text-ink-muted font-sans normal-case">On-site medical &amp; central helpline</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3. Archives & Media Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('media')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 py-1 transition-colors group ${
                    activeDropdown === 'media' ? 'text-teal' : 'text-ink-heading hover:text-teal'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-teal" />
                  <span>Media &amp; Archives</span>
                  <ChevronDown className="w-3 h-3 text-ink-muted group-hover:text-teal" />
                </button>

                {activeDropdown === 'media' && (
                  <div className="absolute top-full left-0 w-72 bg-white border border-surface-border/60 rounded-2xl shadow-soft-lg p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-[10px] uppercase font-display text-teal px-3 py-1.5 font-bold border-b border-surface-border/40 mb-1">
                      Conventions &amp; Documentaries
                    </div>
                    <Link
                      href="/editions/2026"
                      onClick={() => setActiveDropdown(null)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors normal-case"
                    >
                      <span className="font-semibold">72nd Jalsa Salana 2026 Hub</span>
                      <span className="text-[9px] bg-teal-50 text-teal px-2 py-0.5 rounded-md font-bold uppercase">Upcoming</span>
                    </Link>
                    <Link
                      href="/editions"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors normal-case"
                    >
                      <div className="font-semibold">Historical Editions Timeline</div>
                      <div className="text-[11px] text-ink-muted font-sans">Comprehensive convention archives</div>
                    </Link>
                    <Link
                      href="/galleries"
                      onClick={() => setActiveDropdown(null)}
                      className="block p-2.5 rounded-xl hover:bg-surface-bg text-ink hover:text-teal transition-colors normal-case"
                    >
                      <div className="font-semibold">Photography &amp; Video Galleries</div>
                      <div className="text-[11px] text-ink-muted font-sans">High-resolution event photographs</div>
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Right Meta Links */}
            <div className="flex items-center gap-3 py-3 text-xs font-semibold text-ink-muted">
              <Link href="/dashboard" className="text-teal hover:text-forest transition-colors flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                <span>Dashboard</span>
              </Link>
              <span>•</span>
              <Link href="/live-crowd" className="text-forest hover:text-teal transition-colors flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Map</span>
              </Link>
              <span>•</span>
              <Link href="/about" className="hover:text-teal transition-colors">
                About
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-teal transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer with Structured Accordion */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-surface-border/60 bg-white px-4 pt-4 pb-8 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-2 text-sm font-semibold text-ink">
              {/* Registration Banner */}
              <Link
                href="/registration"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 px-4 rounded-2xl bg-teal text-white font-bold flex items-center justify-between shadow-glow-teal"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-lime" />
                  <span>Register for Jalsa 2026</span>
                </div>
                <span className="text-[10px] uppercase font-extrabold bg-forest text-lime px-2 py-0.5 rounded-md">
                  Open Portal
                </span>
              </Link>

              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-surface-muted text-teal font-bold"
              >
                Home
              </Link>

              {/* Group 1: Dedicated Blog Menu */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-display text-teal px-3 py-1 font-bold">
                  Official Blog &amp; Categories
                </div>
                <div className="pl-2 space-y-1">
                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-semibold text-teal"
                  >
                    All Blog Posts (148)
                  </Link>
                  <Link
                    href="/blog?category=amirs-corner"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Amir&apos;s Corner
                  </Link>
                  <Link
                    href="/blog?category=convention-lectures"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Convention Lectures
                  </Link>
                  <Link
                    href="/blog?category=press-conference"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Press Conferences
                  </Link>
                  <Link
                    href="/blog?category=faith-spirituality"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Faith &amp; Spirituality
                  </Link>
                  <Link
                    href="/blog?category=poems-reflections"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Poems &amp; Reflections
                  </Link>
                </div>
              </div>

              {/* Group 2: Event Logistics */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-display text-teal px-3 py-1 font-bold">
                  Event Attendees &amp; Logistics
                </div>
                <div className="pl-2 space-y-1">
                  <Link
                    href="/programme-of-events-jalsa-salana-nigeria-2024"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Programme of Events
                  </Link>
                  <Link
                    href="/accommodation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Accommodation Arrangements
                  </Link>
                  <Link
                    href="/transportation"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Transportation &amp; Routes
                  </Link>
                  <Link
                    href="/security"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Security &amp; Protocol
                  </Link>
                  <Link
                    href="/info-emergency"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-red-50 text-xs font-bold text-red-700"
                  >
                    Info &amp; Emergencies Desk
                  </Link>
                </div>
              </div>

              {/* Group 3: Media & Archives */}
              <div className="pt-2">
                <div className="text-[10px] uppercase font-display text-teal px-3 py-1 font-bold">
                  Media &amp; Archives
                </div>
                <div className="pl-2 space-y-1">
                  <Link
                    href="/speeches"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Speeches &amp; Addresses
                  </Link>
                  <Link
                    href="/editions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Historical Conventions Timeline
                  </Link>
                  <Link
                    href="/galleries"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-surface-muted text-xs font-medium"
                  >
                    Photo &amp; Video Highlights
                  </Link>
                </div>
              </div>

              {/* Mobile Language Selector */}
              <div className="pt-3 border-t border-surface-border/60">
                <div className="text-[10px] uppercase font-display text-ink-muted px-1 py-1 font-bold mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-teal" />
                  <span>Language Selection</span>
                </div>
                <div className="pt-1">
                  <LanguageToggle />
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs font-medium text-ink-muted">
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-teal">
                  About Publication
                </Link>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-teal">
                  Contact
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-teal font-bold">
                  Admin Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
