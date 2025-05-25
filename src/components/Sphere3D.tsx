import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Sphere3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Create scroll-based animations
  const opacity = useTransform(scrollY, [0, 400], [0.9, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);
  const xTransform = useTransform(scrollY, [0, 400], [0, 50]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with better pixel ratio handling
    const setCanvasSize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
      canvas.width = canvas.offsetWidth * pixelRatio;
      canvas.height = canvas.offsetHeight * pixelRatio;
      ctx.scale(pixelRatio, pixelRatio);
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Optimized sphere parameters
    const points: Array<{
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      size: number;
      color: string;
      velocity: number;
    }> = [];

    // Generate points with Fibonacci distribution
    const radius = Math.min(canvas.width, canvas.height) * 0.25;
    const numPoints = 150;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * i;

      const x = radius * Math.sin(inclination) * Math.cos(azimuth);
      const y = radius * Math.sin(inclination) * Math.sin(azimuth);
      const z = radius * Math.cos(inclination);

      points.push({
        x, y, z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2 + 1,
        color: `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.4})`,
        velocity: Math.random() * 0.02 - 0.01
      });
    }

    let rotation = 0;
    let lastTime = 0;
    const rotationSpeed = 0.0003;
    let frame: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / canvas.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / canvas.height - 0.5) * 2
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += rotationSpeed * deltaTime;

      // Matrix rotation
      const cos = Math.cos(rotation);
      const sin = Math.sin(rotation);

      // Mouse influence
      const mouseInfluence = 0.1;
      const springStrength = 0.05;

      points.forEach(point => {
        // Apply mouse repulsion
        const dx = point.x - mousePosition.x * radius;
        const dy = point.y - mousePosition.y * radius;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < radius * 0.5) {
          const force = (radius * 0.5 - distance) / (radius * 0.5);
          point.x += (dx / distance) * force * mouseInfluence;
          point.y += (dy / distance) * force * mouseInfluence;
          point.z += point.velocity;
        }

        // Spring force back to original position
        point.x += (point.baseX - point.x) * springStrength;
        point.y += (point.baseY - point.y) * springStrength;
        point.z += (point.baseZ - point.z) * springStrength;
      });

      const sortedPoints = points.map(point => {
        const rotatedX = point.x * cos - point.z * sin;
        const rotatedZ = point.x * sin + point.z * cos;
        return {
          ...point,
          renderX: rotatedX + canvas.width / 2,
          renderY: point.y + canvas.height / 2,
          renderZ: rotatedZ,
          depth: (rotatedZ + radius) / (radius * 2)
        };
      }).sort((a, b) => (b.renderZ || 0) - (a.renderZ || 0));

      // Draw connections with dynamic opacity
      sortedPoints.forEach((point, i) => {
        sortedPoints.slice(i + 1).forEach(otherPoint => {
          const distance = Math.hypot(
            (point.renderX || 0) - (otherPoint.renderX || 0),
            (point.renderY || 0) - (otherPoint.renderY || 0)
          );
          
          if (distance < radius * 0.5) {
            const opacity = Math.min(point.depth || 0, otherPoint.depth || 0) * 0.15;
            const gradient = ctx.createLinearGradient(
              point.renderX || 0,
              point.renderY || 0,
              otherPoint.renderX || 0,
              otherPoint.renderY || 0
            );
            
            gradient.addColorStop(0, `rgba(37, 99, 235, ${opacity})`);
            gradient.addColorStop(1, `rgba(37, 99, 235, ${opacity * 0.5})`);
            
            ctx.beginPath();
            ctx.moveTo(point.renderX || 0, point.renderY || 0);
            ctx.lineTo(otherPoint.renderX || 0, otherPoint.renderY || 0);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = Math.min(point.depth || 0, otherPoint.depth || 0) * 1.5;
            ctx.stroke();
          }
        });
      });

      // Draw points with enhanced effects
      sortedPoints.forEach(point => {
        const size = (point.size || 1) * ((point.depth || 0) * 0.8 + 0.2);
        const opacity = (point.depth || 0) * 0.8 + 0.2;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          point.renderX || 0,
          point.renderY || 0,
          0,
          point.renderX || 0,
          point.renderY || 0,
          size * 3
        );
        
        gradient.addColorStop(0, `rgba(37, 99, 235, ${opacity})`);
        gradient.addColorStop(0.5, `rgba(37, 99, 235, ${opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(37, 99, 235, 0)');

        ctx.beginPath();
        ctx.arc(point.renderX || 0, point.renderY || 0, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core point
        ctx.beginPath();
        ctx.arc(point.renderX || 0, point.renderY || 0, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${opacity})`;
        ctx.fill();
      });

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [mousePosition]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px]"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 0.9, scale: 1 }}
      style={{
        opacity,
        scale,
        x: xTransform
      }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-none"
        style={{ 
          filter: 'blur(0.5px)',
          transform: 'translateX(-50px)'
        }}
      />
    </motion.div>
  );
};

export default Sphere3D; 