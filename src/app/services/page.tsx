import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { GlassCard } from '@/components/ui/GlassCard';

export const metadata: Metadata = {
  title: 'Services — Comprehensive Redevelopment PMC',
  description:
    'End-to-end legal, architectural, engineering, construction management, liaisoning, and chartered accountancy services for housing society redevelopment in Navi Mumbai.',
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
      'Bank Guarantee & Escrow Structuring',
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
      'Escrow account management and developer bank guarantee scrutiny',
    ],
    deliverables: [
      'Comparative Financial Feasibility Matrix',
      'Tax Impact Advisory Note for Society Members',
      'Corpus Fund Security Mechanism',
      'Escrow Audit Reports',
    ],
  },
};

export default function ServicesPage() {
  return (
    <div className="relative pt-28 pb-20">
      {/* Hero */}
      <section className="px-6 py-16 md:py-20 text-center max-w-5xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
          Integrated PMC Excellence
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
          Our Advisory Services
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-text-muted">
          Redevelopment is multi-disciplinary. Sankalp PMC unifies legal certainty, architectural precision, engineering vigilance, and financial prudence so your society never has to coordinate between fragmented vendors.
        </p>
      </section>

      {/* Services List */}
      <section className="max-w-6xl mx-auto px-6 space-y-12 mb-20">
        {services.map((service, index) => {
          const detail = serviceDetails[service.id];
          const isEven = index % 2 === 0;

          return (
            <GlassCard
              key={service.id}
              variant="default"
              className="p-8 md:p-12 hover:border-gold/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Icon & Title */}
                <div className="lg:w-1/3 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-navy-mid p-3.5 border border-white/10 flex items-center justify-center mb-6">
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={44}
                      height={44}
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-light mb-3">
                    {service.title}
                  </h2>
                  <p className="text-sm text-gold font-medium leading-relaxed">
                    {service.tagline}
                  </p>
                </div>

                {/* Scope & Deliverables */}
                {detail && (
                  <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6 w-full border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-text-light font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Key Scope of Work
                      </h3>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
                        {detail.scope.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gold font-bold">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xs uppercase tracking-wider text-text-light font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                        Tangible Deliverables
                      </h3>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-text-muted">
                        {detail.deliverables.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-gold font-bold">★</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <GlassCard variant="gold" className="p-10 md:p-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-light mb-3">
            Have Questions About Any Service?
          </h2>
          <p className="text-sm text-text-muted mb-6 max-w-xl mx-auto">
            Our principal advocate and senior architects are available to present these scopes directly to your managing committee.
          </p>
          <Link href="/contact-us" className="btn-primary">
            Request Service Presentation
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
