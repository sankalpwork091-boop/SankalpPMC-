'use client';

import React, { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PinwheelLoader } from '@/components/ui/PinwheelLoader';
import { ENABLE_3D_BUILDING_HERO, ENABLE_VIDEO_HERO } from '@/config/hero3d';
import { VideoHeroLayer, PHONE_MEDIA_QUERY, CARD_FADE_MS } from '@/components/hero/VideoHeroLayer';

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
  const climaxCardRef = useRef<HTMLDivElement>(null);
  // Phones (tap-to-play): reveals the card once the clip has ended.
  const phoneRevealRef = useRef<(() => void) | null>(null);
  const revealPhoneCard = useCallback(() => phoneRevealRef.current?.(), []);

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
      const mm = gsap.matchMedia();
      mm.add({ isPhone: PHONE_MEDIA_QUERY, any: 'all' }, (context) => {
      // Phones with the video hero: tap-to-play, no pin or scrub. The card stays hidden
      // (and unfocusable) until the player reports the clip has ended.
      if (context.conditions?.isPhone && useVideo) {
        const card = climaxCardRef.current;
        if (!card) return;
        // Opacity-only fade; GSAP must not touch transform (it would drop the centring translate).
        const restingTransform = card.style.transform;
        card.style.transform = 'none';
        gsap.set(card, { autoAlpha: 0, pointerEvents: 'none', transition: 'none' });
        phoneRevealRef.current = () =>
          context.add(() => {
            gsap.to(card, {
              autoAlpha: 1,
              duration: CARD_FADE_MS / 1000,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set(card, { pointerEvents: 'auto' });
              },
            });
          });
        return () => {
          phoneRevealRef.current = null;
          card.style.transform = restingTransform;
        };
      }

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
      });
    }, pinWrapperRef);

    return () => {
      ctx.revert();
    };
  }, [isKillSwitched, hasWebGL, drawFallback2D, useVideo]);

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

  // Temporary viewport-height readout, only with ?debugvh=1.
  const [showVhDebug, setShowVhDebug] = useState(false);
  useEffect(() => {
    setShowVhDebug(new URLSearchParams(window.location.search).get('debugvh') === '1');
  }, []);

  const use3D = !isKillSwitched && hasWebGL;

  return (
    <>
    {/* Portal into <body>: never inserted next to the pinned wrapper, which GSAP re-parents. */}
    {showVhDebug && createPortal(<VhDebugBadge heroRef={containerRef} pinRef={pinWrapperRef} />, document.body)}
    <div
      ref={pinWrapperRef}
      id="hero-transformation-pin-wrapper"
      className="relative w-full overflow-visible bg-[#886249]"
    >
      <section
        ref={containerRef}
        id="hero-transformation"
        data-pinned="true"
        data-section="0"
        className="relative w-full h-screen supports-[height:100lvh]:h-[100lvh] min-h-screen supports-[min-height:100lvh]:min-h-[100lvh] overflow-hidden [touch-action:pan-y_pinch-zoom] bg-[#F4F3EE] text-[#1B1B1F] select-none border-b border-[#E9E2D0]"
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
        {useVideo && (
          <VideoHeroLayer progressRef={progressRef} isInView={isInView} onPhoneEnd={revealPhoneCard} />
        )}

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

        {/* Page heading for screen readers and search engines only (no visible headline). */}
        <h1 className="sr-only">Watch Trust Rise Floor By Floor</h1>

        {/* ─── STAGE C CLIMAX CARD: DELIVERED LANDMARK & CTAs (z-30) ─── */}
        <div
          ref={climaxCardRef}
          style={{ opacity: 0, transform: 'scale(0.95)' }}
          className="absolute bottom-[max(20px,env(safe-area-inset-bottom))] md:bottom-10 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] md:w-[calc(100%-2rem)] max-w-md z-30 transition-all duration-300 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#E9E2D0] shadow-[0_12px_40px_rgba(143,107,30,0.12)] flex flex-col items-center pointer-events-none max-md:gap-4 max-md:max-h-[56svh] [@media(max-height:499px)_and_(orientation:landscape)]:max-h-[70svh] [@media(max-height:499px)_and_(orientation:landscape)]:!p-4 [@media(max-height:499px)_and_(orientation:landscape)]:gap-3 [@media(max-height:499px)_and_(orientation:landscape)]:bottom-3 max-md:supports-[height:100lvh]:bottom-[calc(max(20px,env(safe-area-inset-bottom))+100lvh-100svh)] [@media(max-height:499px)_and_(orientation:landscape)]:supports-[height:100lvh]:bottom-[calc(12px+100lvh-100svh)]"
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

        {/* ─── DISCLAIMER LINE (z-20): sits in the gap below the climax card, never animated ─── */}
        <p
          style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.55), 0 0 8px rgba(0, 0, 0, 0.35)' }}
          className="absolute inset-x-0 mx-auto w-[90%] z-20 text-center text-white/85 font-normal tracking-[0.02em] pointer-events-none text-[11px] leading-[13px] bottom-[max(4px,calc(env(safe-area-inset-bottom)_-_16px))] max-md:supports-[height:100lvh]:bottom-[calc(max(4px,calc(env(safe-area-inset-bottom)_-_16px))_+_100lvh_-_100svh)] md:text-[12px] md:leading-4 md:bottom-3 [@media(max-height:499px)_and_(orientation:landscape)]:text-[10px] [@media(max-height:499px)_and_(orientation:landscape)]:leading-[10px] [@media(max-height:499px)_and_(orientation:landscape)]:bottom-px [@media(max-height:499px)_and_(orientation:landscape)]:bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.5)_25%,rgba(0,0,0,0.5)_75%,transparent)] [@media(max-height:499px)_and_(orientation:landscape)]:supports-[height:100lvh]:bottom-[calc(1px_+_100lvh_-_100svh)]"
        >
          Project undertaken in the name of A3 Architects
        </p>
      </section>
    </div>
    </>
  );
}

/** Temporary readout of viewport heights (remove after checking on iPhone). */
function VhDebugBadge({
  heroRef,
  pinRef,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  pinRef: React.RefObject<HTMLDivElement | null>;
}) {
  const probesRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    const read = () => {
      const probes = probesRef.current?.children;
      const probe = (i: number) => Math.round((probes?.[i] as HTMLElement | undefined)?.getBoundingClientRect().height ?? 0);
      const spacer = pinRef.current?.parentElement;
      const spacerH = spacer?.classList.contains('pin-spacer') ? spacer.offsetHeight : '-';
      setText(
        `innerH ${window.innerHeight} · vv ${Math.round(window.visualViewport?.height ?? 0)} · hero ${heroRef.current?.offsetHeight ?? '-'} · spacer ${spacerH} · svh ${probe(0)} · lvh ${probe(1)} · dvh ${probe(2)}`
      );
    };
    read();
    const id = window.setInterval(read, 500);
    window.visualViewport?.addEventListener('resize', read);
    return () => {
      window.clearInterval(id);
      window.visualViewport?.removeEventListener('resize', read);
    };
  }, [heroRef, pinRef]);

  return (
    <>
      <div ref={probesRef} aria-hidden="true" className="fixed top-0 left-0 w-0 invisible pointer-events-none">
        <div className="absolute top-0 w-0 h-[100svh]" />
        <div className="absolute top-0 w-0 h-[100lvh]" />
        <div className="absolute top-0 w-0 h-[100dvh]" />
      </div>
      <div className="fixed top-2 left-2 z-[200] max-w-[calc(100vw-1rem)] px-2 py-1 rounded bg-black/75 text-white text-[10px] leading-tight font-mono pointer-events-none">
        {text}
      </div>
    </>
  );
}

