import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bell, Sparkles } from 'lucide-react';

export const ComingSoonSection = ({ comingSoonProducts = [] }) => {
  const fallbackProducts = [
    {
      _id: 'cs-1',
      title: 'LEO Silk Jacquard Imperial Smoking Coat',
      categoryName: 'Eveningwear & Tuxedos',
      price: 24999,
      image: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?auto=format&fit=crop&w=1600&q=95',
      launchDate: 'October 15, 2026',
      shortDescription: 'Tone-on-tone baroque jacquard with quilted shawl collar and silk fringe sash.',
    },
    {
      _id: 'cs-2',
      title: 'LEO Double-Breasted Wool-Silk Dinner Blazer',
      categoryName: 'Eveningwear & Tuxedos',
      price: 21499,
      image: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&w=1600&q=95',
      launchDate: 'October 28, 2026',
      shortDescription: 'Six-button closure in Super 150s virgin wool and Mulberry silk.',
    },
    {
      _id: 'cs-3',
      title: 'LEO Cashmere Draped Mantle Over-Scarf',
      categoryName: 'Knitwear',
      price: 8999,
      image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=95',
      launchDate: 'November 05, 2026',
      shortDescription: 'Heavy 4-ply Mongolian cashmere cape with hand-fringed edging.',
    },
  ];

  const items = comingSoonProducts.length > 0 ? comingSoonProducts : fallbackProducts;

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-12" aria-label="Coming Soon Releases">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Future Drops</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
            Coming Soon to Atelier
          </h2>
        </div>
        <p className="text-xs text-stone-600 font-light mt-2 md:mt-0 max-w-sm">
          Preview upcoming limited capsule releases currently being hand-inspected in our atelier.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item._id}
            className="group relative bg-white border border-velora-border overflow-hidden shadow-md flex flex-col"
          >
            {/* Image Box */}
            <div className="relative aspect-[3/4] bg-stone-200 overflow-hidden">
              <img
                src={item.images?.[0]?.url || item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              />
              <div className="absolute inset-0 bg-black/25" />

              {/* Status Badge */}
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-velora-champagne px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] font-semibold border border-velora-champagne/40">
                COMING SOON
              </div>

              {/* Launch Date */}
              {item.launchDate && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-sm p-2.5 text-center text-white text-[11px] font-light tracking-wider">
                  <span className="text-velora-champagne uppercase font-medium">Launch: </span>
                  <span>{new Date(item.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-velora-muted font-medium block mb-1">
                  {item.categoryName || item.category?.name || 'Exclusive Atelier'}
                </span>
                <h3 className="font-editorial text-xl font-normal text-velora-black leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 font-light mt-2 line-clamp-2 leading-relaxed">
                  {item.shortDescription || item.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-velora-border">
                <span className="text-sm font-semibold text-velora-black">
                  ₹{item.price?.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => alert(`You will be notified as soon as ${item.title} becomes available!`)}
                  className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] font-medium text-velora-champagne hover:text-velora-black transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify Me</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
