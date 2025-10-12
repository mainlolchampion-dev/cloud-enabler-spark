interface FloralBorderProps {
  position?: 'top' | 'bottom' | 'left' | 'right';
  color?: string;
  className?: string;
}

export function FloralBorder({ position = 'top', color = 'currentColor', className = '' }: FloralBorderProps) {
  const rotations = {
    top: 'rotate-0',
    bottom: 'rotate-180',
    left: 'rotate-90',
    right: '-rotate-90'
  };

  return (
    <div className={`absolute ${position}-0 left-0 right-0 pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 80"
        fill="none"
        className={`w-full h-auto ${rotations[position]} opacity-30`}
        preserveAspectRatio="none"
      >
        {/* Floral vine pattern */}
        <path
          d="M0,40 Q50,20 100,40 T200,40 T300,40 T400,40 T500,40 T600,40 T700,40 T800,40 T900,40 T1000,40 T1100,40 T1200,40"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        {/* Flowers along the vine */}
        {[100, 300, 500, 700, 900, 1100].map((x) => (
          <g key={x}>
            {/* Flower petals */}
            <circle cx={x} cy="30" r="8" fill={color} opacity="0.4" />
            <circle cx={x - 6} cy="36" r="8" fill={color} opacity="0.4" />
            <circle cx={x + 6} cy="36" r="8" fill={color} opacity="0.4" />
            <circle cx={x - 6} cy="44" r="8" fill={color} opacity="0.4" />
            <circle cx={x + 6} cy="44" r="8" fill={color} opacity="0.4" />
            {/* Flower center */}
            <circle cx={x} cy="38" r="5" fill={color} opacity="0.8" />
            
            {/* Leaves */}
            <ellipse cx={x - 15} cy="40" rx="6" ry="10" fill={color} opacity="0.3" transform={`rotate(-30 ${x - 15} 40)`} />
            <ellipse cx={x + 15} cy="40" rx="6" ry="10" fill={color} opacity="0.3" transform={`rotate(30 ${x + 15} 40)`} />
          </g>
        ))}
      </svg>
    </div>
  );
}
