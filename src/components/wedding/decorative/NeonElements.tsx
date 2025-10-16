interface NeonElementsProps {
  element: 'disco-ball' | 'vinyl' | 'neon-star' | 'lightning';
  color?: string;
  className?: string;
  size?: number;
  glowIntensity?: 'low' | 'medium' | 'high';
}

export function NeonElements({ 
  element, 
  color = '#EC4899', 
  className = '', 
  size = 80,
  glowIntensity = 'medium' 
}: NeonElementsProps) {
  const glowBlur = {
    low: 8,
    medium: 15,
    high: 25
  };

  const elements = {
    'disco-ball': (
      <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
        <defs>
          <filter id="disco-glow">
            <feGaussianBlur stdDeviation={glowBlur[glowIntensity]} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="disco-gradient">
            <stop offset="0%" stopColor={color} stopOpacity="0.9"/>
            <stop offset="50%" stopColor={color} stopOpacity="0.6"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.3"/>
          </radialGradient>
        </defs>
        
        {/* Main ball */}
        <circle cx="50" cy="50" r="35" fill="url(#disco-gradient)" filter="url(#disco-glow)" />
        
        {/* Mirror squares pattern */}
        {Array.from({ length: 8 }).map((_, row) => 
          Array.from({ length: 8 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={20 + col * 7.5}
              y={20 + row * 7.5}
              width="6"
              height="6"
              fill={color}
              opacity={(row + col) % 2 === 0 ? 0.8 : 0.4}
            />
          ))
        )}
        
        {/* Highlight */}
        <circle cx="40" cy="40" r="8" fill="white" opacity="0.6" />
      </svg>
    ),
    'vinyl': (
      <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
        <defs>
          <filter id="vinyl-glow">
            <feGaussianBlur stdDeviation={glowBlur[glowIntensity]} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Vinyl disc */}
        <circle cx="50" cy="50" r="40" fill={color} opacity="0.3" filter="url(#vinyl-glow)" />
        
        {/* Grooves */}
        {[35, 30, 25, 20, 15].map((r) => (
          <circle 
            key={r}
            cx="50" 
            cy="50" 
            r={r} 
            fill="none" 
            stroke={color} 
            strokeWidth="1" 
            opacity="0.4"
          />
        ))}
        
        {/* Center label */}
        <circle cx="50" cy="50" r="12" fill={color} opacity="0.7" filter="url(#vinyl-glow)" />
        <circle cx="50" cy="50" r="3" fill="black" opacity="0.8" />
      </svg>
    ),
    'neon-star': (
      <svg viewBox="0 0 100 100" fill="none" className={className} style={{ width: size, height: size }}>
        <defs>
          <filter id="star-glow">
            <feGaussianBlur stdDeviation={glowBlur[glowIntensity]} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* 5-pointed star */}
        <path
          d="M 50 10 L 61 40 L 92 40 L 68 58 L 78 88 L 50 68 L 22 88 L 32 58 L 8 40 L 39 40 Z"
          fill={color}
          opacity="0.8"
          filter="url(#star-glow)"
        />
        
        {/* Inner glow */}
        <path
          d="M 50 25 L 57 45 L 77 45 L 62 56 L 68 76 L 50 63 L 32 76 L 38 56 L 23 45 L 43 45 Z"
          fill="white"
          opacity="0.4"
        />
      </svg>
    ),
    'lightning': (
      <svg viewBox="0 0 60 100" fill="none" className={className} style={{ width: size * 0.6, height: size }}>
        <defs>
          <filter id="lightning-glow">
            <feGaussianBlur stdDeviation={glowBlur[glowIntensity]} result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Lightning bolt */}
        <path
          d="M 30 10 L 20 45 L 35 45 L 15 90 L 40 50 L 25 50 Z"
          fill={color}
          opacity="0.9"
          filter="url(#lightning-glow)"
        />
        
        {/* Inner highlight */}
        <path
          d="M 30 15 L 24 45 L 33 45 L 20 80 L 38 50 L 28 50 Z"
          fill="white"
          opacity="0.5"
        />
      </svg>
    ),
  };

  return elements[element];
}
