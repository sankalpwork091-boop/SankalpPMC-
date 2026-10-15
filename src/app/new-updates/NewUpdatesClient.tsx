'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { updates, updateYears } from '@/data/updates';
import { GlassCard } from '@/components/ui/GlassCard';

export function NewUpdatesClient() {
  const [selectedYear, setSelectedYear] = useState<number | 'All'>('All');

  const filteredUpdates = updates.filter(
    (u) => selectedYear === 'All' || u.year === selectedYear
  );

  return (
    <div className="relative pt-28 pb-20">
      {/* Banner & Header */}
      <section className="relative px-6 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-navy-mid/60">
          <Image
            src="/images/new-updates-ban.jpg"
            alt="New Updates Banner"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/90 via-navy/95 to-navy" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
            Latest Bulletins
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
            News & Project Updates
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted">
            Stay informed on recent regulatory changes under Section 79A, project milestone achievements, and society general body resolutions.
          </p>
        </div>
      </section>

      {/* Year Filter */}
      <section className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setSelectedYear('All')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedYear === 'All'
                ? 'bg-gold text-navy shadow-lg shadow-gold/20'
                : 'bg-white/5 text-text-muted hover:text-text-light'
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
                  ? 'bg-gold text-navy shadow-lg shadow-gold/20'
                  : 'bg-white/5 text-text-muted hover:text-text-light'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* Updates Timeline List */}
      <section className="max-w-5xl mx-auto px-6 mb-20 space-y-6">
        {filteredUpdates.map((item, idx) => (
          <GlassCard
            key={item.id}
            variant="default"
            className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-gold/30 transition-all"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex flex-col items-center justify-center shrink-0 text-gold font-bold">
                <span className="text-xs uppercase font-mono">{item.year}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold font-semibold">
                  Milestone Update #{idx + 1}
                </span>
                <h2 className="font-heading text-lg sm:text-xl font-bold text-text-light mt-0.5">
                  Society General Body & Regulatory Advisory Bulletin
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Published {item.date} • General Circular
                </p>
              </div>
            </div>

            <Link
              href="/contact-us"
              className="text-xs font-semibold text-gold hover:text-gold-soft transition-colors shrink-0"
            >
              Request details →
            </Link>
          </GlassCard>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <GlassCard variant="gold" className="p-10">
          <h2 className="font-heading text-2xl font-bold text-text-light mb-3">
            Subscribe To Legal & Regulatory Redevelopment Circulars
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-xl mx-auto">
            Get prompt notifications whenever Maharashtra State housing department modifies Section 79A or redevelopment bylaws.
          </p>
          <Link href="/contact-us" className="btn-primary">
            Register for Society Circulars
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
