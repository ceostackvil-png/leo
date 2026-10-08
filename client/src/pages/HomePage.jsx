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

  // Filter products for Best Sellers
  const filteredBestSellers = bestSellers.filter((item) => {
    if (bestSellerTab === 'co-ords') return item.categorySlug === 'co-ords';
    if (bestSellerTab === 't-shirts') return item.categorySlug === 't-shirts';
    if (bestSellerTab === 'joggers') return item.categorySlug === 'joggers';
    if (bestSellerTab === 'hoodies') return item.categorySlug === 'hoodies-sweatshirts';
    if (bestSellerTab === 'shackets') return item.categorySlug === 'shackets';
    return item.isBestSeller || item.isFeatured;
  });

  const coordProducts = queryProducts({ categorySlug: 'co-ords', limit: 4 }).data;
  const joggerProducts = queryProducts({ categorySlug: 'joggers', limit: 4 }).data;
  const hoodieProducts = queryProducts({ categorySlug: 'hoodies-sweatshirts', limit: 4 }).data;
  const shacketProducts = queryProducts({ categorySlug: 'shackets', limit: 4 }).data;

  // Exact Nobero-style circular category bubbles with authentic CDN images
  const circularCategories = [
    {
      name: 'Co-Ord Sets',
      slug: 'co-ords',
      image: 'https://nobero.com/cdn/shop/files/Co-ord-2.jpg',
      badge: 'From ₹1,499',
      ringColor: 'from-orange-500 via-rose-500 to-pink-500',
    },
    {
      name: 'Travel Essentials',
      slug: 'travel-wear',
      image: 'https://nobero.com/cdn/shop/files/Travel_essential.jpg',
      badge: 'Transit Mode',
      ringColor: 'from-blue-600 via-indigo-600 to-cyan-500',
    },
    {
      name: 'Classic Polos',
      slug: 'polos',
      image: 'https://nobero.com/cdn/shop/files/Polo.jpg',
      badge: 'From ₹699',
      ringColor: 'from-amber-500 via-yellow-500 to-orange-500',
    },
    {
      name: 'Shirts & Linen',
      slug: 't-shirts',
      image: 'https://nobero.com/cdn/shop/files/Linen_Shirts-4.jpg',
      badge: 'Pure Fabrics',
      ringColor: 'from-emerald-500 via-teal-500 to-green-600',
    },
    {
      name: 'Oversized Tees',
      slug: 't-shirts',
      image: 'https://nobero.com/cdn/shop/files/6_3947fc67-5783-4d32-9311-506c676a9ce8.jpg',
      badge: '280 GSM Cotton',
      ringColor: 'from-purple-600 via-violet-600 to-indigo-600',
    },
    {
      name: 'Fashion Joggers',
      slug: 'joggers',
      image: 'https://nobero.com/cdn/shop/files/Joggersssss.jpg',
      badge: 'Deep Pockets',
      ringColor: 'from-amber-700 via-amber-800 to-stone-900',
    },
    {
      name: 'Textured Shackets',
      slug: 'shackets',
      image: 'https://nobero.com/cdn/shop/collections/25p.jpg',
      badge: 'Layering Fit',
      ringColor: 'from-rose-600 via-red-600 to-amber-600',
    },
    {
      name: 'Hoodies & Fleece',
      slug: 'hoodies-sweatshirts',
      image: 'https://nobero.com/cdn/shop/collections/15_4d7859d8-907b-4127-8951-98cc7de6385f.jpg',
      badge: '450 GSM Warmth',
      ringColor: 'from-cyan-600 via-blue-600 to-indigo-700',
    },
  ];

  // Exact Nobero Customer Reviews
  const customerReviews = [
    {
      id: 1,
      name: 'Aditya Verma',
      city: 'Mumbai',
      rating: 5,
      review: 'The Martin Colorblocked Co-ord set is incredible. The fabric weight and stitching quality at this price point completely beats fast-fashion brands.',
      productTitle: 'Oversized Martin Colorblocked Co-ord Set',
      verified: true
    },
    {
      id: 2,
      name: 'Rohit Kulkarni',
      city: 'Bengaluru',
      rating: 5,
      review: 'The 4-way stretch cargo joggers are perfect for flights and everyday transit. Deep zip pockets securely fit my phone, passport, and wallet.',
      productTitle: 'Everyday Transit Fashion Cargo Joggers',
      verified: true
    },
    {
      id: 3,
      name: 'Shreyas Nair',
      city: 'Hyderabad',
      rating: 5,
      review: 'Super comfortable 280 GSM heavyweight oversized tee. Clean drop-shoulder cut and does not lose shape after multiple laundry cycles.',
      productTitle: 'Heavyweight Graphic Oversized T-Shirt',
      verified: true
    }
  ];

  // Exact Nobero Category Showcase Cards
  const noberoCategoryCards = [
    {
      title: 'CO-ORD SETS',
      tagline: 'Matching airport & casual sets',
      image: 'https://nobero.com/cdn/shop/files/HB_Co-Ords_des.jpg',
      link: '/shop?category=co-ords'
    },
    {
      title: 'FASHION JOGGERS',
      tagline: 'Deep zip pockets & all-day stretch',
      image: 'https://nobero.com/cdn/shop/files/HB_Fashion_Joggers_des.jpg',
      link: '/shop?category=joggers'
    },
    {
      title: 'HOODIES & JACKETS',
      tagline: '450 GSM plush loopback fleece',
      image: 'https://nobero.com/cdn/shop/files/HB_Hoodies_Jackets_des.jpg',
      link: '/shop?category=hoodies-sweatshirts'
    },
    {
      title: 'TEXTURED SHACKETS',
      tagline: 'Effortless multi-season layering',
      image: 'https://nobero.com/cdn/shop/files/HB_Shacket_des_jpg.jpg',
      link: '/shop?category=shackets'
    }
  ];

  const instagramShots = [
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-151.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-7_1.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/HB_Co-Ords_mob.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/HB_Fashion_Joggers_mob.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/HB_Hoodies_Jackets_mob.jpg', handle: '@nobero.official' },
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
              <p className="text-[11px] text-gray-500">On all prepaid orders</p>
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
              <p className="text-[11px] text-gray-500">Doorstep pickup & direct refund</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl">
            <div className="p-2.5 bg-purple-600 text-white rounded-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide">LEO Authentic</p>
              <p className="text-[11px] text-gray-500">Direct from Official Atelier</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 — BEST SELLERS (CO-ORDS, TEES, JOGGERS)    */}
      {/* ==================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-600" />
              <span>POPULAR ON NOBERO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Best Sellers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top trending Co-ord sets, heavyweight 280 GSM oversized tees, and transit cargo joggers.
            </p>
          </div>

          {/* Interactive Filter Tabs (Nobero style) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '🔥 All Best Sellers' },
              { id: 'co-ords', label: 'Co-Ord Sets' },
              { id: 't-shirts', label: 'Oversized Tees' },
              { id: 'joggers', label: 'Fashion Joggers' },
              { id: 'hoodies', label: 'Hoodies' },
              { id: 'shackets', label: 'Shackets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBestSellerTab(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-full transition-all shrink-0 shadow-sm cursor-pointer ${
                  bestSellerTab === tab.id
                    ? 'bg-[#242F66] text-white shadow-md scale-105'
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
      {/* NOBERO FEATURE: SHOP BY CATEGORY (4 LARGE CARDS)     */}
      {/* ==================================================== */}
      <section className="py-12 bg-slate-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600">
              FEATURED CATEGORIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Explore Our Core Editions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {noberoCategoryCards.map((card, idx) => (
              <Link
                key={idx}
                to={card.link}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md bg-slate-200 flex flex-col justify-end p-4 border border-gray-200"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="relative z-10 text-white">
                  <h3 className="font-extrabold text-sm sm:text-base tracking-wide uppercase group-hover:text-amber-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-[10px] text-gray-300 font-medium line-clamp-1 mt-0.5">
                    {card.tagline}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* VIBRANT BUNDLE PROMO BANNER (NOBERO STYLE)            */}
      {/* ==================================================== */}
      <section className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="relative bg-gradient-to-r from-[#242F66] via-[#2D45A5] to-[#1E293B] text-white rounded-2xl p-6 sm:p-10 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-400/20">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              🎁 NOBERO MEGA SAVER DEAL
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              BUY ANY 2 APPAREL & SAVE EXTRA 10%
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-medium">
              Mix and match between Heavyweight Oversized Tees, Airport Co-ord Sets, and Transit Cargo Joggers. Auto-applied at checkout!
            </p>
          </div>
          <div className="z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/shop?isBestSeller=true"
              className="px-8 py-3.5 bg-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl hover:bg-amber-300 transition-all shadow-lg hover:scale-105 cursor-pointer"
            >
              SHOP COMBO DEAL
            </Link>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 3 — CO-ORD SETS SHOWCASE                     */}
      {/* ==================================================== */}
      <section className="py-14 bg-gradient-to-b from-orange-50/40 to-white border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600">
                AIRPORT TRANSIT LOOKS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-0.5">
                The Co-Ord Sets Collection
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Elevated matching sets engineered for airport lounges, casual hangouts, and downtime.
              </p>
            </div>
            <Link
              to="/shop?category=co-ords"
              className="px-5 py-2.5 bg-[#242F66] hover:bg-[#1E293B] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center space-x-1.5 self-start md:self-auto"
            >
              <span>View All Co-Ords</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {coordProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4 — FASHION JOGGERS SHOWCASE                 */}
      {/* ==================================================== */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>4-WAY STRETCH MOBILITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Fashion Cargo & Transit Joggers
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Deep zip pockets, tapered ankle cuffs, and pre-shrunk breathable cotton.
            </p>
          </div>
          <Link
            to="/shop?category=joggers"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
          >
            <span>View All Joggers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {joggerProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 5 — HOODIES & SHACKETS SHOWCASE              */}
      {/* ==================================================== */}
      <section className="py-14 bg-gradient-to-b from-blue-50/50 to-white border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider mb-1.5">
                <Flame className="w-3.5 h-3.5 fill-indigo-600" />
                <span>450 GSM FRENCH TERRY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Hoodies & Textured Shackets
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {hoodieProducts.concat(shacketProducts).slice(0, 4).map((product) => (
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
          <span className="text-xs font-black uppercase tracking-wider text-rose-600">#LEOMenswear</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Community & Lookbook</h2>
          <p className="text-xs text-gray-500 font-medium">
            Tag @leo.official on Instagram to be featured on our official wall.
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


