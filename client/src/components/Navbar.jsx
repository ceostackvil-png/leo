import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ isSearchOpen, setIsSearchOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAppBannerOpen, setIsAppBannerOpen] = useState(true);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  
  const location = useLocation();
  const navigate = useNavigate();

  const announcementMessages = [
    "100% Refund Guarantee if you don't ❤️ the product. Shop with Confidence.",
    "⚡ Flat ₹300 Off on your first order! Use Code: APP300",
    "🚚 Free Express Shipping on all orders above ₹999",
    "🎁 Shop any 3 Get Extra 15% Off | Code: B3G15",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcementMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [announcementMessages.length]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navMenuItems = [
    { name: 'Men', href: '/shop?gender=Men' },
    { name: 'Women', href: '/shop?gender=Women' },
    { name: 'Travel', href: '/shop?category=joggers' },
    { name: 'Polos', href: '/shop?category=t-shirts' },
    { name: 'Hoodies', href: '/shop?category=winter-edition' },
    { name: 'Shirts', href: '/shop?category=linen' },
    { name: 'Tees', href: '/shop?category=t-shirts' },
    { name: 'Co-ords', href: '/shop?category=co-ords' },
    { name: 'Joggers', href: '/shop?category=joggers' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 font-sans shadow-xs bg-white">
      {/* 1. TOP APP DOWNLOAD PROMO BAR */}
      {isAppBannerOpen && (
        <div className="bg-[#FAF6E8] text-[#715D0B] px-3 py-1.5 border-b border-[#F0E4B6] flex items-center justify-between text-[11px] sm:text-xs font-[familyMedium]">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2 sm:px-6">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-3.5 h-3.5 text-[#242F66] shrink-0" />
              <span>
                Nobero is better on the App | <strong className="font-[familyBold] text-[#181B2D]">Flat ₹300 Off</strong> | Code: <strong className="font-[familyBold] text-[#242F66]">APP300</strong>
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                to="/shop"
                className="bg-[#242F66] text-white px-2.5 py-0.5 rounded text-[10px] font-[familyBold] hover:bg-[#181B2D] transition-colors"
              >
                OPEN APP
              </Link>
              <button
                onClick={() => setIsAppBannerOpen(false)}
                className="text-[#9698A0] hover:text-[#181B2D] text-xs leading-none"
                aria-label="Close app banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ANNOUNCEMENT TICKER (NAVY #242F66) */}
      <div className="bg-[#242F66] text-white py-1 px-4 text-center text-[11px] sm:text-xs font-[familyMedium] tracking-wide overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={tickerIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {announcementMessages[tickerIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. MAIN NAVBAR HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#242F66] hover:bg-[#F5F6F8] rounded-lg transition-colors"
            aria-label="Open Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <img
              src="https://nobero.com/cdn/shop/files/Nobero_logo_1_2.svg?v=1694697396"
              alt="Nobero"
              className="h-6 sm:h-8 w-auto object-contain"
              onError={(e) => {
                e.target.src = '/nobero_logo.svg';
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            {navMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-[familyBold] text-[#181B2D] hover:text-[#242F66] transition-colors whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative items-center"
          >
            <Search className="w-4 h-4 text-[#9698A0] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Try searching 'T-shirts', 'Co-Ords'..."
              className="w-full bg-[#F5F6F8] text-[#181B2D] text-xs font-[familyMedium] placeholder:text-[#9698A0] pl-9 pr-4 py-2.5 rounded-full border border-[#E8E9EA] focus:outline-none focus:ring-1 focus:ring-[#242F66] focus:bg-white transition-all"
            />
          </form>

          {/* Right Action Icons: Wishlist, Cart, Account */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 text-[#181B2D] hover:text-[#242F66] transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E11D48] text-white text-[10px] font-[familyBold] rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#181B2D] hover:text-[#242F66] transition-colors cursor-pointer"
              aria-label="Cart Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#242F66] text-white text-[10px] font-[familyBold] rounded-full flex items-center justify-center">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1.5 p-1.5 rounded-full hover:bg-[#F5F6F8] text-xs font-[familyBold] text-[#181B2D]"
                >
                  <div className="w-7 h-7 bg-[#EEF2FF] text-[#242F66] rounded-full flex items-center justify-center uppercase">
                    {user?.name?.[0] || 'U'}
                  </div>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-xs font-[familyBold] text-[#181B2D] hover:text-[#242F66] p-1.5"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isUserMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E8E9EA] py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#E8E9EA]">
                    <p className="font-[familyBold] text-[#181B2D] truncate">{user?.name}</p>
                    <p className="text-[#9698A0] text-[10px] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    className="flex items-center space-x-2 px-4 py-2 text-[#484B5A] hover:bg-[#F5F6F8]"
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-4 py-2 text-[#242F66] font-[familyBold] hover:bg-[#EEF2FF]"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-[#E11D48] hover:bg-rose-50 text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-[#9698A0] absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search T-shirts, Joggers, Hoodies..."
              className="w-full bg-[#F5F6F8] text-[#181B2D] text-xs font-[familyMedium] placeholder:text-[#9698A0] pl-9 pr-4 py-2 rounded-full border border-[#E8E9EA] focus:outline-none"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[110px] bottom-0 bg-white z-50 overflow-y-auto p-5 border-t border-[#E8E9EA] space-y-3">
          <div className="space-y-1">
            {navMenuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2.5 text-base font-[familyBold] text-[#181B2D] border-b border-[#F5F6F8]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 space-y-2 text-xs font-[familyMedium] text-[#666875]">
            <Link to="/orders" className="block py-1.5 hover:text-[#242F66]">
              📦 Track Order
            </Link>
            <Link to="/wishlist" className="block py-1.5 hover:text-[#242F66]">
              ❤️ My Wishlist
            </Link>
            <Link to="/login" className="block py-1.5 text-[#242F66] font-[familyBold]">
              👤 Account / Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
