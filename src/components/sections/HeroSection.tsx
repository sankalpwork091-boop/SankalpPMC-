'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteConfig } from '@/data/siteConfig';

export function HeroSection() {
  return (
    <section
      data-section="0"
      className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 z-10"
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/25 text-gold text-xs font-medium uppercase tracking-wider mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Advocate-Led Redevelopment Consultancy
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-light leading-[1.15] mb-6"
        >
          We are here to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-soft via-gold to-gold-dark italic">
            change the idea
          </span>{' '}
          of redevelopment.
        </motion.h1>

        {/* Lead Statement */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl text-base sm:text-lg md:text-xl text-text-muted leading-relaxed mb-10"
        >
          {siteConfig.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a
            href="#process-step-1"
            className="btn-primary w-full sm:w-auto text-center"
          >
            Explore 10-Step Journey
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
          <Link
            href="/contact-us"
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Request Committee Meeting
          </Link>
        </motion.div>

        {/* Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 sm:mt-24 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-text-muted/70"
        >
          <span>Scroll to begin transformation</span>
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-1 h-2 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
