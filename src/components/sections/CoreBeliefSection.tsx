'use client';

import { siteConfig } from '@/data/siteConfig';
import { GlassCard } from '@/components/ui/GlassCard';

export function CoreBeliefSection() {
  return (
    <section
      data-section="2"
      className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 z-10"
    >
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Core Belief Card */}
        <GlassCard variant="default">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold mb-5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-light mb-3">
            Built on Unshakable Trust
          </h2>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            {siteConfig.coreBelief}
          </p>
        </GlassCard>

        {/* The Root Cause of Delays */}
        <GlassCard variant="gold">
          <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold mb-5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-text-light mb-3">
            Why Conventional Projects Stall
          </h2>
          <p className="text-sm sm:text-base text-gold-soft leading-relaxed font-medium">
            {siteConfig.delaysFraming}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
