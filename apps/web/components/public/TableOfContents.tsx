'use client';

import React, { useState, useEffect } from 'react';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!content) return;

    // Parse headings from the rendered DOM or via regex
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.querySelectorAll('h2, h3');

    const parsed: Heading[] = [];
    elements.forEach((el, index) => {
      const text = el.textContent || '';
      const id = `heading-${index}`;
      parsed.push({
        id,
        text,
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    setHeadings(parsed);

    // Also attach ids to DOM headings in real document
    setTimeout(() => {
      const articleEl = document.querySelector('.prose');
      if (articleEl) {
        const hTags = articleEl.querySelectorAll('h2, h3');
        hTags.forEach((el, index) => {
          el.id = `heading-${index}`;
        });
      }
    }, 100);
  }, [content]);

  if (headings.length < 2) return null;

  return (
    <div className="mb-8 p-4 sm:p-5 rounded-xl bg-surface-muted border border-surface-border">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-serif font-bold text-sm sm:text-base text-charcoal text-left"
      >
        <span className="flex items-center gap-2 text-primary">
          <List className="w-4 h-4" />
          Table of Contents
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {isOpen && (
        <nav className="mt-3 pt-3 border-t border-gray-200/70 space-y-1.5 text-xs sm:text-sm font-sans">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block hover:text-primary transition-colors py-0.5 ${
                h.level === 3 ? 'pl-4 text-gray-500 text-xs' : 'font-medium text-gray-700'
              }`}
            >
              • {h.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
