'use client';

interface Fallback2DProps {
  activeSection: number;
  progress: number;
}

export function Fallback2D({ activeSection }: Fallback2DProps) {
  const isTransformed = activeSection >= 11;
  const isProgressing = activeSection >= 3 && activeSection <= 10;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-30"
    >
      <div className="relative w-full max-w-2xl aspect-square flex items-center justify-center">
        {/* Architectural Vector Schematic */}
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full text-gold/40 transition-all duration-700"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          {/* Base Grid */}
          <line x1="50" y1="550" x2="350" y2="550" strokeWidth="2" stroke="currentColor" />

          {!isTransformed ? (
            /* Old 4-Storey Society Building Vector */
            <g className="transition-opacity duration-500">
              <rect x="100" y="320" width="200" height="230" fill="currentColor" fillOpacity="0.05" />
              <line x1="100" y1="380" x2="300" y2="380" strokeDasharray="4 4" />
              <line x1="100" y1="440" x2="300" y2="440" strokeDasharray="4 4" />
              <line x1="100" y1="500" x2="300" y2="500" strokeDasharray="4 4" />
              {/* Overhead water tanks */}
              <rect x="130" y="280" width="40" height="40" rx="4" />
              <rect x="190" y="280" width="40" height="40" rx="4" />
            </g>
          ) : (
            /* New High-Rise Tower Vector */
            <g className="transition-opacity duration-500">
              <rect x="120" y="100" width="160" height="450" fill="currentColor" fillOpacity="0.1" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="120"
                  y1={140 + i * 32}
                  x2="280"
                  y2={140 + i * 32}
                  strokeOpacity="0.6"
                />
              ))}
              {/* Modern Rooftop Spire */}
              <line x1="200" y1="100" x2="200" y2="50" strokeWidth="2" />
              <polygon points="170,100 200,60 230,100" fill="currentColor" fillOpacity="0.2" />
            </g>
          )}

          {/* Blueprint Scanning Ring */}
          {isProgressing && (
            <circle
              cx="200"
              cy="350"
              r="140"
              stroke="#38bdf8"
              strokeDasharray="6 6"
              className="animate-spin-slow origin-center"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
