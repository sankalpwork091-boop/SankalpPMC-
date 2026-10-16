/**
 * Scroll-Driven 3D Transformation Animation Engine
 * Sankalp PMC Architecture
 *
 * Provides smooth 60fps 3D depth, perspective tilt, scale, and parallax
 * transforms across homepage sections as the user scrolls.
 *
 * ─── KILL SWITCH ───
 * To completely disable this animation, set ENABLE_3D_SCROLL_ANIMATION = false
 * or append ?no3d=true to the URL in development.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export const ENABLE_3D_SCROLL_ANIMATION = true;

export interface Scroll3DOptions {
  containerSelector?: string;
  sectionSelector?: string;
  perspective?: number;
  maxRotateX?: number;
  maxTranslateZ?: number;
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
  if (window.location.search.includes('no3d=true') || window.location.search.includes('disable3d=true')) {
    console.info('[Scroll3D] Disabled via URL parameter.');
    return () => {};
  }

  // 2. Respect OS-level Accessibility: prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.info('[Scroll3D] prefers-reduced-motion detected. 3D transforms bypassed for accessibility.');
    return () => {};
  }

  // 3. Register GSAP Plugin
  gsap.registerPlugin(ScrollTrigger);

  const {
    containerSelector = '#scroll-3d-container',
    sectionSelector = '[data-section]',
    perspective = 1400,
    maxRotateX = 5,       // Max degrees of 3D tilt
    maxTranslateZ = -140, // Max depth in pixels
  } = options;

  const container = document.querySelector<HTMLElement>(containerSelector);
  if (!container) {
    return () => {};
  }

  // 4. Mobile performance gating (60fps guarantee)
  // On mobile screens (< 768px), disable heavy 3D matrix math and preserve battery
  const isMobile = window.innerWidth < 768;

  // Set perspective on container
  container.style.perspective = `${perspective}px`;
  container.style.perspectiveOrigin = '50% 50%';
  container.style.transformStyle = 'preserve-3d';

  const sections = Array.from(container.querySelectorAll<HTMLElement>(sectionSelector));
  if (sections.length === 0) {
    return () => {};
  }

  const triggers: ScrollTrigger[] = [];

  sections.forEach((section, index) => {
    // Avoid double-transforming pinned sections like the transformation hero
    const isPinned = section.hasAttribute('data-pinned') || section.classList.contains('pin-spacer');

    // Add 3D transform properties to the section
    section.style.transformStyle = 'preserve-3d';
    section.style.backfaceVisibility = 'hidden';
    section.style.willChange = 'transform, opacity';

    if (isMobile) {
      // Lightweight mobile scroll-parallax: zero 3D rotation, subtle scale/fade
      const tween = gsap.fromTo(
        section,
        {
          opacity: index === 0 ? 1 : 0.88,
          scale: index === 0 ? 1 : 0.98,
        },
        {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'top center',
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    } else {
      // Full Desktop 3D Experience (Depth + Tilt + Parallax)
      // Timeline phases: Enter (depth in) -> Focus (flat & sharp) -> Exit (tilt & float away)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: isPinned ? 'top top' : 'top bottom',
          end: isPinned ? '+=120%' : 'bottom top',
          scrub: 0.8, // Smooth GSAP scrub synced with Lenis
          invalidateOnRefresh: true,
        },
      });

      if (!isPinned) {
        tl.fromTo(
          section,
          {
            rotateX: maxRotateX,
            translateZ: maxTranslateZ,
            scale: 0.94,
            opacity: index === 0 ? 1 : 0.85,
            transformOrigin: '50% 100%',
          },
          {
            rotateX: 0,
            translateZ: 0,
            scale: 1,
            opacity: 1,
            transformOrigin: '50% 50%',
            ease: 'power1.out',
            duration: 0.5,
          }
        ).to(section, {
          rotateX: -maxRotateX * 0.75,
          translateZ: maxTranslateZ * 0.6,
          scale: 0.96,
          opacity: 0.85,
          yPercent: -4, // Subtle parallax lift
          transformOrigin: '50% 0%',
          ease: 'power1.in',
          duration: 0.5,
        });
      } else {
        // For pinned sections, apply subtle depth breathing without disrupting pin
        tl.fromTo(
          section,
          { translateZ: -60, scale: 0.98 },
          { translateZ: 0, scale: 1, ease: 'none' }
        );
      }

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    }
  });

  // Handle window resize dynamically
  const handleResize = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener('resize', handleResize);

  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
    triggers.forEach((st) => st.kill());
    // Reset styles on container
    if (container) {
      container.style.perspective = '';
      container.style.perspectiveOrigin = '';
      container.style.transformStyle = '';
    }
    // Reset styles on sections
    sections.forEach((section) => {
      section.style.transform = '';
      section.style.transformStyle = '';
      section.style.backfaceVisibility = '';
      section.style.willChange = '';
      section.style.opacity = '';
    });
  };
}
