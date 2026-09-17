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
    success('Welcome to the private VELORA List.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0A0A0A] text-[#F7F5F0] pt-20 pb-12 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Newsletter & Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-6 space-y-4">
            <span className="font-editorial text-3xl md:text-4xl font-normal tracking-[0.2em] uppercase">
              VELORA
            </span>
            <p className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">
              Defined by the Details.
            </p>
            <p className="text-sm font-light text-white/60 max-w-md leading-relaxed pt-2">
              An atelier dedicated to structural precision, Italian cashmere, and 100% pure Mulberry silk. Timeless architectural silhouettes for the discerning eye.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.25em] text-white font-medium">
              Join the VELORA List
            </p>
            <p className="text-xs text-white/60 font-light">
              Receive private lookbook previews, editorial releases, and invitations to private trunk shows.
            </p>
            <form onSubmit={handleSubscribe} className="flex max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-transparent border-b border-white/30 text-white placeholder:text-white/40 text-xs py-3 px-1 w-full focus:outline-none focus:border-velora-champagne transition-colors"
                required
              />
              <button
                type="submit"
                className="border-b border-white/30 px-4 py-3 hover:border-velora-champagne hover:text-velora-champagne transition-colors flex items-center text-xs tracking-widest uppercase font-medium"
              >
                {isSubscribed ? <Check className="w-4 h-4 text-velora-champagne" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 text-xs font-light tracking-wide">
          <div className="space-y-4">
            <p className="uppercase tracking-[0.25em] font-medium text-white text-[11px]">Collections</p>
            <ul className="space-y-2.5 text-white/60">
              <li><Link to="/shop?gender=Women" className="hover:text-white transition-colors">Women's Atelier</Link></li>
              <li><Link to="/shop?gender=Men" className="hover:text-white transition-colors">Men's Tailoring</Link></li>
              <li><Link to="/shop?collection=monolith-aw26" className="hover:text-white transition-colors">Autumn/Winter '26</Link></li>
              <li><Link to="/shop?collection=the-silk-edit" className="hover:text-white transition-colors">The Silk Edit</Link></li>
              <li><Link to="/shop?collection=cashmere-atelier" className="hover:text-white transition-colors">Cashmere Collection</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="uppercase tracking-[0.25em] font-medium text-white text-[11px]">Client Concierge</p>
            <ul className="space-y-2.5 text-white/60">
              <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Consignment</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-white transition-colors">Complimentary Delivery & Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Bespoke Size Guide & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Client Services Concierge</Link></li>
              <li><Link to="/account/orders" className="hover:text-white transition-colors">My Client Account</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="uppercase tracking-[0.25em] font-medium text-white text-[11px]">The House</p>
            <ul className="space-y-2.5 text-white/60">
              <li><Link to="/about" className="hover:text-white transition-colors">Brand Heritage & Vision</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Material Sourcing Integrity</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Artisanal Tailoring</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Atelier Locations</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="uppercase tracking-[0.25em] font-medium text-white text-[11px]">Governance</p>
            <ul className="space-y-2.5 text-white/60">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Governance</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/admin/login" className="hover:text-velora-champagne transition-colors">Admin Atelier Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] font-light text-white/40 space-y-4 md:space-y-0">
          <p>© 2026 VELORA Atelier. All Rights Reserved. Crafted for high-altitude elegance.</p>
          <div className="flex items-center space-x-6">
            <span>India / INR (₹)</span>
            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">English (UK)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
