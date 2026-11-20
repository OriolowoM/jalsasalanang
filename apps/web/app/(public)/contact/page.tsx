import { constructMetadata } from '@/lib/seo';
import ContactClient from './ContactClient';

export const metadata = constructMetadata({
  title: 'Contact Us & Secretariat Liaison — Jalsa Salana Nigeria',
  description:
    'Get in touch with the Jalsa Salana Nigeria Organizing Committee, media accreditation secretariat, accommodation desk, and security liaison.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClient />;
}
