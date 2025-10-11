import React, { useEffect, useRef } from 'react';

interface Flower {
  x: number;
  y: number;
  size: number;
  rotation: number;
  xSpeed: number;
  ySpeed: number;
  rotationSpeed: number;
  color: string;
}

interface FlowerAnimationProps {
  colors?: string[];
}

const FlowerAnimation: React.FC<FlowerAnimationProps> = ({ 
  colors = ['#FFD1DC', '#FF80AB', '#FF5A8C', '#FFC0CB', '#FFDDEE'] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowers = useRef<Flower[]>([]);
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

    // Draw a flower shape
    const drawFlower = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      rotation: number,
      size: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      
      // Draw 5 petals
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * 72 * Math.PI) / 180);
        
        ctx.beginPath();
        ctx.ellipse(0, -size / 2, size / 3, size / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        
        ctx.restore();
      }
      
      // Draw center
      ctx.beginPath();
      ctx.arc(0, 0, size / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFEB3B';
      ctx.fill();
      
      ctx.restore();
    };

    // Initialize falling flowers
    const initFlowers = () => {
      flowers.current = [];
      const flowerCount = Math.floor(window.innerWidth / 50);

      for (let i = 0; i < flowerCount; i++) {
        flowers.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 8 + 5,
          rotation: Math.random() * 360,
          xSpeed: Math.random() * 1 - 0.5,
          ySpeed: Math.random() * 1 + 1,
          rotationSpeed: Math.random() * 2 - 1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      flowers.current.forEach(flower => {
        flower.y += flower.ySpeed;
        flower.x += flower.xSpeed;
        flower.rotation += flower.rotationSpeed;
        
        // Reset if out of bounds
        if (flower.y > canvas.height + 50) {
          flower.y = -50;
          flower.x = Math.random() * canvas.width;
        }
        
        if (flower.x < -50) {
          flower.x = canvas.width + 50;
        } else if (flower.x > canvas.width + 50) {
          flower.x = -50;
        }
        
        // Draw flower
        drawFlower(ctx, flower.x, flower.y, flower.rotation, flower.size, flower.color);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initFlowers();
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

export default FlowerAnimation;