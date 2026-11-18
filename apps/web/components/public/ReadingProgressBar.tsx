'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, Printer, Type, Share2, Check, Copy } from 'lucide-react';

interface ReadingProgressBarProps {
  title: string;
}

export default function ReadingProgressBar({ title }: ReadingProgressBarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: standard (17px), 1: relaxed (18px), 2: large (20px)
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
        setIsVisible(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFontSizeCycle = () => {
    const nextIndex = (fontSizeIndex + 1) % 3;
    setFontSizeIndex(nextIndex);
    const proseEl = document.querySelector('.editorial-prose-container');
    if (proseEl) {
      proseEl.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg');
      if (nextIndex === 0) proseEl.classList.add('text-size-sm');
      else if (nextIndex === 1) proseEl.classList.add('text-size-md');
      else if (nextIndex === 2) proseEl.classList.add('text-size-lg');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      {/* Top Fixed Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-gray-200/50 backdrop-blur-sm pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-primary via-gold to-primary transition-all duration-150 ease-out shadow-sm"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Reading Utility Toolbar */}
      <aside
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-white/95 backdrop-blur-md border border-surface-border shadow-prestige transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Article Reading Tools"
      >
        {/* Font Size Toggle */}
        <button
          type="button"
          onClick={handleFontSizeCycle}
          title={`Cycle font size (Current: ${fontSizeIndex === 0 ? 'Compact' : fontSizeIndex === 1 ? 'Standard' : 'Enlarged'})`}
          className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal hover:text-primary hover:bg-primary-subtle transition-colors text-xs font-bold"
        >
          <Type className="w-4 h-4" />
          <span className="text-[10px] ml-0.5">{fontSizeIndex === 0 ? 'A-' : fontSizeIndex === 1 ? 'A' : 'A+'}</span>
        </button>

        <div className="w-[1px] h-4 bg-gray-200" />

        {/* Copy Link */}
        <button
          type="button"
          onClick={handleCopy}
          title={copied ? 'Link Copied!' : 'Copy Article Link'}
          className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal hover:text-primary hover:bg-primary-subtle transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Print Article */}
        <button
          type="button"
          onClick={handlePrint}
          title="Print or Save Article as PDF"
          className="w-9 h-9 rounded-full flex items-center justify-center text-charcoal hover:text-primary hover:bg-primary-subtle transition-colors"
        >
          <Printer className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-4 bg-gray-200" />

        {/* Scroll To Top */}
        <button
          type="button"
          onClick={scrollToTop}
          title="Return to Top"
          className="w-9 h-9 rounded-full bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center shadow-sm"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </aside>
    </>
  );
}
