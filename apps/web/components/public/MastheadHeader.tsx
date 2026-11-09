'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import SearchModal from './SearchModal';

export default function MastheadHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-prestige">
        {/* Top Prestige Calligraphy & Edition Ribbon */}
        <div className="bg-primary-deep text-gold-foil text-[11px] sm:text-xs py-1 px-4 border-b border-gold/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-arabic text-sm text-gold-metallic" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <span className="hidden lg:inline text-[10px] uppercase font-cinzel tracking-[0.25em] text-gray-300">
                · In the Name of Allah, the Most Gracious, Ever Merciful ·
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-cinzel tracking-widest text-gold-metallic">
              <span className="hidden sm:inline">OFFICIAL DIGITAL PUBLICATION</span>
              <span className="hidden sm:inline text-gold/40">✦</span>
              <span className="font-bold text-white">72ND JALSA SALANA 2026</span>
            </div>
          </div>
        </div>

        {/* Main Masthead Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: Brand / Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/jalsa-emblem.png"
                alt="Jalsa Salana Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-display font-black tracking-[0.14em] text-xl sm:text-2xl text-primary leading-none group-hover:text-primary-dark transition-colors">
                JALSA SALANA
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.28em] text-gold-dark mt-1">
                Nigeria — Digital Publication
              </div>
            </div>
          </Link>

          {/* Center: Arabic Calligraphy Tagline with Classical Ornamentation */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center px-4">
            <span className="font-arabic text-2xl text-primary-dark font-normal leading-relaxed text-shadow-sm" dir="rtl">
              قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-8 h-[1px] bg-gold/40"></span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-charcoal-muted font-bold">
                Ahmadiyya Muslim Jama&apos;at Nigeria
              </span>
              <span className="w-8 h-[1px] bg-gold/40"></span>
            </div>
          </div>

          {/* Right: Actions (Search, Registration CTA, Hub Button, Mobile Toggle) */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-gold text-gray-600 hover:text-primary transition-all text-xs font-semibold bg-surface-bg hover:bg-white shadow-sm"
              title="Search publication"
            >
              <Search className="w-3.5 h-3.5 text-gold-dark" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono border border-gray-200">
                ⌘K
              </kbd>
            </button>

            {/* Jalsa 2026 Registration Button with Rich Foil Glow */}
            <Link
              href="/registration"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-gold via-gold-metallic to-gold hover:from-gold-hover hover:to-gold text-primary-950 transition-all text-xs font-black shadow-gold-glow hover:scale-105 active:scale-95"
              title="72nd Jalsa Salana Nigeria Registration Hub"
            >
              <span className="w-2 h-2 rounded-full bg-primary-dark animate-ping"></span>
              <span>Register Now</span>
            </Link>

            {/* Jalsa 2026 Special Badge Link */}
            <Link
              href="/editions/2026"
              className="hidden xl:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors text-xs font-bold shadow-sm"
            >
              <span>2026 Hub</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary focus:outline-none rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Bar with Refined Gold Accents */}
        <nav className="hidden md:block border-t border-gray-100 bg-surface-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold tracking-wider uppercase">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6 py-2.5 overflow-x-auto">
              <Link href="/" className="text-primary hover:text-gold transition-colors py-1 relative group">
                <span>Home</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="/registration" className="text-gold-dark hover:text-primary transition-colors py-1 flex items-center gap-1.5 font-black group relative">
                <span>Registration</span>
                <span className="text-[9px] bg-gold/20 text-gold-dark border border-gold/40 px-1.5 py-0.5 rounded-full">2026</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold-dark scale-x-100 transition-transform"></span>
              </Link>
              <Link href="/articles" className="text-charcoal hover:text-primary transition-colors py-1 relative group">
                <span>Articles &amp; Features</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="/speeches" className="text-charcoal hover:text-primary transition-colors py-1 relative group">
                <span>Speeches &amp; Addresses</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="/editions" className="text-charcoal hover:text-primary transition-colors py-1 flex items-center gap-1 relative group">
                <span>Historical Archives</span>
                <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-primary" />
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="/galleries" className="text-charcoal hover:text-primary transition-colors py-1 relative group">
                <span>Photo &amp; Video</span>
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </Link>
              <Link href="/categories/faith-spirituality" className="text-charcoal-muted hover:text-primary transition-colors py-1 lowercase font-medium">
                #Faith
              </Link>
              <Link href="/categories/social-justice-peace" className="text-charcoal-muted hover:text-primary transition-colors py-1 lowercase font-normal">
                #SocialJustice
              </Link>
              <Link href="/categories/khilafat-guidance" className="text-charcoal-muted hover:text-primary transition-colors py-1 lowercase font-normal">
                #Khilafat
              </Link>
            </div>

            <div className="flex items-center gap-4 py-2.5 text-xs font-medium text-gray-500">
              <Link href="/about" className="hover:text-primary transition-colors">
                About
              </Link>
              <span>•</span>
              <Link href="/contact" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-2 text-sm font-semibold text-charcoal">
              <Link
                href="/registration"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-gold/20 border border-gold/40 text-primary font-black flex items-center justify-between"
              >
                <span>Register for Jalsa 2026</span>
                <span className="text-[10px] uppercase font-extrabold bg-gold text-primary-950 px-2 py-0.5 rounded">Portal</span>
              </Link>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50 text-primary"
              >
                Home
              </Link>
              <Link
                href="/articles"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                Articles & Reports
              </Link>
              <Link
                href="/speeches"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                Speeches & Transcripts
              </Link>
              <Link
                href="/editions/2026"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50 text-gold-dark font-bold flex items-center justify-between"
              >
                <span>Jalsa 2026 Countdown & Hub</span>
                <span className="text-[10px] bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full uppercase">Active</span>
              </Link>
              <Link
                href="/editions"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                Historical Editions Timeline
              </Link>
              <Link
                href="/galleries"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                Photography & Video Galleries
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                About Jalsa Salana Nigeria
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded hover:bg-gray-50"
              >
                Contact & Editorial Inquiries
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded bg-primary-subtle text-primary font-bold"
              >
                Admin / Editorial Sign In
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
