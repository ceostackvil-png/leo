import React, { useState } from 'react';
import { Sparkles, Copy, Check, Tag } from 'lucide-react';

export const SpecialOffersSection = ({ coupons = [] }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const fallbackCoupons = [
    {
      code: 'WELCOME10',
      description: '10% privilege discount on your inaugural atelier order.',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 2000,
    },
    {
      code: 'MONOLITH15',
      description: '15% savings on all Autumn/Winter tailoring and outerwear.',
      discountType: 'percentage',
      discountValue: 15,
      minOrderValue: 5000,
    },
    {
      code: 'ROYAL2000',
      description: '₹2,000 instant credit on pure Mongolian cashmere orders.',
      discountType: 'fixed',
      discountValue: 2000,
      minOrderValue: 10000,
    },
    {
      code: 'VIP25',
      description: '25% VIP Atelier member discount on bespoke purchases above ₹15,000.',
      discountType: 'percentage',
      discountValue: 25,
      minOrderValue: 15000,
    },
  ];

  const offers = coupons.length > 0 ? coupons : fallbackCoupons;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section className="py-20 bg-[#121212] text-white border-y border-white/10" aria-label="Special Coupon Offers">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Privilege Vouchers</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-white mt-1">
              Special Atelier Offers
            </h2>
          </div>
          <p className="text-xs text-white/60 font-light mt-2 md:mt-0 max-w-sm">
            Apply privilege codes during checkout to unlock bespoke complimentary adjustments and discounts.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.slice(0, 4).map((c) => (
            <div
              key={c.code}
              className="group relative p-6 bg-gradient-to-b from-[#1C1C1C] to-[#141414] border border-white/10 hover:border-velora-champagne/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-widest text-velora-champagne font-medium bg-velora-champagne/10 px-2.5 py-1 border border-velora-champagne/20">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                </span>
                <Tag className="w-4 h-4 text-white/40" />
              </div>

              {/* Code & Description */}
              <div className="space-y-2 mb-6">
                <p className="font-editorial text-2xl font-normal tracking-wider text-white">
                  {c.code}
                </p>
                <p className="text-xs text-white/70 font-light leading-relaxed min-h-[36px]">
                  {c.description}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">
                  Min. Order: ₹{c.minOrderValue?.toLocaleString('en-IN') || '0'}
                </p>
              </div>

              {/* Copy Action Button */}
              <button
                onClick={() => handleCopy(c.code)}
                className={`w-full py-2.5 flex items-center justify-center space-x-2 text-xs uppercase tracking-[0.18em] font-medium transition-all duration-300 ${
                  copiedCode === c.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 hover:bg-white text-white hover:text-velora-black'
                }`}
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied Code</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
