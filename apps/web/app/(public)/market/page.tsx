import { constructMetadata } from '@/lib/seo';
import MarketClient from './MarketClient';

export const metadata = constructMetadata({
  title: 'Jalsa Salana 2026 Market — Commercial Stalls & Guidelines',
  description:
    'Official guidelines, commercial stall pricing, operating hours, and registration instructions for the 72nd Jalsa Salana Nigeria 2026 Market at Jamia Ahmadiyya Ilaro, Ogun State.',
  path: '/market',
});

export default function MarketPage() {
  return <MarketClient />;
}
