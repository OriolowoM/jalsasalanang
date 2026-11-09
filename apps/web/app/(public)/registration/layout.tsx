import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register for 72nd Jalsa Salana Nigeria 2026 | Official Registration Portal Guide',
  description: 'Complete registration guide, digital delegate badges, whole family registration, child safety wristbands, lodging allocations, and official portal access (jalsa.ahmadiyyanigeria.net) for the 72nd Jalsa Salana Nigeria 2026.',
  keywords: [
    'Jalsa Salana Nigeria 2026 Registration',
    '72nd Jalsa Salana Nigeria',
    'Jalsa Nigeria December 2026',
    'Ahmadiyya Muslim Community Nigeria Jalsa',
    'jalsa.ahmadiyyanigeria.net',
  ],
  openGraph: {
    title: 'Register for 72nd Jalsa Salana Nigeria 2026',
    description: 'Secure your digital delegate tag, household registration, and lodging for the 72nd Jalsa Salana Nigeria (18–20 December 2026 at Jamia Ilaro).',
    url: 'https://jalsasalana.ng/registration',
    siteName: 'Jalsa Salana Nigeria',
    images: [{ url: '/images/registration/jalsa2026-flyer-01-the-arch_feed.webp', width: 1080, height: 1350 }],
  },
};

export default function RegistrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
