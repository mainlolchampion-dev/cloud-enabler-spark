import { useEffect, useState } from 'react';
import { RosePetal } from './particles/RosePetal';
import { Star } from './particles/Star';
import { Heart } from './particles/Heart';
import { Leaf } from './particles/Leaf';
import { Butterfly } from './particles/Butterfly';
import { Sparkle } from './particles/Sparkle';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface FallingParticlesProps {
  type?: 'flowers' | 'stars' | 'hearts' | 'leaves' | 'butterflies' | 'sparkles';
  density?: 'subtle' | 'medium' | 'dramatic';
  color?: string;
  enabled?: boolean;
}

export function FallingParticles({ 
  type = 'flowers', 
  density = 'medium',
  color = 'currentColor',
  enabled = true 
}: FallingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const densityMap = {
      subtle: 8,
      medium: 15,
      dramatic: 25
    };

    const count = window.innerWidth < 768 
      ? Math.floor(densityMap[density] / 2) 
      : densityMap[density];

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 10,
      size: 0.5 + Math.random() * 1
    }));

    setParticles(newParticles);
  }, [type, density, enabled]);

  if (!enabled || particles.length === 0) return null;

  const ParticleComponent = {
    flowers: RosePetal,
    stars: Star,
    hearts: Heart,
    leaves: Leaf,
    butterflies: Butterfly,
    sparkles: Sparkle
  }[type];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute -top-20 animate-fall"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            transform: `scale(${particle.size})`
          }}
        >
          <ParticleComponent color={color} />
        </div>
      ))}
    </div>
  );
}
