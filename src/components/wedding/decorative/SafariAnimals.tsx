interface SafariAnimalsProps {
  animal: 'giraffe' | 'lion' | 'elephant' | 'zebra';
  color?: string;
  className?: string;
  size?: number;
}

export function SafariAnimals({ animal, color = 'currentColor', className = '', size = 120 }: SafariAnimalsProps) {
  const animals = {
    giraffe: (
      <svg viewBox="0 0 100 140" fill="none" className={className} style={{ width: size, height: size * 1.4 }}>
        {/* Giraffe body */}
        <ellipse cx="50" cy="90" rx="20" ry="30" fill={color} opacity="0.7" />
        {/* Neck */}
        <rect x="42" y="40" width="16" height="55" rx="8" fill={color} opacity="0.7" />
        {/* Head */}
        <ellipse cx="50" cy="30" rx="15" ry="18" fill={color} opacity="0.8" />
        {/* Ears */}
        <ellipse cx="40" cy="20" rx="5" ry="8" fill={color} opacity="0.6" />
        <ellipse cx="60" cy="20" rx="5" ry="8" fill={color} opacity="0.6" />
        {/* Horns */}
        <circle cx="43" cy="15" r="3" fill={color} opacity="0.9" />
        <circle cx="57" cy="15" r="3" fill={color} opacity="0.9" />
        {/* Legs */}
        <rect x="38" y="115" width="8" height="20" rx="4" fill={color} opacity="0.7" />
        <rect x="54" y="115" width="8" height="20" rx="4" fill={color} opacity="0.7" />
        {/* Spots */}
        <circle cx="45" cy="75" r="4" fill={color} opacity="0.4" />
        <circle cx="55" cy="85" r="3" fill={color} opacity="0.4" />
        <circle cx="50" cy="95" r="3" fill={color} opacity="0.4" />
        <circle cx="48" cy="55" r="3" fill={color} opacity="0.4" />
      </svg>
    ),
    lion: (
      <svg viewBox="0 0 120 100" fill="none" className={className} style={{ width: size * 1.2, height: size }}>
        {/* Mane */}
        <circle cx="60" cy="50" r="35" fill={color} opacity="0.4" />
        {/* Head */}
        <circle cx="60" cy="50" r="22" fill={color} opacity="0.7" />
        {/* Ears */}
        <circle cx="45" cy="35" r="8" fill={color} opacity="0.6" />
        <circle cx="75" cy="35" r="8" fill={color} opacity="0.6" />
        {/* Eyes */}
        <circle cx="53" cy="48" r="3" fill={color} opacity="0.9" />
        <circle cx="67" cy="48" r="3" fill={color} opacity="0.9" />
        {/* Nose */}
        <ellipse cx="60" cy="58" rx="5" ry="4" fill={color} opacity="0.8" />
        {/* Body */}
        <ellipse cx="60" cy="80" rx="18" ry="15" fill={color} opacity="0.7" />
        {/* Tail */}
        <path d="M 75 85 Q 90 80 95 75" stroke={color} strokeWidth="4" fill="none" opacity="0.6" />
        <circle cx="95" cy="75" r="5" fill={color} opacity="0.7" />
      </svg>
    ),
    elephant: (
      <svg viewBox="0 0 120 100" fill="none" className={className} style={{ width: size * 1.2, height: size }}>
        {/* Body */}
        <ellipse cx="70" cy="60" rx="30" ry="25" fill={color} opacity="0.7" />
        {/* Head */}
        <ellipse cx="45" cy="45" rx="22" ry="20" fill={color} opacity="0.7" />
        {/* Ears */}
        <ellipse cx="35" cy="45" rx="12" ry="20" fill={color} opacity="0.5" />
        <ellipse cx="55" cy="45" rx="12" ry="20" fill={color} opacity="0.5" />
        {/* Trunk */}
        <path d="M 40 55 Q 35 70 30 85 Q 28 95 35 95" stroke={color} strokeWidth="8" fill="none" opacity="0.7" strokeLinecap="round" />
        {/* Legs */}
        <rect x="55" y="80" width="8" height="18" rx="4" fill={color} opacity="0.7" />
        <rect x="70" y="80" width="8" height="18" rx="4" fill={color} opacity="0.7" />
        <rect x="85" y="80" width="8" height="18" rx="4" fill={color} opacity="0.7" />
        {/* Eye */}
        <circle cx="48" cy="40" r="3" fill={color} opacity="0.9" />
        {/* Tail */}
        <path d="M 95 65 L 105 75" stroke={color} strokeWidth="3" opacity="0.6" />
      </svg>
    ),
    zebra: (
      <svg viewBox="0 0 120 100" fill="none" className={className} style={{ width: size * 1.2, height: size }}>
        {/* Body */}
        <ellipse cx="65" cy="60" rx="28" ry="22" fill={color} opacity="0.7" />
        {/* Neck */}
        <rect x="42" y="35" width="14" height="30" rx="7" fill={color} opacity="0.7" />
        {/* Head */}
        <ellipse cx="50" cy="30" rx="12" ry="15" fill={color} opacity="0.8" />
        {/* Ears */}
        <ellipse cx="45" cy="20" rx="4" ry="7" fill={color} opacity="0.6" />
        <ellipse cx="55" cy="20" rx="4" ry="7" fill={color} opacity="0.6" />
        {/* Mane */}
        <path d="M 48 25 L 46 15 M 50 23 L 50 13 M 52 25 L 54 15" stroke={color} strokeWidth="2" opacity="0.6" />
        {/* Legs */}
        <rect x="50" y="78" width="6" height="20" rx="3" fill={color} opacity="0.7" />
        <rect x="65" y="78" width="6" height="20" rx="3" fill={color} opacity="0.7" />
        <rect x="80" y="78" width="6" height="20" rx="3" fill={color} opacity="0.7" />
        {/* Stripes */}
        <path d="M 55 50 L 75 50 M 55 56 L 75 56 M 55 62 L 75 62 M 55 68 L 75 68" stroke={color} strokeWidth="3" opacity="0.4" />
        <path d="M 45 38 L 52 38 M 45 44 L 52 44 M 45 50 L 52 50" stroke={color} strokeWidth="2" opacity="0.4" />
        {/* Tail */}
        <path d="M 90 60 Q 100 58 105 62" stroke={color} strokeWidth="3" opacity="0.6" />
      </svg>
    ),
  };

  return animals[animal];
}
