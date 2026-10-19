import type { Metadata } from 'next';
import './globals.css';
import { siteConfig } from '@/data/siteConfig';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LenisProvider } from '@/components/scroll/LenisProvider';
import { JsonLd } from '@/components/seo/JsonLd';
import { MOTION_BOOT_SCRIPT } from '@/components/motion/motionScript';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} — Redevelopment Consultancy`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    'redevelopment',
    'PMC',
    'project management consultant',
    'housing society',
    'co-operative society',
    'Navi Mumbai',
    'Mumbai',
    'MMR',
    'Sankalp',
    'redevelopment consultant',
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    siteName: siteConfig.shortName,
    title: `${siteConfig.shortName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: '/images/logo.png', width: 400, height: 400, alt: siteConfig.shortName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.shortName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_BOOT_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..800;1,400..800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1B1B1F]">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        <LenisProvider>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LenisProvider>
        <JsonLd />
      </body>
    </html>
  );
}
