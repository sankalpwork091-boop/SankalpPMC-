'use client';

import { useEffect } from 'react';
import { initScroll3DAnimation, ENABLE_3D_SCROLL_ANIMATION } from '@/animations/scroll3d';

export function Scroll3DController() {
  useEffect(() => {
    if (!ENABLE_3D_SCROLL_ANIMATION) return;

    let cleanup: (() => void) | undefined;

    // Small delay ensures DOM elements and Lenis have settled
    const timeout = setTimeout(() => {
      cleanup = initScroll3DAnimation({
        containerSelector: '#scroll-3d-container',
        sectionSelector: '[data-section]',
        perspective: 1400,
        enterTranslateZ: -60,
        enterRotateX: 2,
        enterScale: 0.97,
        exitRotateX: -1.5,
        exitYPercent: -2,
        scrub: 0.5,
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (cleanup) cleanup();
    };
  }, []);

  return null;
}
