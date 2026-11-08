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
      <header className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-sm">
        {/* Main Masthead Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
          {/* Left: Brand / Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 sm:w-14 sm:h-14 flex-shrink-0">
              <Image
                src="/images/jalsa-emblem.png"
                alt="Jalsa Salana Official Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-serif font-black tracking-wider text-xl sm:text-2xl text-primary leading-tight group-hover:text-primary-dark transition-colors">
                JALSA SALANA
              </div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gold-dark">
                Nigeria — Digital Publication
              </div>
            </div>
          </Link>

          {/* Center: Arabic Calligraphy Tagline */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center">
            <span className="font-arabic text-xl text-primary-dark font-medium leading-none" dir="rtl">
              إِنَّ الصَّلَاةَ وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ
            </span>
            <span className="text-[10px] tracking-widest uppercase text-gray-500 mt-1 font-semibold">
              The Annual Convention of the Ahmadiyya Muslim Jama&apos;at Nigeria
            </span>
          </div>

          {/* Right: Actions (Search, Edition Selector, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary text-gray-600 hover:text-primary transition-all text-xs font-medium bg-surface-bg shadow-sm"
              title="Search publication"
            >
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline-block text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Jalsa 2026 Special Badge Link */}
            <Link
              href="/editions/2026"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors text-xs font-bold shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              Jalsa 2026 Hub
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Bar */}
        <nav className="hidden md:block border-t border-gray-100 bg-surface-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-bold tracking-wider uppercase">
            <div className="flex items-center space-x-1 sm:space-x-4 lg:space-x-6 py-2.5 overflow-x-auto">
              <Link href="/" className="text-primary hover:text-gold transition-colors py-1">
                Home
              </Link>
              <Link href="/articles" className="text-charcoal hover:text-primary transition-colors py-1">
                Articles & Features
              </Link>
              <Link href="/speeches" className="text-charcoal hover:text-primary transition-colors py-1">
                Speeches & Addresses
              </Link>
              <Link href="/editions" className="text-charcoal hover:text-primary transition-colors py-1 flex items-center gap-1">
                Historical Archives <ChevronDown className="w-3 h-3 text-gray-400" />
              </Link>
              <Link href="/galleries" className="text-charcoal hover:text-primary transition-colors py-1">
                Photo & Video
              </Link>
              <Link href="/categories/faith-spirituality" className="text-charcoal-muted hover:text-primary transition-colors py-1 lowercase font-normal">
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
