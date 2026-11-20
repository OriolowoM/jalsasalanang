import { constructMetadata } from '@/lib/seo';
import RegistrationClient from './RegistrationClient';

export const metadata = constructMetadata({
  title: 'Convention Registration & Entry Passes — 72nd Jalsa Salana Nigeria 2026',
  description:
    'Register online for the 72nd Jalsa Salana Nigeria convening 18th–20th December 2026 at Jamia Ahmadiyya Ilaro, Ogun State. Pre-register for fast-track QR verification, accommodation, and transportation.',
  path: '/registration',
});

export default function RegistrationPage() {
  return <RegistrationClient />;
}
