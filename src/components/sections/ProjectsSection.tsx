'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { GlassCard } from '@/components/ui/GlassCard';

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Ongoing' | 'Approved' | 'Completed'>('All');

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'All') return p.featured || projects.indexOf(p) < 6;
    if (activeFilter === 'Completed') return p.status === 'Completed' || p.status === 'OC received';
    if (activeFilter === 'Ongoing') return p.status === 'Ongoing' || p.status === 'Under construction';
    return p.status === activeFilter;
  });

  return (
    <section
      data-section="15"
      className="relative min-h-screen flex items-center justify-center px-6 py-24 z-10"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-2 inline-block">
              Portfolio of Trust
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-text-light">
              Featured Redevelopments
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {(['All', 'Ongoing', 'Approved', 'Completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-gold text-navy font-bold shadow-lg shadow-gold/20'
                    : 'bg-white/5 text-text-muted hover:text-text-light hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredProjects.slice(0, 6).map((project) => (
            <GlassCard
              key={project.id}
              variant="default"
              className="p-0 overflow-hidden flex flex-col group border-white/10 hover:border-gold/40 transition-all duration-500"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-navy-mid">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-80" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-navy/90 text-gold border border-gold/30 backdrop-blur-md">
                  {project.status}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-medium text-text-light/90">
                  📍 {project.location}
                </span>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-lg font-bold text-text-light mb-2 group-hover:text-gold transition-colors">
                  {project.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs text-text-muted mt-auto pt-4 border-t border-white/5">
                  <div>
                    <span className="block text-[10px] uppercase text-text-muted/70">Scale</span>
                    <span className="text-text-light font-medium">{project.size}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-text-muted/70">Format</span>
                    <span className="text-text-light font-medium">{project.configuration}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <Link href="/projects" className="btn-secondary inline-flex items-center gap-2">
            Explore All 20+ Projects
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
