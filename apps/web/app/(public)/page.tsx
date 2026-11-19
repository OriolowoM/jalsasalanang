import React from 'react';
import { getArticles, getEditions, getCurrentEdition, getSpeeches, getGalleries } from '@/lib/api';
import HeroSection from '@/components/public/HeroSection';
import CountdownSection from '@/components/public/CountdownSection';
import RegistrationShowcase from '@/components/public/RegistrationShowcase';
import SoundOfJalsaCard from '@/components/public/audio/SoundOfJalsaCard';
import EventAttendeeHub from '@/components/public/EventAttendeeHub';
import EditorialCategoryTabs from '@/components/public/EditorialCategoryTabs';
import EditorialGrid from '@/components/public/EditorialGrid';
import SpeechesSection from '@/components/public/SpeechesSection';
import MediaHighlightsSection from '@/components/public/MediaHighlightsSection';
import ArchivesTimeline from '@/components/public/ArchivesTimeline';
import NewsletterForm from '@/components/public/NewsletterForm';
import WhatsAppBroadcastBanner from '@/components/public/WhatsAppBroadcastBanner';
import QuranCitationCard from '@/components/public/QuranCitationCard';

export const revalidate = 60; // ISR cache revalidation every minute

export default async function HomePage() {
  // Fetch dynamic content in parallel from backend API
  const [
    heroRes,
    secondaryRes,
    editorsPicksRes,
    latestRes,
    allDispatchesRes,
    editionsRes,
    currentEditionRes,
    speechesRes,
    galleriesRes,
  ] = await Promise.all([
    getArticles({ featuredType: 'HERO', limit: 1 }).catch(() => ({ data: [] })),
    getArticles({ featuredType: 'SECONDARY', limit: 3 }).catch(() => ({ data: [] })),
    getArticles({ featuredType: 'EDITORS_PICK', limit: 4 }).catch(() => ({ data: [] })),
    getArticles({ limit: 6 }).catch(() => ({ data: [] })),
    getArticles({ limit: 40 }).catch(() => ({ data: [] })),
    getEditions().catch(() => ({ data: [] })),
    getCurrentEdition().catch(() => ({ data: null })),
    getSpeeches({ limit: 3 }).catch(() => ({ data: [] })),
    getGalleries().catch(() => ({ data: [] })),
  ]);

  const heroArticle = heroRes.data?.[0] || latestRes.data?.[0];
  const secondaryArticles = secondaryRes.data?.length > 0 ? secondaryRes.data : latestRes.data?.slice(1, 4);
  const editorsPicks = editorsPicksRes.data?.length > 0 ? editorsPicksRes.data : latestRes.data?.slice(0, 4);
  const latestArticles = latestRes.data || [];
  const dispatchesArticles = allDispatchesRes.data || latestArticles;
  const editions = editionsRes.data || [];
  const speeches = speechesRes.data || [];
  const galleries = galleriesRes.data || [];

  return (
    <div>
      {/* 1. Large Featured Story & Secondary Featured Section */}
      <HeroSection heroArticle={heroArticle} secondaryArticles={secondaryArticles} />

      {/* 2. Jalsa Salana 2026 Special Coverage Hub & Live Countdown */}
      <CountdownSection />

      {/* 3. Prominent Jalsa 2026 Registration Showcase Section */}
      <RegistrationShowcase />

      {/* 4. Sound of Jalsa 2026 — 4-Language Official Jingles Audio Experience */}
      <SoundOfJalsaCard />

      {/* 5. Event Attendee Services & Logistics Hub (Programme, Accommodation, Transportation, Security) */}
      <EventAttendeeHub />

      {/* 5. Migrated Digital Magazine Dispatches by Thematic Category Tabs */}
      <EditorialCategoryTabs articles={dispatchesArticles} />

      {/* 6. Editor's Picks & Classic Editorial Grid */}
      <EditorialGrid editorsPicks={editorsPicks} latestArticles={latestArticles} />

      {/* 7. Speeches & Addresses */}
      <SpeechesSection speeches={speeches} />

      {/* Quranic Foundation Anchor linked to AlIslam.org */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <QuranCitationCard />
      </div>

      {/* 8. Photography & Visual Highlights */}
      <MediaHighlightsSection galleries={galleries} />

      {/* 9. Historical Jalsa Archives (2026, 2025, 2024 Platinum Jubilee, etc.) */}
      <ArchivesTimeline editions={editions} />

      {/* Official WhatsApp Delegate Broadcast Banner */}
      <WhatsAppBroadcastBanner />

      {/* 10. Newsletter Subscription Component */}
      <NewsletterForm />
    </div>
  );
}
