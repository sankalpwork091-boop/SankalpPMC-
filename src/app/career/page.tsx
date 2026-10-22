import type { Metadata } from 'next';
import { CareerClient } from './CareerClient';

export const metadata: Metadata = {
  title: 'Careers — Join Our Redevelopment PMC Team',
  description:
    'Join Sankalp PMC. Explore opportunities for advocates, project architects, civil site engineers, and liaisoning executives in Navi Mumbai.',
  alternates: { canonical: '/career' },
  openGraph: {
    url: '/career',
    title: 'Careers at Sankalp PMC',
    description:
      'Build trust where it matters most. Join our advocate-led redevelopment consultancy team in Navi Mumbai.',
    images: [{ url: '/images/career-ban.jpg', width: 1200, height: 630, alt: 'Sankalp PMC Careers' }],
  },
};

export default function CareerPage() {
  return <CareerClient />;
}
