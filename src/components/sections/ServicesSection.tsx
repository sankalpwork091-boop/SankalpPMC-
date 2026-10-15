'use client';

import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { GlassCard } from '@/components/ui/GlassCard';

export function ServicesSection() {
  return (
    <section
      data-section="16"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
            End-To-End Advisory
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light mb-4">
            Specialised Professional Services
          </h2>
          <p className="text-base text-text-muted">
            All technical disciplines united under one roof to give societies complete peace of mind.
          </p>
        </div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service) => (
            <GlassCard
              key={service.id}
              variant="default"
              className="group hover:border-gold/30 flex flex-col p-8 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-navy/90 p-3 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-300">
                <Image
                  src={service.icon}
                  alt={service.title}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>

              <h3 className="font-heading text-xl font-bold text-text-light mb-2 group-hover:text-gold transition-colors">
                {service.title}
              </h3>

              <p className="text-sm text-text-muted leading-relaxed flex-1">
                {service.tagline}
              </p>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center text-xs font-semibold text-gold gap-1 group-hover:translate-x-1 transition-transform">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-secondary">
            View Detailed Service Scope
          </Link>
        </div>
      </div>
    </section>
  );
}
