# JALSA SALANA NIGERIA — AI CAPABILITIES & EXTERNAL INTEGRATIONS ROADMAP
**Domain:** `jalsasalana.ng`  
**Architecture:** Next.js 14 + Node.js/Express + MySQL + Google Gemini AI + External Services

---

## 1. STRATEGIC ARCHITECTURE OVERVIEW

To elevate Jalsa Salana Nigeria into a state-of-the-art digital publication and global convention platform, three core enhancement pillars are established:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       JALSA SALANA NIGERIA PLATFORM                         │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        ▼                              ▼                              ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│ 1. AI User Experience │   │ 2. AI CMS Operations  │   │ 3. External Services  │
├───────────────────────┤   ├───────────────────────┤   ├───────────────────────┤
│ • Ask Jalsa AI Bot    │   │ • AI SEO Meta Engine  │   │ • AlIslam.org Quran   │
│ • Voice Search & Q&A  │   │ • AI Excerpt Generator│   │ • WhatsApp Broadcast  │
│ • Speech Audio Reader │   │ • Editorial Style Pol.│   │ • Google Maps Ilaro   │
│ • Smart Rec. Reading  │   │ • Translation Assist  │   │ • Google/iCal Calendar│
│ • Semantic Search     │   │ • Transcripts Cleanup │   │ • Cloud Storage (S3)  │
│                       │   │                       │   │ • SMS Gateway (Termii)│
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

---

## 2. PILLAR 1: AI-ASSISTED USER EXPERIENCE

### A. "Ask Jalsa AI" Intelligent Natural Language Assistant
- **Purpose:** Provide instantaneous, conversational answers to delegate and reader inquiries regarding Jalsa Salana Nigeria history, upcoming 2026 dates, theme exposition, speeches by Khalifatul Masih (aba) and Amir Sahib, Jamia Ilaro logistics, and Ahmadiyya theological perspectives.
- **Technology:** Google Gemini API with RAG (Retrieval-Augmented Generation) grounding over the MySQL `Article`, `Speech`, and `JalsaEdition` tables, paired with resilient contextual fallbacks.
- **Frontend Experience:** Floating interactive badge on all public pages, expandable into a modern conversational drawer with predefined prompt chips ("What is the theme of 72nd Jalsa?", "Where is Jamia Ilaro?", "Who is speaking this year?").

### B. Voice Interaction (Speech-to-Text & Text-to-Speech)
- **Voice Search (Speech-to-Text):** Integrated microphone in search bars and Ask Jalsa AI drawer via HTML5 Web Speech Recognition API, enabling delegates to dictate queries hands-free.
- **Article Audio Player (Text-to-Speech):** A refined listening bar embedded at the top of every article reading page. Allows readers, commuters, and visually impaired delegates to listen to articles with playback controls, speed toggles (1.0x, 1.25x, 1.5x), and progress indicators.

### C. Contextual Content Recommendations
- **Algorithm:** Multi-factor scoring taking into account category affiliation, tag intersections, edition milestones, and reading history.

---

## 3. PILLAR 2: AI-POWERED EDITORIAL & CMS OPERATIONS

### A. Automated SEO Metadata Generator
- Analyzes article HTML body and extracts high-CTR, Google-optimized `<title>` (<60 chars) and `<meta name="description">` (<160 chars).

### B. Intelligent Excerpt & Summary Generator
- Distills long-form theological treatises and convention reports into concise 2-sentence editorial excerpts for cards and social sharing.

### C. Editorial Tone & Grammar Assistant
- Provides editorial checks aligned with *The Review of Religions* standards (Islamic honorifics formatting e.g. `(aba)`, `(as)`, `(ra)`, journalistic clarity, and academic rigor).

---

## 4. PILLAR 3: EXTERNAL API & SERVICE INTEGRATIONS

### A. AlIslam.org Holy Quran & Hadith Integration
- **Direct Citation Resolver:** Links chapter:verse citations (e.g. `[16:91]`) directly to official Arabic text and 5-Volume English Commentary on [AlIslam.org](https://www.alislam.org/quran/).
- **Curated Verse Cards:** Visual cards rendering Arabic calligraphy, English translation by Maulvi Sher Ali, and commentary links.

### B. WhatsApp Community & Delegate Helpdesk
- **1-Click WhatsApp Channel:** Subscribes delegates to official Jalsa broadcast channel.
- **Direct Helpdesk:** Instant WhatsApp chat with Jalsa Secretariat for logistics inquiries.
- **Smart WhatsApp Sharing:** Formats article title, reading time, and direct URL for WhatsApp forwards.

### C. Google Maps & Jamia Ahmadiyya Ilaro Navigation
- **Interactive Venue Map:** Coordinates `6.8872° N, 3.0142° E` with direct Google Maps route calculation, travel times, and landmark guidance from Lagos, Abeokuta, and international borders.

### D. Google Calendar & Apple/Outlook iCal Integration
- **One-Click Event Sync:** Adds December 18–20, 2026 to Google Calendar or downloads universal `.ics` file with session schedules and venue coordinates.

### E. MTA International & Video Streaming
- **Live Broadcast Embed:** Integrates MTA International satellite streams and YouTube live broadcasts with automatic "Live On Air" status indicator.

### F. Pluggable Cloud Media Storage Adapter
- Abstract storage provider (`apps/api/src/services/storage.ts`) supporting:
  - Local disk storage (development)
  - Amazon Web Services S3 / Cloudflare R2 (production)
  - Cloudinary CDN

### G. SMS & Delegate Broadcast Notification Gateway
- Adapter interface (`apps/api/src/services/notifications.ts`) supporting:
  - Termii (Nigeria SMS gateway for local delegates)
  - Twilio (International SMS and WhatsApp Business API)
