interface ParticleProps {
  color?: string;
}

export function Heart({ color = '#ff6b9d' }: ParticleProps) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="animate-bounce-slow opacity-70">
      <path
        d="M14 26C14 26 2 18 2 10C2 6 4.5 4 7 4C9.5 4 12 6 14 8C16 6 18.5 4 21 4C23.5 4 26 6 26 10C26 18 14 26 14 26Z"
        fill={color}
      />
    </svg>
  );
}
