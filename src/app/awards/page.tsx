import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { awards, awardHighlights } from '@/data/awards';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
  ImageReveal,
} from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Awards & Industry Recognition — Sankalp PMC',
  description:
    'Explore the awards, honors, and industry recognitions received by Sankalp PMC, including The Great Legal Minds by Lokmat and World Architecture Awards.',
  alternates: { canonical: '/awards' },
  openGraph: {
    url: '/awards',
    title: 'Awards & Honors — Sankalp PMC',
    description:
      'Recognitions including The Great Legal Minds by Lokmat and World Architecture Awards.',
    images: [{ url: '/images/awards-banner.jpg', width: 1200, height: 630, alt: 'Sankalp PMC Awards' }],
  },
};

export default function AwardsPage() {
  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Hero Header (Warm Ivory) ─── */}
      <section className="px-6 py-20 md:py-28 text-center bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <ScrollReveal variant="fade" className="max-w-4xl mx-auto">
          <span className="section-eyebrow mb-3">
            Industry Recognition
          </span>
          <HeadingWithGoldLine align="center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
              Honors & <span className="italic text-[#B8913A]">Achievements</span>
            </h1>
          </HeadingWithGoldLine>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5B5B63] mt-4 leading-relaxed">
            Our dedication to legal integrity, architectural innovation, and transformative redevelopment advisory recognized on national and global stages.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Featured Award Highlights (White) ─── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awardHighlights.map((highlight, idx) => (
            <StaggerItem key={idx}>
              <GlassCard variant="gold" className="flex items-center gap-5 p-6 md:p-8 h-full bg-[#FAF7F0]">
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#D4AF5A]/30 flex items-center justify-center shrink-0 text-3xl shadow-sm">
                  🏆
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8F6B1E] font-bold">
                    Distinguished Honor
                  </span>
                  <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1B1B1F] mt-1">
                    {highlight}
                  </h2>
                </div>
              </GlassCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* ─── Awards Gallery (Warm Ivory) ─── */}
      <section className="bg-[#FAF7F0] border-y border-[#E9E2D0] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-14">
            <span className="section-eyebrow mb-2">
              Distinguished Curation
            </span>
            <HeadingWithGoldLine align="center">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F]">
                Recognition Gallery
              </h2>
            </HeadingWithGoldLine>
            <p className="text-sm text-[#5B5B63] mt-3">
              Moments of felicitations, symposium keynotes, and architectural citations.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award) => (
              <StaggerItem key={award.id}>
                <GlassCard
                  variant="default"
                  className="p-0 overflow-hidden flex flex-col group hover:border-[#B8913A]/50 transition-all duration-300 h-full bg-white"
                >
                  <div className="relative aspect-[4/3] bg-white overflow-hidden">
                    <ImageReveal>
                      <Image
                        src={award.image}
                        alt={`Sankalp PMC Award ${award.number}`}
                        fill
                        className={`${award.objectFit === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
                        style={award.imagePosition ? { objectPosition: award.imagePosition } : undefined}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </ImageReveal>
                  </div>
                  <div className="p-5 flex items-center justify-between bg-white border-t border-[#E9E2D0]">
                    <div>
                      <span className="text-[11px] font-bold text-[#8F6B1E]">
                        Award Citation #{award.number}
                      </span>
                      <p className="text-xs text-[#5B5B63]">Industry Recognition</p>
                    </div>
                    <span className="text-base">🏅</span>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── CTA (White) ─── */}
      <section className="bg-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <GlassCard variant="gold" className="p-10 md:p-14">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
                Partner With Award-Winning Redevelopment Consultants
              </h2>
              <p className="text-xs sm:text-sm text-[#5B5B63] mb-8 max-w-xl mx-auto leading-relaxed">
                Experience the difference of working with recognized legal minds and master architects.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Connect With Our Team
              </Link>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
