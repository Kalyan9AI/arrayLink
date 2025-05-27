import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHotel, FaPhone, FaHeadset, FaPlay, FaArrowRight } from 'react-icons/fa';
import { Toaster } from 'react-hot-toast';
import HeroImage from './components/HeroImage';
import Sphere3D from './components/Sphere3D';
import Navbar from './components/Navbar';
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
    window.open('https://sales-agent-c3f5ecevdefjcafc.canadacentral-01.azurewebsites.net/', '_blank');
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
                Voice-Powered E-commerce, Reimagined
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-blue-100/80 mb-12"
                variants={fadeInUp}
              >
                AI agents that navigate your e-commerce like humans, enabling customers to order supplies through natural conversation - no screen time needed.
              </motion.p>
            </motion.div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookDemo}
              >
                Book a Demo
                <FaArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto"
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
              How ArrayLink AI Works
            </h2>
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  {
                    icon: "👥",
                    title: "CRM Integration",
                    description: "Automatically syncs with your CRM to identify leads and customer data"
                  },
                  {
                    icon: "📞",
                    title: "Smart Outreach",
                    description: "Initiates personalized email and call campaigns"
                  },
                  {
                    icon: "🗣️",
                    title: "Voice Ordering",
                    description: "Hands-free ordering during calls while driving or working"
                  },
                  {
                    icon: "📋",
                    title: "ERP Processing",
                    description: "Direct integration with ERP systems for seamless order processing"
                  },
                  {
                    icon: "🚚",
                    title: "Delivery",
                    description: "Automated delivery scheduling and tracking"
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#0C1018] p-6 rounded-xl relative hover:bg-[#0F1319] transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="text-3xl mb-4">{step.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 text-blue-100">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* How It Works */}
        <Section className="relative" delay={0.6}>
          <div className="absolute inset-0 animated-gradient opacity-30"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-gradient">
              Effortless Ordering
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  step: "1", 
                  title: "Connect", 
                  description: "AI learns your e-commerce catalog and customer preferences" 
                },
                { 
                  step: "2", 
                  title: "Converse", 
                  description: "Natural voice interactions for browsing and ordering" 
                },
                { 
                  step: "3", 
                  title: "Complete", 
                  description: "Automated order placement and delivery scheduling" 
                }
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

        {/* Footer CTA */}
        <Section className="relative" delay={0.8}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-blue-400/10 opacity-90"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Experience The Future of Ordering</h2>
            <p className="text-xl text-blue-100/80 mb-8">
              Let your customers order supplies through natural conversations - anytime, anywhere
            </p>
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