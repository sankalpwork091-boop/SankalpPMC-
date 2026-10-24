'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { services } from '@/data/services';

// Quiet decorative border of the service icons down both edges of the viewport.
// Not on the home page, and only when the viewport leaves room beside the widest
// content container (max-w-7xl = 1280px) so it never covers content. Runs the full
// viewport height; z-index 40 keeps it behind the navbar (z-100).

const MIN_WIDTH = '(min-width: 1360px)';
const PITCH = 64; // space per icon

function Strip({ side, count }: { side: 'left' | 'right'; count: number }) {
  return (
    <div
      className={`fixed ${side === 'left' ? 'left-0' : 'right-0'} w-10 flex flex-col items-center justify-around print:hidden`}
      style={{ top: 0, bottom: 0, zIndex: 40, pointerEvents: 'none' }}
    >
      {Array.from({ length: count }, (_, i) => {
        const service = services[i % services.length];
        return (
          <Image
            key={i}
            src={service.icon}
            alt=""
            width={20}
            height={20}
            draggable={false}
            className="w-5 h-5 object-contain opacity-65 select-none"
          />
        );
      })}
    </div>
  );
}

export function ServiceIconBorder() {
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(MIN_WIDTH);
    const update = () => {
      setCount(mq.matches ? Math.max(0, Math.floor(window.innerHeight / PITCH)) : 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (pathname === '/' || count === 0) return null;

  return (
    <div aria-hidden="true">
      <Strip side="left" count={count} />
      <Strip side="right" count={count} />
    </div>
  );
}
