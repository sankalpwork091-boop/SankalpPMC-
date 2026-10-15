'use client';

import { siteConfig } from '@/data/siteConfig';
import { GlassCard } from '@/components/ui/GlassCard';

export function ForewordSection() {
  return (
    <section
      data-section="1"
      className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 z-10"
    >
      <div className="max-w-3xl mx-auto w-full">
        <GlassCard variant="gold" className="p-8 md:p-12 border-gold/20">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold mb-4">
            A Note from Leadership
          </p>
          <blockquote className="font-heading text-xl sm:text-2xl md:text-3xl text-text-light font-normal leading-relaxed italic mb-6">
            &ldquo;{siteConfig.foreword}&rdquo;
          </blockquote>
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-sm font-semibold text-text-light">
                Adv. Santosh Ananda Yadav
              </p>
              <p className="text-xs text-text-muted">
                Founder & Legal Head, Sankalp PMC
              </p>
            </div>
            <div className="text-gold font-serif text-2xl font-bold">
              संकल्प
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
