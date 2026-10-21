'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PinwheelLoader } from '@/components/ui/PinwheelLoader';
import { ENABLE_3D_BUILDING_HERO, ENABLE_VIDEO_HERO } from '@/config/hero3d';
import { VideoHeroLayer } from '@/components/hero/VideoHeroLayer';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// Dynamic import 3D Interactive Building with SSR disabled
const GanpatiBuilding3D = dynamic(
  () => import('@/components/hero/GanpatiBuilding3D'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#F4F3EE] gap-3">
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
  const climaxCardRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isKillSwitched, setIsKillSwitched] = useState(false);
  const [useVideo, setUseVideo] = useState(ENABLE_VIDEO_HERO);
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

    // ?novideo=true restores the live 3D scene
    if (window.location.search.includes('novideo=true')) setUseVideo(false);

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

    // Gradient background: Pale sky haze top #EAF0F4 fading to ivory #F4F3EE
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#EAF0F4');
    sky.addColorStop(0.65, '#F4F3EE');
    sky.addColorStop(1, p > 0.6 ? '#E6EFF6' : '#E6E0D0');
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
    // Mobile browser bars showing/hiding must not re-measure the pin.
    ScrollTrigger.config({ ignoreMobileResize: true });
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

  // Re-measure the pin only after load, fonts and orientation changes (never per resize tick).
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState !== 'complete') window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);
    const orientation = window.matchMedia('(orientation: portrait)');
    orientation.addEventListener('change', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      orientation.removeEventListener('change', refresh);
    };
  }, []);

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
        className="relative w-full h-screen supports-[height:100svh]:h-[100svh] min-h-screen supports-[min-height:100svh]:min-h-[100svh] overflow-hidden [touch-action:pan-y_pinch-zoom] bg-[#F4F3EE] text-[#1B1B1F] select-none border-b border-[#E9E2D0]"
      >
        {/* ─── BASE SKY GRADIENT: SKY HAZE TOP #EAF0F4 FADING TO IVORY #F4F3EE (z-0) ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#EAF0F4] via-[#F4F3EE] to-[#F4F3EE] z-0 pointer-events-none" />

        {/* ─── STAGE C SKY BLUING OVERLAY: (#E6EFF6) (z-0) ─── */}
        <div
          ref={skySunsetRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-t from-[#E6EFF6]/60 via-[#EAF0F4]/20 to-transparent z-0 transition-opacity duration-150 pointer-events-none"
        />

        {/* ─── SCROLL-SCRUBBED CONSTRUCTION VIDEO (z-10) ─── */}
        {useVideo && <VideoHeroLayer progressRef={progressRef} isInView={isInView} />}

        {/* ─── 3D PROCEDURAL INTERACTIVE CANVAS (z-10) ─── */}
        {!useVideo && use3D && isInView && (
          <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
            <GanpatiBuilding3D
              progressRef={progressRef}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )}

        {/* ─── 2D FALLBACK CANVAS: If WebGL disabled or unsupported (z-10) ─── */}
        {!useVideo && (!use3D || !isInView) && (
          <canvas
            ref={canvas2DRef}
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />
        )}

        {/* ─── SUBTLE WHITE FADE OVERLAY BEHIND NAVBAR (z-20) ─── */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none z-20"
          style={{
            height: 'calc(var(--nav-h, 76px) + 60px)',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.4) 65%, transparent 100%)',
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
          {/* Initial Prompt Group: Headline (fades out as user scrolls) */}
          <div
            ref={initialPromptRef}
            className="flex flex-col items-center text-center transition-opacity duration-200 pointer-events-auto w-full max-w-5xl px-1 sm:px-3"
          >
            {/* Eyebrow badge matching other sections */}
            <span className="section-eyebrow text-[10px] sm:text-xs mb-2 sm:mb-3">
              3D Architectural Transformation
            </span>

            {/* Headline with one gold accent word */}
            <h1 className="font-heading font-bold text-[#1B1B1F] tracking-tight text-[clamp(1.6rem,7.4vw,2.25rem)] sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-none max-w-full max-md:text-balance">
              Watch Trust <span className="italic text-[#B8913A]">Rise</span> Floor By Floor
            </h1>

            {/* Decorative Gold Accent Underline */}
            <span className="heading-gold-line mx-auto" />
          </div>
        </div>

        {/* ─── STAGE C CLIMAX CARD: DELIVERED LANDMARK & CTAs (z-30) ─── */}
        <div
          ref={climaxCardRef}
          style={{ opacity: 0, transform: 'scale(0.95)' }}
          className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] md:bottom-10 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] md:w-[calc(100%-2rem)] max-w-md z-30 transition-all duration-300 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E9E2D0] shadow-[0_12px_40px_rgba(143,107,30,0.12)] flex flex-col items-center pointer-events-none max-md:gap-4 max-md:max-h-[56svh] [@media(max-height:499px)_and_(orientation:landscape)]:max-h-[70svh] [@media(max-height:499px)_and_(orientation:landscape)]:!p-4 [@media(max-height:499px)_and_(orientation:landscape)]:gap-3 [@media(max-height:499px)_and_(orientation:landscape)]:bottom-3"
        >
          {/* Sankalp Logo */}
          <div className="relative w-48 sm:w-60 h-14 sm:h-18 mb-2 sm:mb-3 max-md:mb-0 [@media(max-height:499px)_and_(orientation:landscape)]:hidden">
            <Image
              src="/assets/sankalp-logo.png"
              alt="Sankalp — Redevelopment with Responsibility"
              fill
              sizes="(max-width: 640px) 192px, 240px"
              priority
              className="object-contain"
            />
          </div>

          {/* Official Tagline */}
          <div className="flex items-center gap-2 mb-5 sm:mb-6 max-md:mb-0 [@media(max-height:499px)_and_(orientation:landscape)]:mb-0">
            <span className="h-[1px] w-8 max-md:w-4 bg-[#B8913A]" />
            <p className="text-[11px] sm:text-xs font-semibold tracking-widest text-[#8F6B1E] uppercase whitespace-nowrap max-md:text-[10px] max-md:tracking-[0.08em]">
              Redevelopment with Responsibility
            </p>
            <span className="h-[1px] w-8 max-md:w-4 bg-[#B8913A]" />
          </div>

          <div className="w-full max-w-[300px] max-md:max-w-none pointer-events-auto">
            <Link
              href="/contact-us"
              className="btn-primary w-full !py-2.5 sm:!py-3 !px-6 text-xs sm:text-sm flex items-center justify-center gap-2 text-center max-md:!min-h-12 max-md:!whitespace-nowrap max-md:!tracking-normal max-md:!px-4 [@media(max-height:499px)_and_(orientation:landscape)]:!min-h-12"
            >
              Schedule Committee Meeting
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

