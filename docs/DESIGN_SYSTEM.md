# Design System & Brand Identity
## Jalsa Salana Nigeria — Digital Editorial & Publishing Platform

---

## 1. Editorial Visual Direction

Inspired by the intellectual poise and distinguished heritage of *The Review of Religions*, the design system communicates:
- **Spiritual Gravity & Devotion**
- **Scholarly Rigour & Depth**
- **Contemporary Editorial Sophistication**
- **Clarity, Legibility & Comfort**

---

## 2. Colour Palette & Design Tokens

```css
:root {
  /* Brand Primary Colors */
  --color-primary: #064e3b;          /* Deep Islamic Forest Green */
  --color-primary-dark: #022c22;     /* Midnight Islamic Green */
  --color-primary-light: #0d9488;    /* Deep Emerald Accent */
  --color-primary-subtle: #f0fdf4;   /* Pale Tint Green for Highlights */

  /* Gold & Metallic Accents */
  --color-gold: #c5a059;             /* Refined Gold */
  --color-gold-hover: #b38e47;        /* Deep Gold for Active States */
  --color-gold-subtle: #fef9ee;      /* Warm Gold Tint for Callout Badges */

  /* Surface & Background Colors */
  --color-surface-bg: #fbfaf8;       /* Warm Editorial Ivory */
  --color-surface-card: #ffffff;     /* Crisp Pure White */
  --color-surface-elevated: #ffffff; /* Modal / Drawer Surfaces */
  --color-surface-muted: #f4f1eb;    /* Subtle Warm Gray / Border fill */

  /* Typography Colors */
  --color-text-main: #18181b;        /* Charcoal / Near-Black for Body */
  --color-text-headings: #09090b;    /* High-contrast Black for Headlines */
  --color-text-muted: #71717a;       /* Zinc 500 for Metadata & Captions */
  --color-text-inverse: #ffffff;     /* White on Dark Green */

  /* Borders & Dividers */
  --color-border: #e4e4e7;          /* Clean Subtle Gray */
  --color-border-subtle: #f4f4f5;   /* Very Light Divider */
  --color-border-gold: #c5a059;     /* Gold Accent Borders */

  /* Status Colors */
  --color-success: #15803d;
  --color-warning: #b45309;
  --color-error: #b91c1c;

  /* Typography Scales */
  --font-serif: "Merriweather", Georgia, "Times New Roman", serif;
  --font-sans: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-arabic: "Amiri", "Traditional Arabic", serif;

  /* Spacing Scale */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Layout Widths */
  --container-max: 1280px;
  --reading-max: 760px;
  --grid-gap: 2rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 3. Typographic Hierarchy

| Role | Font Family | Size (Desktop) | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Publication Masthead** | Serif | 2.5rem (40px) | 700 Bold | 1.1 | Brand Logo / Header Title |
| **Headline Lead (Hero)** | Serif | 2.5rem - 3.25rem | 700 Bold | 1.15 | Major Frontpage Story Title |
| **Section Title** | Sans-Serif | 1.5rem - 1.875rem | 700 Bold | 1.25 | Homepage Blocks, Archive Headers |
| **Card Headline** | Serif | 1.25rem - 1.5rem | 600 SemiBold | 1.3 | Standard Article & Story Cards |
| **Article Body** | Serif | 1.125rem (18px) | 400 Regular | 1.8 | Long-form reading paragraphs |
| **Subheadings (H2)** | Serif | 1.75rem | 700 Bold | 1.3 | Article section breaks |
| **Subheadings (H3)** | Sans-Serif | 1.35rem | 600 SemiBold | 1.4 | Article subsections |
| **Metadata / Byline** | Sans-Serif | 0.875rem (14px) | 500 Medium | 1.4 | Author, date, reading time |
| **Category Pill / Badge**| Sans-Serif | 0.75rem (12px) | 700 Bold | 1.0 | Uppercase topic chips |
| **Pullquotes** | Serif | 1.5rem (Italic) | 400 Regular | 1.5 | Featured quotations |
| **Arabic Calligraphy** | Arabic Serif | 1.75rem - 2.25rem | 500 Medium | 1.6 | Quranic verses, Hadith |

---

## 4. UI Components & Patterns

1. **Category Pills:** Pill badge styled with dark green or subtle gold border, uppercase tracking, bold typography.
2. **Editorial Cards:** Clean white surface, subtle border, smooth hover elevation, image aspect ratios (`16:9` for standard, `4:3` for compact, `1:1` for thumbnails).
3. **Reading Progress Bar:** Thin gold bar pinned to top of viewport during single article scroll.
4. **Table of Contents (TOC):** Clean sidebar widget on desktop, collapsible accordion on mobile, highlighting active section based on scroll position.
5. **Quranic & Hadith Callouts:** Elegant inset box with gold left border, pale ivory background, right-to-left Arabic script followed by English translation and attribution.
6. **Accessible Lightbox:** Fullscreen dark backdrop, smooth image zoom, keyboard escape / navigation keys, photographer credit footer.
7. **Audio/Video Media Players:** Styled native media player with custom play/pause button, time display, volume toggle, and transcript accordion.
