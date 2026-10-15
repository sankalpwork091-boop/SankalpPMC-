import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { awards, awardHighlights } from '@/data/awards';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Awards & Industry Recognition — Sankalp PMC',
  description:
    'Explore the awards, honors, and industry recognitions received by Sankalp PMC, including The Great Legal Minds by Lokmat and World Architecture Awards.',
  openGraph: {
    title: 'Awards & Honors — Sankalp PMC',
    description:
      'Recognitions including The Great Legal Minds by Lokmat and World Architecture Awards.',
    images: [{ url: '/images/awards-banner.jpg', width: 1200, height: 630, alt: 'Sankalp PMC Awards' }],
  },
};

export default function AwardsPage() {
  return (
    <div className="relative pt-28 pb-20">
      {/* Hero Header */}
      <section className="px-6 py-16 md:py-20 text-center max-w-5xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
          Industry Recognition
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
          Honors & Achievements
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted">
          Our dedication to legal integrity, architectural innovation, and transformative redevelopment advisory recognized on national and global stages.
        </p>
      </section>

      {/* Featured Award Highlights */}
      <section className="max-w-5xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awardHighlights.map((highlight, idx) => (
            <GlassCard key={idx} variant="gold" className="flex items-center gap-5 p-6 md:p-8">
              <div className="w-14 h-14 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center shrink-0 text-3xl">
                🏆
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold">
                  Distinguished Honor
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-text-light mt-1">
                  {highlight}
                </h2>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Awards Gallery */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-light mb-2">
            Recognition Gallery
          </h2>
          <p className="text-xs text-text-muted">
            Moments of felicitations, symposium keynotes, and architectural citations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award, index) => (
            <GlassCard
              key={award.id}
              variant="default"
              className="p-0 overflow-hidden flex flex-col group hover:border-gold/30 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] bg-navy-mid overflow-hidden">
                <Image
                  src={award.image}
                  alt={`Sankalp PMC Award ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-60" />
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-gold">Award Citation #{index + 1}</span>
                  <p className="text-xs text-text-muted">Industry Recognition</p>
                </div>
                <span className="text-sm">🏅</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <GlassCard variant="gold" className="p-10">
          <h2 className="font-heading text-2xl font-bold text-text-light mb-3">
            Partner With Award-Winning Redevelopment Consultants
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-xl mx-auto">
            Experience the difference of working with recognized legal minds and master architects.
          </p>
          <Link href="/contact-us" className="btn-primary">
            Connect With Our Team
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
