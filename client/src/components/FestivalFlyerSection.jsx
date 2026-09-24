import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame } from 'lucide-react';

export const FestivalFlyerSection = ({ flyers = [] }) => {
  const defaultFlyer = {
    title: 'FESTIVAL OF ROYALTY — DIWALI ATELIER SALE',
    description: 'Enjoy complimentary express dispatch and an exclusive ₹2,500 atelier privilege credit on bespoke tailoring and double-faced cashmere.',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=2400&q=95',
    link: '/shop?collection=the-silk-edit',
    ctaText: 'Claim Festival Privilege',
    badge: 'FESTIVE EDIT',
  };

  const flyer = flyers.length > 0 ? flyers[0] : defaultFlyer;

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 md:px-12" aria-label="Promotional Flyer">
      <div className="relative overflow-hidden bg-black text-white shadow-2xl border border-white/10">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={flyer.image}
            alt={flyer.title}
            className="w-full h-full object-cover object-center brightness-50 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/40" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-velora-champagne/20 border border-velora-champagne px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-velora-champagne font-semibold">
            <Flame className="w-3.5 h-3.5 text-velora-champagne" />
            <span>{flyer.badge || 'SPECIAL FESTIVE PROMOTION'}</span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight uppercase tracking-wide text-white">
            {flyer.title}
          </h2>

          <p className="text-sm font-light text-white/80 leading-relaxed max-w-lg">
            {flyer.description}
          </p>

          <div className="pt-2">
            <Link
              to={flyer.link || '/shop'}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-white text-velora-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-velora-champagne hover:text-white transition-all shadow-xl"
            >
              <span>{flyer.ctaText || 'EXPLORE FESTIVE EDIT'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
