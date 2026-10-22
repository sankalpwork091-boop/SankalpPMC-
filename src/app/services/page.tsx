import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
} from '@/components/ui/ScrollReveal';

export const metadata: Metadata = {
  title: 'Services — Comprehensive Redevelopment PMC',
  description:
    'End-to-end legal, architectural, engineering, construction management, liaisoning, and chartered accountancy services for housing society redevelopment in Navi Mumbai.',
  openGraph: {
    title: 'Advisory & PMC Services — Sankalp PMC',
    description:
      'Legal, architectural, engineering, construction management, liaisoning, and financial services under one roof.',
    images: [{ url: '/images/services.jpg', width: 1200, height: 630, alt: 'Sankalp PMC Services' }],
  },
};

const serviceDetails: Record<
  string,
  {
    scope: string[];
    deliverables: string[];
  }
> = {
  legal: {
    scope: [
      'Verification of society title deeds, 7/12 extracts, and property cards',
      'Comprehensive Section 79A guideline compliance and Registrar liaison',
      'Drafting of Tender Documents, Development Agreements, and Power of Attorney',
      'Execution of Permanent Alternate Accommodation Agreements (PAAA) for every flat owner',
    ],
    deliverables: [
      'Title Clearance Certificate',
      'Customized Tender Document & Bid Format',
      'Registered Development Agreement with strict default penalties',
      'Bank Guarantee & Project Account Structuring',
    ],
  },
  architectural: {
    scope: [
      'Detailed site survey, topography, and FSI/TDR potential calculation',
      'Preparation of multiple conceptual floor layouts, podium elevations, and 3D renderings',
      'Member-level flat entitlement calculation and optimal carpet area planning',
      'Green building features, solar orientation, and Vastu-compliant layout options',
    ],
    deliverables: [
      'Architectural Feasibility Report',
      'Comprehensive 3D Massing & Floor Plans',
      'Tender Architectural Drawings',
      'Municipal Approval Drawings',
    ],
  },
  construction: {
    scope: [
      'Full-time on-site civil engineers monitoring day-to-day work',
      'Third-party material testing for steel, concrete cube strength, and waterproofing',
      'Bar-chart scheduling, critical path analysis, and milestone compliance audits',
      'Safety audits, labor welfare compliances, and site security protocols',
    ],
    deliverables: [
      'Monthly Technical Audit Reports for Society Committee',
      'Material Test Validation Certificates',
      'Contractor Milestone Verification before payment release',
      'Snag List Inspection before Flat Handover',
    ],
  },
  'design-execution': {
    scope: [
      'Coordination between structural engineers, MEP specialists, and interior designers',
      'Double-height entrance lobby styling, landscape architecture, and amenities design',
      'Façade lighting, signage design, and boundary security integration',
      'Finishing specifications verification (tiles, elevators, electrical fittings, plumbing fixtures)',
    ],
    deliverables: [
      'MEP & Structural Coordination Drawings',
      'Specification Booklets for Developers',
      'Sample Flat Audit Report',
      'Handover Quality Manual',
    ],
  },
  liaisoning: {
    scope: [
      'Statutory sanction coordination with NMMC, CIDCO, MMRDA, and MCGM',
      'Fire Department NOC, Tree Authority permissions, and Traffic clearances',
      'Commencement Certificate (CC), Plinth Checking, and Water connection approvals',
      'Securing final Occupancy Certificate (OC) and Building Completion Certificate (BCC)',
    ],
    deliverables: [
      'Clearance Tracking Roadmap',
      'Statutory Permission Files',
      'Commencement Certificate (CC)',
      'Final Occupancy Certificate (OC)',
    ],
  },
  financial: {
    scope: [
      'Feasibility evaluation of developer bids, corpus funds, and rent compensation',
      'Capital Gains Tax and Income Tax advice for society and individual flat owners',
      'GST audit and input tax credit optimization on redevelopment',
      'Dedicated project account management and developer bank guarantee scrutiny',
    ],
    deliverables: [
      'Comparative Financial Feasibility Matrix',
      'Tax Impact Advisory Note for Society Members',
      'Corpus Fund Security Mechanism',
      'Project Account Audit Reports',
    ],
  },
};

export default function ServicesPage() {
  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Hero Header (Warm Ivory) ─── */}
      <section className="px-6 py-20 md:py-28 text-center bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <ScrollReveal variant="fade" className="max-w-4xl mx-auto">
          <span className="section-eyebrow mb-3">
            Integrated PMC Excellence
          </span>
          <HeadingWithGoldLine align="center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
              Our Advisory <span className="italic text-[#B8913A]">Services</span>
            </h1>
          </HeadingWithGoldLine>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-[#5B5B63] leading-relaxed mt-4">
            Redevelopment is multi-disciplinary. Sankalp PMC unifies legal certainty, architectural precision, engineering vigilance, and financial prudence so your society never has to coordinate between fragmented vendors.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Services List (White) ─── */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-10">
        {services.map((service, index) => {
          const detail = serviceDetails[service.id];
          const isEven = index % 2 === 0;

          return (
            <ScrollReveal key={service.id}>
              <GlassCard
                variant={isEven ? 'default' : 'soft'}
                className="p-8 md:p-12 hover:border-[#B8913A]/50 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                  {/* Icon & Title */}
                  <div className="lg:w-1/3 shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-white p-3.5 border border-[#E9E2D0] shadow-sm flex items-center justify-center mb-6">
                      <Image
                        src={service.icon}
                        alt={service.title}
                        width={44}
                        height={44}
                        className="w-11 h-11 object-contain"
                      />
                    </div>
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
                      {service.title}
                    </h2>
                    <p className="text-sm text-[#8F6B1E] font-medium leading-relaxed">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Scope & Deliverables */}
                  {detail && (
                    <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-t lg:border-t-0 lg:border-l border-[#E9E2D0] pt-6 lg:pt-0 lg:pl-8">
                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-[#1B1B1F] font-bold mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#B8913A]" />
                          Key Scope of Work
                        </h3>
                        <ul className="space-y-3 text-xs sm:text-sm text-[#5B5B63]">
                          {detail.scope.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="text-[#8F6B1E] font-bold shrink-0">✓</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xs uppercase tracking-wider text-[#1B1B1F] font-bold mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#B8913A]" />
                          Tangible Deliverables
                        </h3>
                        <ul className="space-y-3 text-xs sm:text-sm text-[#5B5B63]">
                          {detail.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <span className="text-[#8F6B1E] font-bold shrink-0">★</span>
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </ScrollReveal>
          );
        })}
      </section>

      {/* ─── CTA (Warm Ivory) ─── */}
      <section className="bg-[#FAF7F0] border-t border-[#E9E2D0] py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <GlassCard variant="gold" className="p-10 md:p-14">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
                Have Questions About Any Service?
              </h2>
              <p className="text-sm text-[#5B5B63] mb-8 max-w-xl mx-auto leading-relaxed">
                Our principal advocate and senior architects are available to present these scopes directly to your managing committee.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Request Service Presentation
              </Link>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
