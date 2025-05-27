import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHotel, FaPhone, FaHeadset, FaPlay, FaArrowRight } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import HeroImage from './components/HeroImage';
import Sphere3D from './components/Sphere3D';
import Navbar from './components/Navbar';
import VoiceDemo from './components/VoiceDemo';
import CalendlyModal from './components/CalendlyModal';

// Progress bar component
const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left z-50"
      style={{ scaleX }}
    />
  );
};

// Loading component
const LoadingDots = () => (
  <div className="flex flex-col items-center">
    <motion.div 
      className="flex space-x-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 bg-blue-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
    <motion.p 
      className="mt-4 text-blue-400 text-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      Loading ArrayLink
    </motion.p>
  </div>
);

const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 30,
    filter: 'blur(10px)',
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.2,
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(10px)',
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    }
  }
};

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = '', delay = 0, id }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const sectionVariants = {
    ...fadeInUp,
    animate: {
      ...fadeInUp.animate,
      transition: {
        ...fadeInUp.animate.transition,
        delay: delay,
      }
    }
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="initial"
      animate={inView ? "animate" : "initial"}
      exit="exit"
      variants={sectionVariants}
      className={`section-padding ${className}`}
    >
      {children}
    </motion.section>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const handleBookDemo = () => {
    setIsCalendlyOpen(true);
  };

  const handleTryLiveDemo = () => {
    window.open('https://www.google.com', '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080B14]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <LoadingDots />
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-[#080B14] text-gray-100 relative">
        <ProgressBar />
        <Navbar onBookDemo={handleBookDemo} />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0C0F1D',
              color: '#fff',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            },
          }}
        />
        
        <CalendlyModal 
          isOpen={isCalendlyOpen}
          onClose={() => setIsCalendlyOpen(false)}
          calendlyUrl="https://calendly.com/arraylinkai/30min"
        />

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
              <motion.h1 
                className="text-4xl md:text-7xl font-bold mb-6 text-gradient"
                variants={fadeInUp}
              >
                Your Voice AI Platform for the Real World
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-blue-100/80 mb-12"
                variants={fadeInUp}
              >
                Deploy agents that think, speak, and act — so your business doesn't wait.
              </motion.p>
            </motion.div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                className="btn-primary group hover-lift w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookDemo}
              >
                Book a Demo
                <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                className="btn-secondary group hover-lift w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTryLiveDemo}
              >
                Try Live Demo
                <FaPlay className="inline-block ml-2 group-hover:scale-110 transition-transform" />
              </motion.button>
            </div>
          </div>
        </Section>

        {/* Use Case Section */}
        <Section className="relative py-20" delay={0.2}>
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
              Voice AI for Every Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 12V22H4V12M22 7H2V12H22V7ZM12 22V7M12 7H7.5C6.67157 7 6 6.32843 6 5.5V3.5C6 2.67157 6.67157 2 7.5 2H16.5C17.3284 2 18 2.67157 18 3.5V5.5C18 6.32843 17.3284 7 16.5 7H12Z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Hotel Reorder Assistant",
                  description: "Automate inventory management with AI-powered voice calls"
                },
                {
                  icon: (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.4017 20.9018 21 20.2827 21 19.5258V15.6488C21 14.9175 20.4491 14.3031 19.7272 14.1988L16.5742 13.7206C15.9272 13.6263 15.2988 13.9236 14.9699 14.4746L14.0368 16.0645C12.2306 15.0864 10.7136 13.5694 9.73545 11.7632L11.3254 10.8301C11.8764 10.5012 12.1737 9.87282 12.0794 9.22583L11.6012 6.07275C11.4969 5.35087 10.8825 4.8 10.1512 4.8H6.27419C5.51731 4.8 4.89824 5.39827 4.84187 6.15172C4.81413 6.53086 4.8 6.91384 4.8 7.3C4.8 8.37849 4.95049 9.42004 5.23019 10.4025" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "AI Sales Caller",
                  description: "Scale your sales outreach with natural-sounding AI agents"
                },
                {
                  icon: (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 6.75H7.75C6.64543 6.75 5.75 7.64543 5.75 8.75V17.25C5.75 18.3546 6.64543 19.25 7.75 19.25H16.25C17.3546 19.25 18.25 18.3546 18.25 17.25V8.75C18.25 7.64543 17.3546 6.75 16.25 6.75H15M9 6.75V5.75C9 4.64543 9.89543 3.75 11 3.75H13C14.1046 3.75 15 4.64543 15 5.75V6.75M9 6.75H15" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9.75 11.75C9.75 12.3023 9.30228 12.75 8.75 12.75C8.19772 12.75 7.75 12.3023 7.75 11.75C7.75 11.1977 8.19772 10.75 8.75 10.75C9.30228 10.75 9.75 11.1977 9.75 11.75Z" fill="#60A5FA"/>
                      <path d="M9.75 15.75C9.75 16.3023 9.30228 16.75 8.75 16.75C8.19772 16.75 7.75 16.3023 7.75 15.75C7.75 15.1977 8.19772 14.75 8.75 14.75C9.30228 14.75 9.75 15.1977 9.75 15.75Z" fill="#60A5FA"/>
                      <path d="M13.75 11.75C13.75 12.3023 13.3023 12.75 12.75 12.75C12.1977 12.75 11.75 12.3023 11.75 11.75C11.75 11.1977 12.1977 10.75 12.75 10.75C13.3023 10.75 13.75 11.1977 13.75 11.75Z" fill="#60A5FA"/>
                      <path d="M13.75 15.75C13.75 16.3023 13.3023 16.75 12.75 16.75C12.1977 16.75 11.75 16.3023 11.75 15.75C11.75 15.1977 12.1977 14.75 12.75 14.75C13.3023 14.75 13.75 15.1977 13.75 15.75Z" fill="#60A5FA"/>
                      <path d="M17.75 11.75C17.75 12.3023 17.3023 12.75 16.75 12.75C16.1977 12.75 15.75 12.3023 15.75 11.75C15.75 11.1977 16.1977 10.75 16.75 10.75C17.3023 10.75 17.75 11.1977 17.75 11.75Z" fill="#60A5FA"/>
                      <path d="M17.75 15.75C17.75 16.3023 17.3023 16.75 16.75 16.75C16.1977 16.75 15.75 16.3023 15.75 15.75C15.75 15.1977 16.1977 14.75 16.75 14.75C17.3023 14.75 17.75 15.1977 17.75 15.75Z" fill="#60A5FA"/>
                    </svg>
                  ),
                  title: "Support Voice Bot",
                  description: "Provide 24/7 customer support with intelligent voice automation"
                }
              ].map((useCase, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-xl bg-[#080B14] hover:bg-[#0C1018] transition-colors duration-300"
                  variants={fadeInUp}
                  custom={index * 0.1}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="mb-8">
                    {useCase.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-white">{useCase.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Voice Demo Section */}
        <Section className="relative py-20" delay={0.4} id="demo">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 text-gradient">
              Experience the AI
            </h2>
            <VoiceDemo />
          </div>
        </Section>

        {/* How It Works */}
        <Section className="relative" delay={0.6}>
          <div className="absolute inset-0 animated-gradient opacity-30"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gradient">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "1", title: "Intent", description: "Define your business goals" },
                { step: "2", title: "Voice", description: "Deploy AI voice agents" },
                { step: "3", title: "Result", description: "Measure business impact" }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative card-bg glass-effect p-8 rounded-xl card-hover"
                  variants={fadeInUp}
                  custom={index * 0.1}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 floating">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-50">{step.title}</h3>
                  <p className="text-blue-200/70 text-lg">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* AI Voice Preview */}
        <Section className="relative" delay={0.8}>
          <div className="absolute inset-0 animated-gradient opacity-40"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="card-bg glass-effect rounded-xl p-10 shadow-lg card-hover">
              <h2 className="text-3xl font-bold mb-8 text-gradient">AI Voice Preview</h2>
              <div className="card-bg backdrop-blur-sm rounded-lg p-8 mb-6">
                <p className="text-blue-100/80 text-xl mb-8 leading-relaxed">
                  "Hello, this is ArrayLink AI calling about your recent order. I noticed you might need to reorder some items..."
                </p>
                <motion.button 
                  className="btn-primary group hover-lift"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlay className="inline-block mr-2 group-hover:scale-110 transition-transform" />
                  Play Sample
                </motion.button>
              </div>
            </div>
          </div>
        </Section>

        {/* Footer CTA */}
        <Section className="relative" delay={1.0}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 opacity-90"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Ready to put AI to work?</h2>
            <motion.button
              className="bg-white text-blue-600 px-8 py-3 rounded-lg text-xl font-semibold hover:bg-blue-50 transition-all duration-300 group hover-lift"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookDemo}
            >
              Book a Demo
              <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </Section>

        {/* Mobile CTA */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-[#0B1120] p-4 border-t border-blue-900/20 sm:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            whileTap={{ scale: 0.98 }}
            onClick={handleBookDemo}
          >
            Book a Demo
          </motion.button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default App; 