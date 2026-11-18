import React from 'react';
import AnnouncementTicker from '@/components/public/AnnouncementTicker';
import MastheadHeader from '@/components/public/MastheadHeader';
import EditorialFooter from '@/components/public/EditorialFooter';
import AskJalsaAI from '@/components/public/AskJalsaAI';
import { LanguageProvider } from '@/context/LanguageContext';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AnnouncementTicker />
      <MastheadHeader />
      <main className="flex-grow">{children}</main>
      <EditorialFooter />
      <AskJalsaAI />
    </LanguageProvider>
  );
}
