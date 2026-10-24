import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-24 bg-[#F6F0E3]">
      <div className="max-w-md w-full text-center bg-white border border-[#E9E2D0] rounded-2xl p-8 sm:p-10 shadow-sm">
        <span className="font-heading text-5xl sm:text-6xl font-bold text-[#8F6B1E] block mb-2">
          404
        </span>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1B1B1F] mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-[#5B5B63] leading-relaxed mb-8">
          The page you are looking for does not exist, has been removed, or has moved to a new address.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#D4AF5A] text-[#1B1B1F] font-semibold text-sm hover:bg-[#c49f4a] transition-all"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
