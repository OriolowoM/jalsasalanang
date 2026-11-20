import { constructMetadata } from '@/lib/seo';
import ProgrammeClient from './ProgrammeClient';

export const metadata = constructMetadata({
  title: 'Official Programme of Events — 72nd Jalsa Salana Nigeria 2026',
  description:
    'Full 3-day programme of events for the 72nd Jalsa Salana Nigeria (18th–20th December 2026) at Jamia Ahmadiyya Ilaro, Ogun State. Theme: "Observing Justice and Human Rights: The foundation for true Global Peace". Keynotes, speeches, Yoruba & Hausa translations, prayers, and sound of Jalsa.',
  path: '/programme-of-events-jalsa-salana-nigeria-2026',
});

export default function ProgrammePage() {
  return <ProgrammeClient />;
}
