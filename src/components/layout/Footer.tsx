'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';

export function Footer() {
  const pathname = usePathname();

  // On home page, hero is the exclusive section
  if (pathname === '/') return null;

  const socialLinks = [
    {
      name: 'Instagram',
      href: siteConfig.social.instagram,
      ariaLabel: 'Sankalp PMC on Instagram',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: siteConfig.social.facebook,
      ariaLabel: 'Sankalp PMC on Facebook',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 011.141.195v3.325a8.623 8.623 0 00-.653-.036 7.834 7.834 0 00-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 00-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: siteConfig.social.youtube,
      ariaLabel: 'Sankalp PMC on YouTube',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="relative z-10 bg-[#1B1B1F] border-t border-[#B8913A]/25 text-[#FAF7F0]">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] items-start gap-8 lg:gap-10">
          {/* Column 1: Brand */}
          <RevealItem>
            <div className="h-10 flex items-center mb-5">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/images/logo.png"
                  alt="Sankalp PMC Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain shrink-0"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-heading text-base font-bold text-[#FAF7F0] leading-tight">
                    Sankalp PMC
                  </p>
                  <p className="text-xs text-[#FAF7F0]/60 leading-tight">
                    Project Management Consultants
                  </p>
                </div>
              </Link>
            </div>
            <p className="text-sm text-[#FAF7F0]/75 leading-relaxed max-w-sm">
              {siteConfig.description}
            </p>
          </RevealItem>

          {/* Column 2: Quick Links */}
          <RevealItem>
            <div className="h-10 flex items-center mb-5">
              <h3 className="text-sm font-semibold !text-[#D4AF5A] uppercase tracking-wider">
                Quick Links
              </h3>
            </div>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[#FAF7F0]/75 hover:text-[#D4AF5A] transition-colors leading-relaxed"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </RevealItem>

          {/* Column 3: Contact Info */}
          <RevealItem>
            <div className="h-10 flex items-center mb-5">
              <h3 className="text-sm font-semibold !text-[#D4AF5A] uppercase tracking-wider">
                Contact Us
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {siteConfig.addresses.map((addr) => (
                <div key={addr.label}>
                  <p className="text-xs font-semibold text-[#D4AF5A] mb-1">
                    {addr.label}
                  </p>
                  <p className="text-sm text-[#FAF7F0]/75 leading-relaxed">
                    {addr.line1}, {addr.line2}
                    <br />
                    {addr.city}, {addr.state} – {addr.pin}
                  </p>
                </div>
              ))}
              {siteConfig.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="text-sm text-[#FAF7F0]/75 hover:text-[#D4AF5A] transition-colors leading-relaxed"
                >
                  {phone}
                </a>
              ))}
            </div>
          </RevealItem>

          {/* Column 4: Social */}
          <RevealItem>
            <div className="h-10 flex items-center mb-5">
              <h3 className="text-sm font-semibold !text-[#D4AF5A] uppercase tracking-wider">
                Follow Us
              </h3>
            </div>
            <div className="flex flex-col gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.ariaLabel}
                  className="group inline-flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF5A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1B1B1F] rounded-full w-fit"
                >
                  <span className="w-10 h-10 rounded-full border border-[#B8913A]/50 bg-white/5 flex items-center justify-center text-[#D4AF5A] group-hover:bg-gradient-to-r group-hover:from-[#D4AF5A] group-hover:to-[#B8913A] group-hover:text-[#1B1B1F] group-hover:border-transparent transition-all duration-300 shrink-0">
                    {item.icon}
                  </span>
                  <span className="text-sm text-[#FAF7F0]/75 group-hover:text-[#D4AF5A] transition-colors leading-relaxed">
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>

        {/* Bottom Bar */}
        <Reveal className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#FAF7F0]/60">
            © 2025 {siteConfig.shortName}. All rights reserved.
          </p>
          <p className="text-xs text-[#FAF7F0]/60">
            Redevelopment done right — for the hearts homes are built for.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
