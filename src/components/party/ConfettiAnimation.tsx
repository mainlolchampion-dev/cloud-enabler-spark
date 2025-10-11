import React, { useEffect, useRef } from 'react';

interface Confetti {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  xSpeed: number;
  ySpeed: number;
  rotationSpeed: number;
  color: string;
}

interface ConfettiAnimationProps {
  colors?: string[];
}

const ConfettiAnimation: React.FC<ConfettiAnimationProps> = ({ 
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confetti = useRef<Confetti[]>([]);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw a confetti piece
    const drawConfetti = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      rotation: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      
      ctx.fillStyle = color;
      ctx.fillRect(-width / 2, -height / 2, width, height);
      
      ctx.restore();
    };

    // Initialize confetti
    const initConfetti = () => {
      confetti.current = [];
      const confettiCount = Math.floor(window.innerWidth / 30);

      for (let i = 0; i < confettiCount; i++) {
        confetti.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          width: Math.random() * 10 + 5,
          height: Math.random() * 6 + 3,
          rotation: Math.random() * 360,
          xSpeed: Math.random() * 2 - 1,
          ySpeed: Math.random() * 2 + 2,
          rotationSpeed: Math.random() * 10 - 5,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confetti.current.forEach(piece => {
        piece.y += piece.ySpeed;
        piece.x += piece.xSpeed;
        piece.rotation += piece.rotationSpeed;
        
        // Add wave motion
        piece.x += Math.sin(piece.y * 0.01) * 0.5;
        
        // Reset if out of bounds
        if (piece.y > canvas.height + 50) {
          piece.y = -50;
          piece.x = Math.random() * canvas.width;
        }
        
        if (piece.x < -50) {
          piece.x = canvas.width + 50;
        } else if (piece.x > canvas.width + 50) {
          piece.x = -50;
        }
        
        // Draw confetti
        drawConfetti(ctx, piece.x, piece.y, piece.width, piece.height, piece.rotation, piece.color);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initConfetti();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [colors]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8, zIndex: 1 }}
    />
  );
};

export default ConfettiAnimation;