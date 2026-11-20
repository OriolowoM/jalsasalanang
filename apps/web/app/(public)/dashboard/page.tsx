import { constructMetadata } from '@/lib/seo';
import DashboardClient from './DashboardClient';

export const metadata = constructMetadata({
  title: 'Attendee Hub & Convention Dashboard — Jalsa Salana Nigeria 2026',
  description:
    'Access your personalized attendee pass, real-time grounds status, assigned gate, and saved convention schedule.',
  path: '/dashboard',
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardClient />;
}
