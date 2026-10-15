'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useScrollStore } from '@/hooks/useScrollStore';

export function ScrollObserver() {
  const setSectionProgress = useScrollStore((s) => s.setSectionProgress);
  const setActiveSection = useScrollStore((s) => s.setActiveSection);
  const setGlobalProgress = useScrollStore((s) => s.setGlobalProgress);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Track overall page progress
    const globalTrigger = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        setGlobalProgress(self.progress);
      },
    });

    // Query all sections with data-section attribute
    const sections = document.querySelectorAll<HTMLElement>('[data-section]');
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const sectionIndex = parseInt(section.getAttribute('data-section') || '0', 10);
      const isPinned = section.hasAttribute('data-pinned');

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: isPinned ? 'top top' : 'top center',
        end: isPinned ? '+=150%' : 'bottom center',
        pin: isPinned,
        scrub: 0.5,
        onEnter: () => setActiveSection(sectionIndex),
        onEnterBack: () => setActiveSection(sectionIndex),
        onUpdate: (self) => {
          setSectionProgress(sectionIndex, self.progress);
        },
      });

      triggers.push(trigger);
    });

    // Refresh ScrollTrigger after DOM settle
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      globalTrigger.kill();
      triggers.forEach((t) => t.kill());
    };
  }, [setSectionProgress, setActiveSection, setGlobalProgress]);

  return null;
}
