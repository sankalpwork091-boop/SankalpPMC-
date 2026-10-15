import type { Metadata } from 'next';
import { ProjectsClient } from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Projects Portfolio — Ongoing & Completed Redevelopments',
  description:
    'Explore 20+ prominent residential and commercial redevelopment projects by Sankalp PMC across Navi Mumbai, Kalyan, Thane, and Mumbai with full technical configurations.',
  openGraph: {
    title: 'Projects Portfolio — Sankalp PMC',
    description:
      'Explore 20+ prominent residential and commercial redevelopment projects by Sankalp PMC across Navi Mumbai and MMR.',
    images: [{ url: '/images/small/pro-1.jpg', width: 800, height: 500, alt: 'Sankalp PMC Projects' }],
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}
