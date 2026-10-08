import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSlider = ({ banners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const defaultSlides = [
    {
      _id: 'banner_1',
      desktopImage: 'https://nobero.com/cdn/shop/files/AW_26_Homepage_Banners_Desktop_jpg.jpg?v=1790747269',
      mobileImage: 'https://nobero.com/cdn/shop/files/AW_26_Homepage_Banners_Mobile-2_jpg.jpg?v=1790747250',
      title: 'AW 26 DROP — AUTUMN WINTER COLLECTION',
      ctaLink: '/shop',
    },
    {
      _id: 'banner_2',
      desktopImage: 'https://nobero.com/cdn/shop/files/FULL-SLEEVE_T-SHIRT.jpg?v=1787831897',
      mobileImage: 'https://nobero.com/cdn/shop/files/full_sleeve_Mobile.jpg?v=1787831879',
      title: 'FULL SLEEVE T-SHIRTS DROP',
      ctaLink: '/shop?category=t-shirts',
    },
    {
      _id: 'banner_3',
      desktopImage: 'https://nobero.com/cdn/shop/files/our_app_is_here_-_Desktop_jpg.jpg?v=1768989566',
      mobileImage: 'https://nobero.com/cdn/shop/files/our_app_is_here_Mobile_-7_jpg.jpg?v=1768989570',
      title: 'DOWNLOAD THE NOBERO APP — GET ₹300 OFF',
      ctaLink: '/shop',
    },
  ];

  const slides = banners && banners.length > 0
    ? banners.map(b => ({
        _id: b._id || b.id || Math.random().toString(),
        desktopImage: b.desktopImage || b.image || 'https://nobero.com/cdn/shop/files/AW_26_Homepage_Banners_Desktop_jpg.jpg?v=1790747269',
        mobileImage: b.mobileImage || b.imageMobile || b.desktopImage || 'https://nobero.com/cdn/shop/files/AW_26_Homepage_Banners_Mobile-2_jpg.jpg?v=1790747250',
        title: b.title || 'Nobero Official',
        ctaLink: b.ctaLink || b.link || '/shop',
      }))
    : defaultSlides;

  // Auto-play slider every 4.5 seconds
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
      className="relative w-full overflow-hidden bg-white select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Nobero Hero Banner Slider"
    >
      <Link to={currentSlide.ctaLink} className="block w-full cursor-pointer">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide._id || currentIndex}
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.85 }}
            transition={{ duration: 0.35 }}
            className="w-full"
          >
            {/* Desktop Banner Image */}
            <img
              src={currentSlide.desktopImage}
              alt={currentSlide.title}
              className="hidden md:block w-full h-auto object-cover max-h-[580px] xl:max-h-[640px]"
            />
            {/* Mobile Banner Image */}
            <img
              src={currentSlide.mobileImage}
              alt={currentSlide.title}
              className="block md:hidden w-full h-auto object-cover aspect-[4/5] sm:aspect-[16/10]"
            />
          </motion.div>
        </AnimatePresence>
      </Link>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); handlePrev(); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#181B2D] flex items-center justify-center shadow-md transition-all z-20"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); handleNext(); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-[#181B2D] flex items-center justify-center shadow-md transition-all z-20"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicators / Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-[#242F66]' : 'w-2 bg-white/80 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
