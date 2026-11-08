import React from 'react';
import AnnouncementTicker from '@/components/public/AnnouncementTicker';
import MastheadHeader from '@/components/public/MastheadHeader';
import EditorialFooter from '@/components/public/EditorialFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementTicker />
      <MastheadHeader />
      <main className="flex-grow">{children}</main>
      <EditorialFooter />
    </>
  );
}
