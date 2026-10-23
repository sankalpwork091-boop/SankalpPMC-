export const siteConfig = {
  name: 'Sankalp Project Management Consultants Pvt. Ltd.',
  shortName: 'Sankalp PMC',
  tagline: 'We are here to change the idea of redevelopment.',
  description:
    'A specialised redevelopment consultancy focused on co-operative housing societies, providing end-to-end support through every stage of redevelopment, ensuring it is transparent, secure, and professionally managed.',
  /** Canonical site address: NEXT_PUBLIC_SITE_URL when set, without a trailing slash */
  url: (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.sankalppmc.com').replace(/\/+$/, ''),

  phones: ['+91 9373188181'],
  email: 'careers@sankalppmc.com',

  addresses: [
    {
      label: 'Head Office',
      line1: 'Office No. 1105, Ellora Fiesta',
      line2: 'Sector 11, Sanpada',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      pin: '400 705',
      mapEmbedUrl: '', // TODO: add Google Maps embed URL
    },
  ],

  /** Social media profile URLs */
  social: {
    facebook: '', // TODO: actual Facebook page URL
    youtube: '', // TODO: actual YouTube channel URL
    instagram: 'https://www.instagram.com/sankalp_pmc/',
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Projects', href: '/projects' },
    { label: 'Services', href: '/services' },
    { label: 'New Updates', href: '/new-updates' },
    { label: 'Awards', href: '/awards' },
    { label: 'Career', href: '/career' },
    { label: 'Contact Us', href: '/contact-us' },
  ],

  /** Animated counter stats on home page */
  stats: [
    {
      value: 0, // TODO: get actual number
      suffix: '+',
      label: 'Years of Combined Experience',
      description: 'In legal, architecture and engineering',
    },
    {
      value: 0, // TODO: get actual number
      suffix: '+',
      label: 'Projects Executed',
      description: 'Successfully executed by the technical team',
    },
    {
      value: 0, // TODO: get actual number
      suffix: '+',
      label: 'Societies Served',
      description: 'Through legal and redevelopment advisory',
    },
    {
      value: 0, // TODO: get actual number
      suffix: 'Cr sq ft',
      label: 'Planning & Design Experience',
      description: 'Of planning, design and engineering experience',
    },
  ],

  /** Brand copy */
  foreword:
    'Redevelopment is often met with hesitation, guarded minds and unanswered questions — and rightly so, because change is never easy, especially when it asks people to rethink something they have lived in and called their own for years. Sankalp is here to do it responsibly, lead with honesty and honour every promise made, to prove that change need not be feared and that, done right, it can lead to something far better.',
  coreBelief:
    'At the heart of every redevelopment lies trust: the trust of families placing the future of their homes in someone else\'s hands, of societies making decisions with long-term emotional and financial consequences, and that the process will be handled not just efficiently but ethically. Sankalp was built to approach redevelopment as a responsibility — not just towards buildings but towards the hearts they are built for.',
  pointOfDifference:
    'Unlike conventional PMCs, Sankalp is uniquely positioned through its advocate-led leadership, which enables it to anticipate legal challenges, structure stronger agreements, and ensure redevelopment moves forward with greater clarity, stronger safeguards, and complete commitments. It brings end-to-end project management and legal oversight under one roof, so redevelopment is not only planned and executed well but also protected well.',
  delaysFraming:
    'Delays do not always begin on site; they begin earlier — in weak structuring, overlooked clauses, unclear commitments, and processes never built to protect the people at the centre.',
} as const;

export type SiteConfig = typeof siteConfig;
