interface ParticleProps {
  color?: string;
}

export function Star({ color = '#d4af37' }: ParticleProps) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" className="animate-pulse-slow opacity-80">
      <path
        d="M12.5 0L15.4 8.7L25 12.5L15.4 16.3L12.5 25L9.6 16.3L0 12.5L9.6 8.7L12.5 0Z"
        fill={color}
      />
      <circle cx="12.5" cy="12.5" r="2" fill="white" opacity="0.8" />
    </svg>
  );
}
