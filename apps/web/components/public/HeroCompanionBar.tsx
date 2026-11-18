'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Bot, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroCompanionBar() {
  const [mounted, setMounted] = useState(false);
  const samplePrompts = [
    'What is the theme of 72nd Jalsa 2026?',
    'How do I register my family online?',
    'What are the dates for the Ilaro convention?',
    'Where are the dining halls and prayer marquees located?',
  ];
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActivePromptIndex((prev) => (prev + 1) % samplePrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openAssistant = (initialQuery?: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-jalsa-ai', {
          detail: { query: initialQuery || samplePrompts[activePromptIndex] },
        })
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-8 mb-4 max-w-2xl"
    >
      <div className="relative group">
        {/* Soft diffused glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal/30 via-lime/30 to-forest/30 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition duration-500" />

        {/* Frosted glass bar */}
        <div
          onClick={() => openAssistant()}
          className="relative flex items-center justify-between gap-3 p-2.5 sm:p-3.5 bg-white/90 backdrop-blur-md rounded-2xl border border-teal/20 shadow-soft-lg hover:shadow-glow-teal hover:border-teal/40 transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center text-white shadow-soft flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-lime" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-display font-extrabold tracking-widest uppercase text-teal flex items-center gap-1">
                  <Bot className="w-3 h-3" /> Jalsa Companion AI
                </span>
                <span className="hidden sm:inline-block text-[9px] bg-lime/30 text-forest-900 font-bold px-1.5 py-0.2 rounded-full border border-lime/40">
                  Instant Answers
                </span>
              </div>

              <div className="text-xs sm:text-sm text-ink-muted truncate font-medium mt-0.5 flex items-center gap-1.5">
                <span className="text-ink-light">Ask:</span>
                <span className="text-forest font-semibold italic truncate">
                  &ldquo;{mounted ? samplePrompts[activePromptIndex] : samplePrompts[0]}&rdquo;
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0 group-hover:bg-teal"
          >
            <span className="hidden sm:inline">Ask AI</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
