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
 * - still: prefers-reduced-motion or a load error; shows the last frame image.
 */

export const VIDEO_HERO_SOURCES = {
  desktop: '/hero/hero-build-scrub.mp4',
  mobile: '/hero/hero-build-mobile.mp4',
  poster: '/hero/hero-poster.jpg',
  last: '/hero/hero-last.jpg',
};

/** Widths up to this use the 960px mobile file. */
const MOBILE_MAX_WIDTH = 767;
/** Final share of the scroll that holds the last frame. */
const HOLD_TAIL = 0.04;
/** Per-frame easing of the video time towards the scroll target (0–1). */
const TIME_LERP = 0.18;
/** Smallest time change worth a seek: one frame of the clip. */
const FRAME_SECONDS = 1 / 24;
/** Phones: tower centred. Desktop: top-anchored so the crown sign clears the navbar. */
const OBJECT_POSITION = 'object-[62%_50%] md:object-[50%_0%]';

type Mode = 'scrub' | 'once' | 'still';

function pickMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  const ua = navigator.userAgent;
  const isIOS = /iP(hone|ad|od)/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  return nav.connection?.saveData || isIOS ? 'once' : 'scrub';
}

export function VideoHeroLayer({
  progressRef,
  isInView,
}: {
  progressRef: React.RefObject<number>;
  isInView: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const inViewRef = useRef(isInView);
  const playedRef = useRef(false);
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    inViewRef.current = isInView;
  }, [isInView]);

  useEffect(() => {
    setMode(pickMode());
  }, []);

  // Choose the file once, refresh ScrollTrigger after metadata, release on unmount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode === null || mode === 'still') return;
    const onMeta = () => ScrollTrigger.refresh();
    const onError = () => setMode('still');
    video.addEventListener('loadedmetadata', onMeta, { once: true });
    video.addEventListener('error', onError);
    video.src =
      window.innerWidth <= MOBILE_MAX_WIDTH ? VIDEO_HERO_SOURCES.mobile : VIDEO_HERO_SOURCES.desktop;
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('error', onError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [mode]);

  // Scrub: ease the video time towards the scroll target in rAF.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'scrub') return;
    let raf = 0;
    let eased = -1;
    let shown = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!inViewRef.current || video.readyState < 2 || !video.duration) return;
      const end = Math.max(0, video.duration - 0.01);
      const p = Math.min(1, (progressRef.current ?? 0) / (1 - HOLD_TAIL));
      const target = p * end;
      eased = eased < 0 ? target : eased + (target - eased) * TIME_LERP;
      if (Math.abs(target - eased) < 0.002) eased = target;
      const settledOnTarget = eased === target && shown !== target;
      if (!video.seeking && (Math.abs(eased - shown) > FRAME_SECONDS || settledOnTarget)) {
        video.currentTime = eased;
        shown = eased;
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
        <Image
          src={VIDEO_HERO_SOURCES.last}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover ${OBJECT_POSITION}`}
        />
      ) : (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${OBJECT_POSITION}`}
          poster={VIDEO_HERO_SOURCES.poster}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />
      )}
    </div>
  );
}
