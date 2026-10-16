'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PinwheelLoader } from '@/components/ui/PinwheelLoader';
import { ENABLE_3D_BUILDING_HERO } from '@/config/hero3d';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Dynamic import 3D Interactive Building with SSR disabled
const GanpatiBuilding3D = dynamic(
  () => import('@/components/hero/GanpatiBuilding3D'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0c1421] gap-3">
        <PinwheelLoader size="xl" label="Loading 3D Architectural Transformation..." />
      </div>
    ),
  }
);

export function BuildingTransformationHero() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef<number>(0);

  // Fast direct DOM refs to avoid 60fps React re-renders
  const skySunsetRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressPercentRef = useRef<HTMLSpanElement>(null);
  const milestoneStepRef = useRef<HTMLSpanElement>(null);
  const milestoneTitleRef = useRef<HTMLSpanElement>(null);
  const initialPromptRef = useRef<HTMLDivElement>(null);
  const climaxCardRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isKillSwitched, setIsKillSwitched] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const towerImageRef = useRef<HTMLImageElement | null>(null);

  // 1. Check Kill-Switch & WebGL capability
  useEffect(() => {
    // Check URL override: ?no3dbuilding=true
    if (
      !ENABLE_3D_BUILDING_HERO ||
      (typeof window !== 'undefined' && window.location.search.includes('no3dbuilding=true'))
    ) {
      setIsKillSwitched(true);
    }

    // Check WebGL availability
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  // 2. Viewport & Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 3. Pause off-screen rendering via IntersectionObserver
  useEffect(() => {
    const el = pinWrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 4. Preload 2D fallback assets (only used if 3D is disabled or unsupported)
  useEffect(() => {
    const towerImg = new window.Image();
    towerImg.src = '/ref/ganpati-final.jpg';
    towerImg.onload = () => setImagesLoaded(true);
    towerImg.onerror = () => {
      // Fallback to existing asset if ref is not accessible
      towerImg.src = '/assets/ganpati-tower.jpg';
    };
    towerImageRef.current = towerImg;
  }, []);

  // 2D Canvas Fallback Drawing Routine
  const drawFallback2D = useCallback((p: number) => {
    const canvas = canvas2DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    // Gradient background
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#0c1524');
    sky.addColorStop(0.75, p > 0.6 ? '#9a3412' : '#1e293b');
    sky.addColorStop(1, '#0284c7');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    if (towerImageRef.current && p > 0.1) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, p * 1.5);
      const img = towerImageRef.current;
      const aspect = img.naturalWidth / img.naturalHeight;
      const rh = Math.min(height * 0.82, 700);
      const rw = rh * aspect;
      ctx.drawImage(img, (width - rw) / 2, height - rh - 20, rw, rh);
      ctx.restore();
    }
  }, []);

  // 5. Unified GSAP ScrollTrigger Scrubbing with gsap.context & stable wrapper
  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const pinEl = pinWrapperRef.current;
    if (!pinEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top top',
        end: '+=250%',
        pin: true,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // Drive fallback 2D if active
          if (isKillSwitched || !hasWebGL) {
            drawFallback2D(p);
          }

          // Direct DOM updates for 60fps indicators
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${Math.round(p * 100)}%`;
          }
          if (progressPercentRef.current) {
            progressPercentRef.current.textContent = `${Math.round(p * 100)}%`;
          }

          // Sky Sunset Amber Overlay (0.5 -> 1.0)
          if (skySunsetRef.current) {
            const sunsetOpacity = p < 0.4 ? 0 : Math.min(1, (p - 0.4) / 0.55);
            skySunsetRef.current.style.opacity = `${sunsetOpacity}`;
          }

          // Milestone badge text
          if (milestoneStepRef.current && milestoneTitleRef.current) {
            if (p < 0.30) {
              milestoneStepRef.current.textContent = 'STAGE A: EXISTING SOCIETY';
              milestoneTitleRef.current.textContent = 'Aging 4-Storey CHS Structure';
            } else if (p < 0.75) {
              const currentFloor = Math.min(8, Math.max(1, Math.floor(((p - 0.30) / 0.42) * 8) + 1));
              milestoneStepRef.current.textContent = `STAGE B: CONSTRUCTION — FLOOR ${currentFloor} OF 8`;
              milestoneTitleRef.current.textContent = 'Section 79A Structural Transformation';
            } else {
              milestoneStepRef.current.textContent = 'STAGE C: COMPLETED LANDMARK';
              milestoneTitleRef.current.textContent = 'Ganpati CHS, Nerul Delivered';
            }
          }

          // Initial Scroll Prompt Fade (fades out as user scrolls past 0.22)
          if (initialPromptRef.current) {
            if (p > 0.22) {
              initialPromptRef.current.style.opacity = '0';
              initialPromptRef.current.style.pointerEvents = 'none';
              initialPromptRef.current.style.transform = 'translateY(-16px)';
            } else {
              const promptAlpha = 1 - (p / 0.22);
              initialPromptRef.current.style.opacity = `${promptAlpha}`;
              initialPromptRef.current.style.pointerEvents = promptAlpha > 0.5 ? 'auto' : 'none';
              initialPromptRef.current.style.transform = `translateY(${-p * 30}px)`;
            }
          }

          // Climax Card Fade (fades in as transformation completes at 0.78)
          if (climaxCardRef.current) {
            if (p >= 0.76) {
              const cardAlpha = Math.min(1, (p - 0.76) / 0.18);
              climaxCardRef.current.style.opacity = `${cardAlpha}`;
              climaxCardRef.current.style.pointerEvents = cardAlpha > 0.6 ? 'auto' : 'none';
              climaxCardRef.current.style.transform = `scale(${0.96 + cardAlpha * 0.04}) translateY(${(1 - cardAlpha) * 16}px)`;
            } else {
              climaxCardRef.current.style.opacity = '0';
              climaxCardRef.current.style.pointerEvents = 'none';
              climaxCardRef.current.style.transform = 'scale(0.95) translateY(24px)';
            }
          }
        },
      });
    }, pinWrapperRef);

    return () => {
      ctx.revert();
    };
  }, [isKillSwitched, hasWebGL, drawFallback2D]);

  const use3D = !isKillSwitched && hasWebGL;

  return (
    <div
      ref={pinWrapperRef}
      id="hero-transformation-pin-wrapper"
      className="relative w-full overflow-visible"
    >
      <section
        ref={containerRef}
        id="hero-transformation"
        data-pinned="true"
        className="relative w-full h-screen overflow-hidden bg-[#0c1421] text-white flex flex-col justify-between select-none"
      >
        {/* ─── BASE SKY GRADIENT: DEEP NIGHT NAVY ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d17] via-[#0c1524] to-[#111e33] z-0 pointer-events-none" />

        {/* ─── NAV READABILITY VIGNETTE GRADIENT ─── */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#080d17]/90 via-[#080d17]/40 to-transparent z-20 pointer-events-none" />

        {/* ─── SUNSET ORANGE / GOLDEN AMBER OVERLAY (Stage C) ─── */}
        <div
          ref={skySunsetRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-[#ea580c]/35 via-[#9a3412]/20 to-transparent z-0 transition-opacity duration-150 pointer-events-none"
        />

        {/* ─── 3D PROCEDURAL INTERACTIVE CANVAS ─── */}
        {use3D && isInView && (
          <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
            <GanpatiBuilding3D
              progressRef={progressRef}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )}

        {/* ─── 2D FALLBACK CANVAS (If WebGL disabled or unsupported) ─── */}
        {(!use3D || !isInView) && (
          <canvas
            ref={canvas2DRef}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />
        )}

        {/* ─── TOP BAR: MILESTONE & PROGRESS SCRUBBER OVERLAY ─── */}
        <div
          className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
          style={{ paddingTop: 'max(88px, env(safe-area-inset-top, 0px) + 88px)' }}
        >
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-center sm:justify-between gap-2.5 sm:gap-4">
            {/* Milestone Badge */}
            <div className="flex items-center gap-2 sm:gap-3 bg-[#0c1421]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#D4A462]/35 shadow-xl [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)] min-w-0 max-w-full">
              <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#D4A462] animate-pulse shrink-0" />
              <span
                ref={milestoneStepRef}
                className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#D4A462] truncate"
              >
                STAGE A: EXISTING SOCIETY
              </span>
              <span className="text-white/40 text-xs shrink-0">|</span>
              <span
                ref={milestoneTitleRef}
                className="text-[10px] sm:text-xs text-white/95 font-medium truncate max-w-[140px] xs:max-w-xs sm:max-w-md"
              >
                Aging 4-Storey CHS Structure
              </span>
            </div>

            {/* Scroll Scrubber Progress Bar */}
            <div className="flex items-center gap-2 sm:gap-3 bg-[#0c1421]/90 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 text-[10px] sm:text-xs font-mono [text-shadow:_0_1px_8px_rgba(0,0,0,0.8)] shrink-0">
              <span className="text-white/70 hidden xs:inline">3D RECONSTRUCTION</span>
              <div className="w-16 sm:w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  ref={progressBarRef}
                  style={{ width: '0%' }}
                  className="h-full bg-gradient-to-r from-[#154C96] to-[#D4A462] transition-all duration-75"
                />
              </div>
              <span ref={progressPercentRef} className="text-[#D4A462] font-bold min-w-[3ch] text-right">
                0%
              </span>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM HERO OVERLAYS: PROMPT & CLIMAX CARD ─── */}
        <div className="relative z-30 max-w-4xl mx-auto px-6 pb-10 md:pb-14 text-center pointer-events-none">
          {/* Stage A Initial Prompt: Fades out on scroll */}
          <div
            ref={initialPromptRef}
            className="transition-transform duration-300 flex flex-col items-center gap-3 pointer-events-auto [text-shadow:_0_2px_14px_rgba(0,0,0,0.95)]"
          >
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-tight tracking-tight">
              Watch Trust Rise Floor By Floor
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/90 max-w-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] leading-relaxed font-medium">
              Scroll down to watch an aging housing society transform into Ganpati CHS, Nerul.
            </p>

            {/* Animated Mouse/Finger Indicator */}
            <div className="mt-3 flex flex-col items-center gap-1.5 text-[11px] font-mono text-[#D4A462] uppercase tracking-wider font-semibold drop-shadow-md">
              <span>Scroll to Transform</span>
              <div className="w-5 h-8 rounded-full border border-[#D4A462]/80 flex items-start justify-center p-1 bg-black/30">
                <div className="w-1.5 h-2.5 rounded-full bg-[#D4A462] animate-bounce" />
              </div>
            </div>
          </div>

          {/* Stage C Climax Card: Sankalp Logo & CTAs */}
          <div
            ref={climaxCardRef}
            style={{ opacity: 0, transform: 'scale(0.95) translateY(24px)' }}
            className="transition-all duration-500 bg-[#0c1421]/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[#D4A462]/50 shadow-2xl shadow-[#154C96]/40 flex flex-col items-center pointer-events-none"
          >
            {/* Sankalp Logo */}
            <div className="relative w-52 sm:w-64 h-16 sm:h-20 mb-3">
              <Image
                src="/assets/sankalp-logo.png"
                alt="Sankalp — Redevelopment with Responsibility"
                fill
                priority
                className="object-contain drop-shadow-[0_4px_16px_rgba(212,164,98,0.4)]"
              />
            </div>

            {/* Official Tagline */}
            <div className="flex items-center gap-2 mb-4">
              <span className="h-[1px] w-8 bg-[#D4A462]" />
              <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#D4A462] uppercase">
                Redevelopment with Responsibility
              </p>
              <span className="h-[1px] w-8 bg-[#D4A462]" />
            </div>

            <p className="text-xs sm:text-sm text-text-muted max-w-lg mb-6 leading-relaxed">
              From our project portfolio: <strong className="text-white">Ganpati Society at Nerul</strong> — fully constructed with 8 floors, cantilevered white architectural frames, walnut-wood soffits, illuminated glass balconies, and stilt parking.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto pointer-events-auto">
              <Link
                href="/contact-us"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4A462] hover:bg-[#e6be85] text-[#0c1421] font-bold text-sm shadow-lg shadow-[#D4A462]/25 transition-all flex items-center justify-center gap-2"
              >
                Schedule Committee Meeting
                <span>→</span>
              </Link>
              <a
                href="#process-step-1"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#154C96] hover:bg-[#1d5bb8] text-white font-semibold text-sm border border-white/20 transition-all text-center"
              >
                Explore 10-Step Process
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

