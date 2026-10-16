'use client';

import { useEffect } from 'react';
import { initScroll3DAnimation, ENABLE_3D_SCROLL_ANIMATION } from '@/animations/scroll3d';

export function Scroll3DController() {
  useEffect(() => {
    if (!ENABLE_3D_SCROLL_ANIMATION) return;

    // Small timeout to allow DOM elements and layout to stabilize
    const timeout = setTimeout(() => {
      const cleanup = initScroll3DAnimation({
        containerSelector: '#scroll-3d-container',
        sectionSelector: '[data-section]',
        perspective: 1400,
        maxRotateX: 5,
        maxTranslateZ: -140,
      });

      return () => {
        cleanup();
      };
    }, 150);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
