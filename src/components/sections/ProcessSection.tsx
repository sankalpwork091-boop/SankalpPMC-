'use client';

import Image from 'next/image';
import { processSteps } from '@/data/process';
import { GlassCard } from '@/components/ui/GlassCard';

export function ProcessSection() {
  return (
    <div className="relative z-10">
      {/* Intro Header */}
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-8 text-center">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
          The 10-Step Transformation
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light mb-4">
          A Disciplined, Legally-Protected Journey
        </h2>
        <p className="max-w-2xl mx-auto text-base text-text-muted">
          From first committee resolution to handing over keys to your new home,
          watch how your society transforms through each milestone.
        </p>
      </div>

      {/* 10 Pinned Story Steps */}
      {processSteps.map((step, idx) => {
        const sectionNumber = step.id + 2; // sections 3 through 12
        const isEven = idx % 2 === 0;

        return (
          <section
            key={step.id}
            id={`process-step-${step.id}`}
            data-section={sectionNumber}
            className="min-h-screen flex items-center justify-center px-6 py-16"
          >
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Step Info Card (alternates left/right on desktop to give room to 3D model) */}
              <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                <GlassCard variant="gold" className="border-gold/30">
                  {/* Step Badge & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold text-xs font-mono font-bold tracking-wider">
                      STEP {step.id < 10 ? `0${step.id}` : step.id} / 10
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-navy/80 p-2 border border-white/10 flex items-center justify-center">
                      <Image
                        src={step.icon}
                        alt={step.title}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-light mb-4">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Legal Safeguard Bullet */}
                  <div className="p-3.5 rounded-xl bg-navy/60 border border-white/5 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs text-text-light/90 leading-normal">
                      <strong className="text-gold font-medium">Sankalp Safeguard: </strong>
                      Ensuring complete transparency, stringent compliance, and legal shielding for every member.
                    </p>
                  </div>
                </GlassCard>
              </div>

              {/* Spacer column giving focus to the 3D model */}
              <div className={`${isEven ? 'md:order-2' : 'md:order-1'} hidden md:block`} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
