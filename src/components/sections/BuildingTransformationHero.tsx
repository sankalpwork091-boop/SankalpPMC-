'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { PinwheelLoader } from '@/components/ui/PinwheelLoader';

export function BuildingTransformationHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileComparePos, setMobileComparePos] = useState(50); // 0-100% for mobile comparison slider

  const towerImageRef = useRef<HTMLImageElement | null>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload Assets
  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = 2;

    const onAssetLoad = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad) {
        setImagesLoaded(true);
      }
    };

    const towerImg = new window.Image();
    towerImg.src = '/assets/ganpati-tower.jpg';
    towerImg.onload = onAssetLoad;
    towerImageRef.current = towerImg;

    const logoImg = new window.Image();
    logoImg.src = '/assets/sankalp-logo.png';
    logoImg.onload = onAssetLoad;
    logoImageRef.current = logoImg;
  }, []);

  // Canvas Drawing Routine
  const drawScene = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // 1. SKY GRADIENT: Interpolates from Dusk (#0c1524 / #9a3412) to Clear Blue Day (#0284c7 / #bae6fd)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);

      // Colors interpolation
      // Top color: Dusk #0c1524 (12, 21, 36) -> Day #0284c7 (2, 132, 199)
      const topR = Math.round(12 + (2 - 12) * progress);
      const topG = Math.round(21 + (132 - 21) * progress);
      const topB = Math.round(36 + (199 - 36) * progress);

      // Horizon color: Dusk amber #9a3412 (154, 52, 18) -> Day soft azure #e0f2fe (224, 242, 254)
      const btmR = Math.round(154 + (224 - 154) * progress);
      const btmG = Math.round(52 + (242 - 52) * progress);
      const btmB = Math.round(18 + (254 - 18) * progress);

      skyGrad.addColorStop(0, `rgb(${topR}, ${topG}, ${topB})`);
      skyGrad.addColorStop(0.75, `rgb(${btmR}, ${btmG}, ${btmB})`);
      skyGrad.addColorStop(1, progress > 0.6 ? '#f0f9ff' : '#1e293b');

      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant city silhouette at dusk (fades as day arrives)
      if (progress < 0.6) {
        ctx.save();
        ctx.globalAlpha = (1 - progress / 0.6) * 0.4;
        ctx.fillStyle = '#090e17';
        for (let i = 0; i < 24; i++) {
          const bx = (i / 24) * width;
          const bw = width / 24;
          const bh = (height * 0.15) + Math.sin(i * 3.7) * (height * 0.08);
          ctx.fillRect(bx, height - bh, bw, bh);
        }
        ctx.restore();
      }

      // Ground pavement
      const groundH = height * 0.12;
      ctx.fillStyle = progress > 0.5 ? '#1e293b' : '#0a0f1a';
      ctx.fillRect(0, height - groundH, width, groundH);

      // 2. DRAW OLD SOCIETY BUILDING (Prominent when progress < 0.6)
      const oldAlpha = Math.max(0, 1 - progress * 1.8);
      if (oldAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = oldAlpha;

        const bWidth = Math.min(width * 0.42, 380);
        const bHeight = Math.min(height * 0.52, 440);
        const bX = (width - bWidth) / 2;
        const bY = height - groundH - bHeight;

        // Old stucco body with concrete stain
        ctx.fillStyle = '#78716c';
        ctx.fillRect(bX, bY, bWidth, bHeight);

        // Water damage & weathered grunge overlay
        ctx.fillStyle = 'rgba(41, 37, 36, 0.4)';
        for (let i = 0; i < 8; i++) {
          ctx.fillRect(bX + i * (bWidth / 8), bY, bWidth / 16, bHeight * 0.7);
        }

        // 4 Old Floors with weathered balconies
        const floors = 4;
        const fHeight = bHeight / floors;
        for (let f = 0; f < floors; f++) {
          const fy = bY + f * fHeight;
          // Floor divider
          ctx.fillStyle = '#57534e';
          ctx.fillRect(bX - 6, fy + fHeight - 8, bWidth + 12, 8);

          // Windows & Balconies
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(bX + bWidth * 0.1, fy + 14, bWidth * 0.35, fHeight - 28);
          ctx.fillRect(bX + bWidth * 0.55, fy + 14, bWidth * 0.35, fHeight - 28);

          // Rust-tinted balcony railings
          ctx.strokeStyle = '#44403c';
          ctx.lineWidth = 2;
          ctx.strokeRect(bX + bWidth * 0.08, fy + fHeight - 24, bWidth * 0.39, 18);
          ctx.strokeRect(bX + bWidth * 0.53, fy + fHeight - 24, bWidth * 0.39, 18);
        }

        // Rooftop Water Tanks (Classic Indian housing society style)
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bX + 24, bY - 32, 44, 32);
        ctx.fillRect(bX + 80, bY - 32, 44, 32);
        ctx.fillStyle = '#57534e';
        ctx.fillRect(bX + bWidth - 70, bY - 26, 50, 26);

        ctx.restore();
      }

      // 3. BLUEPRINT & CONSTRUCTION LASER OVERLAY (Active during transition 0.2 -> 0.75)
      if (progress > 0.15 && progress < 0.8) {
        ctx.save();
        const wireAlpha = Math.sin(((progress - 0.15) / 0.65) * Math.PI);
        ctx.globalAlpha = wireAlpha * 0.85;

        const targetW = Math.min(width * 0.52, 460);
        const targetH = Math.min(height * 0.78, 680);
        const tX = (width - targetW) / 2;
        const tY = height - groundH - targetH;

        // Glowing Blue/Gold architectural frame lines
        ctx.strokeStyle = progress > 0.45 ? '#D4A462' : '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(tX, tY, targetW, targetH);

        // Grid levels
        for (let i = 1; i <= 12; i++) {
          const ly = tY + (i / 13) * targetH;
          ctx.beginPath();
          ctx.moveTo(tX, ly);
          ctx.lineTo(tX + targetW, ly);
          ctx.stroke();
        }

        // Horizontal scanning laser beam
        const scanY = tY + targetH * (1 - ((progress * 3) % 1));
        ctx.strokeStyle = '#D4A462';
        ctx.lineWidth = 3;
        ctx.setLineDash([]);
        ctx.shadowColor = '#D4A462';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(tX - 30, scanY);
        ctx.lineTo(tX + targetW + 30, scanY);
        ctx.stroke();

        ctx.restore();
      }

      // 4. DRAW FINAL GANPATI TOWER ARCHITECTURE RENDER
      // Crossfade smoothly between 0.35 and 1.0
      const towerAlpha = Math.min(1, Math.max(0, (progress - 0.25) / 0.65));
      if (towerImageRef.current && towerAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = towerAlpha;

        const img = towerImageRef.current;
        const imgAspect = img.naturalWidth / img.naturalHeight;

        // Calculate aspect-fit height matching the canvas height
        const renderH = Math.min(height * 0.88, 780);
        const renderW = renderH * imgAspect;
        const renderX = (width - renderW) / 2;
        const renderY = height - groundH - renderH + 20;

        // Subtle scale transition for dramatic rise
        const scale = 0.95 + progress * 0.05;
        ctx.translate(width / 2, height / 2);
        ctx.scale(scale, scale);
        ctx.translate(-width / 2, -height / 2);

        // Draw the architectural render
        ctx.drawImage(img, renderX, renderY, renderW, renderH);

        // Glow effect on rooftop GANPATI CHS crown as progress reaches completion
        if (progress > 0.85) {
          const glowAlpha = (progress - 0.85) / 0.15;
          ctx.save();
          ctx.globalAlpha = glowAlpha * 0.6;
          ctx.fillStyle = '#D4A462';
          ctx.shadowColor = '#D4A462';
          ctx.shadowBlur = 25;
          // Sign location at crown top
          ctx.fillRect(renderX + renderW * 0.35, renderY + renderH * 0.08, renderW * 0.3, 14);
          ctx.restore();
        }

        ctx.restore();
      }
    },
    []
  );

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      drawScene(scrollProgress);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawScene, scrollProgress]);

  // GSAP ScrollTrigger Scrubbing
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        drawScene(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [drawScene]);

  // Redraw when images finish loading
  useEffect(() => {
    if (imagesLoaded) {
      drawScene(scrollProgress);
    }
  }, [imagesLoaded, drawScene, scrollProgress]);

  // Phase Title according to progress
  const phaseInfo =
    scrollProgress < 0.3
      ? {
          step: 'EXISTING PREMISES',
          title: 'Aging Housing Society',
          desc: 'Co-operative society ready for legally-protected redevelopment.',
        }
      : scrollProgress < 0.7
      ? {
          step: 'SECTION 79A PROCESS & EXECUTION',
          title: 'Structural Transformation',
          desc: 'Stacked white frames, walnut-wood bands, and louvered parking podium.',
        }
      : {
          step: 'ARCHITECTURAL LANDMARK',
          title: 'Ganpati CHS, Nerul',
          desc: 'Modern 17-storey residential tower delivered with total legal assurance.',
        };

  return (
    <section
      ref={containerRef}
      id="hero-transformation"
      className="relative w-full h-screen overflow-hidden bg-[#0c1421] text-white flex flex-col justify-between"
    >
      {/* ─── LOADING STATE WITH GOLD PINWHEEL ─── */}
      {!imagesLoaded && (
        <div className="absolute inset-0 z-50 bg-[#0c1421] flex flex-col items-center justify-center gap-4">
          <PinwheelLoader size="xl" label="Loading Architectural Transformation..." />
        </div>
      )}

      {/* ─── DESKTOP/TABLET CANVAS IMAGE SEQUENCE ─── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      {/* ─── MOBILE TOUCH FALLBACK VIEW ─── */}
      {isMobile && imagesLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col p-4 pt-20 pointer-events-auto">
          {/* Mobile Comparison Split View */}
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden border border-[#D4A462]/30 shadow-2xl bg-[#0c1421]">
            <Image
              src="/assets/ganpati-tower.jpg"
              alt="Ganpati Society at Nerul"
              fill
              priority
              className="object-contain"
            />

            {/* Split overlay showing old society */}
            <div
              className="absolute inset-0 bg-[#0c1524] overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - mobileComparePos}% 0 0)` }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#0c1524] to-[#1e293b]">
                <div className="w-48 h-56 bg-stone-700/80 rounded-lg border-2 border-stone-500 p-3 flex flex-col justify-between mb-4 shadow-xl">
                  <div className="flex justify-between">
                    <div className="w-8 h-6 bg-stone-900 rounded" />
                    <div className="w-8 h-6 bg-stone-900 rounded" />
                  </div>
                  <div className="text-[10px] text-stone-300 font-mono">
                    EXISTING 4-STOREY CHS
                  </div>
                  <div className="flex justify-between">
                    <div className="w-14 h-4 bg-stone-800 rounded" />
                    <div className="w-14 h-4 bg-stone-800 rounded" />
                  </div>
                </div>
                <span className="text-xs font-semibold text-stone-300 uppercase tracking-widest">
                  Original Structure
                </span>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs">
                  Weathered concrete, aging services, awaiting Section 79A renewal.
                </p>
              </div>
            </div>

            {/* Interactive Slider Divider Handle */}
            <input
              type="range"
              min="0"
              max="100"
              value={mobileComparePos}
              onChange={(e) => setMobileComparePos(Number(e.target.value))}
              aria-label="Drag to compare before and after redevelopment"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#D4A462] pointer-events-none z-10 shadow-[0_0_10px_#D4A462]"
              style={{ left: `${mobileComparePos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#154C96] border-2 border-[#D4A462] flex items-center justify-center text-[10px] text-[#D4A462] shadow-lg">
                ⇄
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#D4A462] font-semibold px-2">
            <span>◄ Slide for Original Society</span>
            <span>Ganpati CHS Render ►</span>
          </div>
        </div>
      )}

      {/* ─── FLOATING UI OVERLAY: TOP BAR & MILESTONE INDICATOR ─── */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pt-24 md:pt-28 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-none">
        {/* Milestone Badge */}
        <div className="flex items-center gap-3 bg-[#0c1421]/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4A462]/30 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D4A462] animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4A462]">
            {phaseInfo.step}
          </span>
          <span className="text-white/40 text-xs">|</span>
          <span className="text-xs text-white/90 font-medium">
            {phaseInfo.title}
          </span>
        </div>

        {/* Scroll Scrubber Progress Indicator */}
        <div className="hidden sm:flex items-center gap-3 bg-[#0c1421]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs font-mono">
          <span className="text-white/60">TRANSFORMATION</span>
          <div className="w-24 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#154C96] to-[#D4A462] transition-all duration-75"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[#D4A462] font-bold">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* ─── OVERLAY: INITIAL PROMPT & CLIMAX CARD WITH SANKALP LOGO ─── */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 pb-12 md:pb-16 text-center pointer-events-none">
        {/* Initial Scroll Prompt (visible at start, fades out on scroll) */}
        <div
          className={`transition-all duration-500 flex flex-col items-center gap-3 ${
            scrollProgress < 0.3
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none absolute inset-x-0 bottom-12'
          }`}
        >
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md">
            Watch Trust Rise Floor By Floor
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-md">
            Scroll down to watch an aging housing society transform into Ganpati CHS, Nerul.
          </p>

          {/* Animated Mouse/Finger Indicator */}
          <div className="mt-4 flex flex-col items-center gap-1.5 text-[11px] font-mono text-[#D4A462] uppercase tracking-wider">
            <span>Scroll to Transform</span>
            <div className="w-5 h-8 rounded-full border border-[#D4A462]/60 flex items-start justify-center p-1">
              <div className="w-1 h-2 rounded-full bg-[#D4A462] animate-bounce" />
            </div>
          </div>
        </div>

        {/* Climax Card: Sankalp Logo, Tagline & CTAs (fades in when transformation completes) */}
        <div
          className={`transition-all duration-700 bg-[#0c1421]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[#D4A462]/40 shadow-2xl shadow-[#154C96]/30 flex flex-col items-center ${
            scrollProgress >= 0.78
              ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
              : 'opacity-0 translate-y-6 pointer-events-none scale-95'
          }`}
        >
          {/* Sankalp Logo with Pinwheel */}
          <div className="relative w-52 sm:w-64 h-16 sm:h-20 mb-3">
            <Image
              src="/assets/sankalp-logo.png"
              alt="Sankalp — Redevelopment with Responsibility"
              fill
              priority
              className="object-contain drop-shadow-[0_4px_16px_rgba(212,164,98,0.3)]"
            />
          </div>

          {/* Official Tagline */}
          <div className="flex items-center gap-2 mb-6">
            <span className="h-[1px] w-8 bg-[#D4A462]" />
            <p className="text-xs sm:text-sm font-semibold tracking-widest text-[#D4A462] uppercase">
              Redevelopment with Responsibility
            </p>
            <span className="h-[1px] w-8 bg-[#D4A462]" />
          </div>

          <p className="text-xs sm:text-sm text-text-muted max-w-lg mb-6 leading-relaxed">
            From our project portfolio: <strong className="text-white">Ganpati Society at Nerul</strong> — transformed with stacked white architectural frames, walnut-wood soffits, glass balconies, and louvered parking.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <Link
              href="/contact-us"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#D4A462] hover:bg-[#e6be85] text-[#0c1421] font-bold text-sm shadow-lg shadow-[#D4A462]/20 transition-all flex items-center justify-center gap-2"
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
  );
}
