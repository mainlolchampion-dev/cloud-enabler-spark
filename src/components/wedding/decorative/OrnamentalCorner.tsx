interface OrnamentalCornerProps {
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pattern?: 'floral' | 'geometric' | 'vintage';
  color?: string;
  size?: number;
}

export function OrnamentalCorner({ 
  corner = 'top-left', 
  pattern = 'floral',
  color = 'currentColor',
  size = 100
}: OrnamentalCornerProps) {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]'
  };

  const patterns = {
    floral: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Curved stem */}
        <path
          d="M0,0 Q20,20 40,25 T60,20 T80,10"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        
        {/* Flower at corner */}
        <circle cx="10" cy="10" r="8" fill={color} opacity="0.3" />
        <circle cx="5" cy="15" r="6" fill={color} opacity="0.3" />
        <circle cx="15" cy="5" r="6" fill={color} opacity="0.3" />
        <circle cx="10" cy="10" r="4" fill={color} opacity="0.6" />
        
        {/* Leaves along stem */}
        <ellipse cx="30" cy="22" rx="8" ry="12" fill={color} opacity="0.25" transform="rotate(-30 30 22)" />
        <ellipse cx="50" cy="18" rx="6" ry="10" fill={color} opacity="0.25" transform="rotate(20 50 18)" />
        <ellipse cx="70" cy="12" rx="5" ry="8" fill={color} opacity="0.25" transform="rotate(-15 70 12)" />
      </svg>
    ),
    
    geometric: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Art deco lines */}
        <path d="M0,0 L30,0 L30,5 L5,5 L5,30 L0,30 Z" fill={color} opacity="0.4" />
        <path d="M0,0 L50,0 L50,2 L2,2 L2,50 L0,50 Z" fill={color} opacity="0.3" />
        
        {/* Geometric shapes */}
        <circle cx="15" cy="15" r="8" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" />
        <rect x="8" y="8" width="14" height="14" stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" transform="rotate(45 15 15)" />
        
        {/* Corner accent */}
        <path d="M0,0 L20,0 L0,20 Z" fill={color} opacity="0.2" />
      </svg>
    ),
    
    vintage: (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Ornate scrollwork */}
        <path
          d="M0,0 Q10,10 15,20 Q20,30 25,35 Q30,38 35,40"
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0,10 Q15,15 25,25 Q30,30 35,32"
          stroke={color}
          strokeWidth="1.5"
          fill="none"
          opacity="0.3"
        />
        
        {/* Vintage flourishes */}
        <circle cx="5" cy="5" r="5" fill={color} opacity="0.3" />
        <path d="M10,5 Q15,0 20,5 Q15,10 10,5" fill={color} opacity="0.35" />
        <path d="M5,10 Q0,15 5,20 Q10,15 5,10" fill={color} opacity="0.35" />
        
        {/* Decorative dots */}
        <circle cx="25" cy="25" r="2" fill={color} opacity="0.5" />
        <circle cx="35" cy="30" r="1.5" fill={color} opacity="0.5" />
        <circle cx="30" cy="35" r="1.5" fill={color} opacity="0.5" />
      </svg>
    )
  };

  return (
    <div className={`absolute pointer-events-none ${positions[corner]}`}>
      {patterns[pattern]}
    </div>
  );
}
