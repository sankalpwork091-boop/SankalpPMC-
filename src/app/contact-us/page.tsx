import type { Metadata } from 'next';
import { siteConfig } from '@/data/siteConfig';
import { ConsultationSection } from '@/components/sections/ConsultationSection';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
} from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Contact Us — Head Office',
  description:
    'Connect with Sankalp Project Management Consultants in Sanpada, Navi Mumbai. Book a committee consultation or reach out directly.',
  alternates: { canonical: '/contact-us' },
  openGraph: {
    url: '/contact-us',
    title: 'Contact Sankalp PMC — Sanpada Office',
    description:
      'Connect with our senior advocates and redevelopment architects. Schedule a managing committee consultation.',
    images: [{ url: '/images/logo.png', width: 400, height: 400, alt: 'Sankalp PMC Contact' }],
  },
};

export default function ContactUsPage() {
  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Page Header (Warm Ivory) ─── */}
      <section className="px-6 py-20 md:py-28 text-center bg-[#F6F0E3] border-b border-[#E9E2D0]">
        <ScrollReveal variant="fade" className="max-w-4xl mx-auto">
          <span className="section-eyebrow mb-3">
            Get In Touch
          </span>
          <HeadingWithGoldLine align="center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
              Start Your Redevelopment <span className="italic text-[#B8913A]">Right</span>
            </h1>
          </HeadingWithGoldLine>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5B5B63] mt-4 leading-relaxed">
            Our senior advocates, architects, and project managers are ready to meet your committee. Reach us at our office in Sanpada.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Office Locations Grid (White) ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-xl mx-auto">
          <StaggerContainer className="flex justify-center">
            {siteConfig.addresses.map((addr, i) => (
              <StaggerItem key={i} className="w-full">
                <GlassCard variant="default" className="p-8 flex flex-col justify-between h-full bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-[#8F6B1E] uppercase tracking-wider bg-[#F6EFDD] px-3 py-1 rounded-full border border-[#D4AF5A]/30">
                        {addr.label}
                      </span>
                      <span className="text-xl">📍</span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-[#1B1B1F] mb-3">
                      {addr.line1}
                    </h2>
                    <p className="text-sm text-[#5B5B63] leading-relaxed">
                      {addr.line2}<br />
                      {addr.city}, {addr.state} — {addr.pin}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E9E2D0] flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${addr.line1}, ${addr.line2}, ${addr.city} ${addr.pin}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs !py-2.5 text-center flex-1"
                    >
                      View on Google Maps ↗
                    </a>
                    <a
                      href={`tel:${siteConfig.phones[i % siteConfig.phones.length].replace(/\s/g, '')}`}
                      className="btn-primary text-xs !py-2.5 text-center flex-1"
                    >
                      Call Office
                    </a>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Integrated Consultation Form Component (Warm Ivory) ─── */}
      <div>
        <ConsultationSection />
      </div>
    </div>
  );
}
