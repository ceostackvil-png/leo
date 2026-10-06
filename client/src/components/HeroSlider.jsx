import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';

export const HeroSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const slides = banners.length > 0 ? banners : [
    {
      _id: 'banner_1',
      title: 'THE NEW STANDARD',
      subtitle: 'Heavyweight Supima Cotton & 14.5oz Japanese Selvedge Denim.',
      tag: "⚡ NEW COLLECTION '26",
      image: '/hero-menswear.jpg',
      ctaText: 'SHOP THE KING DROP',
      ctaLink: '/shop',
    },
    {
      _id: 'banner_2',
      title: 'SOVEREIGN STITCHING',
      subtitle: 'Hand-tailored master blazers and artisanal coats built for modern royalty.',
      tag: '🧵 ARTISANAL ATELIER',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'EXPLORE STITCHING',
      ctaLink: '/shop?category=outerwear',
    },
    {
      _id: 'banner_3',
      title: 'THE DENIM EDITION',
      subtitle: 'Classic Indigo Blue & Vintage Washed Olive Green Raw Selvedge Jackets.',
      tag: '🔥 LIMITED RUN',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=2560&q=95',
      ctaText: 'SHOP DENIM JACKETS',
      ctaLink: '/shop?category=denim',
    },
  ];

  // Auto-play slider every 4.5 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

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
      className="relative w-full h-[480px] sm:h-[580px] md:h-[680px] flex items-center justify-center overflow-hidden bg-slate-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Promotional Hero Slider"
    >
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide._id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center brightness-[0.78] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center">
        {/* Tagline Badge */}
        <div className="mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg"
            >
              <span>{currentSlide.tag || "⚡ ALTER — THE KING ATELIER"}</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Title */}
        <div className="min-h-[60px] sm:min-h-[90px] md:min-h-[110px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-tight drop-shadow-md"
            >
              {currentSlide.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Subtitle */}
        <div className="min-h-[40px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${currentIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="text-xs sm:text-sm md:text-base font-normal text-white/90 max-w-lg mx-auto tracking-wide leading-relaxed drop-shadow"
            >
              {currentSlide.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            to={currentSlide.ctaLink || '/shop'}
            className="px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-black tracking-wider uppercase rounded-full transition-all duration-200 shadow-xl flex items-center space-x-2 hover:scale-105"
          >
            <span>{currentSlide.ctaText || 'SHOP NOW'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop?isBestSeller=true"
            className="px-6 py-3.5 bg-white/15 hover:bg-white/25 border border-white/40 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full transition-all duration-200 backdrop-blur-md"
          >
            View Best Sellers
          </Link>
        </div>
      </div>

      {/* Manual Arrows */}
      <button
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-950 items-center justify-center transition-all backdrop-blur-md shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-950 items-center justify-center transition-all backdrop-blur-md shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full ${
              currentIndex === idx
                ? 'w-8 h-2.5 bg-amber-500'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
