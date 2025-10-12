import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  animation?: 'fadeInUp' | 'fadeInScale' | 'slideInLeft' | 'slideInRight';
  delay?: number;
  className?: string;
}

export function AnimatedSection({ 
  children, 
  animation = 'fadeInUp',
  delay = 0,
  className = '' 
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true
  });

  const animationClasses = {
    fadeInUp: 'animate-fade-in-up',
    fadeInScale: 'animate-fade-in-scale',
    slideInLeft: 'animate-slide-in-left',
    slideInRight: 'animate-slide-in-right'
  };

  return (
    <section
      ref={ref}
      className={`
        ${className}
        ${isVisible ? animationClasses[animation] : 'opacity-0'}
      `}
      style={{
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </section>
  );
}
