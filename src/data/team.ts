export interface TeamMember {
  id: string;
  name: string;
  title: string;
  qualifications: string;
  image: string;
  bio: string;
  awards?: string[];
  category: 'leadership' | 'architect-engineer';
}

export const team: TeamMember[] = [
  {
    id: 'santosh-yadav',
    name: 'Mr. Santosh Ananda Yadav',
    title: 'Advocate',
    qualifications: 'B.L.S., LLB',
    image: '/images/santosh-ananda-yadav.jpg',
    bio: 'At the helm of Sankalp PMC\'s legal strategy, with over 7 years of experience in redevelopment and allied legal services. Strong foundation in intellectual property and real estate law; has advised 50+ corporations and individuals with structured, compliant, risk-mitigated solutions. Legal Advisor for multiple residential and commercial redevelopment projects across Navi Mumbai and Panvel. Track record: 29 registered development agreements, Section 79A processes for 30 housing societies, and the amalgamation of 8 society clusters.',
    awards: ['The Great Legal Minds by Lokmat'],
    category: 'leadership',
  },
  {
    id: 'ali-abbasi',
    name: 'Mr. Ali Abbasi',
    title: 'Principal Architect',
    qualifications: 'B.Arch Honours',
    image: '/images/aliabbasi.jpg',
    bio: '"The mind behind the masterpieces." More than two decades of experience across the UAE and India, including 5 years at Khatib & Alami before starting his Indian journey. Passionate about design and innovation, he has shaped many urban landmarks.',
    awards: ['3x World Architecture Award'],
    category: 'architect-engineer',
  },
  {
    id: 'akshay-mankame',
    name: 'Mr. Akshay Mankame',
    title: '',
    qualifications: 'B.Arch, Diploma in Interior Designing & Decoration',
    image: '/images/akshay-mankame.jpg',
    bio: '',
    category: 'architect-engineer',
  },
  {
    id: 'swapnil-chavan',
    name: 'Mr. Swapnil Chavan',
    title: 'ACME Buildsmart',
    qualifications: '',
    image: '/images/swapnil-chavan.jpg',
    bio: '',
    category: 'architect-engineer',
  },
  {
    id: 'janmesh-patel',
    name: 'Mr. Janmesh Patel',
    title: 'ACME Buildsmart',
    qualifications: '',
    image: '/images/janmesh-patel.jpg',
    bio: '',
    category: 'architect-engineer',
  },
];

export const teamSectionHeading = 'Our Leadership';
export const architectsHeading =
  'Our Architect & Engineers — Over two decades of excellence, shaping landmark developments across India';
