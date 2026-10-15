'use client';

import { siteConfig } from '@/data/siteConfig';
import { GlassCard } from '@/components/ui/GlassCard';

export function PointOfDifferenceSection() {
  const pillars = [
    {
      title: 'Anticipate Legal Challenges',
      description:
        'Advocate-led oversight identifies title flaws, regulatory pitfalls, and consent hurdles before they derail progress.',
      icon: (
        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
    },
    {
      title: 'Ironclad Agreement Structuring',
      description:
        'Development Agreements & Permanent Alternate Accommodation Agreements drafted with zero ambiguities and enforceable penalties.',
      icon: (
        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Technical Discipline & Site Oversight',
      description:
        'Experienced architects and civil engineers continuously inspecting concrete grades, structural reinforcement, and MEP installations.',
      icon: (
        <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <section
      data-section="13"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
            The Sankalp Distinction
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light mb-6">
            Advocate-Led Leadership. Total Protection.
          </h2>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            {siteConfig.pointOfDifference}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <GlassCard key={i} variant="default" className="flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
                {pillar.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-text-light mb-3">
                {pillar.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                {pillar.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
