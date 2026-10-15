import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import { team, teamSectionHeading, architectsHeading } from '@/data/team';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'About Us — Leadership & Advocate-Led Philosophy',
  description:
    'Learn about Sankalp PMC: our advocate-led leadership, legal safeguarding, and veteran architectural and engineering team guiding housing society redevelopments across Navi Mumbai.',
  openGraph: {
    title: 'About Sankalp PMC — Advocate-Led Redevelopment Consultancy',
    description:
      'Learn about Sankalp PMC: our advocate-led leadership, legal safeguarding, and veteran architectural and engineering team in Navi Mumbai.',
    images: [{ url: '/images/about-us-ban.jpg', width: 1200, height: 630, alt: 'About Sankalp PMC' }],
  },
};

export default function AboutUsPage() {
  const leadership = team.filter((m) => m.category === 'leadership');
  const technicalTeam = team.filter((m) => m.category === 'architect-engineer');

  return (
    <div className="relative pt-28 pb-20">
      {/* Page Header */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-navy-mid/60">
          <Image
            src="/images/about-us-ban.jpg"
            alt="Sankalp PMC About Us Banner"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-navy" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
            Our Purpose & Heritage
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
            Redevelopment Handled As A Sacred Trust
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed">
            {siteConfig.foreword}
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
              Why We Exist
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-light mb-6">
              A Legal-First Shield for Housing Societies
            </h2>
            <div className="space-y-4 text-text-muted text-base leading-relaxed">
              <p>
                {siteConfig.pointOfDifference}
              </p>
              <p>
                {siteConfig.coreBelief}
              </p>
            </div>
          </div>

          <div className="relative">
            <GlassCard variant="gold" className="p-8 md:p-10 border-gold/30">
              <div className="text-gold font-serif text-3xl font-bold mb-4">
                संकल्प
              </div>
              <h3 className="font-heading text-xl font-bold text-text-light mb-3">
                The Sole PMC Built From The Inside Out By Legal Specialists
              </h3>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                Most consultants only review drawings; we scrutinize title chains, drafting clauses, financial escrow terms, and Section 79A government compliance to guarantee your society is immune to developer abandonment.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs">
                <div>
                  <span className="block font-heading text-xl font-bold text-gold">29+</span>
                  <span className="text-text-muted">Registered Development Agreements</span>
                </div>
                <div>
                  <span className="block font-heading text-xl font-bold text-gold">30+</span>
                  <span className="text-text-muted">Section 79A Compliances</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
            Visionary Guidance
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-text-light">
            {teamSectionHeading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {leadership.map((member) => (
            <GlassCard key={member.id} variant="default" className="flex flex-col sm:flex-row gap-6 p-6 md:p-8">
              <div className="relative w-32 h-40 sm:w-40 sm:h-48 shrink-0 rounded-xl overflow-hidden bg-navy-mid border border-white/10">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="mb-3">
                  <h3 className="font-heading text-xl font-bold text-text-light">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-gold">
                    {member.title} {member.qualifications && `• ${member.qualifications}`}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4 flex-1">
                  {member.bio}
                </p>
                {member.awards && member.awards.length > 0 && (
                  <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                    <span className="text-xs text-gold">🏆</span>
                    <span className="text-xs text-text-light/90 font-medium">
                      {member.awards.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Architect & Engineers */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
            Engineering & Architecture Board
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-text-light mb-3">
            Technical Leadership
          </h3>
          <p className="text-sm text-text-muted">
            {architectsHeading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {technicalTeam.map((member) => (
            <GlassCard key={member.id} variant="default" className="text-center p-6 flex flex-col items-center">
              <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-navy-mid border border-white/10 mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="font-heading text-lg font-bold text-text-light mb-1">
                {member.name}
              </h4>
              <p className="text-xs text-gold font-medium">
                {member.title || 'Architectural & Execution Expert'}
              </p>
              {member.qualifications && (
                <p className="text-[11px] text-text-muted mt-1">
                  {member.qualifications}
                </p>
              )}
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <GlassCard variant="gold" className="p-10 md:p-14">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-text-light mb-4">
            Protect Your Society&apos;s Biggest Milestone
          </h2>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto mb-8">
            Speak directly with Adv. Santosh Yadav and our senior technical consultants to evaluate your society’s potential.
          </p>
          <Link href="/contact-us" className="btn-primary">
            Schedule Committee Consultation
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
