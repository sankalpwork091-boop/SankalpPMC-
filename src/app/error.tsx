'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { logger } from '@/lib/logger';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized error digest for diagnostic monitoring
    logger.error('Application runtime error occurred', error, {
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#FAF7F0]">
      <div className="max-w-md w-full text-center bg-white border border-[#E9E2D0] rounded-2xl p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FAF7F0] border border-[#E9E2D0] flex items-center justify-center text-[#8F6B1E] text-2xl font-bold">
          !
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
          Something Went Wrong
        </h1>
        <p className="text-sm text-[#5B5B63] leading-relaxed mb-8">
          We encountered an unexpected issue while loading this page. Please try again or return to the home page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#D4AF5A] text-[#1B1B1F] font-semibold text-sm hover:bg-[#c49f4a] transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-white border border-[#E9E2D0] text-[#1B1B1F] font-semibold text-sm hover:border-[#B8913A] transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
