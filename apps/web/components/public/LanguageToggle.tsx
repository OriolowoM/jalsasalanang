'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage, LocaleCode } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES: Array<{ code: LocaleCode; label: string; region: string }> = [
  { code: 'EN', label: 'English', region: 'Global' },
  { code: 'YO', label: 'Èdè Yorùbá', region: 'South West' },
  { code: 'HA', label: 'Harshen Hausa', region: 'Northern Nigeria' },
  { code: 'IG', label: 'Asụsụ Igbo', region: 'South East' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-border/80 hover:border-teal/40 bg-surface-bg hover:bg-white text-ink-muted hover:text-forest transition-all text-xs font-semibold shadow-xs"
        aria-expanded={isOpen}
        title="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-teal" />
        <span className="font-bold">{activeLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-ink-light transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-soft-lg border border-surface-border p-2 z-50 overflow-hidden"
          >
            <div className="px-2.5 py-1.5 text-[10px] font-display font-bold uppercase tracking-wider text-teal border-b border-surface-border/60 mb-1">
              Select Translation
            </div>

            <div className="space-y-1">
              {LANGUAGES.map((lang) => {
                const isSelected = locale === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-teal/10 text-teal font-bold'
                        : 'text-ink-body hover:bg-surface-bg font-medium'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-display leading-tight">{lang.label}</div>
                      <div className="text-[10px] text-ink-light">{lang.region}</div>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-teal flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-surface-border/60 px-2 text-[9px] text-ink-light">
              ✦ AI-assisted multi-dialect translation for Nigerian delegates
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
