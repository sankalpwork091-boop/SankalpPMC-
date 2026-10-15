'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/siteConfig';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
      <div className="glass-card mx-3 mt-3 md:mx-6 md:mt-4 px-4 py-3 md:px-6 md:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Sankalp PMC Home">
          <Image
            src="/images/logo.png"
            alt="Sankalp PMC Logo"
            width={44}
            height={44}
            className="w-10 h-10 md:w-11 md:h-11"
            priority
          />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight text-text-light">
              Sankalp PMC
            </p>
            <p className="text-[10px] text-text-muted leading-tight">
              Project Management Consultants
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-text-muted hover:text-gold transition-colors duration-300 rounded-md hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href={`tel:${siteConfig.phones[0].replace(/\s/g, '')}`}
            className="btn-primary text-sm !py-2 !px-4 hidden md:inline-flex"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </a>

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-[2px] bg-text-light transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-full h-[2px] bg-text-light transition-all duration-300 ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-[2px] bg-text-light transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-card mx-3 mt-2 p-4"
            aria-label="Mobile navigation"
          >
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base text-text-muted hover:text-gold hover:bg-white/5 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-white/10">
              <a
                href={`tel:${siteConfig.phones[0].replace(/\s/g, '')}`}
                className="btn-primary w-full justify-center text-sm"
              >
                Call {siteConfig.phones[0]}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
