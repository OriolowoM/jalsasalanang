# Product Requirements Document (PRD)
## Project: Jalsa Salana Nigeria — Digital Editorial & Publishing Platform
**Domain:** `jalsasalana.ng`  
**Reference Benchmark:** *The Review of Religions* (`reviewofreligions.org`)  
**Target Audience:** Ahmadiyya Muslim Community members in Nigeria and worldwide, academic researchers, journalists, interfaith leaders, government dignitaries, and general readers seeking intellectual and spiritual enlightenment.

---

## 1. Executive Summary & Vision

Jalsa Salana Nigeria is the premier annual spiritual, intellectual, and educational gathering of the Ahmadiyya Muslim Jama'at Nigeria, drawing tens of thousands of delegates, scholars, and dignitaries. 

The **Jalsa Salana Nigeria Digital Editorial & Publishing Platform** transforms the official web presence from an ephemeral event noticeboard into an authoritative, world-class digital magazine and permanent historical archive. Drawing architectural and editorial inspiration from *The Review of Religions* (founded in 1902 by Hazrat Mirza Ghulam Ahmad, the Promised Messiah (as)), this platform delivers high-calibre articles, theological treatises, speech transcripts, multimedia coverage, press releases, and edition-by-edition historical documentation.

---

## 2. Core Stakeholders & User Personas

| Persona | Role | Primary Goals / Needs |
|---|---|---|
| **Alhaji / Delegate (Reader)** | Attendee / Jama'at Member | Read inspiring sermons, revisit speeches, download transcripts, view photo galleries, explore Jalsa 2026 countdown & programme. |
| **Academic / Journalist** | External Researcher / Media | Access verified press communiques, historical archives, high-res photos with credits, official statements on peace and governance. |
| **Editor-in-Chief** | Editorial Board Lead | Oversee multi-stage workflow (Draft → Review → Approved → Scheduled → Published), manage editorial picks, curate homepage hierarchy. |
| **Staff Writer / Contributor** | Editorial Contributor | Draft articles, assign topics and Jalsa editions, submit for review, preview formatting. |
| **Media Editor** | Photography & Video Lead | Curate albums, upload photo collections with photographer attribution, embed live streams and speech recordings. |
| **SEO & Digital Strategist** | Audience Growth Lead | Ensure Schema.org structured data, Open Graph sharing cards, search discoverability, newsletter subscriber acquisition. |

---

## 3. Product Principles

1. **Editorial Gravity & Elegance:** Premium editorial hierarchy, spacious typography, sophisticated colour palette (Islamic Forest Green `#064e3b`, Warm Ivory `#fbfaf8`, Gold Accents `#c5a059`), and thoughtful whitespace.
2. **Dynamic Editorial Control:** Zero hardcoded homepage stories. Every headline, hero card, editor's pick, and banner is manageable via standard WordPress queries and meta settings.
3. **Historical Continuity:** Dedicated custom post type and taxonomy architecture for Jalsa Editions, allowing readers to traverse past conventions (1950s–2025) and anticipate future milestones (Jalsa Salana Nigeria 2026).
4. **Native WordPress Standards:** Fully utilizes native WordPress capabilities, post statuses, roles, block editor patterns, and media library without fragile external dependencies.
5. **Mobile-First & High Performance:** Fast loading times on Nigerian cellular networks, responsive breakpoints (360px to 1440px+), WebP image handling, and WCAG 2.2 AA accessibility.

---

## 4. Functional Specifications

### 4.1 Frontend Experience
* **Global Announcement Ticker:** Top bar displaying latest announcements, live broadcast alerts, or press releases.
* **Masthead & Navigation:** Brand identity with official Jalsa crest, primary navigation (Articles, Speeches, Editions Archive, Media Gallery, About, Contact), search toggle, and edition quick-switch.
* **Editorial Homepage:**
  - *Lead Hero Story:* Dominant featured article with subtitle, author, read time, and edition badge.
  - *Secondary Featured Stories:* 3-column curated grid.
  - *Special 2026 Coverage Hub:* Interactive countdown, theme spotlight, and latest preparations.
  - *Editor's Picks & Deep Dives:* Intellectual essays and research papers.
  - *Speeches & Addresses Carousel/Grid:* Keynote addresses with speaker title, audio/video indicators, and transcript access.
  - *Media & Photo Galleries:* Visual photo essays with lightbox and credits.
  - *Historical Editions Timeline:* Visual archive selector (2026, 2025, 2024 70th Platinum Jubilee, 2023, 2022...).
  - *Newsletter Subscription Box:* Clean AJAX-enabled opt-in with spam honeypot and feedback.
  - *Comprehensive Footer:* Editorial policy links, quick navigation, copyright, Jama'at affiliation statement.
* **Article Reading Experience:**
  - Responsive headline, subtitle/deck, reading time, publication date, author bio chip.
  - Dynamic Table of Contents auto-generated from `<h2>` and `<h3>` tags.
  - Editorial pullquotes, Quran/Hadith citation boxes with Arabic typography, image galleries with captions and photographer credit.
  - Sticky reading progress bar and one-click social sharing (WhatsApp, X, Facebook, LinkedIn, Copy Link).
  - Related articles curated by topic and Jalsa edition.
* **Dedicated Speeches & Addresses Archive:**
  - Filterable by Speaker, Jalsa Edition, and Topic.
  - Detail view featuring embedded audio player, video stream, downloadable PDF transcript, and formatted text.
* **Historical Jalsa Edition Hub (`single-jalsa_edition.php`):**
  - Edition overview (Theme, Venue, Dates, Attendance, Key Highlights).
  - Associated speeches, articles, and photo albums automatically queried via taxonomy relation.
* **Media Gallery & Photo Albums:**
  - Masonry grid layout with accessible full-screen lightbox.
  - Photographer credit, album date, high-resolution view.
* **Search & Discovery:**
  - Live search overlay + full search results page with filters by content type and edition.

### 4.2 Editorial Management & Backend CMS
* **Custom Content Types:**
  - Native `post` (Articles, Features, News, Interviews)
  - `jalsa_edition` (Annual Convention records)
  - `speech` (Addresses, Keynotes, Friday Sermons)
  - `media_gallery` (Photo Albums and Video collections)
* **Custom Taxonomies:**
  - `edition_year` (Assigned across posts, speeches, galleries)
  - `speech_topic` (Theology, Peace, Tarbiyya, Governance, Science)
  - `speaker` (Orators, Scholars, Dignitaries)
* **Custom Editorial Metadata:**
  - Subtitle / Deck
  - Featured Article (Hero) & Secondary Featured toggles
  - Editor's Pick toggle
  - Reading time calculation / override
  - Audio/Video embed URLs and downloadable PDF links
  - Photographer attribution metadata
* **Editorial Roles & Permissions:**
  - Super Administrator, Editor-in-Chief, Editor, Author, Contributor, Media Editor, SEO Editor.
* **Newsletter Subscriber Module:**
  - Stored subscriber records, active/unsubscribed status, CSV export.

---

## 5. Non-Functional Requirements
* **Security:** Nonce verification on all admin forms and AJAX endpoints; strict sanitization (`sanitize_text_field`, `esc_html`, `esc_url`); cap check validation.
* **SEO:** JSON-LD schema (NewsArticle, Event, Organization, Breadcrumbs), Open Graph tags, Twitter cards, clean permalinks.
* **Accessibility:** WCAG 2.2 AA compliant, skip to content links, proper ARIA states, color contrast ratio $\ge 4.5:1$.
* **Hosting Compatibility:** Standard cPanel shared hosting, Apache/Nginx, PHP 7.4–8.3+, MySQL 5.7 / 8.0 / MariaDB 10.3+.
