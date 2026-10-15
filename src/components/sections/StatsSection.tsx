'use client';

import { siteConfig } from '@/data/siteConfig';
import { GlassCard } from '@/components/ui/GlassCard';
import { Counter } from '@/components/ui/Counter';

export function StatsSection() {
  return (
    <section
      data-section="14"
      className="relative min-h-[70vh] flex items-center justify-center px-6 py-20 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
            Proven Foundation
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-light mb-4">
            Technical Scale & Dedicated Advisory
          </h2>
          <p className="text-sm sm:text-base text-text-muted">
            Depth of expertise across legal jurisprudence, architectural planning, and execution engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.stats.map((stat, i) => (
            <GlassCard key={i} variant="gold" className="text-center py-10">
              <div className="text-4xl sm:text-5xl font-heading font-bold text-gold mb-3">
                {stat.value > 0 ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  <span>Verified</span>
                )}
              </div>
              <p className="font-heading text-base font-semibold text-text-light mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                {stat.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
