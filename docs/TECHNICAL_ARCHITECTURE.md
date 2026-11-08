# Technical Architecture
## Jalsa Salana Nigeria — Digital Editorial & Publishing Platform

---

## 1. Architectural Philosophy

The platform is engineered as a decoupled, high-performance WordPress system adhering strictly to the WordPress Coding Standards (WPCS). It avoids heavy external frameworks or monolithic page builders, relying instead on clean PHP 8.2+ object-oriented architecture, native WordPress APIs, semantic HTML5, modern CSS3 variables, and lightweight vanilla ES6+ JavaScript.

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER                                     |
|  - Semantic HTML5 / Responsive Viewports (360px - 1440px+)                            |
|  - CSS3 Custom Properties (Design Tokens)                                             |
|  - Vanilla ES6+ JS (Search Drawer, Lightbox, Audio Player, AJAX Newsletter, TOC)     |
+---------------------------------------------------------------------------------------+
                                           |
                                      HTTP / HTTPS
                                           |
+---------------------------------------------------------------------------------------+
|                                WORDPRESS CORE ENGINE                                  |
|  - Rewrite Engine & Routing Rules                                                     |
|  - User Capability & Role Authentication                                              |
|  - Media Library & Image Subsizes                                                     |
|  - Gutenberg Block Editor & Patterns                                                  |
+---------------------------------------------------------------------------------------+
                |                                                       |
+-----------------------------------+               +-----------------------------------+
|    THEME: `jalsa-salana`          |               | PLUGIN: `jalsa-salana-core`       |
|  - style.css (Metadata & Resets)  |               |  - Custom Post Types Registration |
|  - functions.php (Setup & Hooks)  |               |  - Custom Taxonomies Registration |
|  - template-parts/ (Modular UI)   | <-----------> |  - Custom Meta Boxes & Nonces     |
|  - Template Hierarchy             |               |  - Editorial Workflow & Statuses  |
|  - assets/ (CSS, JS, Fonts, Icons)|               |  - Newsletter Sub System & AJAX   |
|                                   |               |  - JSON-LD & Technical SEO Engine |
+-----------------------------------+               +-----------------------------------+
                                           |
+---------------------------------------------------------------------------------------+
|                                DATABASE LAYER (MySQL 8.0)                             |
|  - wp_posts / wp_postmeta (Articles, Speeches, Editions, Galleries)                   |
|  - wp_terms / wp_term_taxonomy / wp_term_relationships (Editions, Topics, Speakers)   |
|  - wp_jalsa_subscribers (Custom optimized table for newsletter management)             |
+---------------------------------------------------------------------------------------+
```

---

## 2. Directory Structure

```
jalsasalana/
├── wp-config.php                          # Environment & DB configuration
├── wp-content/
│   ├── plugins/
│   │   └── jalsa-salana-core/             # Functionality Plugin
│   │       ├── jalsa-salana-core.php      # Main entry point & autoloader
│   │       ├── includes/
│   │       │   ├── class-post-types.php   # CPTs: jalsa_edition, speech, media_gallery
│   │       │   ├── class-taxonomies.php   # Taxonomies: edition_year, speech_topic, speaker
│   │       │   ├── class-meta-boxes.php   # Editorial metadata fields
│   │       │   ├── class-roles.php        # Roles: Editor-in-Chief, Media Editor, SEO Editor
│   │       │   ├── class-workflow.php     # Multi-stage editorial workflow
│   │       │   ├── class-newsletter.php   # Subscriber engine, AJAX, DB migration, CSV export
│   │       │   ├── class-seo.php          # Schema.org JSON-LD, Open Graph, Sitemap
│   │       │   ├── class-block-patterns.php # Custom Gutenberg patterns
│   │       │   └── class-admin-dashboard.php # Editorial Hub & metrics screen
│   │       └── assets/
│   │           ├── css/admin.css          # Admin styling
│   │           └── js/admin.js            # Admin scripts & quick actions
│   └── themes/
│       └── jalsa-salana/                  # Editorial Magazine Theme
│           ├── style.css                  # Theme declaration & CSS variables
│           ├── functions.php              # Theme setup, assets, hooks
│           ├── index.php                  # Fallback blog loop
│           ├── front-page.php             # Editorial Homepage
│           ├── single.php                 # Deep article reading template
│           ├── single-jalsa_edition.php   # Edition historical hub
│           ├── single-speech.php          # Speeches & sermon player/transcript
│           ├── single-media_gallery.php   # Gallery album view & lightbox
│           ├── archive.php                # Editorial article archive
│           ├── archive-jalsa_edition.php  # Editions timeline archive
│           ├── archive-speech.php         # Speeches listing & filters
│           ├── archive-media_gallery.php  # Photo & video listing
│           ├── category.php               # Category archive
│           ├── search.php                 # Search results with faceted filters
│           ├── page.php                   # Default page template
│           ├── page-about.php             # About Jalsa Salana page
│           ├── page-history.php           # Historical narrative page
│           ├── page-editorial-policy.php  # Editorial guidelines page
│           ├── page-contact.php           # Contact page & editorial feedback
│           ├── 404.php                    # Custom 404 template
│           ├── template-parts/
│           │   ├── header/                # Ticker, masthead, nav, search drawer
│           │   ├── footer/                # Footer grid, newsletter form, colophon
│           │   ├── homepage/              # Editorial hero, 2026 hub, grid blocks
│           │   ├── article/               # Article header, reading progress, TOC, bio
│           │   └── cards/                 # Reusable editorial card components
│           └── assets/
│               ├── css/
│               │   ├── main.css           # Design system, layout, responsive
│               │   └── editor-style.css   # Gutenberg editor styling
│               ├── js/
│               │   └── main.js            # Vanilla UI interactions
│               └── images/                # Logos, icons, branding
├── PRD.md                                 # Product Requirements Document
├── PROJECT_PLAN.md                        # Implementation Plan & Milestones
├── TECHNICAL_ARCHITECTURE.md              # System Architecture Specification
├── DESIGN_SYSTEM.md                       # Design System, Tokens & Typography
├── DATABASE_AND_CONTENT_MODEL.md          # Schema & Content Types Mapping
├── INSTALLATION_GUIDE.md                  # Deployment & cPanel Setup Guide
└── TESTING_REPORT.md                      # Comprehensive 20-Point QA Report
```

---

## 3. Data Query & Retrieval Patterns

To ensure high performance and prevent slow SQL queries:
1. **Homepage Editorial Grid:**
   - Single multi-purpose `WP_Query` instances using indexed meta keys (`_jalsa_featured_type` = `hero`, `secondary`, `editors_pick`).
   - Strict `no_found_rows => true` optimization on non-paginated blocks.
2. **Edition Cross-Referencing:**
   - Uses the hierarchical taxonomy `edition_year` as the shared relational spine connecting native `post` (articles), `speech` (audio/transcripts), and `media_gallery` (photo sets).
3. **Table of Contents Generation:**
   - Rendered client-side and server-side fallback by parsing `<h2>` and `<h3>` tags with automated anchor injection, maintaining clean source HTML.
4. **Caching Strategy:**
   - Transient API utilized for expensive queries (e.g., active edition statistics and navigation tree counts).
   - Compatible with Redis, Memcached, LiteSpeed Cache, and W3 Total Cache.

---

## 4. Security Architecture

- **Data Sanitization:** Strict typing and sanitization on all incoming request data (`sanitize_text_field`, `sanitize_email`, `sanitize_textarea_field`, `esc_url_raw`).
- **Output Escaping:** Universal contextual escaping (`esc_html`, `esc_attr`, `esc_url`, `wp_kses_post`).
- **CSRF & Nonce Protection:** Nonce generation and verification across all forms, AJAX requests, and state changes.
- **Role Capabilities:** Granular capability verification (`current_user_can`) before rendering editorial controls or processing status mutations.
- **Spam Prevention:** Dual-layered protection on newsletter and contact forms (hidden honeypot field + timestamp verification).
