'use client';

import { useScrollStore } from '@/hooks/useScrollStore';
import { processSteps } from '@/data/process';

export function ProcessRail() {
  const activeSection = useScrollStore((s) => s.activeSection);

  // The 10 process steps correspond to sections 3 to 12
  const isProcessVisible = activeSection >= 2 && activeSection <= 13;
  const currentStepId = activeSection >= 3 && activeSection <= 12 ? activeSection - 2 : null;

  if (!isProcessVisible) return null;

  return (
    <aside
      aria-label="10-Step Redevelopment Timeline"
      className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-2 pointer-events-auto"
    >
      <div className="bg-navy-light/80 backdrop-blur-md p-2.5 rounded-full border border-white/10 shadow-2xl flex flex-col items-center gap-2">
        {processSteps.map((step) => {
          const isActive = currentStepId === step.id;
          const isPassed = currentStepId ? step.id < currentStepId : false;

          return (
            <a
              key={step.id}
              href={`#process-step-${step.id}`}
              className="group relative flex items-center justify-center p-1"
              aria-label={`Jump to Step ${step.id}: ${step.title}`}
            >
              {/* Tooltip on Hover */}
              <span className="absolute right-8 px-2.5 py-1 rounded bg-navy-mid/95 text-xs text-text-light font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 shadow-lg">
                Step {step.id}: {step.title}
              </span>

              {/* Indicator Dot */}
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-4 h-4 bg-gold ring-4 ring-gold/20'
                    : isPassed
                    ? 'bg-gold/60'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
