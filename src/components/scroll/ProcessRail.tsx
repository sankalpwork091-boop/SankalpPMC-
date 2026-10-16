'use client';

import { useRef } from 'react';
import { useScrollStore } from '@/hooks/useScrollStore';
import { processSteps } from '@/data/process';

export function ProcessRail() {
  const activeSection = useScrollStore((s) => s.activeSection);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // The 10 process steps correspond to sections 3 to 12
  const isProcessVisible = activeSection >= 2 && activeSection <= 13;
  const currentStepId = activeSection >= 3 && activeSection <= 12 ? activeSection - 2 : null;

  if (!isProcessVisible) return null;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex = -1;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      targetIndex = (index + 1) % processSteps.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      targetIndex = (index - 1 + processSteps.length) % processSteps.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIndex = processSteps.length - 1;
    }

    if (targetIndex >= 0 && linksRef.current[targetIndex]) {
      linksRef.current[targetIndex]?.focus();
    }
  };

  return (
    <aside
      aria-label="10-Step Redevelopment Timeline"
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-2 pointer-events-auto"
    >
      <nav
        role="navigation"
        aria-label="Redevelopment Process Steps"
        className="bg-white/90 backdrop-blur-md p-2.5 rounded-full border border-[#E9E2D0] shadow-xl flex flex-col items-center gap-2"
      >
        {processSteps.map((step, index) => {
          const isActive = currentStepId === step.id;
          const isPassed = currentStepId ? step.id < currentStepId : false;

          return (
            <a
              key={step.id}
              ref={(el) => {
                linksRef.current[index] = el;
              }}
              href={`#process-step-${step.id}`}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-label={`Step ${step.id} of 10: ${step.title}${isActive ? ' (Current Step)' : ''}`}
              aria-current={isActive ? 'step' : undefined}
              className="group relative flex items-center justify-center p-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-[#B8913A] focus-visible:outline-none transition-all"
            >
              {/* Tooltip on Hover and Focus */}
              <span
                role="tooltip"
                className="absolute right-9 px-2.5 py-1 rounded-lg bg-white text-xs text-[#1B1B1F] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity pointer-events-none border border-[#E9E2D0] shadow-lg"
              >
                Step {step.id}: {step.title}
              </span>

              {/* Indicator Dot */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-3.5 h-3.5 bg-[#B8913A] ring-4 ring-[#B8913A]/25'
                    : isPassed
                    ? 'w-2.5 h-2.5 bg-[#D4AF5A]'
                    : 'w-2.5 h-2.5 bg-[#E9E2D0] group-hover:bg-[#B8913A]/50'
                }`}
              />
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
