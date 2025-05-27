import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';

interface NavbarProps {
  onBookDemo: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookDemo }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange(latest => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      animate={{
        backgroundColor: isScrolled ? 'rgba(8, 11, 20, 0.9)' : 'rgba(8, 11, 20, 0)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/assets/logo.png" 
            alt="ArrayLink Logo" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-3xl font-bold text-white tracking-wider">
            ArrayLink AI
          </span>
        </motion.div>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#demo">Demo</NavLink>
        </div>

        <motion.button
          className="md:hidden text-white"
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <motion.a
    href={href}
    className="text-gray-300 hover:text-white transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {children}
  </motion.a>
);

export default Navbar; 