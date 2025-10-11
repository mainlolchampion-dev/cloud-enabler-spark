import React, { useEffect, useRef } from 'react';

interface Bubble {
  x: number;
  y: number;
  size: number;
  xSpeed: number;
  ySpeed: number;
  color: string;
  opacity: number;
}

interface BubbleAnimationProps {
  colors?: string[];
}

const BubbleAnimation: React.FC<BubbleAnimationProps> = ({ 
  colors = ['#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#B3E5FC'] 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles = useRef<Bubble[]>([]);
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

    // Draw a bubble
    const drawBubble = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      opacity: number
    ) => {
      // Main bubble
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * 0.3;
      ctx.fill();
      
      // Highlight
      ctx.beginPath();
      ctx.arc(x - size / 3, y - size / 3, size / 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.globalAlpha = opacity * 0.5;
      ctx.fill();
      
      // Border
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.globalAlpha = opacity * 0.6;
      ctx.stroke();
      
      ctx.globalAlpha = 1;
    };

    // Initialize bubbles
    const initBubbles = () => {
      bubbles.current = [];
      const bubbleCount = Math.floor(window.innerWidth / 40);

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * canvas.height,
          size: Math.random() * 30 + 10,
          xSpeed: Math.random() * 0.5 - 0.25,
          ySpeed: -(Math.random() * 1 + 0.5),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.5
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.current.forEach(bubble => {
        bubble.y += bubble.ySpeed;
        bubble.x += bubble.xSpeed;
        
        // Add floating motion
        bubble.x += Math.sin(bubble.y * 0.01) * 0.5;
        
        // Reset if out of bounds
        if (bubble.y < -100) {
          bubble.y = canvas.height + 50;
          bubble.x = Math.random() * canvas.width;
        }
        
        if (bubble.x < -50) {
          bubble.x = canvas.width + 50;
        } else if (bubble.x > canvas.width + 50) {
          bubble.x = -50;
        }
        
        // Draw bubble
        drawBubble(ctx, bubble.x, bubble.y, bubble.size, bubble.color, bubble.opacity);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    initBubbles();
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
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.7 }}
    />
  );
};

export default BubbleAnimation;