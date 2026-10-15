'use client';

import dynamic from 'next/dynamic';
import { Fallback2D } from '@/components/three/Fallback2D';

const Scene = dynamic(
  () => import('@/components/three/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => <Fallback2D activeSection={0} progress={0} />,
  }
);
import { ScrollObserver } from '@/components/scroll/ScrollObserver';
import { ProcessRail } from '@/components/scroll/ProcessRail';
import { HeroSection } from '@/components/sections/HeroSection';
import { ForewordSection } from '@/components/sections/ForewordSection';
import { CoreBeliefSection } from '@/components/sections/CoreBeliefSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { PointOfDifferenceSection } from '@/components/sections/PointOfDifferenceSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ConsultationSection } from '@/components/sections/ConsultationSection';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* 3D Background Canvas Layer */}
      <Scene />

      {/* GSAP ScrollTrigger & Timeline Observer */}
      <ScrollObserver />

      {/* Floating 10-Step Timeline Indicator */}
      <ProcessRail />

      {/* Main Narrative Scroll Story (Sections 0 to 17) */}
      <div className="relative z-10">
        <HeroSection />
        <ForewordSection />
        <CoreBeliefSection />
        <ProcessSection />
        <PointOfDifferenceSection />
        <StatsSection />
        <ProjectsSection />
        <ServicesSection />
        <ConsultationSection />
      </div>
    </div>
  );
}
