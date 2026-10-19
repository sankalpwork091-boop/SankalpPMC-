'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Reveal components now come from the shared motion system; these names are
// kept so existing pages keep working unchanged.
export {
  Reveal as ScrollReveal,
  RevealGroup as StaggerContainer,
  RevealItem as StaggerItem,
  RevealHeading as HeadingWithGoldLine,
  RevealImage as ImageReveal,
} from '@/components/motion/Reveal';

export function AnimatedNumber({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp: number | null = null;
    const duration = 1200;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value]);

  return (
    <motion.span
      onViewportEnter={() => setHasStarted(true)}
      viewport={{ once: true, amount: 0.2 }}
      className="inline-block tabular-nums"
    >
      {prefix}
      {count}
      {suffix}
    </motion.span>
  );
}
