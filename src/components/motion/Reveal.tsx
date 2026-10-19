'use client';

import React, { useLayoutEffect, useRef } from 'react';

/*
 * Shared scroll-reveal system for every page except the home page.
 *
 * - One IntersectionObserver for the whole page; elements are revealed once
 *   and never replayed.
 * - Hidden/visible states live in globals.css ("Scroll motion") and only
 *   apply while <html data-motion="on"> is set by MOTION_BOOT_SCRIPT, so the
 *   server HTML is always visible without JS.
 * - Timings (distance, duration, easing, mobile values) are the --reveal-*
 *   custom properties in globals.css; trigger point and stagger are below.
 */

export type RevealVariant = 'up' | 'fade' | 'image';

export const REVEAL_ROOT_MARGIN = '0px 0px -12% 0px';
export const REVEAL_STAGGER_MS = 80;
export const REVEAL_STAGGER_CAP = 6;
const SAFETY_TIMEOUT_MS = 2500;

interface RevealWindow extends Window {
  __revealScript?: number;
  __revealBooted?: boolean;
  __revealFallback?: number;
}

if (typeof window !== 'undefined') {
  (window as RevealWindow).__revealBooted = true;
}

let observer: IntersectionObserver | null = null;
const pending = new Set<HTMLElement>();
let safetyTimer: number | undefined;

function motionEnabled() {
  return document.documentElement.getAttribute('data-motion') === 'on';
}

// React Strict Mode (dev) resets <html> attributes on remount; restore the
// flag before paint, but only if the boot script ran and did not fall back.
function ensureMotionFlag() {
  const w = window as RevealWindow;
  if (!w.__revealScript || w.__revealFallback) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.setAttribute('data-motion', 'on');
}

export function revealElement(el: HTMLElement, delayMs = 0) {
  if (el.hasAttribute('data-revealed')) return;
  if (motionEnabled()) {
    if (delayMs > 0) el.style.setProperty('--reveal-delay', `${delayMs}ms`);
    el.style.willChange =
      el.getAttribute('data-reveal') === 'image' ? 'opacity, scale' : 'opacity, translate';
    const clear = () => {
      el.style.willChange = '';
      el.removeEventListener('transitionend', onEnd);
    };
    const onEnd = (e: TransitionEvent) => {
      if (e.target === el && e.propertyName === 'opacity') clear();
    };
    el.addEventListener('transitionend', onEnd);
    window.setTimeout(clear, 2000 + delayMs);
  }
  el.setAttribute('data-revealed', '');
}

function forget(el: HTMLElement) {
  pending.delete(el);
  observer?.unobserve(el);
  if (pending.size === 0 && observer) {
    observer.disconnect();
    observer = null;
    window.removeEventListener('scroll', checkPageBottom);
    window.clearTimeout(safetyTimer);
  }
}

function handleIntersect(entries: IntersectionObserverEntry[]) {
  // Items of the same group that enter together are staggered in DOM order.
  const groupCounts = new Map<Element, number>();
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const el = entry.target as HTMLElement;
    forget(el);
    let delayMs = 0;
    const group = el.hasAttribute('data-reveal-item') ? el.closest('[data-reveal-group]') : null;
    if (group) {
      const k = groupCounts.get(group) ?? 0;
      groupCounts.set(group, k + 1);
      delayMs = Math.min(k, REVEAL_STAGGER_CAP - 1) * REVEAL_STAGGER_MS;
    }
    revealElement(el, delayMs);
  }
}

function revealPendingInView() {
  const viewportBottom = window.innerHeight;
  pending.forEach((el) => {
    if (el.getBoundingClientRect().top < viewportBottom) {
      forget(el);
      revealElement(el);
    }
  });
}

// Anything in or above the viewport that has not revealed after 2.5s is shown.
function scheduleSafetyReveal() {
  window.clearTimeout(safetyTimer);
  safetyTimer = window.setTimeout(revealPendingInView, SAFETY_TIMEOUT_MS);
}

// Content in the last 12% of a page can never cross the trigger line, so
// reveal what is on screen once the visitor reaches the bottom.
let bottomCheckQueued = false;
function checkPageBottom() {
  if (bottomCheckQueued) return;
  bottomCheckQueued = true;
  window.requestAnimationFrame(() => {
    bottomCheckQueued = false;
    const doc = document.documentElement;
    if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) revealPendingInView();
  });
}

function observe(el: HTMLElement) {
  if (el.hasAttribute('data-revealed')) return;
  if (!motionEnabled()) {
    revealElement(el);
    return;
  }
  if (!observer) {
    observer = new IntersectionObserver(handleIntersect, {
      rootMargin: REVEAL_ROOT_MARGIN,
      threshold: 0,
    });
    window.addEventListener('scroll', checkPageBottom, { passive: true });
  }
  pending.add(el);
  observer.observe(el);
  scheduleSafetyReveal();
  checkPageBottom();
}

interface RevealOptions {
  /** Extra delay in seconds. */
  delay?: number;
  /** Part of a RevealGroup stagger. */
  item?: boolean;
  /** Render without any reveal (e.g. cards already on screen). */
  disabled?: boolean;
}

export interface RevealProps<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  'data-reveal'?: RevealVariant;
  'data-reveal-item'?: '';
  style?: React.CSSProperties;
}

/** Spread the result onto an existing element to reveal it on scroll. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  variant: RevealVariant = 'up',
  { delay = 0, item = false, disabled = false }: RevealOptions = {}
): RevealProps<T> {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    ensureMotionFlag();
    const el = ref.current;
    // "fade" is a CSS-only load animation and needs no observer.
    if (!el || disabled || variant === 'fade') return;
    observe(el);
    return () => forget(el);
  }, [variant, disabled]);

  if (disabled) return { ref };
  return {
    ref,
    'data-reveal': variant,
    ...(item ? { 'data-reveal-item': '' as const } : {}),
    ...(delay > 0
      ? { style: { '--reveal-delay': `${Math.round(delay * 1000)}ms` } as React.CSSProperties }
      : {}),
  };
}

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  item = false,
  style,
  ...rest
}: DivProps & { variant?: RevealVariant; delay?: number; item?: boolean }) {
  const reveal = useReveal<HTMLDivElement>(variant, { delay, item });
  return (
    <div {...rest} {...reveal} style={{ ...style, ...reveal.style }}>
      {children}
    </div>
  );
}

/** Container whose RevealItem children stagger in. Adds no motion itself. */
export function RevealGroup({ children, ...rest }: DivProps) {
  return (
    <div data-reveal-group="" {...rest}>
      {children}
    </div>
  );
}

export function RevealItem(props: DivProps & { delay?: number }) {
  return <Reveal {...props} item />;
}

/** Heading block that fades up, then draws its gold line left to right. */
export function RevealHeading({
  children,
  className = '',
  align = 'center',
}: {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const reveal = useReveal<HTMLDivElement>('up');
  return (
    <div {...reveal} className={`relative ${className}`}>
      {children}
      <span
        data-reveal-line=""
        className={`block h-[2px] w-12 bg-gradient-to-r from-[#B8913A] via-[#D4AF5A] to-[#B8913A] mt-3 origin-left ${
          align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : ''
        }`}
      />
    </div>
  );
}

/**
 * Place inside an existing positioned, overflow-hidden image box around a
 * `fill` image. Scales 1.04 -> 1 while fading in; the box itself is untouched.
 */
export function RevealImage({ children }: { children: React.ReactNode }) {
  const reveal = useReveal<HTMLDivElement>('image');
  return (
    <div {...reveal} className="absolute inset-0">
      {children}
    </div>
  );
}
