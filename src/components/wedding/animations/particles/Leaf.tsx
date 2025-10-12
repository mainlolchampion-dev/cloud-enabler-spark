interface ParticleProps {
  color?: string;
}

export function Leaf({ color = '#8fbc8f' }: ParticleProps) {
  return (
    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" className="animate-sway opacity-75">
      <path
        d="M12 0C12 0 2 8 2 18C2 28 12 32 12 32C12 32 22 28 22 18C22 8 12 0 12 0Z"
        fill={color}
      />
      <path
        d="M12 2C12 2 8 10 8 18C8 26 12 30 12 30"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
