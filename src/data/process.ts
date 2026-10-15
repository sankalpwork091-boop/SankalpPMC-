export interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: string; // path to icon image
  /** Visual hint for the 3D scene — what happens to the building at this step */
  sceneHint: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Appointment',
    description:
      'The society appoints Sankalp PMC as its redevelopment consultant.',
    icon: '/images/icon-7.png',
    sceneHint: 'blueprint-outline-draws',
  },
  {
    id: 2,
    title: 'Legal Check & Feasibility',
    description:
      'We examine legal title, compliances, and overall redevelopment potential.',
    icon: '/images/icon-8.png',
    sceneHint: 'scanning-light-documents',
  },
  {
    id: 3,
    title: 'Tendering',
    description:
      'We prepare tender documents and invite bids from qualified developers.',
    icon: '/images/icon-9.png',
    sceneHint: 'tower-options-slide',
  },
  {
    id: 4,
    title: '79A Compliance',
    description:
      'We ensure the process is carried out in line with the required government guidelines.',
    icon: '/images/icon-10.png',
    sceneHint: 'checklist-shield-ticks',
  },
  {
    id: 5,
    title: 'Offer Evaluation & Plan Finalization',
    description:
      'We review proposals, negotiate terms, and help finalize the best fit for the society.',
    icon: '/images/icon-11.png',
    sceneHint: 'tower-comparison-highlight',
  },
  {
    id: 6,
    title: 'Agreement Structuring',
    description:
      'We draft and execute key legal documents to protect society interests.',
    icon: '/images/icon-12.png',
    sceneHint: 'contract-signature-shield',
  },
  {
    id: 7,
    title: 'Approvals',
    description:
      'We coordinate statutory permissions and regulatory clearances.',
    icon: '/images/icon-13.png',
    sceneHint: 'gates-open-wireframe-solid',
  },
  {
    id: 8,
    title: 'Execution Monitoring',
    description:
      'We monitor quality, progress, timelines, and stakeholder coordination.',
    icon: '/images/icon-14.png',
    sceneHint: 'demolish-construct-floors',
  },
  {
    id: 9,
    title: 'Occupancy Certificate',
    description:
      'We assist in securing the final compliance approvals.',
    icon: '/images/icon-15.png',
    sceneHint: 'tower-complete-certificate',
  },
  {
    id: 10,
    title: 'Handover',
    description:
      'We help bring the process to a smooth and successful close.',
    icon: '/images/icon-16.png',
    sceneHint: 'golden-hour-keys-glow',
  },
];
