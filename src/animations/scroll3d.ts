/**
 * Scroll-Driven 3D Transformation Animation Engine
 * Sankalp PMC Architecture
 *
 * Provides smooth 60fps 3D depth, perspective tilt, scale, and parallax
 * transforms across homepage sections as the user scrolls.
 *
 * ─── KILL SWITCH ───
 * To completely disable this animation, set ENABLE_3D_SCROLL_ANIMATION = false
 * or append ?no3d=true to the URL in the browser.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const ENABLE_3D_SCROLL_ANIMATION = true;

export interface Scroll3DOptions {
  containerSelector?: string;
  sectionSelector?: string;
  perspective?: number;
  enterTranslateZ?: number;
  enterRotateX?: number;
  enterScale?: number;
  exitRotateX?: number;
  exitYPercent?: number;
  scrub?: number;
}

export function initScroll3DAnimation(options: Scroll3DOptions = {}): () => void {
  // 1. Master Kill-Switch verification
  if (!ENABLE_3D_SCROLL_ANIMATION) {
    return () => {};
  }

  // SSR safety check
  if (typeof window === 'undefined') {
    return () => {};
  }

  // URL override kill-switch: ?no3d=true or ?disable3d=true
  if (
    window.location.search.includes('no3d=true') ||
    window.location.search.includes('disable3d=true')
  ) {
    console.info('[Scroll3D] Disabled via URL parameter (?no3d=true).');
    return () => {};
  }

  // 2. Respect OS-level Accessibility: prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('[Scroll3D] prefers-reduced-motion active. 3D transforms bypassed for accessibility.');
    return () => {};
  }

  // 3. Register GSAP Plugin & configure to ignore mobile address bar resize jumps
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const {
    containerSelector = '#scroll-3d-container',
    sectionSelector = '[data-section]',
    perspective = 1400,
    enterTranslateZ = -60,   // Tone down: -60px depth
    enterRotateX = 2,        // Tone down: 2deg tilt
    enterScale = 0.97,       // Tone down: 0.97 scale
    exitRotateX = -1.5,      // Tone down: -1.5deg exit tilt
    exitYPercent = -2,       // Tone down: -2% parallax lift
    scrub = 0.5,             // Smooth scrub
  } = options;

  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) {
    return () => {};
  }

  // Ensure horizontal overflow is clipped without setting perspective on container
  container.style.overflowX = 'clip';

  // 4. Mobile performance gating (60fps guarantee)
  const isMobile = window.innerWidth < 768;

  // Query candidate sections
  const candidateSections = Array.from(container.querySelectorAll<HTMLElement>(sectionSelector));
  if (candidateSections.length === 0) {
    return () => {};
  }

  // Filter out any pinned sections or heroes to avoid transform/fixed conflicts
  const validSections = candidateSections.filter((section) => {
    const isHero =
      section.id === 'hero-transformation' ||
      section.querySelector('#hero-transformation') !== null;
    const isPinned =
      section.hasAttribute('data-pinned') ||
      section.classList.contains('pin-spacer');

    return !isHero && !isPinned;
  });

  // 5. Build GSAP Context for 100% clean teardown in React StrictMode
  const ctx = gsap.context(() => {
    validSections.forEach((section, index) => {
      // Apply transformPerspective to individual section (NOT on container)
      gsap.set(section, {
        transformPerspective: perspective,
        transformOrigin: '50% 50%',
      });

      if (isMobile) {
        // Mobile: Subtle opacity/scale scrub without 3D rotation or depth matrix
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top 95%',
          end: 'top 35%',
          scrub: 0.4,
          onToggle: (self) => {
            section.style.willChange = self.isActive ? 'opacity, transform' : 'auto';
          },
        });

        gsap.fromTo(
          section,
          {
            opacity: index === 0 ? 1 : 0.9,
            scale: index === 0 ? 1 : 0.985,
          },
          {
            opacity: 1,
            scale: 1,
            ease: 'power1.out',
            scrollTrigger: st,
            onComplete: () => {
              gsap.set(section, { clearProps: 'willChange' });
            },
          }
        );
      } else {
        // Desktop: High-precision, toned-down 3D depth and tilt
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub,
            onToggle: (self) => {
              // Apply will-change only while section is actively animating in viewport
              section.style.willChange = self.isActive ? 'transform, opacity' : 'auto';
            },
            onLeave: () => {
              // Clear props or settle cleanly when section scrolls past
              gsap.set(section, { clearProps: 'willChange' });
            },
            onLeaveBack: () => {
              // Clear props or settle cleanly when scrolling back up above section
              gsap.set(section, { clearProps: 'willChange' });
            },
          },
        });

        // Phase 1: Enter viewport -> Arrive at focal center (flat, sharp, 100% scale)
        tl.fromTo(
          section,
          {
            z: enterTranslateZ,
            rotateX: enterRotateX,
            scale: enterScale,
            opacity: index === 0 ? 1 : 0.88,
          },
          {
            z: 0,
            rotateX: 0,
            scale: 1,
            opacity: 1,
            ease: 'power1.out',
            duration: 0.5,
          }
        )
        // Phase 2: Exit center -> Leave viewport gracefully
        .to(section, {
          z: enterTranslateZ * 0.4,
          rotateX: exitRotateX,
          yPercent: exitYPercent,
          opacity: 0.9,
          ease: 'power1.in',
          duration: 0.5,
        });
      }
    });

    // 6. Refresh ScrollTrigger once fonts and images load
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      }).catch(() => {});
    }

    const onWindowLoad = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('load', onWindowLoad, { once: true });
  }, container);

  // 7. Cleanup function: Reverts context, removes triggers, restores original styles
  return () => {
    ctx.revert();
    if (container) {
      container.style.overflowX = '';
    }
    validSections.forEach((section) => {
      gsap.set(section, { clearProps: 'all' });
    });
  };
}
