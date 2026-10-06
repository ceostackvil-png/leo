import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const LeoIntroSplash = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasDismissed, setHasDismissed] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if already viewed in this session
    const seenSplash = sessionStorage.getItem('leo_intro_seen');
    if (seenSplash === 'true') {
      setIsVisible(false);
      onComplete && onComplete();
      return;
    }

    // Safety fallback timeout in case video fails or gets stuck
    const fallbackTimer = setTimeout(() => {
      handleDismiss();
    }, 8000);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDismiss = () => {
    if (hasDismissed) return;
    setHasDismissed(true);
    sessionStorage.setItem('leo_intro_seen', 'true');
    setIsVisible(false);
    setTimeout(() => {
      onComplete && onComplete();
    }, 700);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="leo-splash-video"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[100] bg-[#050505] text-[#F7F5F0] flex flex-col items-center justify-center overflow-hidden cursor-pointer selection:bg-transparent select-none"
          onClick={handleDismiss}
        >
          {/* Subtle Ambient Golden Glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#C5A880]/20 via-[#C5A880]/5 to-transparent blur-[140px] pointer-events-none" />

          {/* Background Atmospheric Subtle Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-30" />

          {/* Video Container */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl aspect-video overflow-hidden bg-transparent flex items-center justify-center"
            >
              <video
                ref={videoRef}
                src="/Untitled%20design.mp4"
                autoPlay
                muted
                playsInline
                onEnded={handleDismiss}
                className="w-full h-full object-contain"
              />
            </motion.div>

            {/* Skip CTA */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mt-8 group flex items-center space-x-2 text-[10px] tracking-[0.3em] uppercase text-white/60 hover:text-[#C5A880] transition-colors py-2 px-5 border border-white/10 hover:border-[#C5A880]/40 rounded-full backdrop-blur-sm"
            >
              <span>Enter Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Bottom Prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-6 text-[9px] uppercase tracking-[0.25em] text-white/30 font-light"
          >
            Press <kbd className="px-1.5 py-0.5 border border-white/20 text-white/50">ESC</kbd> or click to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

