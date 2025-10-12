interface ParticleProps {
  color?: string;
}

export function Sparkle({ color = '#ffffff' }: ParticleProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-twinkle opacity-90">
      <path d="M10 0L11 9L10 20L9 9L10 0Z" fill={color} />
      <path d="M0 10L9 11L20 10L9 9L0 10Z" fill={color} />
      <circle cx="10" cy="10" r="2" fill={color} opacity="0.5" />
    </svg>
  );
}
