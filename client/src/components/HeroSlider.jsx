import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = banners.length > 0 ? banners : [
    {
      _id: 'default-1',
      title: 'THE NEW STANDARD',
      subtitle: 'Architectural tailoring, double-faced Italian cashmere, and pure Mulberry silk.',
      tag: "GENTLEMEN'S AW '26 RELEASE",
      image: '/hero-menswear.jpg',
      ctaText: 'EXPLORE COLLECTION',
      ctaLink: '/shop',
    },
    {
      _id: 'default-2',
      title: 'SOVEREIGN TAILORING',
      subtitle: 'Double-breasted Biella wool blazers and bespoke black-tie dinner jackets.',
      tag: 'BESPOKE ATELIER',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'SHOP TAILORING',
      ctaLink: '/shop?category=tailored-suits',
    },
    {
      _id: 'default-3',
      title: 'MONGOLIAN CASHMERE',
      subtitle: 'Plush 4-ply Grade-A knitwear spun for high-altitude refinement.',
      tag: 'WINTER CAPSULE',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'DISCOVER KNITWEAR',
      ctaLink: '/shop?category=knitwear',
    },
    {
      _id: 'default-4',
      title: 'THE LEATHER EDITION',
      subtitle: 'Full-grain French lambskin bombers and structured Italian trench coats.',
      tag: 'LIMITED RUN',
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'VIEW OUTERWEAR',
      ctaLink: '/shop?category=outerwear',
    },
    {
      _id: 'default-5',
      title: 'PERMANENT ARCHIVE',
      subtitle: 'Heirloom silhouettes designed to transcend fleeting seasons.',
      tag: 'THE ARCHIVE',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'EXPLORE ARCHIVE',
      ctaLink: '/shop?collection=minimalist-noir',
    },
  ];

  // Auto-play slider every 6 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Hero Slider"
    >
      {/* Background Images with Crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide._id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-radial-vignette opacity-50" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
        {/* Brand Crest */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/30 p-1 flex items-center justify-center mb-5 backdrop-blur-sm shadow-2xl"
        >
          <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
        </motion.div>

        {/* Tagline */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`tag-${currentIndex}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="text-xs md:text-sm uppercase tracking-[0.35em] text-velora-champagne font-medium mb-3 flex items-center space-x-2"
          >
            <span>{currentSlide.tag || "GENTLEMEN'S LUXURY ATELIER"}</span>
          </motion.p>
        </AnimatePresence>

        {/* Main Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8 }}
            className="font-editorial text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-[0.08em] uppercase leading-none"
          >
            {currentSlide.title}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle / Description */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-5 text-sm md:text-base font-light text-white/85 max-w-xl mx-auto tracking-wide leading-relaxed"
          >
            {currentSlide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* CTA Actions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`cta-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <Link
              to={currentSlide.ctaLink || '/shop'}
              className="w-56 py-4 bg-white text-velora-black text-xs font-semibold tracking-[0.22em] uppercase hover:bg-velora-champagne hover:text-white transition-all duration-300 shadow-2xl text-center"
            >
              {currentSlide.ctaText || 'EXPLORE COLLECTION'}
            </Link>
            <Link
              to="/shop?category=tailored-suits"
              className="w-56 py-4 bg-transparent border border-white/80 text-white text-xs font-semibold tracking-[0.22em] uppercase hover:bg-white hover:text-velora-black transition-all duration-300 backdrop-blur-sm text-center"
            >
              Bespoke Tailoring
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Left/Right Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/30 hover:bg-white hover:text-velora-black text-white items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-xl"
        aria-label="Previous promotional slide"
      >
        <ChevronLeft className="w-6 h-6 stroke-[1.5]" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/30 hover:bg-white hover:text-velora-black text-white items-center justify-center transition-all duration-300 backdrop-blur-sm shadow-xl"
        aria-label="Next promotional slide"
      >
        <ChevronRight className="w-6 h-6 stroke-[1.5]" />
      </button>

      {/* Slide Pagination Indicator Dots & Progress */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === idx
                ? 'w-10 h-2 bg-velora-champagne'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
