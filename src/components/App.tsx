import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from '../components/HeroImage';
import Sphere3D from '../components/Sphere3D';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className }) => {
  return (
    <section className={className}>
      {children}
    </section>
  );
};

{/* Hero Section */}
<Section className="min-h-screen flex items-center justify-center text-center relative overflow-hidden pt-20">
  <div className="absolute inset-0 animated-gradient"></div>
  <HeroImage />
  <Sphere3D />
  <div className="max-w-4xl mx-auto relative z-10">
    <motion.div 
      className="floating"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      // ... rest of the component code ...
    </motion.div>
  </div>
</Section> 