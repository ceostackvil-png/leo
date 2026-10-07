import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useToast } from '../context/ToastContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    success('Welcome to the private LEO Guild.');
    setEmail('');
  };

  return (
    <footer className="bg-[#181B2D] text-white pt-16 pb-12 font-sans border-t border-[#242F66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Newsletter & Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-950 ring-2 ring-amber-400 p-0.5 flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="LEO Crest" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight uppercase text-white">
                  LEO <span className="text-amber-400">OFFICIAL STORE</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">
                  High-Comfort D2C Fashion & Modern Streetwear
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
              Engineered with 280gsm 100% Combed Supima cotton, 14.5oz Japanese selvedge denim, pure French flax linen, and 450gsm plush fleece. Designed for comfort that moves with you.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3 bg-[#242F66]/60 p-6 rounded-2xl border border-[#2D45A5]/40 shadow-lg">
            <p className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>🎁 GET FLAT ₹300 OFF ON FIRST ORDER</span>
            </p>
            <p className="text-xs text-blue-100 font-medium">
              Join 150,000+ members and receive secret flash drop alerts, combo vouchers, and member-only privilege pricing.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-[#181B2D] border border-white/20 rounded-xl text-white placeholder-gray-400 text-xs py-3 px-4 w-full focus:outline-none focus:border-amber-400 transition-colors font-medium"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shrink-0 shadow-md cursor-pointer"
              >
                {isSubscribed ? <Check className="w-4 h-4" /> : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Popular Categories</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/shop?category=t-shirts" className="hover:text-amber-400 transition-colors">Oversized T-Shirts (280 GSM)</Link></li>
              <li><Link to="/shop?category=denim" className="hover:text-amber-400 transition-colors">Selvedge Denim Jackets</Link></li>
              <li><Link to="/shop?category=winter-edition" className="hover:text-amber-400 transition-colors">450gsm Winter Hoodies</Link></li>
              <li><Link to="/shop?category=linen" className="hover:text-amber-400 transition-colors">Pure French Linen Shirts</Link></li>
              <li><Link to="/shop?category=travelling-collection" className="hover:text-amber-400 transition-colors">Airport Transit Joggers</Link></li>
              <li><Link to="/shop?category=leather-accessories" className="hover:text-amber-400 transition-colors">Leather Belts & Wallets</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Customer Support</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/track-order" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-amber-400 transition-colors">Shipping & 7-Day Easy Returns</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">Size Guide & Fit FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">WhatsApp & Helpdesk</Link></li>
              <li><Link to="/account/orders" className="hover:text-amber-400 transition-colors">My Client Account</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">The LEO Story</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Brand Story & Philosophy</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">100% Combed Cotton Quality</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Sustainable Craftsmanship</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Flagship Stores</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Policies & Legal</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/login/admin" className="hover:text-amber-400 transition-colors font-bold text-amber-400">👑 Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <p>© 2026 LEO Official Store. 100% Secure Shopping. Crafted with pride in India.</p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-gray-200">
            <span className="px-2.5 py-1 bg-[#242F66] rounded-md border border-white/10">⚡ Instant UPI / GPay</span>
            <span className="px-2.5 py-1 bg-[#242F66] rounded-md border border-white/10">💳 Visa / Mastercard</span>
            <span className="px-2.5 py-1 bg-[#242F66] rounded-md border border-white/10">🏦 Netbanking</span>
            <span className="px-2.5 py-1 bg-[#242F66] rounded-md border border-white/10">📦 Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
