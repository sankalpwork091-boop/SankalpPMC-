/**
 * Media configuration: toggle between procedural three.js scenes and
 * AI-generated media (Higgsfield / Google Flow) per scene.
 *
 * Set `enabled: true` and provide the `src` path once a generated asset
 * is placed in `/public/media/generated/`. The components read this config
 * and swap the procedural fallback for the generated media automatically.
 */

export interface MediaAsset {
  id: string;
  enabled: boolean;
  type: 'video' | 'image' | 'frames';
  /** Path relative to /public */
  src: string;
  /** Mobile variant path (9:16 for video, smaller res for frames) */
  srcMobile?: string;
  /** Frame sequence directory (for scroll-scrubbed backgrounds) */
  framesDir?: string;
  frameCount?: number;
  description: string;
}

export const mediaAssets: Record<string, MediaAsset> = {
  'hero-dawn-skyline': {
    id: 'hero-dawn-skyline',
    enabled: false,
    type: 'video',
    src: '/media/generated/hero-dawn-skyline.mp4',
    srcMobile: '/media/generated/hero-dawn-skyline-mobile.mp4',
    description: 'Dawn skyline push-in towards old housing society',
  },
  'old-building-orbit': {
    id: 'old-building-orbit',
    enabled: false,
    type: 'video',
    src: '/media/generated/old-building-orbit.mp4',
    description: 'Slow orbit around weathered society building',
  },
  'blueprint-draw': {
    id: 'blueprint-draw',
    enabled: false,
    type: 'frames',
    src: '/media/generated/blueprint-draw.mp4',
    framesDir: '/media/frames/blueprint-draw/',
    frameCount: 0, // set after extraction
    description: 'Blueprint lines drawing over building outline',
  },
  'legal-documents-float': {
    id: 'legal-documents-float',
    enabled: false,
    type: 'video',
    src: '/media/generated/legal-documents-float.mp4',
    description: 'Legal documents and shield aligning in soft light',
  },
  'construction-timelapse': {
    id: 'construction-timelapse',
    enabled: false,
    type: 'frames',
    src: '/media/generated/construction-timelapse.mp4',
    framesDir: '/media/frames/construction-timelapse/',
    frameCount: 0,
    description: 'Tower construction floor by floor timelapse',
  },
  'tower-complete-golden-hour': {
    id: 'tower-complete-golden-hour',
    enabled: false,
    type: 'video',
    src: '/media/generated/tower-complete-golden-hour.mp4',
    description: 'Completed tower reveal at golden hour',
  },
  'handover-keys': {
    id: 'handover-keys',
    enabled: false,
    type: 'video',
    src: '/media/generated/handover-keys.mp4',
    description: 'Keys placed on table in warm morning light',
  },

  // Stills
  'bg-skyline-night': {
    id: 'bg-skyline-night',
    enabled: false,
    type: 'image',
    src: '/media/generated/bg-skyline-night.webp',
    description: 'Night skyline background',
  },
  'bg-blueprint-grid': {
    id: 'bg-blueprint-grid',
    enabled: false,
    type: 'image',
    src: '/media/generated/bg-blueprint-grid.webp',
    description: 'Blueprint grid pattern background',
  },
  'texture-concrete-warm': {
    id: 'texture-concrete-warm',
    enabled: false,
    type: 'image',
    src: '/media/generated/texture-concrete-warm.webp',
    description: 'Warm concrete texture',
  },
  'bg-paper-ivory': {
    id: 'bg-paper-ivory',
    enabled: false,
    type: 'image',
    src: '/media/generated/bg-paper-ivory.webp',
    description: 'Ivory paper texture background',
  },
};

/** Helper to check if a media asset is available */
export function isMediaEnabled(id: string): boolean {
  return mediaAssets[id]?.enabled ?? false;
}

/** Get a media asset config, returns undefined if not found */
export function getMedia(id: string): MediaAsset | undefined {
  return mediaAssets[id];
}
