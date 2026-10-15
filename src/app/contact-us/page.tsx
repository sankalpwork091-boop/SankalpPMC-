import type { Metadata } from 'next';
import { siteConfig } from '@/data/siteConfig';
import { ConsultationSection } from '@/components/sections/ConsultationSection';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Contact Us — Head Office & Branch Advisory',
  description:
    'Connect with Sankalp Project Management Consultants in CBD Belapur and Sanpada, Navi Mumbai. Book a committee consultation or reach out directly.',
};

export default function ContactUsPage() {
  return (
    <div className="relative pt-28 pb-20">
      {/* Page Header */}
      <section className="px-6 py-16 md:py-20 text-center max-w-5xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
          Get In Touch
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
          Start Your Redevelopment Right
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted">
          Our senior advocates, architects, and project managers are ready to meet your committee. Reach us at our offices in CBD Belapur or Sanpada.
        </p>
      </section>

      {/* Office Locations Grid */}
      <section className="max-w-6xl mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {siteConfig.addresses.map((addr, i) => (
            <GlassCard key={i} variant="default" className="p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                    {addr.label}
                  </span>
                  <span className="text-xl">📍</span>
                </div>
                <h2 className="font-heading text-xl font-bold text-text-light mb-3">
                  {addr.line1}
                </h2>
                <p className="text-sm text-text-muted leading-relaxed">
                  {addr.line2}<br />
                  {addr.city}, {addr.state} — {addr.pin}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${addr.line1}, ${addr.line2}, ${addr.city} ${addr.pin}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs !py-2 text-center"
                >
                  View on Google Maps ↗
                </a>
                <a
                  href={`tel:${siteConfig.phones[i % siteConfig.phones.length].replace(/\s/g, '')}`}
                  className="btn-primary text-xs !py-2 text-center"
                >
                  Call Office
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Integrated Consultation Form Component */}
      <div className="-mt-12">
        <ConsultationSection />
      </div>
    </div>
  );
}
