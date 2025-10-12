interface ParticleProps {
  color?: string;
}

export function RosePetal({ color = '#f4a7b9' }: ParticleProps) {
  return (
    <svg width="30" height="35" viewBox="0 0 30 35" fill="none" className="animate-spin-slow opacity-70">
      <path
        d="M15 0C15 0 10 5 10 12C10 19 15 20 15 20C15 20 20 19 20 12C20 5 15 0 15 0Z"
        fill={color}
        opacity="0.8"
      />
      <path
        d="M15 20C15 20 8 18 5 25C2 32 8 35 8 35C8 35 15 32 15 25C15 18 15 20 15 20Z"
        fill={color}
        opacity="0.7"
      />
      <path
        d="M15 20C15 20 22 18 25 25C28 32 22 35 22 35C22 35 15 32 15 25C15 18 15 20 15 20Z"
        fill={color}
        opacity="0.7"
      />
      <ellipse cx="15" cy="18" rx="3" ry="3" fill={color} opacity="0.9" />
    </svg>
  );
}
