'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { GlassCard } from '@/components/ui/GlassCard';

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
    <div className="relative pt-28 pb-20">
      {/* Hero Header */}
      <section className="px-6 py-16 md:py-20 text-center max-w-5xl mx-auto">
        <span className="text-xs uppercase tracking-widest text-gold font-semibold mb-3 inline-block">
          Delivered & Ongoing Excellence
        </span>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-light mb-6">
          Our Redevelopment Portfolio
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-text-muted">
          From residential high-rises to commercial complexes, explore how Sankalp PMC brings certainty and architectural distinction to every society.
        </p>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-navy-light/40 border border-white/10 backdrop-blur-md">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === filter
                    ? 'bg-gold text-navy shadow-lg shadow-gold/20'
                    : 'bg-white/5 text-text-muted hover:text-text-light hover:bg-white/10'
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
              className="w-full px-4 py-2 rounded-xl bg-navy/80 border border-white/10 text-xs text-text-light placeholder:text-text-muted/60 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <GlassCard
              key={project.id}
              variant="default"
              className="p-0 overflow-hidden flex flex-col group hover:border-gold/40 transition-all duration-500"
            >
              {/* Project Image */}
              <div className="relative aspect-[16/10] bg-navy-mid overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold bg-navy/90 text-gold border border-gold/30 backdrop-blur-md">
                  {project.status}
                </span>
                <span className="absolute bottom-3 left-4 text-xs font-medium text-text-light/90">
                  📍 {project.location}
                </span>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col flex-1">
                <h2 className="font-heading text-xl font-bold text-text-light mb-3 group-hover:text-gold transition-colors">
                  {project.name}
                </h2>

                <div className="space-y-2 text-xs text-text-muted mb-6 flex-1">
                  {project.developer && (
                    <p>
                      <strong className="text-text-light font-medium">Developer: </strong>
                      {project.developer}
                    </p>
                  )}
                  {project.configuration && (
                    <p>
                      <strong className="text-text-light font-medium">Configuration: </strong>
                      {project.configuration}
                    </p>
                  )}
                  {project.startYear && (
                    <p>
                      <strong className="text-text-light font-medium">Year: </strong>
                      {project.startYear}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-text-muted">Scale</span>
                  <span className="text-gold font-bold">{project.size}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-base text-text-muted">No projects found matching your search criteria.</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <GlassCard variant="gold" className="p-10">
          <h2 className="font-heading text-2xl font-bold text-text-light mb-3">
            Want to see your society featured here?
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mb-6 max-w-xl mx-auto">
            Book an obligation-free presentation for your managing committee.
          </p>
          <Link href="/contact-us" className="btn-primary">
            Request Society Assessment
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
