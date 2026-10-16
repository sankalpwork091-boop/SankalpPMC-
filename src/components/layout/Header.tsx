'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/siteConfig';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      <div className="mx-3 mt-3 md:mx-6 md:mt-4 px-4 py-3 md:px-6 md:py-3 flex items-center justify-between rounded-2xl transition-all duration-300 bg-white/90 backdrop-blur-xl border border-[#E9E2D0] shadow-[0_4px_24px_rgba(143,107,30,0.07)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="Sankalp PMC Home">
          <Image
            src="/images/logo.png"
            alt="Sankalp PMC Logo"
            width={44}
            height={44}
            className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-sm"
            priority
          />
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-bold leading-tight transition-colors duration-300 text-[#1B1B1F]">
              Sankalp PMC
            </p>
            <p className="text-[10px] leading-tight transition-colors duration-300 text-[#5B5B63]">
              Project Management Consultants
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {siteConfig.nav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-md group ${
                  isActive
                    ? 'text-[#8F6B1E]'
                    : 'text-[#5B5B63] hover:text-[#8F6B1E]'
                }`}
              >
                {item.label}
                {/* Gold hover/active underline */}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#B8913A] opacity-100 scale-x-100'
                      : 'bg-[#B8913A] opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact-us"
            className="btn-primary text-sm !py-2 !px-4 hidden md:inline-flex"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Contact
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md transition-colors hover:bg-black/5"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-[2px] transition-all duration-300 bg-[#1B1B1F] ${
                  isOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`}
              />
              <span
                className={`w-full h-[2px] transition-all duration-300 bg-[#1B1B1F] ${
                  isOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-full h-[2px] transition-all duration-300 bg-[#1B1B1F] ${
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
            className="lg:hidden mx-3 mt-2 p-4 rounded-2xl border transition-all duration-300 bg-white/95 border-[#E9E2D0] text-[#1B1B1F] shadow-xl"
            aria-label="Mobile navigation"
          >
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base rounded-md font-medium transition-colors ${
                    isActive
                      ? 'text-[#8F6B1E] bg-[#FAF7F0] font-semibold'
                      : 'text-[#5B5B63] hover:text-[#8F6B1E] hover:bg-[#FAF7F0]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="mt-3 pt-3 border-t border-[#E9E2D0]">
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
