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
      
      // Add glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      
      // Draw 5 petals with gradient
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((i * 2 * Math.PI) / 5);
        
        // Create gradient for petal
        const gradient = ctx.createRadialGradient(0, -size / 2, 0, 0, -size / 2, size / 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, color + '80');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, -size / 2, size / 3, size / 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add petal outline for depth
        ctx.strokeStyle = color;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        
        ctx.restore();
      }
      
      // Draw golden center with gradient
      const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size / 3);
      centerGradient.addColorStop(0, '#FFD700');
      centerGradient.addColorStop(0.7, '#FFA500');
      centerGradient.addColorStop(1, '#FF8C00');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Add sparkle dots in center
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3;
        const dotX = Math.cos(angle) * size / 6;
        const dotY = Math.sin(angle) * size / 6;
        ctx.beginPath();
        ctx.arc(dotX, dotY, size / 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };

    // Initialize falling flowers
    const initFlowers = () => {
      flowers.current = [];
      const flowerCount = Math.floor(window.innerWidth / 40); // More flowers!

      for (let i = 0; i < flowerCount; i++) {
        flowers.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 10 + 6, // Bigger flowers
          rotation: Math.random() * 360,
          xSpeed: Math.random() * 1.5 - 0.75, // More horizontal movement
          ySpeed: Math.random() * 1.2 + 0.8, // Varied fall speed
          rotationSpeed: Math.random() * 3 - 1.5, // Faster rotation
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
      style={{ opacity: 0.9, zIndex: 1 }}
    />
  );
};

export default FlowerAnimation;