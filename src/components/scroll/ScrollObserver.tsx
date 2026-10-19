'use client';

import { useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useScrollStore } from '@/hooks/useScrollStore';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function ScrollObserver() {
  const setSectionProgress = useScrollStore((s) => s.setSectionProgress);
  const setActiveSection = useScrollStore((s) => s.setActiveSection);
  const setGlobalProgress = useScrollStore((s) => s.setGlobalProgress);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Track overall page progress
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setGlobalProgress(self.progress);
        },
      });

      // Query all sections with data-section attribute
      const sections = document.querySelectorAll<HTMLElement>('[data-section]');

      sections.forEach((section) => {
        const sectionIndex = parseInt(section.getAttribute('data-section') || '0', 10);
        const isPinned = section.hasAttribute('data-pinned');

        ScrollTrigger.create({
          trigger: section,
          start: isPinned ? 'top top' : 'top center',
          end: isPinned ? '+=150%' : 'bottom center',
          pin: false, // NEVER pin in observer — avoids wrapper/spacer DOM mutation conflicts
          scrub: 0.5,
          onEnter: () => setActiveSection(sectionIndex),
          onEnterBack: () => setActiveSection(sectionIndex),
          onUpdate: (self) => {
            setSectionProgress(sectionIndex, self.progress);
          },
        });
      });
    });

    return () => {
      ctx.revert();
    };
  }, [setSectionProgress, setActiveSection, setGlobalProgress]);

  return null;
}

