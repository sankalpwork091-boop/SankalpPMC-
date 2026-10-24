'use client';

import { useEffect, useRef, useState } from 'react';

// Sankalp starburst cursor for mouse devices only. Position, hover and press are
// written straight to the DOM from refs, so mouse movement never re-renders React.

const SIZE = 28;
const HALF = SIZE / 2;
const EASE = 0.2;
const HOVER_SCALE = 1.4;
const PRESS_SCALE = 0.9;

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const CLICKABLE = [
  'a[href]',
  'button',
  '[role="button"]',
  'label',
  'summary',
  'input[type="submit"]',
  'input[type="button"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="file"]',
  'input[type="image"]',
  'input[type="range"]',
  'input[type="color"]',
  '.group',
  '.cursor-pointer',
  '[class*="hover:-translate-y"]', // GlassCard and other lifting cards
].join(',');

const TEXT_FIELD =
  'input:not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="image"]):not([type="range"]):not([type="color"]), textarea, select, [contenteditable]:not([contenteditable="false"])';

// Starburst blades traced from src/app/icon.png (512px canvas).
const BLADES = [
  '276,67 313,225 196,79',
  '347,88 410,144 324,278',
  '130,109 265,194 79,173',
  '48,247 213,207 67,323',
  '442,208 451,289 295,326',
  '97,391 181,255 160,440',
  '194,310 312,455 229,460',
  '244,339 430,360 377,421',
];

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const root = document.documentElement;
    const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reduceMq.matches;
    const applyReduce = () => {
      reduce = reduceMq.matches;
      inner.style.transition = reduce ? 'none' : 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1)';
    };
    applyReduce();

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let started = false;
    let inWindow = true;
    let overText = false;
    let hovering = false;
    let pressed = false;
    let raf = 0;

    const place = () => {
      outer.style.transform = `translate3d(${x - HALF}px, ${y - HALF}px, 0)`;
    };
    const tick = () => {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;
      if (Math.abs(targetX - x) < 0.1 && Math.abs(targetY - y) < 0.1) {
        x = targetX;
        y = targetY;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      place();
    };
    const syncVisibility = () => {
      outer.style.opacity = started && inWindow && !overText ? '1' : '0';
    };
    const syncScale = () => {
      const scale = (hovering ? HOVER_SCALE : 1) * (pressed ? PRESS_SCALE : 1);
      inner.style.transform = `scale(${scale})`;
    };
    const readTarget = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      overText = !!el?.closest(TEXT_FIELD);
      hovering = !overText && !!el?.closest(CLICKABLE);
      syncScale();
      syncVisibility();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (!started || reduce || !inWindow) {
        // First move, or coming back into the window: jump, don't glide in.
        x = targetX;
        y = targetY;
        place();
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
      if (!started) {
        started = true;
        root.classList.add('has-custom-cursor');
        readTarget(e.target);
      }
      if (!inWindow) {
        inWindow = true;
        syncVisibility();
      }
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') readTarget(e.target);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pressed = true;
      syncScale();
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pressed = false;
      syncScale();
    };
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      inWindow = false;
      pressed = false;
      syncScale();
      syncVisibility();
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseout', onLeave, { passive: true });
    reduceMq.addEventListener('change', applyReduce);

    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseout', onLeave);
      reduceMq.removeEventListener('change', applyReduce);
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={outerRef}
      aria-hidden="true"
      data-custom-cursor=""
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: SIZE,
        height: SIZE,
        zIndex: 2147483647,
        pointerEvents: 'none',
        opacity: 0,
        willChange: 'transform',
        transform: `translate3d(-${SIZE * 2}px, -${SIZE * 2}px, 0)`,
      }}
    >
      <div ref={innerRef} style={{ width: '100%', height: '100%' }}>
        <svg
          viewBox="40 54 420 420"
          width={SIZE}
          height={SIZE}
          style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 1px 2px rgba(27, 27, 31, 0.35))' }}
        >
          <defs>
            <linearGradient id="custom-cursor-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#E1B15C" />
              <stop offset="1" stopColor="#B2843A" />
            </linearGradient>
          </defs>
          <g fill="url(#custom-cursor-gold)" stroke="#9C7128" strokeWidth="5" strokeLinejoin="round">
            {BLADES.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
