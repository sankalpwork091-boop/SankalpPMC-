'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/*
 * Scroll-scrubbed construction video for the home hero. It reads the hero's
 * existing ScrollTrigger progress (progressRef) and adds no trigger of its own,
 * so the pin, scroll distance and text timing are unchanged.
 *
 * Modes:
 * - scrub: video.currentTime follows scroll progress (never calls play()).
 * - once:  iOS Safari or Save-Data; plays once when in view, rests on the last frame.
 * - still: prefers-reduced-motion, or every file failed; shows the final still.
 *
 * Tunables:
 * - VIDEO_LADDER            files from largest to smallest; errors or slow seeks step down
 * - LARGE_MIN_DEVICE_WIDTH  viewport width x devicePixelRatio needed for the 2K file
 * - MOBILE_MAX_WIDTH        widths up to this (or portrait screens) use the mobile file
 * - FREEZE_SECONDS          time of the frozen final frame (frame 184; the files hold it for 12 frames)
 * - HOLD_TAIL               final share of the scroll that holds steady after the dissolve
 * - END_DISSOLVE / DISSOLVE_SPAN    cross-dissolve to the sharp end still; it starts only
 *                           once the video has reached the frozen frame
 * - TIME_LERP               per-frame easing of the video time towards the scroll target
 * - FRAME_SECONDS           smallest time change worth a seek (one frame)
 * - SEEK_LAG_MS / SEEK_LAG_SAMPLES  median seek time that drops to the next smaller file
 * - OBJECT_POSITION         framing: phones centre the tower, desktop is top-anchored
 */

export const VIDEO_HERO_SOURCES = {
  large: '/hero/hero-build-2k.mp4',
  desktop: '/hero/hero-build-scrub.mp4',
  mobile: '/hero/hero-build-mobile.mp4',
  poster: '/hero/hero-poster-2k.jpg',
  last: '/hero/hero-last-2k.jpg',
  end: '/hero/hero-end-2k.jpg',
};

const VIDEO_LADDER = [VIDEO_HERO_SOURCES.large, VIDEO_HERO_SOURCES.desktop, VIDEO_HERO_SOURCES.mobile];
const LARGE_MIN_DEVICE_WIDTH = 1920;
const MOBILE_MAX_WIDTH = 767;
const FREEZE_SECONDS = 184.5 / 24;
const HOLD_TAIL = 0.04;
const END_DISSOLVE = true;
const DISSOLVE_SPAN = 0.08;
const TIME_LERP = 0.18;
const FRAME_SECONDS = 1 / 24;
const SEEK_LAG_MS = 140;
const SEEK_LAG_SAMPLES = 12;
const OBJECT_POSITION = 'object-[62%_50%] md:object-[50%_0%]';

/** Scroll progress at which the video reaches its frozen final frame. */
const VIDEO_END_PROGRESS = 1 - HOLD_TAIL - (END_DISSOLVE ? DISSOLVE_SPAN : 0);

const FINAL_STILL = END_DISSOLVE ? VIDEO_HERO_SOURCES.end : VIDEO_HERO_SOURCES.last;

type Mode = 'scrub' | 'once' | 'still';

function saveDataOn() {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  return Boolean(nav.connection?.saveData);
}

function pickMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  const ua = navigator.userAgent;
  const isIOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  return saveDataOn() || isIOS ? 'once' : 'scrub';
}

/** Index into VIDEO_LADDER, decided once per mount. */
function pickFileIndex(): number {
  const w = window.innerWidth;
  if (w <= MOBILE_MAX_WIDTH || window.innerHeight > w) return 2;
  if (!saveDataOn() && w * (window.devicePixelRatio || 1) >= LARGE_MIN_DEVICE_WIDTH) return 0;
  return 1;
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);

export function VideoHeroLayer({
  progressRef,
  isInView,
}: {
  progressRef: React.RefObject<number>;
  isInView: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const endStillRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(isInView);
  const playedRef = useRef(false);
  const [mode, setMode] = useState<Mode | null>(null);
  const [fileIndex, setFileIndex] = useState<number | null>(null);

  useEffect(() => {
    inViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    setMode(pickMode());
    setFileIndex(pickFileIndex());
  }, []);

  const stepDown = (index: number) => {
    if (index < VIDEO_LADDER.length - 1) setFileIndex(index + 1);
    else setMode('still');
  };

  // Load the chosen file, refresh ScrollTrigger after metadata, release on change/unmount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode === null || mode === 'still' || fileIndex === null) return;
    const onMeta = () => ScrollTrigger.refresh();
    const onError = () => stepDown(fileIndex);
    video.addEventListener('loadedmetadata', onMeta, { once: true });
    video.addEventListener('error', onError);
    video.src = VIDEO_LADDER[fileIndex];
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('error', onError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [mode, fileIndex]);

  // Scrub: ease the video time towards the scroll target in rAF; step down if seeks lag.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'scrub' || fileIndex === null) return;
    let raf = 0;
    let eased = -1;
    let shown = -1;
    let seekStart = 0;
    const lags: number[] = [];
    let seeksSeen = 0;
    const onSeeked = () => {
      if (!seekStart) return;
      seeksSeen += 1;
      if (seeksSeen > 4) lags.push(performance.now() - seekStart);
      seekStart = 0;
      if (lags.length >= SEEK_LAG_SAMPLES) {
        const median = [...lags].sort((a, b) => a - b)[lags.length >> 1];
        lags.length = 0;
        if (median > SEEK_LAG_MS && fileIndex < VIDEO_LADDER.length - 1) setFileIndex(fileIndex + 1);
      }
    };
    video.addEventListener('seeked', onSeeked);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inViewRef.current || video.readyState < 2 || !video.duration) return;
      const end = Math.max(0, Math.min(FREEZE_SECONDS, video.duration - 0.01));
      const p = Math.min(1, (progressRef.current ?? 0) / VIDEO_END_PROGRESS);
      const target = p * end;
      eased = eased < 0 ? target : eased + (target - eased) * TIME_LERP;
      if (Math.abs(target - eased) < 0.002) eased = target;
      const settledOnTarget = eased === target && shown !== target;
      if (!video.seeking && (Math.abs(eased - shown) > FRAME_SECONDS || settledOnTarget)) {
        seekStart = performance.now();
        video.currentTime = eased;
        shown = eased;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [mode, fileIndex, progressRef]);

  // Optional end dissolve: opacity only, eased, finishing as the final hold begins.
  useEffect(() => {
    const still = endStillRef.current;
    if (!END_DISSOLVE || !still || mode === null || mode === 'still') return;
    let raf = 0;
    let last = -1;
    const start = VIDEO_END_PROGRESS;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Math.min(1, Math.max(0, ((progressRef.current ?? 0) - start) / DISSOLVE_SPAN));
      const o = Math.round(easeInOut(t) * 1000) / 1000;
      if (o !== last) {
        still.style.opacity = `${o}`;
        last = o;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, progressRef]);

  // Once: play a single time when the hero is in view, then rest on the last frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'once' || !isInView || playedRef.current) return;
    playedRef.current = true;
    video.play().catch(() => setMode('still'));
  }, [mode, isInView]);

  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      {mode === 'still' ? (
        <Image src={FINAL_STILL} alt="" fill priority sizes="100vw" className={`object-cover ${OBJECT_POSITION}`} />
      ) : (
        <>
          {/* First paint: responsive poster (2K on large screens) until the video has data. */}
          <Image
            src={VIDEO_HERO_SOURCES.poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className={`object-cover ${OBJECT_POSITION}`}
          />
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${OBJECT_POSITION}`}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
          />
          {END_DISSOLVE && (
            <div ref={endStillRef} className="absolute inset-0" style={{ opacity: 0 }}>
              <Image src={VIDEO_HERO_SOURCES.end} alt="" fill sizes="100vw" className={`object-cover ${OBJECT_POSITION}`} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
