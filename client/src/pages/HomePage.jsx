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
  Layers,
  Crown
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
  const carouselRef = useRef(null);

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

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filter products for Best Sellers according to user specifications:
  // 4 T-Shirts (Round Neck, Full Sleeve, Turtle Neck, Polo)
  // 2 Denim Jackets (Blue, Olive Green)
  // Linen shirts (Formal, Casual)
  const filteredBestSellers = bestSellers.filter((item) => {
    if (bestSellerTab === 't-shirts') return item.categoryName === 'T-Shirts' || item.category === 'cat_t-shirts';
    if (bestSellerTab === 'denim') return item.categoryName === 'Denim' || item.category === 'cat_denim';
    if (bestSellerTab === 'linen') return item.categoryName === 'Linen' || item.category === 'cat_linen';
    // 'all' shows the curated 8 core icons
    return (
      item.categoryName === 'T-Shirts' ||
      item.categoryName === 'Denim' ||
      item.categoryName === 'Linen' ||
      item.isBestSeller
    );
  });

  // Dedicated section queries from localDataStore
  const denimProducts = queryProducts({ categorySlug: 'denim' }).data;
  const leatherProducts = queryProducts({ categorySlug: 'leather-accessories' }).data;
  const travellingProducts = queryProducts({ categorySlug: 'travelling-collection' }).data;

  // Nobero-style visual categories quick bar
  const quickCategories = [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
      badge: 'Supima & Polo'
    },
    {
      name: 'Denim',
      slug: 'denim',
      image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=400&q=80',
      badge: 'Blue & Olive'
    },
    {
      name: 'Winter Edition',
      slug: 'winter-edition',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80',
      badge: '450gsm Fleece'
    },
    {
      name: 'Linen',
      slug: 'linen',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      badge: 'Pure Flax'
    },
    {
      name: 'Leather',
      slug: 'leather-accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
      badge: 'Belts & Shoes'
    },
    {
      name: 'Travelling',
      slug: 'travelling-collection',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
      badge: 'Airport Transit'
    },
    {
      name: 'Stitching',
      slug: 'outerwear',
      image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=400&q=80',
      badge: 'Hand-Tailored'
    }
  ];

  const sections = cmsSettings?.homepageSections || {
    heroSlider: true,
    bestSellers: true,
    categories: true,
    signatureCollection: true,
    specialOffers: true,
    comingSoon: true,
    festivalFlyers: true,
    recentlyViewed: true,
    needHelp: true,
    instagramFeed: true,
  };

  const instagramShots = [
    { image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=95', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1600&q=95', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=95', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=95', handle: '@alter.theking' },
    { image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1600&q=95', handle: '@alter.theking' },
  ];

  return (
    <div className="bg-[#FAF9F5] text-[#141414] overflow-hidden font-sans">
      {/* ==================================================== */}
      {/* SECTION 1 — HERO SLIDER                              */}
      {/* ==================================================== */}
      {sections.heroSlider !== false && (
        <HeroSlider banners={banners} />
      )}

      {/* ==================================================== */}
      {/* NOBERO-STYLE CATEGORY QUICK-BAR                      */}
      {/* ==================================================== */}
      <section className="bg-white border-b border-velora-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-velora-champagne font-bold">
              EXPLORE THE KING ATELIER
            </span>
            <h3 className="font-editorial text-xl sm:text-2xl text-velora-black mt-0.5">
              Categories at a Glance
            </h3>
          </div>

          <div className="flex items-center justify-start md:justify-center space-x-4 sm:space-x-6 overflow-x-auto pb-3 scrollbar-none">
            {quickCategories.map((item) => (
              <Link
                key={item.slug}
                to={`/shop?category=${item.slug}`}
                className="group flex flex-col items-center shrink-0 text-center w-20 sm:w-24 focus:outline-none"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 border-2 border-stone-200 group-hover:border-velora-champagne transition-all duration-300 shadow-sm overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
                <span className="mt-2 text-xs font-semibold text-stone-800 group-hover:text-black tracking-tight line-clamp-1">
                  {item.name}
                </span>
                <span className="text-[9px] text-stone-500 font-light tracking-wide line-clamp-1">
                  {item.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Pillars Bar */}
      <section className="bg-[#FAF9F5] border-b border-velora-border py-5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-velora-dark font-light">
          <div className="flex flex-col items-center space-y-0.5">
            <Truck className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Complimentary Delivery</span>
            <span className="text-velora-muted text-[10px]">On all orders above ₹2,999</span>
          </div>
          <div className="flex flex-col items-center space-y-0.5">
            <Sparkles className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Japanese Denim & Italian Flax</span>
            <span className="text-velora-muted text-[10px]">14.5oz Selvedge & Normandy Flax</span>
          </div>
          <div className="flex flex-col items-center space-y-0.5">
            <RefreshCw className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">7-Day Hassle Free Returns</span>
            <span className="text-velora-muted text-[10px]">Doorstep pickup & direct refund</span>
          </div>
          <div className="flex flex-col items-center space-y-0.5">
            <Shield className="w-4 h-4 text-velora-champagne mb-1" />
            <span className="font-medium tracking-wider uppercase text-[11px]">Sovereign King Guarantee</span>
            <span className="text-velora-muted text-[10px]">Individually numbered atelier garments</span>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 2 — BEST SELLERS (T-Shirts, Denim, Linen)     */}
      {/* ==================================================== */}
      {sections.bestSellers !== false && (
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">
                Icons of the House
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
                Best Sellers
              </h2>
            </div>

            {/* Filter Tabs (Nobero style) */}
            <div className="flex items-center space-x-2 mt-4 md:mt-0 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Icons (8)' },
                { id: 't-shirts', label: 'T-Shirts (4 Types)' },
                { id: 'denim', label: 'Denim Jackets (Blue & Olive)' },
                { id: 'linen', label: 'Linen Shirts (Formal & Casual)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBestSellerTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs tracking-wider uppercase transition-all rounded-full border shrink-0 ${
                    bestSellerTab === tab.id
                      ? 'bg-[#0A0A0A] text-white border-black font-semibold shadow-sm'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Best Sellers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredBestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 3 — DENIM EDITION SHOWCASE                   */}
      {/* ==================================================== */}
      <section className="py-20 bg-[#0E1520] text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Story & Jackets Focus */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-900/60 border border-blue-500/30 text-blue-300 text-[10px] tracking-[0.25em] uppercase font-semibold">
                <span>The Denim Edition</span>
              </div>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-white">
                14.5oz Japanese Selvedge Jackets
              </h2>
              <p className="text-sm font-light text-stone-300 leading-relaxed">
                Shuttle-loomed in Kojima, Japan from heavyweight ring-spun cotton. Available in our iconic <strong>Classic Indigo Blue</strong> and <strong>Vintage Washed Olive Green</strong>.
              </p>
              <ul className="text-xs space-y-2 text-stone-300 font-light">
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  <span>Red-line selvedge placket tape & antique brass hardware</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span>Custom garment-wash treatment for immediate broken-in comfort</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  to="/shop?category=denim"
                  className="inline-flex items-center space-x-3 px-7 py-3.5 bg-white text-black text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-200 transition-colors shadow-lg"
                >
                  <span>Explore Denim Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Product Spotlight Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {denimProducts.slice(0, 2).map((item) => (
                <div key={item._id} className="bg-[#151D2A] p-4 border border-white/10 rounded-sm shadow-xl flex flex-col justify-between group">
                  <div className="aspect-[3/4] overflow-hidden bg-stone-900 mb-4 relative">
                    <img
                      src={item.images?.[0]?.url || item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-black/80 text-velora-champagne px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold">
                      {item.colors?.[0]?.name || 'Selvedge Denim'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-editorial text-lg text-white font-normal line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1 font-light">
                      {item.shortDescription}
                    </p>
                    <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-sm font-semibold text-white">
                        ₹{item.price?.toLocaleString('en-IN')}
                      </span>
                      <Link
                        to={`/product/${item.slug || item._id}`}
                        className="text-[11px] uppercase tracking-wider text-velora-champagne hover:text-white font-medium flex items-center space-x-1"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4 — LEATHER COLLECTION (Belts, Wallets, Shoes)*/}
      {/* ==================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium flex items-center space-x-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Florentine Leathercraft</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
              The Leather Collection
            </h2>
            <p className="text-xs text-stone-600 font-light mt-1">
              Full-grain French calfskin belts, RFID wallets, Goodyear-welted Chelsea boots, and weekender duffels.
            </p>
          </div>
          <Link
            to="/shop?category=leather-accessories"
            className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-velora-dark hover:text-velora-black flex items-center space-x-1.5 luxury-underline font-medium"
          >
            <span>View All Leather</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {leatherProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 5 — TRAVELLING COLLECTION                    */}
      {/* ==================================================== */}
      <section className="py-20 bg-[#F3EFEA] border-y border-velora-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium flex items-center space-x-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>First-Class Transit Capsule</span>
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-normal text-velora-black mt-1">
                The Travelling Collection
              </h2>
              <p className="text-xs text-stone-600 font-light mt-1">
                Engineered for long-haul flight comfort with concealed passport pockets, 450gsm fleece, and stretch joggers.
              </p>
            </div>
            <Link
              to="/shop?category=travelling-collection"
              className="mt-4 md:mt-0 text-xs uppercase tracking-[0.2em] text-velora-dark hover:text-velora-black flex items-center space-x-1.5 luxury-underline font-medium"
            >
              <span>Explore Travelling</span>
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
      {/* SECTION 6 — SIGNATURE / SOVEREIGN STITCHING EDITORIAL */}
      {/* ==================================================== */}
      {sections.signatureCollection !== false && (
        <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Editorial Photo */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/5] bg-stone-200 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=2400&q=95"
                  alt="ALTER Autumn Winter 2026 Menswear Lookbook"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="hidden sm:block absolute -bottom-8 -right-8 w-48 h-64 bg-stone-300 overflow-hidden shadow-xl border-4 border-[#FAF9F5]">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=95"
                  alt="Sovereign Stitching Detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Story & CTA */}
            <div className="lg:col-span-5 space-y-6 lg:pl-6">
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">
                Sovereign Stitching
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-velora-black">
                ALTER — The King Haute Couture
              </h2>
              <p className="text-sm font-light text-stone-600 leading-relaxed">
                The Sovereign collection explores brutalist restraint through heavy wools, razor-sharp shoulder lines, and monolithic monochrome layering designed for modern metropolitan life.
              </p>
              <p className="text-sm font-light text-stone-600 leading-relaxed">
                Each piece is individually tailored with hand-pick stitching, unbleached cupro linings, and natural horn fastenings.
              </p>
              <div className="pt-4">
                <Link
                  to="/shop?collection=sovereign-stitching"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-velora-black text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-black/85 transition-colors shadow-lg"
                >
                  <span>Explore Sovereign Stitching</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* SECTION 7 — SPECIAL COUPONS & OFFERS                */}
      {/* ==================================================== */}
      {sections.specialOffers !== false && (
        <SpecialOffersSection />
      )}

      {/* ==================================================== */}
      {/* SECTION 8 — COMING SOON / FUTURE LAUNCHES           */}
      {/* ==================================================== */}
      {sections.comingSoon !== false && (
        <ComingSoonSection />
      )}

      {/* ==================================================== */}
      {/* SECTION 9 — FESTIVAL / PROMOTIONAL FLYERS           */}
      {/* ==================================================== */}
      {sections.festivalFlyers !== false && (
        <FestivalFlyerSection />
      )}

      {/* ==================================================== */}
      {/* SECTION 10 — RECENTLY VIEWED PRODUCTS               */}
      {/* ==================================================== */}
      {sections.recentlyViewed !== false && (
        <RecentlyViewedSection />
      )}

      {/* ==================================================== */}
      {/* SECTION 11 — BRAND MANIFESTO                        */}
      {/* ==================================================== */}
      <section className="py-24 bg-[#0A0A0A] text-[#F7F5F0] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">The King's Manifesto</span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal leading-tight text-white">
              “WE BELIEVE CLOTHING SHOULD SAY SOMETHING BEFORE YOU DO.”
            </h2>
            <p className="text-sm font-light text-white/60 leading-relaxed">
              ALTER — The King was founded on the conviction that true sovereign luxury does not shout with gaudy logos. It manifests in the weight of double-faced Italian cashmere, the whisper of pure Normandy linen across the collarbone, and the impeccable drape of selvedge denim.
            </p>
            <p className="text-sm font-light text-white/60 leading-relaxed">
              Every garment is created in limited atelier runs to eliminate excess and guarantee sovereign craftsmanship.
            </p>
            <div className="pt-4">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-velora-champagne hover:text-white transition-colors luxury-underline font-medium"
              >
                <span>Read Our Heritage Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 aspect-[4/5] bg-stone-900 overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=2400&q=95"
              alt="Artisanal tailoring"
              className="w-full h-full object-cover brightness-90 hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 12 — NEED HELP / CONCIERGE & SUPPORT        */}
      {/* ==================================================== */}
      {sections.needHelp !== false && (
        <NeedHelpSection />
      )}

      {/* ==================================================== */}
      {/* SECTION 13 — INSTAGRAM LOOKBOOK GALLERY             */}
      {/* ==================================================== */}
      {sections.instagramFeed !== false && (
        <section className="py-20 max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">#ALTERTheKing</span>
            <h2 className="font-editorial text-3xl font-normal text-velora-black">As Seen Around the Globe</h2>
            <p className="text-xs text-velora-muted font-light">
              Tag @alter.theking on Instagram to be featured in our permanent digital editorial.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {instagramShots.map((item, idx) => (
              <div key={idx} className="group relative aspect-square bg-stone-200 overflow-hidden">
                <img
                  src={item.image}
                  alt="Instagram lookbook snapshot"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white space-y-2">
                  <InstagramIcon className="w-6 h-6 text-velora-champagne" />
                  <span className="text-[11px] tracking-widest font-light">{item.handle}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};


