interface GeometricDividerProps {
  style?: 'classic' | 'modern' | 'elegant';
  color?: string;
  className?: string;
}

export function GeometricDivider({ style = 'classic', color = 'currentColor', className = '' }: GeometricDividerProps) {
  const dividers = {
    classic: (
      <div className={`flex items-center justify-center gap-4 ${className}`}>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color }} />
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z" fill={color} opacity="0.6" />
          <circle cx="20" cy="20" r="3" fill={color} opacity="0.8" />
        </svg>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color }} />
      </div>
    ),
    
    modern: (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        <div className="w-8 h-px bg-current opacity-40" style={{ color }} />
        <div className="w-2 h-2 rotate-45 border border-current opacity-60" style={{ borderColor: color }} />
        <div className="w-16 h-px bg-current opacity-40" style={{ color }} />
        <div className="w-2 h-2 rotate-45 border border-current opacity-60" style={{ borderColor: color }} />
        <div className="w-8 h-px bg-current opacity-40" style={{ color }} />
      </div>
    ),
    
    elegant: (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20" style={{ color }} />
        <div className="relative bg-background px-6">
          <svg width="60" height="30" viewBox="0 0 60 30" fill="none">
            <path
              d="M5,15 Q10,5 20,10 T30,15 T40,10 Q50,5 55,15"
              stroke={color}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
            <circle cx="30" cy="15" r="4" fill={color} opacity="0.6" />
            <circle cx="15" cy="12" r="2" fill={color} opacity="0.4" />
            <circle cx="45" cy="12" r="2" fill={color} opacity="0.4" />
          </svg>
        </div>
      </div>
    )
  };

  return dividers[style];
}
