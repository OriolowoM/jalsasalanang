import { constructMetadata } from '@/lib/seo';
import RegistrationClient from '../registration/RegistrationClient';

export const metadata = constructMetadata({
  title: 'Convention Registration & Entry Passes — 72nd Jalsa Salana Nigeria 2026',
  description:
    'Register online for the 72nd Jalsa Salana Nigeria convening 18th–20th December 2026 at Jamia Ahmadiyya Ilaro, Ogun State.',
  path: '/jalsa-registration',
});

export default function JalsaRegistrationPage() {
  return <RegistrationClient />;
}
