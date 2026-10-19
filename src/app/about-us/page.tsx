import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from '@/data/siteConfig';
import { team, teamSectionHeading, architectsHeading } from '@/data/team';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
  ImageReveal,
  AnimatedNumber,
} from '@/components/ui/ScrollReveal';

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
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Page Header Banner (Warm Ivory) ─── */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/about-us-ban.jpg"
            alt="Sankalp PMC About Us Banner"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#FAF7F0]/90 to-[#FAF7F0]" />
        </div>

        <ScrollReveal variant="fade" className="max-w-4xl mx-auto text-center">
          <span className="section-eyebrow mb-4">
            Our Purpose & Heritage
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6 tracking-tight">
            Redevelopment Handled As A <span className="italic text-[#B8913A]">Sacred Trust</span>
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#5B5B63] leading-relaxed">
            {siteConfig.foreword}
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Narrative Section (White) ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <span className="section-eyebrow mb-3">
              Why We Exist
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B1B1F] mb-6">
              A Legal-First Shield for Housing Societies
            </h2>
            <div className="space-y-4 text-[#5B5B63] text-base leading-relaxed">
              <p>{siteConfig.pointOfDifference}</p>
              <p>{siteConfig.coreBelief}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <GlassCard variant="gold" className="p-8 md:p-10">
              <div className="text-[#B8913A] font-serif text-3xl font-bold mb-4">
                संकल्प
              </div>
              <h3 className="font-heading text-xl font-bold text-[#1B1B1F] mb-3">
                The Sole PMC Built From The Inside Out By Legal Specialists
              </h3>
              <p className="text-sm text-[#5B5B63] leading-relaxed mb-6">
                Most consultants only review drawings; we scrutinize title chains, drafting clauses, financial escrow terms, and Section 79A government compliance to guarantee your society is immune to developer abandonment.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#E9E2D0] text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E9E2D0]">
                  <span className="block font-heading text-2xl font-bold text-[#8F6B1E]">
                    <AnimatedNumber value={29} suffix="+" />
                  </span>
                  <span className="text-[#5B5B63]">Registered Development Agreements</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E9E2D0]">
                  <span className="block font-heading text-2xl font-bold text-[#8F6B1E]">
                    <AnimatedNumber value={30} suffix="+" />
                  </span>
                  <span className="text-[#5B5B63]">Section 79A Compliances</span>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Leadership Team (Warm Ivory) ─── */}
      <section className="bg-[#FAF7F0] border-y border-[#E9E2D0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="section-eyebrow mb-2">
              Visionary Guidance
            </span>
            <HeadingWithGoldLine align="center">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#1B1B1F]">
                {teamSectionHeading}
              </h2>
            </HeadingWithGoldLine>
          </ScrollReveal>

          <div className="max-w-2xl mx-auto">
            <StaggerContainer className="flex justify-center">
              {leadership.map((member) => (
                <StaggerItem key={member.id} className="w-full">
                  <GlassCard variant="default" className="flex flex-col sm:flex-row gap-6 p-6 md:p-8 h-full">
                    <div className="relative w-32 h-40 sm:w-40 sm:h-48 shrink-0 rounded-xl overflow-hidden bg-white border border-[#E9E2D0] shadow-sm">
                      <ImageReveal>
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 128px, 160px"
                        />
                      </ImageReveal>
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="mb-3">
                        <h3 className="font-heading text-xl font-bold text-[#1B1B1F]">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#8F6B1E] mt-0.5">
                          {member.title} {member.qualifications && `• ${member.qualifications}`}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-[#5B5B63] leading-relaxed mb-4 flex-1">
                        {member.bio}
                      </p>
                      {member.awards && member.awards.length > 0 && (
                        <div className="pt-3 border-t border-[#E9E2D0] flex items-center gap-2">
                          <span className="text-sm">🏆</span>
                          <span className="text-xs text-[#8F6B1E] font-medium">
                            {member.awards.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─── Technical Leadership (White) ─── */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="section-eyebrow mb-2">
              Engineering & Architecture Board
            </span>
            <HeadingWithGoldLine align="center">
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F]">
                Technical Leadership
              </h3>
            </HeadingWithGoldLine>
            <p className="text-sm text-[#5B5B63] mt-4">
              {architectsHeading}
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalTeam.map((member) => (
              <StaggerItem key={member.id}>
                <GlassCard variant="default" className="text-center p-6 flex flex-col items-center h-full">
                  <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-white border border-[#E9E2D0] shadow-sm mb-4">
                    <ImageReveal>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </ImageReveal>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-[#1B1B1F] mb-1">
                    {member.name}
                  </h4>
                  <p className="text-xs text-[#8F6B1E] font-medium">
                    {member.title || 'Architectural & Execution Expert'}
                  </p>
                  {member.qualifications && (
                    <p className="text-[11px] text-[#5B5B63] mt-1">
                      {member.qualifications}
                    </p>
                  )}
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA Banner (Warm Ivory Card) ─── */}
      <section className="bg-[#FAF7F0] border-t border-[#E9E2D0] py-16 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <GlassCard variant="gold" className="p-10 md:p-14">
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#1B1B1F] mb-4">
                Protect Your Society&apos;s Biggest Milestone
              </h2>
              <p className="text-sm sm:text-base text-[#5B5B63] max-w-2xl mx-auto mb-8 leading-relaxed">
                Speak directly with Adv. Santosh Yadav and our senior technical consultants to evaluate your society’s potential.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Schedule Committee Consultation
              </Link>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
