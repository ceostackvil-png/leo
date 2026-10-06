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
    <footer className="bg-slate-900 text-white pt-16 pb-12 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Newsletter & Statement Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 p-1 flex items-center justify-center font-black">
                👑
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight uppercase">
                  ALTER <span className="text-amber-400">THE KING</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                  Sovereign D2C Menswear Atelier
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
              Everyday luxury engineered with 280gsm Supima cotton, 14.5oz Japanese selvedge denim, pure French flax linen, and 450gsm loopback transit fleece.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
            <p className="text-sm font-bold text-white uppercase tracking-wider">
              🎁 Subscribe & Get ₹300 Off
            </p>
            <p className="text-xs text-gray-300">
              Be the first to hear about new drop alerts, secret warehouse sales, and VIP combo discounts.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="bg-slate-900 border border-slate-700 rounded-full text-white placeholder-gray-500 text-xs py-2.5 px-4 w-full focus:outline-none focus:border-amber-400 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full transition-all shrink-0 shadow-md"
              >
                {isSubscribed ? <Check className="w-4 h-4" /> : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Links Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 text-xs">
          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Popular Categories</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/shop?category=t-shirts" className="hover:text-amber-400 transition-colors">Heavyweight T-Shirts</Link></li>
              <li><Link to="/shop?category=denim" className="hover:text-amber-400 transition-colors">Selvedge Denim Jackets</Link></li>
              <li><Link to="/shop?category=winter-edition" className="hover:text-amber-400 transition-colors">450gsm Winter Hoodies</Link></li>
              <li><Link to="/shop?category=linen" className="hover:text-amber-400 transition-colors">Pure French Linen Shirts</Link></li>
              <li><Link to="/shop?category=leather-accessories" className="hover:text-amber-400 transition-colors">Leather Belts & Boots</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Customer Support</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/track-order" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-amber-400 transition-colors">Shipping & 7-Day Returns</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">Size Guide & FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">WhatsApp & Concierge</Link></li>
              <li><Link to="/account/orders" className="hover:text-amber-400 transition-colors">My Client Account</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">About Alter</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">The House of ALTER</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Fabric Quality Standards</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition-colors">Sovereign Craftsmanship</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Store Locations</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="uppercase font-black text-amber-400 tracking-wider text-[11px]">Policies & Admin</p>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/login/admin" className="hover:text-amber-400 transition-colors font-bold text-amber-400">👑 ALTER Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 space-y-4 md:space-y-0">
          <p>© 2026 ALTER — The King. All Rights Reserved. Crafted with pride in India.</p>
          <div className="flex items-center space-x-3 text-[11px] font-bold text-gray-300">
            <span className="px-2 py-1 bg-slate-800 rounded">UPI / GPay</span>
            <span className="px-2 py-1 bg-slate-800 rounded">Cards & Netbanking</span>
            <span className="px-2 py-1 bg-slate-800 rounded">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
