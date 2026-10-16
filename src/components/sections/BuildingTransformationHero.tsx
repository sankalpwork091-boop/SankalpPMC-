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
  const initialPromptRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
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
        end: '+=500%',
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

          // Sky Sunset Amber Overlay (0.5 -> 1.0)
          if (skySunsetRef.current) {
            const sunsetOpacity = p < 0.4 ? 0 : Math.min(1, (p - 0.4) / 0.55);
            skySunsetRef.current.style.opacity = `${sunsetOpacity}`;
          }

          // Initial Scroll Prompt Fade (fades out as user scrolls past 0.22)
          if (initialPromptRef.current) {
            if (p > 0.22) {
              initialPromptRef.current.style.opacity = '0';
              initialPromptRef.current.style.pointerEvents = 'none';
              initialPromptRef.current.style.transform = 'none';
            } else {
              const promptAlpha = Math.max(0, 1 - (p / 0.22));
              initialPromptRef.current.style.opacity = `${promptAlpha}`;
              initialPromptRef.current.style.pointerEvents = promptAlpha > 0.5 ? 'auto' : 'none';
              initialPromptRef.current.style.transform = 'none';
            }
          }

          // Scroll Cue Fade (fades out in sync with initial prompt)
          if (scrollCueRef.current) {
            if (p > 0.22) {
              scrollCueRef.current.style.opacity = '0';
            } else {
              const cueAlpha = Math.max(0, 1 - (p / 0.22));
              scrollCueRef.current.style.opacity = `${cueAlpha}`;
            }
          }

          // Climax Card Fade (fades in as transformation completes at 0.78)
          if (climaxCardRef.current) {
            if (p >= 0.76) {
              const cardAlpha = Math.min(1, (p - 0.76) / 0.18);
              climaxCardRef.current.style.opacity = `${cardAlpha}`;
              climaxCardRef.current.style.pointerEvents = cardAlpha > 0.6 ? 'auto' : 'none';
              climaxCardRef.current.style.transform = `scale(${0.96 + cardAlpha * 0.04})`;
            } else {
              climaxCardRef.current.style.opacity = '0';
              climaxCardRef.current.style.pointerEvents = 'none';
              climaxCardRef.current.style.transform = 'scale(0.95)';
            }
          }
        },
      });

      // Refresh ScrollTrigger calculations after mounting
      ScrollTrigger.refresh();
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
        data-section="0"
        className="relative w-full h-[100svh] min-h-[100svh] overflow-hidden bg-[#0c1421] text-white select-none"
      >
        {/* ─── BASE SKY GRADIENT: DEEP NIGHT NAVY (z-0) ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080d17] via-[#0c1524] to-[#111e33] z-0 pointer-events-none" />

        {/* ─── SUNSET ORANGE / GOLDEN AMBER OVERLAY: Stage C (z-0) ─── */}
        <div
          ref={skySunsetRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-[#ea580c]/35 via-[#9a3412]/20 to-transparent z-0 transition-opacity duration-150 pointer-events-none"
        />

        {/* ─── 3D PROCEDURAL INTERACTIVE CANVAS (z-10) ─── */}
        {use3D && isInView && (
          <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
            <GanpatiBuilding3D
              progressRef={progressRef}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )}

        {/* ─── 2D FALLBACK CANVAS: If WebGL disabled or unsupported (z-10) ─── */}
        {(!use3D || !isInView) && (
          <canvas
            ref={canvas2DRef}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />
        )}

        {/* ─── SUBTLE GRADIENT OVERLAY BEHIND NAVBAR (z-20) ─── */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none z-20"
          style={{
            height: 'calc(var(--nav-h, 76px) + 60px)',
            background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.85) 0%, rgba(10, 15, 30, 0.4) 65%, transparent 100%)',
          }}
        />

        {/* ─── ONE FLEX COLUMN HERO TEXT CONTAINER (z-30, Normal Flow, No Overlaps) ─── */}
        <div
          className="absolute inset-0 flex flex-col items-center text-center pointer-events-none z-30 px-4"
          style={{
            paddingTop: 'calc(var(--nav-h, 76px) + 24px)',
            gap: '16px',
          }}
        >
          {/* Initial Prompt Group: Headline & Subtitle (fades out as user scrolls) */}
          <div
            ref={initialPromptRef}
            className="flex flex-col items-center text-center transition-opacity duration-200 pointer-events-auto"
            style={{ gap: '16px' }}
          >
            {/* 2. Headline */}
            <h1
              className="font-heading font-bold text-white tracking-tight"
              style={{
                fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
                lineHeight: 1.1,
                maxWidth: '90vw',
                textWrap: 'balance',
                textShadow: '0 2px 16px rgba(0, 0, 0, 0.9), 0 4px 32px rgba(0, 0, 0, 0.75)',
              }}
            >
              Watch Trust Rise Floor By Floor
            </h1>

            {/* 3. Subtitle */}
            <p
              className="text-white/90 font-medium leading-relaxed"
              style={{
                maxWidth: '60ch',
                marginInline: 'auto',
                fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 4px 20px rgba(0, 0, 0, 0.7)',
              }}
            >
              Scroll down to watch an aging housing society transform into Ganpati CHS, Nerul.
            </p>
          </div>
        </div>

        {/* ─── SUBTLE BOTTOM GRADIENT VIGNETTE (z-20) ─── */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#080d17]/85 via-[#080d17]/30 to-transparent z-20 pointer-events-none" />

        {/* ─── SCROLL TO TRANSFORM CUE (Direct child of pinned hero, bottom centre) (z-30) ─── */}
        <div
          ref={scrollCueRef}
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30 transition-opacity duration-200"
          style={{
            bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
            gap: '8px',
          }}
        >
          <span
            className="text-[11px] font-mono text-[#D4A462] uppercase tracking-wider font-semibold"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.95)' }}
          >
            Scroll to Transform
          </span>
          <div className="w-5 h-8 rounded-full border border-[#D4A462]/80 flex items-start justify-center p-1 bg-black/40 backdrop-blur-sm shadow-lg">
            <div className="w-1.5 h-2.5 rounded-full bg-[#D4A462] animate-bounce" />
          </div>
        </div>

        {/* ─── STAGE C CLIMAX CARD: DELIVERED LANDMARK & CTAs (z-30) ─── */}
        <div
          ref={climaxCardRef}
          style={{ opacity: 0, transform: 'scale(0.95)' }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl z-30 transition-all duration-300 bg-[#0c1421]/95 backdrop-blur-xl p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#D4A462]/50 shadow-2xl shadow-[#154C96]/40 flex flex-col items-center pointer-events-none"
        >
          {/* Sankalp Logo */}
          <div className="relative w-48 sm:w-60 h-14 sm:h-18 mb-2 sm:mb-3">
            <Image
              src="/assets/sankalp-logo.png"
              alt="Sankalp — Redevelopment with Responsibility"
              fill
              priority
              className="object-contain drop-shadow-[0_4px_16px_rgba(212,164,98,0.4)]"
            />
          </div>

          {/* Official Tagline */}
          <div className="flex items-center gap-2 mb-3">
            <span className="h-[1px] w-8 bg-[#D4A462]" />
            <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#D4A462] uppercase">
              Redevelopment with Responsibility
            </p>
            <span className="h-[1px] w-8 bg-[#D4A462]" />
          </div>

          <p className="text-xs sm:text-sm text-text-muted max-w-lg mb-5 leading-relaxed text-center">
            From our project portfolio: <strong className="text-white">Ganpati Society at Nerul</strong> — fully constructed with 8 floors, cantilevered white architectural frames, walnut-wood soffits, illuminated glass balconies, and stilt parking.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto pointer-events-auto">
            <Link
              href="/contact-us"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-[#D4A462] hover:bg-[#e6be85] text-[#0c1421] font-bold text-xs sm:text-sm shadow-lg shadow-[#D4A462]/25 transition-all flex items-center justify-center gap-2"
            >
              Schedule Committee Meeting
              <span>→</span>
            </Link>
            <Link
              href="/services"
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-xl bg-[#154C96] hover:bg-[#1d5bb8] text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all text-center"
            >
              Explore 10-Step Process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

