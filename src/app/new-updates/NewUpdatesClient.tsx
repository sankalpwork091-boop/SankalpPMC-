'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { updates, updateYears } from '@/data/updates';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
} from '@/components/ui/ScrollReveal';

export function NewUpdatesClient() {
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');

  const filteredUpdates = updates.filter(
    (u) => selectedYear === 'All' || u.year === selectedYear
  );

  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Banner & Header (Warm Ivory) ─── */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/new-updates-ban.jpg"
            alt="New Updates Banner"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-[#FAF7F0]/90 to-[#FAF7F0]" />
        </div>

        <ScrollReveal variant="fade" className="max-w-4xl mx-auto text-center">
          <span className="section-eyebrow mb-3">
            Latest Bulletins
          </span>
          <HeadingWithGoldLine align="center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
              News & Project <span className="italic text-[#B8913A]">Updates</span>
            </h1>
          </HeadingWithGoldLine>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5B5B63] mt-4 leading-relaxed">
            Stay informed on recent regulatory changes under Section 79A, project milestone achievements, and society general body resolutions.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Year Filter (White) ─── */}
      <section className="max-w-5xl mx-auto px-6 -mt-6 relative z-20 mb-12">
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-white border border-[#E9E2D0] shadow-sm max-w-lg mx-auto">
            <button
              onClick={() => setSelectedYear('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedYear === 'All'
                  ? 'bg-gradient-to-r from-[#B8913A] to-[#D4AF5A] text-[#1B1B1F] font-bold shadow-md shadow-[#B8913A]/20'
                  : 'bg-[#FAF7F0] border border-[#E9E2D0] text-[#5B5B63] hover:text-[#8F6B1E]'
              }`}
            >
              All Years
            </button>
            {updateYears.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedYear === year
                    ? 'bg-gradient-to-r from-[#B8913A] to-[#D4AF5A] text-[#1B1B1F] font-bold shadow-md shadow-[#B8913A]/20'
                    : 'bg-[#FAF7F0] border border-[#E9E2D0] text-[#5B5B63] hover:text-[#8F6B1E]'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Updates Timeline List (Warm Ivory) ─── */}
      <section className="bg-[#FAF7F0] border-y border-[#E9E2D0] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <StaggerContainer className="space-y-6">
            {filteredUpdates.map((item, idx) => (
              <StaggerItem key={item.id}>
                <GlassCard
                  variant="default"
                  className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-[#B8913A]/50 transition-all bg-white"
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-[#FAF7F0] border border-[#D4AF5A]/30 flex flex-col items-center justify-center shrink-0 text-[#8F6B1E] font-bold shadow-sm">
                      <span className="text-sm uppercase font-mono">{item.year}</span>
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#8F6B1E] font-bold">
                        Milestone Update #{idx + 1}
                      </span>
                      <h2 className="font-heading text-lg sm:text-xl font-bold text-[#1B1B1F] mt-1">
                        Society General Body & Regulatory Advisory Bulletin
                      </h2>
                      <p className="text-xs text-[#5B5B63] mt-1">
                        Published {item.date} • General Circular
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/contact-us"
                    className="text-xs font-bold text-[#8F6B1E] hover:text-[#B8913A] transition-colors shrink-0 flex items-center gap-1 self-start sm:self-center"
                  >
                    Request details →
                  </Link>
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
                Subscribe To Legal & Regulatory Redevelopment Circulars
              </h2>
              <p className="text-xs sm:text-sm text-[#5B5B63] mb-8 max-w-xl mx-auto leading-relaxed">
                Get prompt notifications whenever Maharashtra State housing department modifies Section 79A or redevelopment bylaws.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Register for Society Circulars
              </Link>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
