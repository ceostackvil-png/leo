import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shield,
  RefreshCw,
  Truck,
  Compass,
  Briefcase,
  Flame,
  Tag,
  Star,
  CheckCircle2,
  PackageCheck,
  Percent,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { InstagramIcon } from '../components/Icons';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';
import { HeroSlider } from '../components/HeroSlider';
import { SpecialOffersSection } from '../components/SpecialOffersSection';
import { ComingSoonSection } from '../components/ComingSoonSection';
import { FestivalFlyerSection } from '../components/FestivalFlyerSection';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection';
import { NeedHelpSection } from '../components/NeedHelpSection';

import {
  queryProducts,
  categories as initialCategories,
  banners as initialBanners,
} from '../data/localDataStore';

export const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState(() => queryProducts({ isFeatured: true, limit: 8 }).data);
  const [bestSellers, setBestSellers] = useState(() => queryProducts({ isBestSeller: true }).data);
  const [categories, setCategories] = useState(() => initialCategories);
  const [banners, setBanners] = useState(() => initialBanners);
  const [cmsSettings, setCmsSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bestSellerTab, setBestSellerTab] = useState('all'); // 'all', 't-shirts', 'denim', 'linen'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes, catRes, banRes, settingsRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=8'),
          api.get('/products?isBestSeller=true'),
          api.get('/categories'),
          api.get('/banners'),
          api.get('/cms/settings').catch(() => ({ data: { success: false } })),
        ]);

        if (featuredRes.data.success) setFeaturedProducts(featuredRes.data.data);
        if (bestRes.data.success) setBestSellers(bestRes.data.data);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (banRes.data.success) setBanners(banRes.data.data);
        if (settingsRes?.data?.success) setCmsSettings(settingsRes.data.data);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products for Best Sellers according to user specifications:
  // 4 T-Shirts (Round Neck, Full Sleeve, Turtle Neck, Polo)
  // 2 Denim Jackets (Blue, Olive Green)
  // Linen shirts (Formal, Casual)
  const filteredBestSellers = bestSellers.filter((item) => {
    if (bestSellerTab === 't-shirts') return item.categoryName === 'T-Shirts' || item.category === 'cat_t-shirts';
    if (bestSellerTab === 'denim') return item.categoryName === 'Denim' || item.category === 'cat_denim';
    if (bestSellerTab === 'linen') return item.categoryName === 'Linen' || item.category === 'cat_linen';
    return (
      item.categoryName === 'T-Shirts' ||
      item.categoryName === 'Denim' ||
      item.categoryName === 'Linen' ||
      item.isBestSeller
    );
  });

  const denimProducts = queryProducts({ categorySlug: 'denim' }).data;
  const leatherProducts = queryProducts({ categorySlug: 'leather-accessories' }).data;
  const travellingProducts = queryProducts({ categorySlug: 'travelling-collection' }).data;

  // Nobero-style circular category bubbles with colorful gradient rings
  const circularCategories = [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      badge: 'From ₹1,999',
      ringColor: 'from-orange-500 via-rose-500 to-pink-500',
    },
    {
      name: 'Denim Jackets',
      slug: 'denim',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
      badge: 'Blue & Olive',
      ringColor: 'from-blue-600 via-indigo-600 to-cyan-500',
    },
    {
      name: 'Winter Hoodies',
      slug: 'winter-edition',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
      badge: '450 GSM',
      ringColor: 'from-amber-500 via-yellow-500 to-orange-500',
    },
    {
      name: 'Pure Linen',
      slug: 'linen',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      badge: 'Formal & Casual',
      ringColor: 'from-emerald-500 via-teal-500 to-green-600',
    },
    {
      name: 'Travelling',
      slug: 'travelling-collection',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      badge: 'Airport Transit',
      ringColor: 'from-purple-600 via-violet-600 to-indigo-600',
    },
    {
      name: 'Leathercraft',
      slug: 'leather-accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
      badge: 'Belts & Boots',
      ringColor: 'from-amber-700 via-amber-800 to-stone-900',
    },
    {
      name: 'Stitching',
      slug: 'outerwear',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=400&q=80',
      badge: 'Hand-Tailored',
      ringColor: 'from-rose-600 via-red-600 to-amber-600',
    },
  ];

  // Customer Reviews (Nobero style)
  const customerReviews = [
    {
      id: 1,
      name: 'Vikramaditya S.',
      city: 'Mumbai',
      rating: 5,
      review: 'The Supima Heavyweight Round Neck Tee is easily on par with international luxury brands. The collar does not sag even after 10 washes.',
      productTitle: 'ALTER Supima Round Neck Tee',
      verified: true
    },
    {
      id: 2,
      name: 'Arjun Mehra',
      city: 'Bengaluru',
      rating: 5,
      review: 'The Classic Indigo Denim Jacket is stiff, structured, and fades into pure gold. 14.5oz selvedge at this price is unmatched.',
      productTitle: 'Classic Indigo Denim Jacket',
      verified: true
    },
    {
      id: 3,
      name: 'Karan Singhal',
      city: 'New Delhi',
      rating: 5,
      review: 'Ordered both the Formal Linen and Band-Collar shirt for my Europe trip. Extremely breathable and feels tailored to perfection.',
      productTitle: 'Italian Tailored Linen Shirt',
      verified: true
    }
  ];

  const instagramShots = [
    { image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=85', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=85', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=85', handle: '@alter.theking' },
  ];

  return (
    <div className="bg-white text-slate-900 overflow-hidden font-sans">
      {/* ==================================================== */}
      {/* SECTION 1 — HERO SLIDER                              */}
      {/* ==================================================== */}
      <HeroSlider banners={banners} />

      {/* ==================================================== */}
      {/* NOBERO-STYLE CATEGORY STORIES CAROUSEL               */}
      {/* ==================================================== */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600">
                EXPLORE BY CATEGORY
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Curated Collections
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex items-center justify-start md:justify-center space-x-5 sm:space-x-8 overflow-x-auto pb-4 pt-1 scrollbar-none">
            {circularCategories.map((item) => (
              <Link
                key={item.slug}
                to={`/shop?category=${item.slug}`}
                className="group flex flex-col items-center shrink-0 text-center w-20 sm:w-24 focus:outline-none"
              >
                {/* Vibrant Gradient Ring Bubble */}
                <div className={`p-1 rounded-full bg-gradient-to-tr ${item.ringColor} shadow-md group-hover:scale-105 group-hover:shadow-lg transition-all duration-300`}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white p-0.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="mt-2 text-xs font-bold text-slate-900 group-hover:text-amber-700 tracking-tight line-clamp-1">
                  {item.name}
                </span>
                <span className="text-[10px] text-gray-500 font-semibold line-clamp-1">
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* VIBRANT VALUE PILLARS (NOBERO STYLE)                 */}
      {/* ==================================================== */}
      <section className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center space-x-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
            <div className="p-2.5 bg-blue-600 text-white rounded-lg shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">Free Shipping</p>
              <p className="text-[11px] text-gray-500">On all orders above ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <div className="p-2.5 bg-emerald-600 text-white rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">100% Pure Fabrics</p>
              <p className="text-[11px] text-gray-500">Supima, French Flax & Selvedge</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <div className="p-2.5 bg-amber-600 text-white rounded-lg shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">7 Days Easy Return</p>
              <p className="text-[11px] text-gray-500">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl">
            <div className="p-2.5 bg-purple-600 text-white rounded-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">King Authentic</p>
              <p className="text-[11px] text-gray-500">Direct from Alter Atelier</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 — BEST SELLERS (T-Shirts, Denim, Linen)     */}
      {/* ==================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-600" />
              <span>POPULAR DEMAND</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Best Sellers of the King
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top rated 4 T-Shirts, 2 Japanese Denim Jackets, and Pure Linen shirts.
            </p>
          </div>

          {/* Interactive Filter Tabs (Nobero style) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Best Sellers' },
              { id: 't-shirts', label: 'T-Shirts (4 Types)' },
              { id: 'denim', label: 'Denim Jackets (Blue & Olive)' },
              { id: 'linen', label: 'Linen Shirts (Formal & Casual)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBestSellerTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 shadow-sm ${
                  bestSellerTab === tab.id
                    ? 'bg-slate-950 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* VIBRANT BUNDLE PROMO BANNER (NOBERO STYLE)            */}
      {/* ==================================================== */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 text-white rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
              🎁 KING COMBO SPECIAL
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              BUY ANY 2 APPAREL & SAVE EXTRA 10%
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl font-medium">
              Mix and match between Heavyweight Supima Tees, Selvedge Denim, and Pure Linen Shirts. Automatic discount at checkout!
            </p>
          </div>
          <div className="z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/shop?isBestSeller=true"
              className="px-8 py-3.5 bg-white text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-amber-100 transition-all shadow-lg hover:scale-105"
            >
              SHOP COMBO DEAL
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 3 — DENIM EDITION SHOWCASE (BRIGHT)          */}
      {/* ==================================================== */}
      <section className="py-16 bg-gradient-to-b from-blue-50/60 to-white border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700">
                THE DENIM EDITION
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
                14.5oz Japanese Selvedge Jackets
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Featuring our iconic <strong>Classic Indigo Blue</strong> and <strong>Vintage Washed Olive Green</strong> denim jackets.
              </p>
            </div>
            <Link
              to="/shop?category=denim"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-md flex items-center space-x-1.5 self-start md:self-auto"
            >
              <span>Explore Denim</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {denimProducts.slice(0, 2).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4 — LEATHER COLLECTION (Belts, Wallets, Shoes)*/}
      {/* ==================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>FLORENTINE LEATHER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              The Leather Collection
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Full-grain French calfskin belts, RFID wallets, Goodyear Chelsea boots, and duffel bags.
            </p>
          </div>
          <Link
            to="/shop?category=leather-accessories"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
          >
            <span>View All Leather</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {leatherProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 5 — TRAVELLING COLLECTION (AIRPORT TRANSIT)  */}
      {/* ==================================================== */}
      <section className="py-16 bg-gradient-to-b from-emerald-50/50 to-white border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>FIRST CLASS TRANSIT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                The Travelling Collection
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                450gsm dense airport transit hoodies with passport pockets and stretch commuter joggers.
              </p>
            </div>
            <Link
              to="/shop?category=travelling-collection"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>Explore Travelling Gear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {travellingProducts.slice(0, 3).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 6 — SPECIAL OFFERS & COUPONS                 */}
      {/* ==================================================== */}
      <SpecialOffersSection />

      {/* ==================================================== */}
      {/* SECTION 7 — COMING SOON DROPS                       */}
      {/* ==================================================== */}
      <ComingSoonSection />

      {/* ==================================================== */}
      {/* SECTION 8 — VERIFIED CUSTOMER REVIEWS (NOBERO STYLE) */}
      {/* ==================================================== */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              ⭐ 4.9/5 RATED BY 25,000+ CUSTOMERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              What Gentlemen Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                    "{rev.review}"
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{rev.name}</p>
                    <p className="text-[10px] text-gray-400">{rev.city}</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 9 — INSTAGRAM LOOKBOOK GALLERY               */}
      {/* ==================================================== */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
          <span className="text-xs font-black uppercase tracking-wider text-rose-600">#ALTERTheKing</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Community & Lookbook</h2>
          <p className="text-xs text-gray-500 font-medium">
            Tag @alter.theking on Instagram to be featured on our official wall.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {instagramShots.map((item, idx) => (
            <div key={idx} className="group relative aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm">
              <img
                src={item.image}
                alt="Instagram lookbook snapshot"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white space-y-1">
                <InstagramIcon className="w-6 h-6 text-amber-400" />
                <span className="text-[11px] font-bold">{item.handle}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Need Help Concierge */}
      <NeedHelpSection />
    </div>
  );
};


