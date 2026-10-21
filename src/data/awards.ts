export interface AwardItem {
  id: string;
  number: number;
  title: string;
  year?: number;
  image: string;
  caption?: string;
  imagePosition?: string;
  objectFit?: 'cover' | 'contain';
}

/**
 * Awards gallery. The old site had images only.
 * TODO: Add titles, years, and captions to each entry.
 */
export const awards: AwardItem[] = [
  { id: 'aw-111', number: 11, title: 'TODO: Award Title', image: '/images/aw/aw-111.jpeg', caption: '', objectFit: 'contain', imagePosition: 'center' },
  { id: 'aw-1', number: 1, title: 'TODO: Award Title', image: '/images/aw/aw-1.jpg', caption: '' },
  { id: 'aw-2', number: 2, title: 'TODO: Award Title', image: '/images/aw/aw-2.jpg', caption: '' },
  { id: 'aw-3', number: 3, title: 'TODO: Award Title', image: '/images/aw/aw-3.jpg', caption: '' },
  { id: 'aw-4', number: 4, title: 'TODO: Award Title', image: '/images/aw/aw-4.jpg', caption: '' },
  { id: 'aw-5', number: 5, title: 'TODO: Award Title', image: '/images/aw/aw-5.jpg', caption: '' },
  { id: 'aw-6', number: 6, title: 'TODO: Award Title', image: '/images/aw/aw-6.jpg', caption: '' },
  { id: 'aw-7', number: 7, title: 'TODO: Award Title', image: '/images/aw/aw-7.jpg', caption: '' },
  { id: 'aw-8', number: 8, title: 'TODO: Award Title', image: '/images/aw/aw-8.jpg', caption: '' },
  { id: 'aw-9', number: 9, title: 'TODO: Award Title', image: '/images/aw/aw-9.jpg', caption: '' },
  { id: 'aw-10', number: 10, title: 'TODO: Award Title', image: '/images/aw/aw-10.jpg', caption: '' },
];

export const awardHighlights = [
  'Lokmat "The Great Legal Minds" — Mr. Santosh Ananda Yadav',
  '3x World Architecture Award — Mr. Ali Abbasi',
];
