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
  ShieldCheck,
  LogOut,
  Package,
  Settings,
  Flame,
  Sparkles,
  Truck,
  Percent,
  Tag
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
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  
  const location = useLocation();
  const navigate = useNavigate();

  const [isAppBannerVisible, setIsAppBannerVisible] = useState(true);

  const announcementMessages = [
    { text: "100% Refund Guarantee if you don't ❤️ the product. Shop with Confidence.", icon: '❤️' },
    { text: '🔥 FLAT ₹300 OFF ON 1ST ORDER | USE CODE: LEO300 | 🚚 FREE SHIPPING ON PREPAID ORDERS', icon: '🔥' },
    { text: '⚡ BUY ANY 2 APPAREL & GET EXTRA 10% OFF AUTO-APPLIED AT CHECKOUT', icon: '⚡' },
    { text: '✨ OVERSIZED TEES & DENIM DROP IS NOW LIVE | 450 GSM FRENCH TERRY', icon: '✨' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % announcementMessages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navCategories = [
    {
      name: 'Men',
      href: '/shop?gender=Men',
      badge: 'POPULAR',
      badgeColor: 'bg-blue-600 text-white',
      subcategories: [
        { name: 'All Men Collections', href: '/shop?gender=Men' },
        { name: 'Oversized T-Shirts', href: '/shop?category=t-shirts&subCategory=Oversized' },
        { name: 'Classic Pique Polos', href: '/shop?category=t-shirts&subCategory=Polo' },
        { name: 'Round Neck Tees', href: '/shop?category=t-shirts&subCategory=Round Neck' },
        { name: 'Selvedge Denim Jackets', href: '/shop?category=denim&subCategory=Jackets' },
        { name: '450gsm Hoodies', href: '/shop?category=winter-edition&subCategory=Hoodies' },
        { name: 'Commuter Joggers', href: '/shop?category=travelling-collection&subCategory=Transit Joggers' },
      ],
      tagline: 'Engineered Everyday Wear'
    },
    {
      name: 'Oversized Tees',
      href: '/shop?category=t-shirts',
      badge: 'HOT',
      badgeColor: 'bg-rose-500 text-white',
      subcategories: [
        { name: 'All T-Shirts', href: '/shop?category=t-shirts' },
        { name: 'Heavyweight Round Neck', href: '/shop?category=t-shirts&subCategory=Round Neck' },
        { name: 'Full Sleeve Knits', href: '/shop?category=t-shirts&subCategory=Full Sleeve' },
        { name: 'Turtle Neck Knit Tees', href: '/shop?category=t-shirts&subCategory=Turtle Neck' },
        { name: 'Mercerized Polos', href: '/shop?category=t-shirts&subCategory=Polo' },
      ],
      tagline: '280gsm 100% Combed Cotton'
    },
    {
      name: 'Denim',
      href: '/shop?category=denim',
      badge: 'NEW',
      badgeColor: 'bg-indigo-600 text-white',
      subcategories: [
        { name: 'All Denim', href: '/shop?category=denim' },
        { name: 'Classic Indigo Denim Jacket', href: '/shop?category=denim&subCategory=Jackets' },
        { name: 'Olive Green Denim Jacket', href: '/shop?category=denim&subCategory=Jackets' },
        { name: 'Japanese Selvedge Jeans', href: '/shop?category=denim&subCategory=Jeans' },
      ],
      tagline: '14.5oz Kaihara Raw Selvedge'
    },
    {
      name: 'Winterwear',
      href: '/shop?category=winter-edition',
      badge: '450 GSM',
      badgeColor: 'bg-amber-500 text-slate-900',
      subcategories: [
        { name: 'All Winterwear', href: '/shop?category=winter-edition' },
        { name: 'Heavyweight Hoodies', href: '/shop?category=winter-edition&subCategory=Hoodies' },
        { name: 'Cashmere Sweatshirts', href: '/shop?category=winter-edition&subCategory=Sweatshirts' },
        { name: 'Insulated Outerwear', href: '/shop?category=winter-edition&subCategory=Jackets' },
      ],
      tagline: 'Plush Loopback French Terry'
    },
    {
      name: 'Linen',
      href: '/shop?category=linen',
      subcategories: [
        { name: 'All Linen', href: '/shop?category=linen' },
        { name: 'Italian Formal Linen Shirts', href: '/shop?category=linen&subCategory=Formal' },
        { name: 'Casual Band-Collar Shirts', href: '/shop?category=linen&subCategory=Casual' },
        { name: 'Pleated Linen Trousers', href: '/shop?category=trousers' },
      ],
      tagline: 'Pure Normandy Flax'
    },
    {
      name: 'Travel Wear',
      href: '/shop?category=travelling-collection',
      badge: 'TRANSIT',
      badgeColor: 'bg-emerald-600 text-white',
      subcategories: [
        { name: 'All Travel Wear', href: '/shop?category=travelling-collection' },
        { name: 'Airport Transit Hoodies', href: '/shop?category=travelling-collection&subCategory=Travel Hoodies' },
        { name: 'Commuter Transit Joggers', href: '/shop?category=travelling-collection&subCategory=Transit Joggers' },
        { name: 'Leather Duffel Bags', href: '/shop?category=leather-accessories&subCategory=Bags' },
      ],
      tagline: 'Engineered for Long Hauls'
    },
    {
      name: 'Combos & Deals',
      href: '/shop?isBestSeller=true',
      badge: 'SAVE 40%',
      badgeColor: 'bg-red-600 text-white animate-pulse',
      subcategories: [
        { name: 'Buy 2 T-Shirts @ ₹1,499', href: '/shop?category=t-shirts' },
        { name: 'Buy 2 Polos @ ₹1,999', href: '/shop?category=t-shirts' },
        { name: 'Best Sellers Under ₹2,999', href: '/shop?isBestSeller=true' },
      ],
      tagline: 'Super Saver Bundles'
    }
  ];

  return (
    <>
      {/* ==================================================== */}
      {/* TOP APP DOWNLOAD BANNER (NOBERO SIGNATURE WIDGET)    */}
      {/* ==================================================== */}
      {isAppBannerVisible && (
        <div className="bg-[#EEF2FF] border-b border-[#DDE4FC] px-3 sm:px-6 py-2 text-xs text-[#242F66] transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#242F66] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                🦁
              </div>
              <div className="leading-tight">
                <span className="font-bold text-[#242F66] block sm:inline mr-2">LEO is better on the App</span>
                <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 text-[11px] shadow-2xs">
                  Flat ₹300 Off | Code: LEO300
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#2D45A5] text-white text-[10px] sm:text-[11px] font-extrabold py-1 px-3.5 rounded uppercase tracking-wider hover:bg-[#242F66] transition-colors shadow-sm cursor-pointer"
              >
                OPEN APP
              </button>
              <button
                onClick={() => setIsAppBannerVisible(false)}
                aria-label="Close app banner"
                className="p-1 text-[#242F66]/70 hover:text-[#242F66] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TOP ANNOUNCEMENT TICKER (NOBERO SIGNATURE #242F66)   */}
      {/* ==================================================== */}
      <div className="bg-[#242F66] text-white text-xs font-semibold py-2 px-4 text-center overflow-hidden relative shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={tickerIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center space-x-2 text-[11px] sm:text-xs font-semibold"
            >
              <span>{announcementMessages[tickerIndex].text}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ==================================================== */}
      {/* MAIN BRIGHT NAVBAR                                   */}
      {/* ==================================================== */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 bg-white transition-all duration-200 border-b border-[#E8E9EA] shadow-xs ${
          isScrolled ? 'py-2 shadow-md' : 'py-2.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
          {/* Mobile Menu Button & Search icon */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-800 hover:text-black focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-gray-800 hover:text-black"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo (Left Zone) — LEO */}
          <div className="flex items-center shrink-0">
            <Link to="/" className="group flex items-center space-x-2.5">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 p-0.5 ring-2 ring-amber-500 shadow-md flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="LEO Crest"
                  className="w-full h-full object-contain rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="font-black text-xl sm:text-2xl text-[#242F66] tracking-tight leading-tight">
                    LEO
                  </span>
                  <span className="bg-amber-400 text-stone-950 text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-xs">
                    OFFICIAL
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.25em] -mt-0.5">
                  D2C Apparel
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar (Nobero style integrated search) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try searching "T-shirts", "Denim Jackets", "Hoodies"...'
                className="w-full bg-[#F5F6F8] hover:bg-[#EBEEF2] focus:bg-white text-gray-900 placeholder-gray-400 text-xs rounded-lg py-2.5 pl-10 pr-4 border border-[#E8E9EA] focus:border-[#242F66] focus:ring-2 focus:ring-[#242F66]/10 outline-none transition-all font-medium"
              />
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end shrink-0 space-x-2 sm:space-x-3">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Saved items"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className="flex items-center space-x-1 p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="User profile"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.8]" />
                  <ChevronDown className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center space-x-1.5 py-1.5 px-3.5 rounded-full text-xs font-semibold text-slate-800 bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Sign in"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-60 bg-white text-gray-900 border border-gray-200 shadow-2xl py-2 z-50 text-xs font-medium rounded-xl overflow-hidden"
                  >
                    <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Signed In As</p>
                      <p className="font-bold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-gray-500 text-[11px] truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-amber-50 text-amber-700 transition-colors font-bold"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>ALTER Admin Atelier</span>
                      </Link>
                    )}

                    <Link
                      to="/account/orders"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account/profile"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 hover:bg-rose-50 text-rose-600 border-t border-gray-100 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Bag Button */}
            <button
              onClick={openCart}
              className="relative py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full flex items-center space-x-1.5 shadow-sm transition-all"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {totalItemCount > 0 && (
                <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded-full px-1.5 py-0.2 min-w-[18px] text-center ml-1">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Categories Sub-Navigation Bar (Nobero style) */}
        <div className="hidden lg:block border-t border-gray-100 mt-2.5 pt-1.5">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center space-x-6 xl:space-x-8">
            {navCategories.map((cat) => (
              <div
                key={cat.name}
                className="relative py-1.5"
                onMouseEnter={() => setActiveDropdown(cat.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={cat.href}
                  className="text-xs font-bold text-gray-700 hover:text-slate-950 uppercase tracking-wider transition-colors flex items-center space-x-1.5 py-1"
                >
                  <span>{cat.name}</span>
                  {cat.badge && (
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full leading-tight ${cat.badgeColor}`}>
                      {cat.badge}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === cat.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-1 w-64 z-50 pointer-events-auto"
                    >
                      <div className="bg-white text-gray-900 border border-gray-200 shadow-2xl p-4 space-y-2 rounded-xl">
                        <div className="pb-2 border-b border-gray-100 flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-wider text-amber-600 font-extrabold">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            {cat.tagline}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1 pt-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className="text-xs font-semibold text-gray-700 hover:text-amber-600 hover:translate-x-1 transition-all py-1"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-white text-gray-900 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <img src="/logo.png" alt="LEO Crest" className="w-8 h-8 object-contain rounded-full bg-slate-950 p-0.5" />
                    <div className="flex flex-col">
                      <span className="font-extrabold text-lg text-slate-900">LEO</span>
                      <span className="text-[8px] tracking-widest uppercase text-amber-600 font-bold -mt-1">OFFICIAL STORE</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-gray-500 hover:text-black"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Search */}
                <form onSubmit={(e) => { handleSearchSubmit(e); setIsMobileMenuOpen(false); }} className="mt-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder='Search "Oversized Tees, Hoodies..."'
                      className="w-full bg-gray-100 text-gray-900 text-xs rounded-lg py-2.5 pl-9 pr-3 outline-none"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </form>

                <div className="mt-5 flex flex-col space-y-3">
                  {navCategories.map((cat) => (
                    <div key={cat.name} className="border-b border-gray-100 pb-2.5">
                      <div className="flex items-center justify-between">
                        <Link
                          to={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm font-bold text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {cat.name}
                        </Link>
                        {cat.badge && (
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full ${cat.badgeColor}`}>
                            {cat.badge}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-2 pl-2">
                        {cat.subcategories.slice(1, 5).map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[11px] text-gray-600 hover:text-black font-medium"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex flex-col space-y-2 text-xs font-semibold text-gray-600">
                    <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black">
                      📦 Track Order
                    </Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black">
                      👑 About LEO Atelier
                    </Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-black">
                      💬 WhatsApp & Help
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-gray-100 text-xs font-medium text-gray-600">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <span>Hi, {user?.name}</span>
                    <button onClick={logout} className="text-red-500 font-bold">Logout</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-600 font-bold">Sign In</Link>
                    <span>/</span>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-900 font-bold">Create Account</Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
