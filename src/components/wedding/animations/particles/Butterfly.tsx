interface ParticleProps {
  color?: string;
}

export function Butterfly({ color = '#dda0dd' }: ParticleProps) {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26" fill="none" className="animate-flutter opacity-70">
      <path
        d="M8 13C8 13 2 8 2 4C2 0 6 0 8 2C10 4 10 8 10 10L8 13Z"
        fill={color}
      />
      <path
        d="M8 13C8 13 2 18 2 22C2 26 6 26 8 24C10 22 10 18 10 16L8 13Z"
        fill={color}
      />
      <path
        d="M24 13C24 13 30 8 30 4C30 0 26 0 24 2C22 4 22 8 22 10L24 13Z"
        fill={color}
      />
      <path
        d="M24 13C24 13 30 18 30 22C30 26 26 26 24 24C22 22 22 18 22 16L24 13Z"
        fill={color}
      />
      <ellipse cx="16" cy="13" rx="6" ry="2" fill={color} opacity="0.8" />
      <circle cx="16" cy="13" r="1.5" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}
