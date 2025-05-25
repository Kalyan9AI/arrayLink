import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyUrl: string;
}

declare global {
  interface Window {
    Calendly: any;
  }
}

const CalendlyModal: React.FC<CalendlyModalProps> = ({ isOpen, onClose, calendlyUrl }) => {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        if (isOpen) {
          initializeCalendly();
        }
      };
      document.body.appendChild(script);

      // Add custom CSS to modify Calendly's iframe content
      const style = document.createElement('style');
      style.textContent = `
        .calendly-inline-widget iframe {
          filter: brightness(0.9) !important;
          background-color: rgba(255, 255, 255, 0.9) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.body.removeChild(script);
        document.head.removeChild(style);
        scriptLoaded.current = false;
      };
    }
  }, []);

  const initializeCalendly = () => {
    if (window.Calendly && scriptLoaded.current) {
      window.Calendly.initInlineWidget({
        url: calendlyUrl,
        parentElement: document.getElementById('calendly-embed'),
        prefill: {},
        styles: {
          height: '700px',
          minWidth: '320px'
        },
        branding: {
          color: '#2563EB',
          textColor: '#1a1a1a',
          backgroundColor: 'rgba(255, 255, 255, 0.9)'
        }
      });
    }
  };

  useEffect(() => {
    if (isOpen && scriptLoaded.current) {
      initializeCalendly();
    }
  }, [isOpen, calendlyUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#0B1120] rounded-xl w-full max-w-4xl relative overflow-hidden shadow-2xl"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-50 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            ✕
          </button>
          <div 
            id="calendly-embed" 
            className="rounded-lg"
            style={{ 
              height: '700px',
              width: '100%',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }} 
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CalendlyModal; 