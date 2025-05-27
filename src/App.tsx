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
              {/* Connecting Lines */}
              <div className="absolute inset-0 z-0">
                <svg className="w-full h-full" viewBox="0 0 1200 200" fill="none">
                  {/* Main connecting line */}
                  <path 
                    d="M100 100 H1100" 
                    stroke="#4B5563" 
                    strokeWidth="2" 
                    strokeDasharray="6 6"
                    className="connecting-line"
                  />
                  
                  {/* Animated dots */}
                  {[0, 1, 2].map((i) => (
                    <circle
                      key={i}
                      r="4"
                      fill="#4ADE80"
                      className="moving-dot"
                      style={{
                        animation: `moveDot 3s linear infinite ${i * 1}s`
                      }}
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path="M100 100 H1100"
                      />
                    </circle>
                  ))}
                </svg>
              </div>

              {/* Process Steps */}
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

          <style>
            {`
              @keyframes moveDot {
                0% {
                  opacity: 0;
                }
                20% {
                  opacity: 0.5;
                }
                80% {
                  opacity: 0.5;
                }
                100% {
                  opacity: 0;
                }
              }

              .connecting-line {
                stroke-dasharray: 6;
                animation: dash 30s linear infinite;
              }

              @keyframes dash {
                to {
                  stroke-dashoffset: -1000;
                }
              }

              .moving-dot {
                opacity: 0;
              }
            `}
          </style>
        </Section>

        {/* Architecture Flow Section */}
        <Section className="relative py-20 overflow-x-auto" delay={0.4}>
          <style>
            {`
              @keyframes flowBlob {
                0% {
                  transform: translate(-50%, 0);
                  opacity: 0;
                }
                20% {
                  opacity: 1;
                }
                80% {
                  opacity: 1;
                }
                100% {
                  transform: translate(-50%, 1000px);
                  opacity: 0;
                }
              }

              .connector-line {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                height: 100%;
                z-index: 0;
                width: 2px;
                background: linear-gradient(to bottom, rgba(67, 97, 238, 0.1), rgba(139, 63, 231, 0.1));
              }

              .data-blob {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #60A5FA;
                box-shadow: 0 0 10px rgba(96, 165, 250, 0.6);
                opacity: 0;
                left: 50%;
                transform: translateX(-50%);
              }

              .blob-1 { animation: flowBlob 4s infinite; }
              .blob-2 { animation: flowBlob 4s infinite 1.3s; }
              .blob-3 { animation: flowBlob 4s infinite 2.6s; }

              /* Add curved connecting lines */
              .module-connector {
                position: absolute;
                width: 100%;
                height: 160px;
                pointer-events: none;
              }

              .module-connector svg {
                width: 100%;
                height: 100%;
              }

              .module-connector path {
                fill: none;
                stroke: rgba(67, 97, 238, 0.2);
                stroke-width: 2;
                filter: drop-shadow(0 0 8px rgba(67, 97, 238, 0.2));
                stroke-dasharray: 5;
                animation: dash 30s linear infinite;
              }

              @keyframes dash {
                to {
                  stroke-dashoffset: -1000;
                }
              }

              .glow-underline {
              }
            `}
          </style>

          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
              <span className="glow-underline">Follow the Data Flow</span>
            </h2>

            <div className="relative min-h-[1000px] flex flex-col items-center">
              {/* Center Vertical Line */}
              <div className="absolute left-1/2 h-full w-[2px] border-l-2 border-dotted border-blue-500/30"></div>

              {/* Moving Dots */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full">
                <div className="relative h-full">
                  <div className="data-blob blob-1" />
                  <div className="data-blob blob-2" />
                  <div className="data-blob blob-3" />
                </div>
              </div>

              {/* Architecture Modules */}
              {[
                {
                  icon: "📇",
                  title: "CRM Intake",
                  description: "Gather leads, contact info, purchase data",
                  position: "left",
                  color: "from-blue-600 to-blue-500"
                },
                {
                  icon: "📞",
                  title: "Voice Outreach",
                  description: "Outbound call with contextual pitch",
                  position: "right",
                  color: "from-blue-500 to-violet-500"
                },
                {
                  icon: "🧠",
                  title: "Product Guidance",
                  description: "Suggest SKUs, confirm interest",
                  position: "left",
                  color: "from-violet-500 to-purple-500",
                  decision: true
                },
                {
                  icon: "🧾",
                  title: "Order → ERP",
                  description: "Push confirmed orders to ERP systems",
                  position: "right",
                  color: "from-purple-500 to-purple-600"
                },
                {
                  icon: "🚚",
                  title: "Delivery Trigger",
                  description: "Initiate logistics & notify customer",
                  position: "left",
                  color: "from-purple-600 to-purple-700"
                },
                {
                  icon: "🔄",
                  title: "Feedback Loop",
                  description: "Update CRM, log activity, schedule next steps",
                  position: "right",
                  color: "from-purple-700 to-purple-800"
                }
              ].map((module, index) => (
                <motion.div
                  key={index}
                  className={`absolute ${
                    module.position === 'left' ? 'right-[52%]' : 'left-[52%]'
                  }`}
                  style={{ top: `${index * 160 + 40}px` }}
                  initial={{ opacity: 0, x: module.position === 'left' ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="relative">
                    {module.decision && (
                      <>
                        <div className="absolute right-full w-20 h-[2px] border-t-2 border-dotted border-gray-500/30 top-1/2">
                          <span className="absolute right-full mr-2 text-xs text-gray-400">NO</span>
                        </div>
                        <div className="absolute left-full w-20 h-[2px] border-t-2 border-dotted border-gray-500/30 top-1/2">
                          <span className="absolute left-full ml-2 text-xs text-gray-400">YES</span>
                        </div>
                      </>
                    )}
                    <div className={`w-[280px] rounded-xl bg-gradient-to-r ${module.color} p-5 shadow-lg`}>
                      <div className="flex items-start gap-3">
                        <div className="text-2xl mt-1">{module.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg text-white mb-2">{module.title}</h3>
                          <p className="text-gray-100/80 text-sm">{module.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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