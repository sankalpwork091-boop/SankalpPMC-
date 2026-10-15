'use client';

interface PinwheelLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  className?: string;
}

export function PinwheelLoader({
  size = 'md',
  label,
  className = '',
}: PinwheelLoaderProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // 8 trapezoidal blades radiating in a swirl matching the official Sankalp mark
  const blades = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className={`relative ${sizeMap[size]} animate-spin-slow`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(212,164,98,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {blades.map((deg, i) => (
            <path
              key={i}
              d="M50 50 L65 30 L55 20 L50 35 Z"
              fill="#D4A462"
              transform={`rotate(${deg} 50 50)`}
              className="opacity-95"
            />
          ))}
          {/* Subtle Center Hub */}
          <circle cx="50" cy="50" r="3.5" fill="#154C96" />
        </svg>
      </div>

      {label && (
        <span className="text-xs uppercase tracking-widest text-[#D4A462] font-semibold animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
