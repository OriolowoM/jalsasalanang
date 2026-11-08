# Project Implementation Plan
## Jalsa Salana Nigeria — Digital Editorial & Publishing Platform

---

## Phase Overview & Milestones

```
+-----------------------------------------------------------------------------------+
| Phase 1: Environment, Database & Architecture Setup                               |
| Phase 2: Design System & Assets Integration                                       |
| Phase 3: Core Functionality Plugin (jalsa-salana-core)                            |
| Phase 4: Custom Editorial Theme (jalsa-salana)                                    |
| Phase 5: Editorial Content Seeding & Demonstration Data                           |
| Phase 6: Editorial Workflow, Dashboard & Administration                           |
| Phase 7: Technical SEO, Performance & WCAG Accessibility Audits                   |
| Phase 8: Quality Assurance, Verification & Handover Documentation                 |
+-----------------------------------------------------------------------------------+
```

---

## Detailed Milestone Breakdown

### Phase 1: Environment & Architecture Setup
- [x] Inspect development environment (PHP 8.2, Composer, MySQL 8.0, Node.js).
- [x] Discover authentic branding assets (`jalsa-logo.png`, `Jalsa.png`, `jalsa2026.png`, real event photos, XML backup).
- [ ] Create database `jalsasalana_db` on MySQL localhost.
- [ ] Deploy WordPress Core into workspace.
- [ ] Configure `wp-config.php` for local execution and cPanel portability.
- [ ] Create documentation files (`PRD.md`, `PROJECT_PLAN.md`, `TECHNICAL_ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `DATABASE_AND_CONTENT_MODEL.md`, `INSTALLATION_GUIDE.md`, `TESTING_REPORT.md`).

### Phase 2: Brand Identity & Design System
- [ ] Establish design tokens (colors, typography, spacing, shadows, borders).
- [ ] Organize official branding assets into theme `assets/images/`.
- [ ] Implement responsive typography pairing (Playfair Display / Merriweather serif for headlines/editorial, Plus Jakarta Sans / Inter for UI/meta, Amiri for Arabic calligraphy).
- [ ] Create reusable CSS component classes and CSS variables in `style.css` and `assets/css/main.css`.

### Phase 3: Core Functionality Plugin (`jalsa-salana-core`)
- [ ] Plugin header and activation hooks.
- [ ] Register Custom Post Types:
  - `jalsa_edition` (Conventions archive)
  - `speech` (Speeches, sermons & addresses)
  - `media_gallery` (Photo albums & video collections)
- [ ] Register Custom Taxonomies:
  - `edition_year` (Shared across posts, speeches, galleries)
  - `speech_topic` (Theology, Peace, Social Justice, Tarbiyya, etc.)
  - `speaker` (Orators & dignitaries)
- [ ] Register Custom Meta Boxes with secure nonces & sanitization:
  - Editorial flags: Hero Featured, Secondary Featured, Editor's Pick
  - Subtitle / Deck
  - Reading time calculation / override
  - Speech details (Speaker title, audio URL, video URL, transcript, download link)
  - Edition details (Year, edition number, venue, dates, theme, attendance)
  - Gallery details (Attached image IDs, credits, captions, video embed)
- [ ] Custom Editorial Roles: `editor_in_chief`, `media_editor`, `seo_editor`.
- [ ] Editorial Workflow: Status handling and capability enforcement.
- [ ] Newsletter Management Module: AJAX endpoint, custom DB table, honeypot protection, admin subscribers list with CSV export.
- [ ] Technical SEO Module: Open Graph tags, Twitter cards, JSON-LD Schema.org generators (NewsArticle, Event, Organization, Breadcrumbs).
- [ ] Gutenberg Block Patterns: Pullquote, Quran/Hadith callout, Speaker card, Edition factsheet.

### Phase 4: Custom Editorial Theme (`jalsa-salana`)
- [ ] Theme declaration (`style.css`), `functions.php`, theme supports (HTML5, title-tag, post-thumbnails, menus, responsive-embeds, editor-styles).
- [ ] Modular template parts:
  - Header: Announcement ticker, brand crest, nav menu, search drawer, edition switcher, mobile toggle.
  - Footer: Brand overview, newsletter widget, edition links, legal, back-to-top.
  - Homepage sections: Hero split, secondary featured grid, 2026 special hub, latest news, editor's picks, speeches carousel, photo/video highlights, archive timeline.
- [ ] Core Template Hierarchy:
  - `front-page.php` (Dynamic editorial magazine layout)
  - `single.php` (Deep reading experience, dynamic Table of Contents, author bio, social share, related posts)
  - `single-jalsa_edition.php` (Edition hub with linked speeches, albums, articles)
  - `single-speech.php` (Audio player, video embed, transcript, speaker bio)
  - `single-media_gallery.php` (Responsive masonry grid + accessible lightbox)
  - `archive.php`, `category.php`, `archive-jalsa_edition.php`, `archive-speech.php`, `archive-media_gallery.php`
  - `search.php`
  - Standard pages (`page.php`, `page-about.php`, `page-contact.php`, `page-history.php`, `page-editorial-policy.php`)
  - `404.php`
- [ ] Vanilla JavaScript (`assets/js/main.js`): Mobile menu, search modal, reading progress bar, table of contents generator, lightbox, audio player, AJAX newsletter handler.

### Phase 5: Content Seeding & Demonstration Data
- [ ] Import/seed real Jalsa Salana Nigeria editorial content, editions, speeches, and photo albums.
- [ ] Configure primary menus, widgets, and settings.
- [ ] Ensure all demo content is dynamically queried and clearly organized.

### Phase 6: Administration & Editorial CMS Enhancements
- [ ] Editorial Dashboard page in wp-admin (metrics, workflow overview, quick actions).
- [ ] Admin columns enhancement for quick filtering by edition, featured status, speaker, etc.
- [ ] Newsletter subscribers management screen in wp-admin.

### Phase 7: Quality Assurance, Security & Performance Verification
- [ ] Run PHP linting on all theme and plugin files.
- [ ] Verify nonces, sanitization, escaping, and user capability checks.
- [ ] Test all 20 required QA scenarios (Admin login, article creation, workflow, filters, search, newsletter, mobile responsiveness, error handling).
- [ ] Complete `TESTING_REPORT.md`.

### Phase 8: Deployment & Handover Deliverables
- [ ] Prepare cPanel-ready installation zip/packages.
- [ ] Complete `INSTALLATION_GUIDE.md` with step-by-step cPanel setup, database configuration, user creation, and maintenance recommendations.
