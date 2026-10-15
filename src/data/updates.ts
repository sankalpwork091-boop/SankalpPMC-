export interface UpdateItem {
  id: string;
  title: string;
  date: string; // ISO date string
  year: number;
  image: string;
  caption?: string;
}

/** TODO: Seed with actual update entries. The old site had images only, no captions. */
export const updates: UpdateItem[] = [
  // Placeholder entries — replace with actual data
  {
    id: 'update-2026-1',
    title: 'TODO: Update Title',
    date: '2026-01-01',
    year: 2026,
    image: '/images/placeholder-update.jpg', // TODO: replace
    caption: '', // TODO: add caption
  },
  {
    id: 'update-2025-1',
    title: 'TODO: Update Title',
    date: '2025-01-01',
    year: 2025,
    image: '/images/placeholder-update.jpg', // TODO: replace
    caption: '', // TODO: add caption
  },
  {
    id: 'update-2024-1',
    title: 'TODO: Update Title',
    date: '2024-01-01',
    year: 2024,
    image: '/images/placeholder-update.jpg', // TODO: replace
    caption: '', // TODO: add caption
  },
];

export const updateYears = [2026, 2025, 2024] as const;
