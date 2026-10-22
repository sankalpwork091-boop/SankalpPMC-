import type { Metadata } from 'next';
import { NewUpdatesClient } from './NewUpdatesClient';

export const metadata: Metadata = {
  title: 'New Updates & Circulars — Regulatory Bulletins',
  description:
    'Stay updated on Section 79A regulatory circulars, housing society redevelopment policies, and project milestones across Navi Mumbai & MMR.',
  alternates: { canonical: '/new-updates' },
  openGraph: {
    url: '/new-updates',
    title: 'News & Project Updates — Sankalp PMC',
    description:
      'Regulatory bulletins and milestone announcements for co-operative housing societies in Navi Mumbai.',
    images: [{ url: '/images/new-updates-ban.jpg', width: 1200, height: 630, alt: 'Sankalp PMC Updates' }],
  },
};

export default function NewUpdatesPage() {
  return <NewUpdatesClient />;
}
