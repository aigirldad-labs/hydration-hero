interface BottleVisualizerProps {
  fillPercent: number;
  goalOz: number;
}

export function BottleVisualizer({ fillPercent, goalOz }: BottleVisualizerProps) {
  const isEmpty = fillPercent === 0;
  const fillHeight = Math.max(0, Math.min(100, fillPercent * 100));

  return (
    <div className="flex justify-center py-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className={`relative ${!isEmpty ? 'bottle-glow animate-pulse-glow' : ''}`}>
        {/* Bottle SVG */}
        <svg
          width="140"
          height="280"
          viewBox="0 0 140 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottle outline */}
          <defs>
            <clipPath id="bottleClip">
              {/* Neck */}
              <rect x="50" y="0" width="40" height="30" rx="4" />
              {/* Shoulder transition */}
              <path d="M50 30 L20 60 L20 260 Q20 275 35 275 L105 275 Q120 275 120 260 L120 60 L90 30 Z" />
            </clipPath>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(190, 90%, 55%)" />
              <stop offset="100%" stopColor="hsl(200, 90%, 45%)" />
            </linearGradient>
            <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(220, 15%, 20%)" />
              <stop offset="50%" stopColor="hsl(220, 15%, 28%)" />
              <stop offset="100%" stopColor="hsl(220, 15%, 20%)" />
            </linearGradient>
          </defs>

          {/* Bottle body background */}
          <g clipPath="url(#bottleClip)">
            <rect x="0" y="0" width="140" height="280" fill="url(#bottleGradient)" />
            
            {/* Water fill */}
            {!isEmpty && (
              <g className="water-fill">
                <rect
                  x="0"
                  y={280 - (fillHeight * 2.45)}
                  width="140"
                  height={fillHeight * 2.45 + 10}
                  fill="url(#waterGradient)"
                  className="transition-all duration-500 ease-out"
                />
                {/* Wave effect at top of water */}
                <ellipse
                  cx="70"
                  cy={280 - (fillHeight * 2.45)}
                  rx="50"
                  ry="8"
                  fill="hsl(190, 90%, 60%)"
                  className="animate-water-wave"
                  style={{ opacity: fillHeight > 5 ? 0.6 : 0 }}
                />
              </g>
            )}
          </g>

          {/* Bottle outline stroke */}
          <path
            d="M54 4 L86 4 Q90 4 90 8 L90 30 L118 58 Q120 60 120 62 L120 258 Q120 272 106 272 L34 272 Q20 272 20 258 L20 62 Q20 60 22 58 L50 30 L50 8 Q50 4 54 4 Z"
            stroke="hsl(220, 15%, 35%)"
            strokeWidth="3"
            fill="none"
          />

          {/* Cap */}
          <rect
            x="46"
            y="0"
            width="48"
            height="8"
            rx="4"
            fill="hsl(220, 15%, 30%)"
            stroke="hsl(220, 15%, 40%)"
            strokeWidth="1"
          />

          {/* Highlight reflection */}
          <path
            d="M30 80 L30 240"
            stroke="hsl(0, 0%, 100%)"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.1"
          />
        </svg>

        {/* Empty state text */}
        {isEmpty && goalOz > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded">
              Empty!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
