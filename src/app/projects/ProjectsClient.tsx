'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HeadingWithGoldLine,
} from '@/components/ui/ScrollReveal';

export function ProjectsClient() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Ongoing', 'Approved', 'Under construction', 'Completed'];

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'Completed'
        ? project.status === 'Completed' || project.status === 'OC received'
        : activeFilter === 'Ongoing'
        ? project.status === 'Ongoing' || project.status === 'Under construction'
        : project.status === activeFilter;

    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.developer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="relative pt-24 pb-20 bg-white text-[#1B1B1F]">
      {/* ─── Hero Header (Warm Ivory) ─── */}
      <section className="px-6 py-20 md:py-28 text-center bg-[#FAF7F0] border-b border-[#E9E2D0]">
        <ScrollReveal className="max-w-4xl mx-auto">
          <span className="section-eyebrow mb-3">
            Delivered & Ongoing Excellence
          </span>
          <HeadingWithGoldLine align="center">
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-[#1B1B1F] mb-6">
              Our Redevelopment <span className="italic text-[#B8913A]">Portfolio</span>
            </h1>
          </HeadingWithGoldLine>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#5B5B63] mt-4 leading-relaxed">
            From residential high-rises to commercial complexes, explore how Sankalp PMC brings certainty and architectural distinction to every society.
          </p>
        </ScrollReveal>
      </section>

      {/* ─── Filter and Search Bar (White) ─── */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 mb-12">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E9E2D0] shadow-[0_8px_30px_rgba(143,107,30,0.06)]">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-[#B8913A] to-[#D4AF5A] text-[#1B1B1F] font-bold shadow-md shadow-[#B8913A]/20'
                      : 'bg-[#FAF7F0] border border-[#E9E2D0] text-[#5B5B63] hover:text-[#8F6B1E] hover:border-[#B8913A]/40'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72">
              <input
                type="text"
                placeholder="Search by society, location, developer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-[#E9E2D0] text-xs text-[#1B1B1F] placeholder:text-[#5B5B63]/60 focus:outline-none focus:ring-2 focus:ring-[#D4AF5A] transition-all"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Projects Grid (Warm Ivory Section) ─── */}
      <section className="bg-[#FAF7F0] border-y border-[#E9E2D0] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <StaggerItem key={project.id}>
                <GlassCard
                  variant="default"
                  className="p-0 overflow-hidden flex flex-col group hover:border-[#B8913A]/60 transition-all duration-300 h-full"
                >
                  {/* Project Image: Natural Colors */}
                  <div className="relative aspect-[16/10] bg-white overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-[#8F6B1E] border border-[#E9E2D0] shadow-sm">
                      {project.status}
                    </span>
                    <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow-md">
                      📍 {project.location}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="p-6 flex flex-col flex-1 bg-white">
                    <h2 className="font-heading text-xl font-bold text-[#1B1B1F] mb-3 group-hover:text-[#8F6B1E] transition-colors">
                      {project.name}
                    </h2>

                    <div className="space-y-2 text-xs text-[#5B5B63] mb-6 flex-1">
                      {project.developer && (
                        <p>
                          <strong className="text-[#1B1B1F] font-semibold">Developer: </strong>
                          {project.developer}
                        </p>
                      )}
                      {project.configuration && (
                        <p>
                          <strong className="text-[#1B1B1F] font-semibold">Configuration: </strong>
                          {project.configuration}
                        </p>
                      )}
                      {project.startYear && (
                        <p>
                          <strong className="text-[#1B1B1F] font-semibold">Year: </strong>
                          {project.startYear}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#E9E2D0] flex items-center justify-between text-xs">
                      <span className="text-[#5B5B63] uppercase tracking-wider text-[11px] font-medium">Scale</span>
                      <span className="text-[#8F6B1E] font-bold text-sm">{project.size}</span>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-base text-[#5B5B63]">No projects found matching your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA (White) ─── */}
      <section className="bg-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <GlassCard variant="gold" className="p-10 md:p-14">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
                Want to see your society featured here?
              </h2>
              <p className="text-xs sm:text-sm text-[#5B5B63] mb-8 max-w-xl mx-auto leading-relaxed">
                Book an obligation-free presentation for your managing committee.
              </p>
              <Link href="/contact-us" className="btn-primary">
                Request Society Assessment
              </Link>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
