'use client';

import { useEffect, useRef, useState } from 'react';
import { getImageProps } from 'next/image';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

/*
 * Scroll-scrubbed construction video for the home hero. It reads the hero's
 * existing ScrollTrigger progress (progressRef) and adds no trigger of its own,
 * so the pin, scroll distance and text timing are unchanged.
 *
 * Modes:
 * - scrub: video.currentTime follows scroll progress (never calls play()).
 * - once:  scrubbing is slow or unsupported (e.g. iOS Safari); plays once when in view.
 * - lite:  Save-Data or a 2g/3g connection; poster plus the end-still dissolve, no video.
 * - still: prefers-reduced-motion, or every file failed; shows the final still.
 *
 * Phones (PHONE_MEDIA_QUERY) use tap-to-play instead: no pin or scrub, the first frame
 * waits for a tap, the clip plays once, then the end still and the card fade in.
 *
 * Phone tunables:
 * - SHOW_TAP_HINT           the gold "Tap to play" ring over the first frame
 * - IDLE_REVEAL_MS          no tap for this long: show the end still and the card (0 = off)
 * - CARD_FADE_MS            card fade-in after the clip ends
 * - END_DISSOLVE_MS         clip end to end-still cross-dissolve
 *
 * Desktop/tablet tunables:
 * - LANDSCAPE_LADDER / PORTRAIT_LADDER  files from largest to smallest; errors or slow
 *                           seeks step down. Portrait = taller than wide.
 * - LARGE_MIN_DEVICE_WIDTH  viewport width x devicePixelRatio needed for the 2K file
 * - MOBILE_MAX_WIDTH / PHONE_LANDSCAPE_MAX_HEIGHT  phones only ever get the mobile files
 * - FREEZE_SECONDS          time of the frozen final frame (frame 184; the files hold it for 12 frames)
 * - HOLD_TAIL               final share of the scroll that holds steady after the dissolve
 * - END_DISSOLVE / DISSOLVE_SPAN    cross-dissolve to the sharp end still; it starts only
 *                           once the video has reached the frozen frame
 * - TIME_LERP               per-frame easing of the video time towards the scroll target
 * - FRAME_SECONDS           smallest time change worth a seek (one frame)
 * - SEEK_LAG_MS / SEEK_LAG_SAMPLES  median seek time that drops to the next smaller file
 * - SEEK_TEST_MS / LOAD_TIMEOUT_MS  first-seek and first-data limits before play-once mode
 * - OFFSCREEN_RELEASE_MS    how long the hero must be off-screen before the video is released
 * - ONCE_START_PROGRESS     play-once mode: scroll progress that starts playback from time 0
 *                           (at or below it the first frame shows)
 * - OBJECT_POSITION         framing: portrait crop centred, landscape phones keep the tower
 *                           centred, desktop is top-anchored
 * - LANDSCAPE_PHONE_SHIFT   landscape phones: shift the layer down so the crown clears the navbar
 */

/** Phones: under 768 wide, or a landscape phone under 500 high (matches the hero CSS). */
export const PHONE_MEDIA_QUERY = '(max-width: 767px), (max-height: 499px) and (orientation: landscape)';

// Phone tap-to-play tunables.
export const SHOW_TAP_HINT = true;
export const IDLE_REVEAL_MS = 15000;
export const CARD_FADE_MS = 700;
export const END_DISSOLVE_MS = 600;

export const VIDEO_HERO_SOURCES = {
  phonePlay: '/hero/hero-build-phone-play.mp4',
  large: '/hero/hero-build-2k.mp4',
  desktop: '/hero/hero-build-scrub.mp4',
  mobile: '/hero/hero-build-mobile.mp4',
  portrait: '/hero/hero-build-mobile-portrait.mp4',
  poster: { src: '/hero/hero-poster-2k.jpg', width: 2560, height: 1440 },
  posterPortrait: { src: '/hero/hero-poster-portrait.jpg', width: 720, height: 1280 },
  end: { src: '/hero/hero-end-2k.jpg', width: 2560, height: 1440 },
  endPortrait: { src: '/hero/hero-end-portrait.jpg', width: 1080, height: 1920 },
};

const LANDSCAPE_LADDER = [VIDEO_HERO_SOURCES.large, VIDEO_HERO_SOURCES.desktop, VIDEO_HERO_SOURCES.mobile];
const PORTRAIT_LADDER = [VIDEO_HERO_SOURCES.portrait, VIDEO_HERO_SOURCES.mobile];
const LARGE_MIN_DEVICE_WIDTH = 1920;
const MOBILE_MAX_WIDTH = 767;
const PHONE_LANDSCAPE_MAX_HEIGHT = 499;
const FREEZE_SECONDS = 184.5 / 24;
const HOLD_TAIL = 0.04;
const END_DISSOLVE = true;
const DISSOLVE_SPAN = 0.08;
const TIME_LERP = 0.18;
const FRAME_SECONDS = 1 / 24;
const SEEK_LAG_MS = 140;
const SEEK_LAG_SAMPLES = 12;
const SEEK_TEST_MS = 250;
const LOAD_TIMEOUT_MS = 3000;
const OFFSCREEN_RELEASE_MS = 1200;
const ONCE_START_PROGRESS = 0.01;
const OBJECT_POSITION =
  'object-[62%_50%] md:object-[50%_0%] portrait:object-[50%_50%] md:portrait:object-[50%_50%]';
const LANDSCAPE_PHONE_SHIFT =
  '[@media(max-height:499px)_and_(orientation:landscape)]:[translate:0_max(0px,calc(92px-0.145*max(100svh,56.25vw)))] ' +
  '[@media(max-height:499px)_and_(orientation:landscape)]:[mask-image:linear-gradient(to_bottom,transparent,#000_48px)]';

/** Scroll progress at which the video reaches its frozen final frame. */
const VIDEO_END_PROGRESS = 1 - HOLD_TAIL - (END_DISSOLVE ? DISSOLVE_SPAN : 0);

type Mode = 'scrub' | 'once' | 'lite' | 'still';
type Connection = { saveData?: boolean; effectiveType?: string };

// Portrait = taller than wide (a 667x375 phone is landscape even though it is under 768 wide).
const isPortrait = () => window.innerHeight > window.innerWidth;
const ladderFor = (portrait: boolean) => (portrait ? PORTRAIT_LADDER : LANDSCAPE_LADDER);

function pickMode(): Mode {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still';
  const conn = (navigator as Navigator & { connection?: Connection }).connection;
  if (conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? '')) return 'lite';
  return 'scrub';
}

/** Index into the ladder for the current orientation. */
function pickFileIndex(portrait: boolean): number {
  if (portrait) return 0;
  const w = window.innerWidth;
  if (w <= MOBILE_MAX_WIDTH || window.innerHeight <= PHONE_LANDSCAPE_MAX_HEIGHT) return 2;
  return w * (window.devicePixelRatio || 1) >= LARGE_MIN_DEVICE_WIDTH ? 0 : 1;
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);

/** Orientation-aware still: portrait art below the portrait media query, 2K art otherwise. */
function ArtStill({
  landscape,
  portrait,
  eager,
}: {
  landscape: { src: string; width: number; height: number };
  portrait: { src: string; width: number; height: number };
  eager?: boolean;
}) {
  const common = { alt: '', sizes: '100vw' };
  const {
    props: { srcSet: portraitSrcSet },
  } = getImageProps({ ...common, ...portrait });
  const { props } = getImageProps({ ...common, ...landscape });
  return (
    <picture>
      <source media="(orientation: portrait)" srcSet={portraitSrcSet} sizes="100vw" />
      <img
        {...props}
        alt=""
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        className={`absolute inset-0 w-full h-full object-cover ${OBJECT_POSITION}`}
      />
    </picture>
  );
}

/** Desktop, laptop and tablet: video time follows the pinned scroll. */
function ScrubPlayer({
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
  const [portrait, setPortrait] = useState<boolean | null>(null);
  const [fileIndex, setFileIndex] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    inViewRef.current = isInView;
  }, [isInView]);

  // Mode once; file by orientation, re-picked only when the orientation flips.
  useEffect(() => {
    setMode(pickMode());
    let current: boolean | null = null;
    const apply = () => {
      const p = isPortrait();
      if (p === current) return;
      current = p;
      setPortrait(p);
      setFileIndex(pickFileIndex(p));
    };
    apply();
    const mq = window.matchMedia('(orientation: portrait)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Release the video when the hero has been off-screen for a while or the tab is hidden.
  useEffect(() => {
    let timer = 0;
    const update = () => {
      window.clearTimeout(timer);
      if (document.hidden) setActive(false);
      else if (isInView) setActive(true);
      else timer = window.setTimeout(() => setActive(false), OFFSCREEN_RELEASE_MS);
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', update);
    };
  }, [isInView]);

  const ladder = portrait === null ? LANDSCAPE_LADDER : ladderFor(portrait);
  const videoMode = mode === 'scrub' || mode === 'once';
  // Scrub mode re-seeks from scroll on return, so it can release; play-once keeps its position.
  const loaded = active || mode === 'once';

  // Load the chosen file, refresh ScrollTrigger after metadata, release on change/unmount.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoMode || fileIndex === null || !loaded) return;
    const stepDown = () => {
      if (fileIndex < ladder.length - 1) setFileIndex(fileIndex + 1);
      else setMode('still');
    };
    const onMeta = () => ScrollTrigger.refresh();
    video.addEventListener('loadedmetadata', onMeta, { once: true });
    video.addEventListener('error', stepDown);
    video.src = ladder[fileIndex];
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('error', stepDown);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [videoMode, fileIndex, loaded, ladder]);

  // Scrub: ease the video time towards the scroll target in rAF; step down if seeks lag.
  // A first test seek (or no data at all) that is too slow switches to play-once mode.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'scrub' || fileIndex === null || !active) return;
    let raf = 0;
    let eased = -1;
    let shown = -1;
    let seekStart = 0;
    let tested = false;
    const lags: number[] = [];
    let seeksSeen = 0;
    const loadTimer = window.setTimeout(() => {
      if (video.readyState < 2) setMode('once');
    }, LOAD_TIMEOUT_MS);
    const onSeeked = () => {
      if (!seekStart) return;
      const lag = performance.now() - seekStart;
      seekStart = 0;
      if (!tested) {
        tested = true;
        if (lag > SEEK_TEST_MS) setMode('once');
        return;
      }
      seeksSeen += 1;
      if (seeksSeen > 4) lags.push(lag);
      if (lags.length >= SEEK_LAG_SAMPLES) {
        const median = [...lags].sort((a, b) => a - b)[lags.length >> 1];
        lags.length = 0;
        if (median > SEEK_LAG_MS && fileIndex < ladder.length - 1) setFileIndex(fileIndex + 1);
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
      window.clearTimeout(loadTimer);
      video.removeEventListener('seeked', onSeeked);
    };
  }, [mode, fileIndex, active, ladder, progressRef]);

  // End dissolve: opacity only, eased, starting once the video holds its frozen frame.
  useEffect(() => {
    const still = endStillRef.current;
    if (!END_DISSOLVE || !still || mode === null || mode === 'still') return;
    let raf = 0;
    let last = -1;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = Math.min(1, Math.max(0, ((progressRef.current ?? 0) - VIDEO_END_PROGRESS) / DISSOLVE_SPAN));
      const o = Math.round(easeInOut(t) * 1000) / 1000;
      if (o !== last) {
        still.style.opacity = `${o}`;
        last = o;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, progressRef]);

  // Once: rest on the first frame at the top; play from time 0 once the visitor starts
  // scrolling the hero, and rewind to the first frame if they return to the top.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode !== 'once') return;
    if (!isInView || !active) {
      video.pause();
      return;
    }
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const p = progressRef.current ?? 0;
      if (p <= ONCE_START_PROGRESS) {
        if (playedRef.current) {
          playedRef.current = false;
          video.pause();
          video.currentTime = 0;
        }
      } else if (!playedRef.current) {
        playedRef.current = true;
        video.currentTime = 0;
        video.play().catch(() => setMode('still'));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode, isInView, active, progressRef]);

  return (
    <div className={`absolute inset-0 z-10 w-full h-full pointer-events-none ${LANDSCAPE_PHONE_SHIFT}`}>
      {mode === 'still' ? (
        <ArtStill landscape={VIDEO_HERO_SOURCES.end} portrait={VIDEO_HERO_SOURCES.endPortrait} eager />
      ) : (
        <>
          {/* First paint: orientation-aware poster until the video has data. */}
          <ArtStill landscape={VIDEO_HERO_SOURCES.poster} portrait={VIDEO_HERO_SOURCES.posterPortrait} eager />
          {mode !== 'lite' && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover ${OBJECT_POSITION}`}
              poster={portrait ? VIDEO_HERO_SOURCES.posterPortrait.src : VIDEO_HERO_SOURCES.poster.src}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
            />
          )}
          {END_DISSOLVE && (
            <div ref={endStillRef} className="absolute inset-0" style={{ opacity: 0 }}>
              <ArtStill landscape={VIDEO_HERO_SOURCES.end} portrait={VIDEO_HERO_SOURCES.endPortrait} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

const TAP_MOVE_TOLERANCE_PX = 10;

/**
 * Phones: the first frame waits for a tap; the tap plays the clip once (play() runs inside
 * the gesture handler, as iOS requires), then the end still dissolves in and onEnd reveals
 * the card. A scroll swipe never starts it.
 */
function PhoneTapPlayer({ isInView, onEnd }: { isInView: boolean; onEnd?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const endStillRef = useRef<HTMLDivElement>(null);
  const onEndRef = useRef(onEnd);
  const startedRef = useRef(false);
  const doneRef = useRef(false);
  const [noVideo, setNoVideo] = useState(false);
  const [portrait, setPortrait] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest('section');
    if (!root || !hero) return;
    const timers: number[] = [];
    const conn = (navigator as Navigator & { connection?: Connection }).connection;
    const lite =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      Boolean(conn?.saveData) ||
      /(^|-)(2g|3g)$/.test(conn?.effectiveType ?? '');
    const isPortraitNow = window.innerHeight > window.innerWidth;
    setPortrait(isPortraitNow);
    let detach = () => {};

    // End still, then the card; immediate (no dissolve) when there was no video.
    const finish = (instant: boolean) => {
      if (doneRef.current) return;
      doneRef.current = true;
      detach();
      setHintVisible(false);
      videoRef.current?.pause();
      const still = endStillRef.current;
      if (still) {
        still.style.transition = instant ? 'none' : `opacity ${END_DISSOLVE_MS}ms ease`;
        still.style.opacity = '1';
      }
      timers.push(window.setTimeout(() => onEndRef.current?.(), instant ? 0 : END_DISSOLVE_MS));
    };

    if (lite) {
      setNoVideo(true);
      finish(true);
      return () => timers.forEach((t) => window.clearTimeout(t));
    }

    const video = videoRef.current;
    if (!video) return;
    video.preload = 'metadata';
    video.src = isPortraitNow ? VIDEO_HERO_SOURCES.phonePlay : VIDEO_HERO_SOURCES.mobile;
    if (SHOW_TAP_HINT) setHintVisible(true);

    const start = () => {
      if (startedRef.current || doneRef.current) return;
      setHintVisible(false);
      video.play().then(
        () => {
          startedRef.current = true;
          detach();
        },
        () => {
          // Keep the first frame; the next tap tries again.
          if (SHOW_TAP_HINT && !doneRef.current) setHintVisible(true);
        }
      );
    };

    let touchX = 0;
    let touchY = 0;
    let moved = false;
    let lastTouchTap = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchX = t.clientX;
      touchY = t.clientY;
      moved = false;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (Math.hypot(t.clientX - touchX, t.clientY - touchY) > TAP_MOVE_TOLERANCE_PX) moved = true;
    };
    const isOwnControl = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('a, button:not([data-tap-hint])'));
    const onTouchEnd = (e: TouchEvent) => {
      if (moved || isOwnControl(e.target)) return;
      lastTouchTap = performance.now();
      start();
    };
    // Mouse clicks and keyboard (Enter/Space on the hint button) arrive as click.
    const onClick = (e: MouseEvent) => {
      if (performance.now() - lastTouchTap < 700 || isOwnControl(e.target)) return;
      start();
    };
    const opts = { passive: true } as const;
    hero.addEventListener('touchstart', onTouchStart, opts);
    hero.addEventListener('touchmove', onTouchMove, opts);
    hero.addEventListener('touchend', onTouchEnd, opts);
    hero.addEventListener('click', onClick, opts);
    detach = () => {
      hero.removeEventListener('touchstart', onTouchStart);
      hero.removeEventListener('touchmove', onTouchMove);
      hero.removeEventListener('touchend', onTouchEnd);
      hero.removeEventListener('click', onClick);
    };

    // Play once to the frozen frame; never loop or seek.
    const onTime = () => {
      if (video.currentTime >= FREEZE_SECONDS) finish(false);
    };
    const onEnded = () => finish(false);
    const onError = () => finish(true);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    if (IDLE_REVEAL_MS > 0) {
      timers.push(
        window.setTimeout(() => {
          if (!startedRef.current) finish(false);
        }, IDLE_REVEAL_MS)
      );
    }

    return () => {
      detach();
      timers.forEach((t) => window.clearTimeout(t));
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, []);

  // Pause while off-screen or hidden; resume from the same point when back.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const update = () => {
      if (!startedRef.current || doneRef.current) return;
      if (document.hidden || !isInView) video.pause();
      else video.play().catch(() => {});
    };
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, [isInView]);

  return (
    <div ref={rootRef} className={`absolute inset-0 z-10 w-full h-full pointer-events-none ${LANDSCAPE_PHONE_SHIFT}`}>
      <ArtStill landscape={VIDEO_HERO_SOURCES.poster} portrait={VIDEO_HERO_SOURCES.posterPortrait} eager />
      {!noVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover ${OBJECT_POSITION}`}
          poster={portrait ? VIDEO_HERO_SOURCES.posterPortrait.src : VIDEO_HERO_SOURCES.poster.src}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />
      )}
      <div ref={endStillRef} className="absolute inset-0" style={{ opacity: 0 }}>
        <ArtStill landscape={VIDEO_HERO_SOURCES.end} portrait={VIDEO_HERO_SOURCES.endPortrait} />
      </div>
      {SHOW_TAP_HINT && !noVideo && (
        <div
          className={`absolute left-1/2 top-[67%] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[250ms] ${
            hintVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            type="button"
            data-tap-hint=""
            aria-label="Tap to play"
            tabIndex={hintVisible ? 0 : -1}
            className={`w-14 h-14 rounded-full border border-[#B8913A] bg-white/20 flex items-center justify-center animate-[hero-tap-pulse_2.4s_ease-in-out_infinite] ${
              hintVisible ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" fill="#B8913A" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Picks the phone tap-to-play player or the scroll-scrubbed player. onPhoneEnd is
 * called once the phone clip (or its fallback) has finished, to reveal the card.
 */
export function VideoHeroLayer({
  progressRef,
  isInView,
  onPhoneEnd,
}: {
  progressRef: React.RefObject<number>;
  isInView: boolean;
  onPhoneEnd?: () => void;
}) {
  const [phone, setPhone] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(PHONE_MEDIA_QUERY);
    const apply = () => setPhone(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  if (phone === null) {
    return (
      <div className={`absolute inset-0 z-10 w-full h-full pointer-events-none ${LANDSCAPE_PHONE_SHIFT}`}>
        <ArtStill landscape={VIDEO_HERO_SOURCES.poster} portrait={VIDEO_HERO_SOURCES.posterPortrait} eager />
      </div>
    );
  }
  return phone ? (
    <PhoneTapPlayer isInView={isInView} onEnd={onPhoneEnd} />
  ) : (
    <ScrubPlayer progressRef={progressRef} isInView={isInView} />
  );
}
