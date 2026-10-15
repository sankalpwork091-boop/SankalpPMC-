export interface Service {
  id: string;
  title: string;
  tagline: string;
  icon: string;
}

export const services: Service[] = [
  {
    id: 'legal',
    title: 'Legal Services',
    tagline: 'Securing every step with legal certainty.',
    icon: '/images/icon-1.png',
  },
  {
    id: 'architectural',
    title: 'Architectural Services',
    tagline: 'Designing spaces with purpose, precision and practicality.',
    icon: '/images/icon-2.png',
  },
  {
    id: 'construction',
    title: 'Construction Management',
    tagline: 'Keeping execution disciplined from start to finish.',
    icon: '/images/icon-3.png',
  },
  {
    id: 'design-execution',
    title: 'Design & Execution',
    tagline: 'Transforming ideas into spaces crafted with excellence.',
    icon: '/images/icon-4.png',
  },
  {
    id: 'liaisoning',
    title: 'Liaisoning',
    tagline: 'Navigating approvals with speed and clarity.',
    icon: '/images/icon-5.png',
  },
  {
    id: 'financial',
    title: 'Financial Services / Chartered Accountant',
    tagline: 'Providing financial clarity at every stage.',
    icon: '/images/icon-6.png',
  },
];
