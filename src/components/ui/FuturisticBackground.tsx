
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FuturisticBackgroundProps {
  children?: React.ReactNode;
}

export function FuturisticBackground({ children }: FuturisticBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    // Initialize particles
    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor(window.innerWidth * window.innerHeight / 12000);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: i % 5 === 0 ? '#c1f17e' : 'rgba(214, 221, 230, 0.4)'
        });
      }
    };
    
    // Draw grid lines
    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(214, 221, 230, 0.05)';
      ctx.lineWidth = 0.3;
      
      const gridSize = 80;
      const offsetX = (canvas.width % gridSize) / 2;
      const offsetY = (canvas.height % gridSize) / 2;
      
      // Vertical lines
      for (let x = offsetX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = offsetY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // Draw some highlighted grid intersections
      ctx.fillStyle = 'rgba(193, 241, 126, 0.15)';
      for (let x = offsetX; x < canvas.width; x += gridSize * 2) {
        for (let y = offsetY; y < canvas.height; y += gridSize * 2) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid
      drawGrid();
      
      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Set up canvas and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative w-full overflow-hidden">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-0 bg-background"
        style={{ 
          background: 'linear-gradient(to bottom, #0a1420 0%, #080f17 100%)'
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
}
