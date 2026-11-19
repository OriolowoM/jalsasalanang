import React from 'react';
import AnnouncementTicker from '@/components/public/AnnouncementTicker';
import MastheadHeader from '@/components/public/MastheadHeader';
import EditorialFooter from '@/components/public/EditorialFooter';
import AskJalsaAI from '@/components/public/AskJalsaAI';
import { LanguageProvider } from '@/context/LanguageContext';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import JalsaMiniPlayer from '@/components/public/audio/JalsaMiniPlayer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AudioPlayerProvider>
        <AnnouncementTicker />
        <MastheadHeader />
        <main className="flex-grow">{children}</main>
        <EditorialFooter />
        <JalsaMiniPlayer />
        <AskJalsaAI />
      </AudioPlayerProvider>
    </LanguageProvider>
  );
}
