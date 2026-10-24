'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Root global error occurred', error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#F6F0E3', color: '#1B1B1F' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '440px', width: '100%', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #E9E2D0', borderRadius: '16px', padding: '40px 32px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '64px', height: '64px', margin: '0 auto 24px', borderRadius: '50%', backgroundColor: '#F6F0E3', border: '1px solid #E9E2D0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8F6B1E', fontSize: '24px', fontWeight: 'bold' }}>
              !
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px', color: '#1B1B1F' }}>
              System Error
            </h1>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#5B5B63', margin: '0 0 32px' }}>
              A temporary issue occurred while rendering the application. Please refresh or try again.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => reset()}
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#D4AF5A', color: '#1B1B1F', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                Try Again
              </button>
              <Link
                href="/"
                style={{ padding: '12px 24px', borderRadius: '10px', backgroundColor: '#ffffff', color: '#1B1B1F', fontWeight: 600, fontSize: '14px', border: '1px solid #E9E2D0', textDecoration: 'none' }}
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
