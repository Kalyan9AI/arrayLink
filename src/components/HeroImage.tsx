import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HeroImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const yTransform = useTransform(scrollY, [0, 400], [0, 100]);

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        opacity,
        y: yTransform
      }}
      transition={{ duration: 1 }}
    >
      <div 
        className="w-full h-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0) 50%)'
        }}
      />
    </motion.div>
  );
};

export default HeroImage; 