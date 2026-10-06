import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, User as UserIcon, Menu, X, ChevronDown, ShieldCheck, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Navbar = ({ isSearchOpen, setIsSearchOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
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

  const navCategories = [
    {
      name: 'T-Shirts',
      href: '/shop?category=t-shirts',
      subcategories: [
        { name: 'All T-Shirts', href: '/shop?category=t-shirts' },
        { name: 'Round Neck Tees', href: '/shop?category=t-shirts&subCategory=Round Neck' },
        { name: 'Full Sleeve Tees', href: '/shop?category=t-shirts&subCategory=Full Sleeve' },
        { name: 'Turtle Neck Knit Tees', href: '/shop?category=t-shirts&subCategory=Turtle Neck' },
        { name: 'Mercerized Polos', href: '/shop?category=t-shirts&subCategory=Polo' },
        { name: 'Oversized Boxy Tees', href: '/shop?category=t-shirts&subCategory=Oversized' },
      ],
      tagline: '280gsm Supima & Mercerized Cotton'
    },
    {
      name: 'Denim',
      href: '/shop?category=denim',
      subcategories: [
        { name: 'All Denim', href: '/shop?category=denim' },
        { name: 'Classic Indigo Denim Jacket', href: '/shop?category=denim&subCategory=Jackets' },
        { name: 'Olive Green Denim Jacket', href: '/shop?category=denim&subCategory=Jackets' },
        { name: 'Japanese Selvedge Jeans', href: '/shop?category=denim&subCategory=Jeans' },
        { name: 'Relaxed Wide-Leg Denim', href: '/shop?category=denim&subCategory=Jeans' },
      ],
      tagline: '14.5oz Kaihara Japanese Selvedge'
    },
    {
      name: 'Winter Edition',
      href: '/shop?category=winter-edition',
      subcategories: [
        { name: 'All Winter Edition', href: '/shop?category=winter-edition' },
        { name: '450gsm Heavyweight Hoodies', href: '/shop?category=winter-edition&subCategory=Hoodies' },
        { name: 'Cashmere-Blend Sweatshirts', href: '/shop?category=winter-edition&subCategory=Sweatshirts' },
        { name: 'Quilted Winter Shirts', href: '/shop?category=winter-edition&subCategory=Shirts' },
        { name: 'Insulated Outerwear & Parkas', href: '/shop?category=winter-edition&subCategory=Jackets' },
      ],
      tagline: 'Grade-A Cashmere & Loopback Fleece'
    },
    {
      name: 'Linen',
      href: '/shop?category=linen',
      subcategories: [
        { name: 'All Linen', href: '/shop?category=linen' },
        { name: 'Italian Formal Linen Shirts', href: '/shop?category=linen&subCategory=Formal' },
        { name: 'Casual Band-Collar Linen Shirts', href: '/shop?category=linen&subCategory=Casual' },
        { name: 'Pleated Linen Trousers', href: '/shop?category=trousers' },
      ],
      tagline: 'Pure Normandy Pre-Washed Flax'
    },
    {
      name: 'Leather',
      href: '/shop?category=leather-accessories',
      subcategories: [
        { name: 'All Leather', href: '/shop?category=leather-accessories' },
        { name: 'Full-Grain Calfskin Belts', href: '/shop?category=leather-accessories&subCategory=Belts' },
        { name: 'Minimalist Bifold Wallets', href: '/shop?category=leather-accessories&subCategory=Wallets' },
        { name: 'Goodyear-Welted Chelsea Boots', href: '/shop?category=leather-accessories&subCategory=Shoes' },
        { name: 'Weekender Duffel Bags', href: '/shop?category=leather-accessories&subCategory=Bags' },
      ],
      tagline: 'Vegetable-Tanned Florentine Leather'
    },
    {
      name: 'Travelling',
      href: '/shop?category=travelling-collection',
      subcategories: [
        { name: 'All Travelling Gear', href: '/shop?category=travelling-collection' },
        { name: 'Airport Transit Hoodies', href: '/shop?category=travelling-collection&subCategory=Travel Hoodies' },
        { name: 'Commuter Transit Joggers', href: '/shop?category=travelling-collection&subCategory=Transit Joggers' },
        { name: 'Packable Travel Jackets', href: '/shop?category=travelling-collection&subCategory=Packable Jackets' },
      ],
      tagline: 'Engineered for First-Class Transit'
    },
    {
      name: 'Collections',
      href: '/collections',
      subcategories: [
        { name: 'All Lookbooks', href: '/collections' },
        { name: 'The King Essentials', href: '/shop?collection=the-king-essentials' },
        { name: 'The Denim Edition', href: '/shop?collection=denim-edition' },
        { name: 'Pure Linen Atelier', href: '/shop?collection=linen-atelier' },
        { name: 'Sovereign Stitching', href: '/shop?collection=sovereign-stitching' },
      ],
      tagline: 'Curated Seasonal Lookbooks'
    }
  ];

  const isLightHero = isHomePage && !isScrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF9F5]/98 backdrop-blur-md border-b border-velora-border/70 py-3 shadow-sm'
            : isHomePage
            ? 'bg-gradient-to-b from-black/75 via-black/35 to-transparent text-white py-3.5'
            : 'bg-[#FAF9F5] border-b border-velora-border py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1.5 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className={`w-5.5 h-5.5 ${isLightHero ? 'text-white' : 'text-velora-black'}`} />
            </button>
          </div>

          {/* Logo (Left Zone) — ALTER The King */}
          <div className="flex items-center shrink-0 min-w-[130px]">
            <Link to="/" className="group flex items-center space-x-2.5">
              <img
                src="/logo.png"
                alt="ALTER The King Crest"
                className={`w-8 h-8 md:w-8.5 md:h-8.5 object-contain rounded-full transition-all duration-300 ${
                  isLightHero ? 'ring-1 ring-white/40' : 'ring-1 ring-black/10'
                }`}
              />
              <div className="flex flex-col">
                <span className={`font-editorial text-xl md:text-2xl font-normal tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isLightHero ? 'text-white' : 'text-velora-black'
                }`}>
                  ALTER
                </span>
                <span className={`text-[7px] md:text-[8px] tracking-[0.35em] uppercase font-medium -mt-1 transition-opacity duration-300 ${
                  isLightHero ? 'text-velora-champagne' : 'text-stone-600'
                }`}>
                  The King
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation with Nobero-style Dropdown Mega Menu */}
          <nav className="hidden lg:flex items-center justify-center space-x-4 xl:space-x-6 px-4 flex-1">
            {navCategories.map((cat) => (
              <div
                key={cat.name}
                className="relative py-2"
                onMouseEnter={() => setActiveDropdown(cat.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={cat.href}
                  className={`text-[10px] xl:text-[11px] font-semibold tracking-[0.18em] uppercase transition-all duration-200 flex items-center space-x-1 py-1 ${
                    isLightHero
                      ? 'text-white/90 hover:text-white'
                      : 'text-stone-800 hover:text-black'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown className="w-3 h-3 opacity-60 transition-transform group-hover:rotate-180" />
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {activeDropdown === cat.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-64 z-50 pointer-events-auto"
                    >
                      <div className="bg-[#0A0A0A] text-[#F7F5F0] border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)] p-4 space-y-2 rounded-sm">
                        <div className="pb-2 border-b border-white/10">
                          <span className="text-[9px] uppercase tracking-[0.25em] text-velora-champagne font-semibold block">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-white/50 font-light block">
                            {cat.tagline}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1.5 pt-1">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.name}
                              to={sub.href}
                              onClick={() => setActiveDropdown(null)}
                              className="text-xs font-light text-white/80 hover:text-velora-champagne hover:translate-x-1 transition-all py-1"
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
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end shrink-0 min-w-[120px] space-x-3.5 md:space-x-5">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-1 transition-colors duration-300 ${
                isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
              }`}
              aria-label="Search catalog"
            >
              <Search className="w-4.5 h-4.5 stroke-[1.5]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className={`relative p-1 transition-colors duration-300 ${
                isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
              }`}
              aria-label="Saved items"
            >
              <Heart className="w-4.5 h-4.5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-velora-champagne text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account / Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  className={`flex items-center space-x-1 p-1 transition-colors duration-300 ${
                    isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
                  }`}
                  aria-label="User profile"
                >
                  <UserIcon className="w-4.5 h-4.5 stroke-[1.5]" />
                  <ChevronDown className="w-3 h-3" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`p-1 transition-colors duration-300 ${
                    isLightHero ? 'text-white/90 hover:text-white' : 'text-velora-dark hover:text-velora-black'
                  }`}
                  aria-label="Sign in"
                >
                  <UserIcon className="w-4.5 h-4.5 stroke-[1.5]" />
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
                    className="absolute right-0 mt-3 w-60 bg-[#0A0A0A] text-[#F7F5F0] border border-velora-borderDark shadow-2xl py-3 z-50 text-xs font-light"
                  >
                    <div className="px-4 py-2 border-b border-velora-borderDark/60">
                      <p className="text-[10px] text-velora-muted uppercase tracking-widest">Signed In As</p>
                      <p className="font-medium text-white truncate">{user?.name}</p>
                      <p className="text-velora-muted text-[11px] truncate">{user?.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 text-velora-champagne transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span className="tracking-wider uppercase font-semibold text-[11px]">ALTER Admin Atelier</span>
                      </Link>
                    )}

                    <Link
                      to="/account/orders"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <Package className="w-4 h-4 text-velora-muted" />
                      <span>My Orders</span>
                    </Link>

                    <Link
                      to="/account/profile"
                      className="flex items-center space-x-2.5 px-4 py-2.5 hover:bg-white/5 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-velora-muted" />
                      <span>Account Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 hover:bg-red-500/10 text-red-400 border-t border-velora-borderDark/60 mt-1 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Bag */}
            <button
              onClick={openCart}
              className={`relative p-1 flex items-center transition-colors duration-300 ${
                isLightHero ? 'text-white hover:text-white' : 'text-velora-black hover:opacity-80'
              }`}
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4.5 h-4.5 stroke-[1.5]" />
              {totalItemCount > 0 && (
                <motion.span
                  key={totalItemCount}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-velora-black text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center border border-white/40"
                >
                  {totalItemCount}
                </motion.span>
              )}
            </button>
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-sm h-full bg-[#0A0A0A] text-[#F7F5F0] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center space-x-2.5">
                    <img src="/logo.png" alt="ALTER Crest" className="w-7 h-7 object-contain rounded-full border border-white/30" />
                    <div className="flex flex-col">
                      <span className="font-editorial text-xl tracking-[0.2em] text-white">ALTER</span>
                      <span className="text-[7px] tracking-[0.35em] uppercase text-velora-champagne font-medium -mt-1">THE KING</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col space-y-4">
                  {navCategories.map((cat) => (
                    <div key={cat.name} className="border-b border-white/5 pb-3">
                      <Link
                        to={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-base font-editorial tracking-wider text-white hover:text-velora-champagne transition-colors block"
                      >
                        {cat.name}
                      </Link>
                      <div className="grid grid-cols-2 gap-2 mt-2 pl-2">
                        {cat.subcategories.slice(1, 5).map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-[11px] text-white/50 hover:text-white transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex flex-col space-y-3 text-xs font-light text-white/70">
                    <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)} className="tracking-widest uppercase">
                      Track Order
                    </Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="tracking-widest uppercase">
                      Brand Philosophy
                    </Link>
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="tracking-widest uppercase">
                      Concierge Support
                    </Link>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs font-light text-white/50">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <span>Signed in as {user?.name}</span>
                    <button onClick={logout} className="text-red-400">Logout</button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-velora-champagne uppercase tracking-widest font-medium">Sign In</Link>
                    <span>/</span>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-white uppercase tracking-widest font-medium">Create Account</Link>
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
