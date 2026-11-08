# Database & Content Model Specification
## Jalsa Salana Nigeria — Digital Editorial & Publishing Platform

---

## 1. Content Entities Overview

The data architecture integrates WordPress core tables with specialized Custom Post Types (CPTs), hierarchical and flat Custom Taxonomies, structured Post Meta keys, and an optimized custom database table for newsletter subscribers.

```
+-------------------------------------------------------------------------------------------------+
|                                     CONTENT ARCHITECTURE                                        |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   +-----------------------+       Assigned To       +-------------------------+                 |
|   |  native `post`        | ----------------------> | taxonomy `edition_year` |                 |
|   |  (Editorial Articles) |                         +-------------------------+                 |
|   +-----------------------+                                      ^                              |
|               |                                                  |                              |
|               | Categorized By                                   | Links to                     |
|               v                                                  |                              |
|   +-----------------------+                         +-------------------------+                 |
|   | taxonomy `category`   |                         | CPT `jalsa_edition`     |                 |
|   +-----------------------+                         | (Convention Hub)        |                 |
|                                                     +-------------------------+                 |
|                                                                  ^                              |
|   +-----------------------+       Assigned To                    |                              |
|   | CPT `speech`          | -------------------------------------+                              |
|   | (Sermons & Keynotes)  |                                                                     |
|   +-----------------------+                                                                     |
|          |         |                                                                            |
|          |         +------------> taxonomy `speech_topic`                                       |
|          v                                                                                      |
|   taxonomy `speaker`                                                                            |
|                                                                                                 |
|   +-----------------------+       Assigned To       +-------------------------+                 |
|   | CPT `media_gallery`   | ----------------------> | taxonomy `edition_year` |                 |
|   | (Photo / Video Albums)|                         +-------------------------+                 |
|   +-----------------------+                                                                     |
+-------------------------------------------------------------------------------------------------+
```

---

## 2. Custom Post Types

### 2.1 Editorial Articles (`post`)
- **Core Purpose:** The central publishing vehicle for essays, theological analysis, interviews, breaking news, reports, and reflections.
- **Key Fields & Post Meta:**
  - `_jalsa_subtitle` (`text`): Editorial deck or secondary headline.
  - `_jalsa_featured_type` (`enum: none, hero, secondary, editors_pick`): Editorial prominence flag.
  - `_jalsa_reading_time` (`int`): Estimated reading time in minutes (auto-calculated from word count or manual override).
  - `_jalsa_image_credit` (`text`): Photographer or source attribution for the featured image.
  - `_jalsa_audio_url` (`url`): Optional link to audio narration or spoken version of the article.

### 2.2 Jalsa Editions (`jalsa_edition`)
- **Slug / Rewrite:** `/editions/`
- **Core Purpose:** Dedicated historical and future convention hubs (e.g. 72nd Jalsa 2026, 71st Jalsa 2025, 70th Jalsa 2024 Platinum Jubilee).
- **Key Fields & Post Meta:**
  - `_jalsa_edition_number` (`text`): e.g., "72nd Annual Convention", "70th Platinum Jubilee".
  - `_jalsa_edition_year` (`int`): e.g., `2026`, `2025`, `2024`.
  - `_jalsa_theme_english` (`text`): Official theme in English.
  - `_jalsa_theme_arabic` (`text`): Official theme / Quranic verse in Arabic calligraphy.
  - `_jalsa_venue` (`text`): Venue name and location (e.g., Jamia Ahmadiyya Ilaro, Ogun State).
  - `_jalsa_dates` (`text`): Convention dates (e.g., "December 18–20, 2026").
  - `_jalsa_attendance` (`text`): Official attendance figures (e.g., "42,850 Delegates").
  - `_jalsa_livestream_url` (`url`): MTA International / YouTube live stream URL.
  - `_jalsa_is_current` (`boolean`): Flags the active upcoming convention for homepage ticker and countdown.

### 2.3 Speeches & Addresses (`speech`)
- **Slug / Rewrite:** `/speeches/`
- **Core Purpose:** Authoritative archive of keynote addresses, Friday sermons, presidential remarks, and scholarly lectures.
- **Key Fields & Post Meta:**
  - `_speech_speaker_name` (`text`): Full name of the speaker.
  - `_speech_speaker_title` (`text`): Official designation (e.g., "Amir Ahmadiyya Muslim Jama'at Nigeria", "Worldwide Head of the Ahmadiyya Muslim Community").
  - `_speech_type` (`enum`): `Keynote Address`, `Friday Sermon`, `Concluding Address`, `Scholarly Lecture`, `Goodwill Message`.
  - `_speech_session` (`text`): e.g. "Opening Session - Day 1", "Ladies Session - Day 2".
  - `_speech_audio_url` (`url`): Audio file URL (MP3) for inline player.
  - `_speech_video_url` (`url`): Video stream URL (YouTube / Vimeo / MP4).
  - `_speech_download_pdf` (`url`): Downloadable transcript PDF link.
  - `_speech_transcript` (`longtext`): Full text transcript with session metadata.

### 2.4 Media Galleries (`media_gallery`)
- **Slug / Rewrite:** `/galleries/`
- **Core Purpose:** High-resolution photographic albums and video documentaries.
- **Key Fields & Post Meta:**
  - `_gallery_images` (`json / serialized`): Array of attachment IDs with specific caption and photographer credit.
  - `_gallery_photographer` (`text`): Primary photographer / photography team.
  - `_gallery_video_url` (`url`): Embedded video recap URL.
  - `_gallery_day` (`text`): "Day 1 - Friday", "Day 2 - Saturday", "Day 3 - Sunday", "Pre-Jalsa Preparations".

---

## 3. Custom Taxonomies

1. **`edition_year` (Hierarchical):**
   - Attached to: `post`, `speech`, `media_gallery`.
   - Terms: `2026`, `2025`, `2024`, `2023`, `2022`, `2021`, etc.
   - Purpose: Enables cross-cutting queries. Viewing an edition automatically displays its articles, speeches, and albums.
2. **`speech_topic` (Non-hierarchical / Tag-like or Category):**
   - Attached to: `speech`.
   - Terms: `Khilafat & Leadership`, `Social Justice & Peace`, `Tarbiyya & Youth`, `Faith & Science`, `Financial Sacrifice`, `Women in Islam`.
3. **`speaker` (Hierarchical):**
   - Attached to: `speech`.
   - Terms: `Hazrat Mirza Masroor Ahmad (aba)`, `Alhaji Barr. Alatoye Folorunso Azeez`, `Maulvi Abdul Azeez`, etc.

---

## 4. Newsletter Subscribers Table Schema (`wp_jalsa_subscribers`)

Created upon plugin activation using `dbDelta`:

```sql
CREATE TABLE {$wpdb->prefix}jalsa_subscribers (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(191) NOT NULL,
    full_name VARCHAR(191) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    ip_address VARCHAR(45) DEFAULT NULL,
    subscribed_at DATETIME NOT NULL,
    unsubscribed_at DATETIME DEFAULT NULL,
    unsubscribe_token VARCHAR(64) NOT NULL,
    PRIMARY KEY  (id),
    UNIQUE KEY email_unique (email),
    KEY status_idx (status),
    KEY token_idx (unsubscribe_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 5. User Roles & Capabilities

| Role Name | Display Name | Core Capabilities |
|---|---|---|
| `administrator` | Super Administrator | Full system configuration, theme/plugin settings, database maintenance. |
| `editor_in_chief` | Editor-in-Chief | Manage, publish, approve, and delete any article, speech, gallery, or edition; manage categories & menus. |
| `editor` | Editor | Edit and publish own articles and review/publish contributor submissions. |
| `author` | Author | Create, edit, and publish own articles; upload media. |
| `contributor` | Contributor | Draft articles and submit for review (cannot publish directly). |
| `media_editor` | Media Editor | Manage, upload, and curate `media_gallery` albums, videos, and credits. |
| `seo_editor` | SEO Editor | Edit SEO metadata, structured schema, canonical slugs, and social share previews. |
