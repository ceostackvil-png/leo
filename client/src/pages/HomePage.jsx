import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  Truck,
  Sparkles,
  RefreshCw,
  Shield,
  ShoppingBag
} from 'lucide-react';
import { InstagramIcon } from '../components/Icons';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { HeroSlider } from '../components/HeroSlider';
import { NeedHelpSection } from '../components/NeedHelpSection';

import {
  queryProducts,
  categories as initialCategories,
  banners as initialBanners,
} from '../data/localDataStore';

export const HomePage = () => {
  const [bestSellers, setBestSellers] = useState(() => queryProducts({ isBestSeller: true }).data);
  const [banners, setBanners] = useState(() => initialBanners);
  const [bestSellerTab, setBestSellerTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bestRes, banRes] = await Promise.all([
          api.get('/products?isBestSeller=true'),
          api.get('/banners'),
        ]);

        if (bestRes.data.success) setBestSellers(bestRes.data.data);
        if (banRes.data.success) setBanners(banRes.data.data);
      } catch (err) {
        console.error('Home data load error:', err);
      }
    };

    fetchData();
  }, []);

  // Filter products for Best Sellers
  const filteredBestSellers = bestSellers.filter((item) => {
    if (bestSellerTab === 'co-ords') return item.categorySlug === 'co-ords' || item.category === 'co-ords';
    if (bestSellerTab === 't-shirts') return item.categorySlug === 't-shirts' || item.category === 't-shirts';
    if (bestSellerTab === 'joggers') return item.categorySlug === 'joggers' || item.category === 'joggers';
    if (bestSellerTab === 'hoodies') return item.categorySlug === 'winter-edition' || item.category === 'winter-edition';
    if (bestSellerTab === 'denim') return item.categorySlug === 'denim' || item.category === 'denim';
    return true;
  });

  const noberoFavourites = queryProducts({ limit: 8 }).data;

  // Exact Nobero Story Circles
  const noberoStories = [
    {
      name: 'Premium HD T-Shirt',
      slug: 't-shirts',
      image: 'https://nobero.com/cdn/shop/collections/port_1.jpg?v=1745516013',
    },
    {
      name: 'T-Shirt',
      slug: 't-shirts',
      image: 'https://nobero.com/cdn/shop/collections/Website_Shop_men_220_x_304_11.png?v=1775748481',
    },
    {
      name: 'Hoodies & Jackets',
      slug: 'winter-edition',
      image: 'https://nobero.com/cdn/shop/collections/Website_Shop_men_220_x_304_9.png?v=1771849527',
    },
    {
      name: 'Full Sleeve T Shirt',
      slug: 't-shirts',
      image: 'https://nobero.com/cdn/shop/collections/Full_sleeve_polo.jpg?v=1783596387',
    },
    {
      name: 'Jackets',
      slug: 'denim',
      image: 'https://nobero.com/cdn/shop/collections/25p.jpg?v=1787216475',
    },
    {
      name: 'Joggers',
      slug: 'joggers',
      image: 'https://nobero.com/cdn/shop/collections/6_29719fa5-f748-482e-8039-fda30c64d1db.jpg?v=1757760284',
    },
    {
      name: 'Pants',
      slug: 'joggers',
      image: 'https://nobero.com/cdn/shop/collections/Cargo_Pants_Icon_Home_Page_copy.jpg?v=1790616572',
    },
    {
      name: 'Co-Ord Sets',
      slug: 'co-ords',
      image: 'https://nobero.com/cdn/shop/collections/9.jpg?v=1757759355',
    },
  ];

  // Exact Nobero Match The Mood Tiles
  const matchTheMoodCards = [
    {
      title: 'HOODIES & JACKETS',
      image: 'https://nobero.com/cdn/shop/files/1_9602c197-e8ad-4b1b-be05-93ea3d7f14be.jpg?v=1790759136',
      link: '/shop?category=winter-edition',
    },
    {
      title: 'SWEATSHIRTS',
      image: 'https://nobero.com/cdn/shop/files/2_fc9b593f-811f-46f6-aafa-d698ebaec746.jpg?v=1790759136',
      link: '/shop?category=winter-edition',
    },
    {
      title: 'T-SHIRTS',
      image: 'https://nobero.com/cdn/shop/files/3_f50776a1-69f4-4772-9ca6-be73d07449ba.jpg?v=1790759136',
      link: '/shop?category=t-shirts',
    },
    {
      title: 'FASHION JOGGERS',
      image: 'https://nobero.com/cdn/shop/files/4_b42a622d-6555-416c-9463-b257d777090e.jpg?v=1790759135',
      link: '/shop?category=joggers',
    },
  ];

  // Exact Nobero Shop by Collection Cards
  const shopByCollectionCards = [
    { title: 'Travel Essentials', image: 'https://nobero.com/cdn/shop/files/Travel_essential.jpg?v=1757745353', link: '/shop?category=joggers' },
    { title: 'Classic Polo', image: 'https://nobero.com/cdn/shop/files/Polo.jpg?v=1757745353', link: '/shop?category=t-shirts' },
    { title: 'Linen Shirts', image: 'https://nobero.com/cdn/shop/files/Linen_Shirts-4.jpg?v=1778157293', link: '/shop?category=linen' },
    { title: 'Co-ord Sets', image: 'https://nobero.com/cdn/shop/files/Co-ord-2.jpg?v=1786527383', link: '/shop?category=co-ords' },
    { title: 'Premium HD Tees', image: 'https://nobero.com/cdn/shop/files/Premium_tee-2_jpg.jpg?v=1772443532', link: '/shop?category=t-shirts' },
    { title: 'T-Shirts', image: 'https://nobero.com/cdn/shop/files/6_3947fc67-5783-4d32-9311-506c676a9ce8.jpg?v=1757745344', link: '/shop?category=t-shirts' },
    { title: 'Fashion Joggers', image: 'https://nobero.com/cdn/shop/files/Joggersssss.jpg?v=1762501540', link: '/shop?category=joggers' },
    { title: 'Cargo Pants', image: 'https://nobero.com/cdn/shop/files/Cargo_Pants_f4f28077-9d53-45e8-92d8-ceebffdbb6f6.jpg?v=1762501471', link: '/shop?category=joggers' },
  ];

  // Exact Nobero Customer Reviews
  const customerReviews = [
    {
      id: 1,
      name: 'Aditya Verma',
      city: 'Mumbai',
      rating: 5,
      review: 'The Martin Colorblocked Co-ord set is incredible. The fabric weight and stitching quality at this price point completely beats fast-fashion brands.',
      verified: true
    },
    {
      id: 2,
      name: 'Rohit Kulkarni',
      city: 'Bengaluru',
      rating: 5,
      review: 'The 4-way stretch cargo joggers are perfect for flights and everyday transit. Deep zip pockets securely fit my phone, passport, and wallet.',
      verified: true
    },
    {
      id: 3,
      name: 'Shreyas Nair',
      city: 'Hyderabad',
      rating: 5,
      review: 'Super comfortable 280 GSM heavyweight oversized tee. Clean drop-shoulder cut and does not lose shape after multiple laundry cycles.',
      verified: true
    }
  ];

  const instagramShots = [
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-151.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-7_1.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-109.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-19.jpg', handle: '@nobero.official' },
    { image: 'https://nobero.com/cdn/shop/files/Instagrampost-91.jpg', handle: '@nobero.official' },
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#181B2D] overflow-hidden font-sans">
      {/* ==================================================== */}
      {/* 1. NOBERO STORY CIRCLES BAR                          */}
      {/* ==================================================== */}
      <section className="bg-white border-b border-[#E8E9EA] pt-28 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-start md:justify-center space-x-4 sm:space-x-7 overflow-x-auto pb-2 scrollbar-none">
            {noberoStories.map((item, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${item.slug}`}
                className="group flex flex-col items-center shrink-0 text-center w-[72px] sm:w-[84px] focus:outline-none"
              >
                {/* Clean Story Bubble */}
                <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#242F66] to-[#F59E0B] shadow-xs group-hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden bg-white p-0.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="mt-2 text-[11px] font-[familySemiBold] text-[#181B2D] group-hover:text-[#242F66] tracking-tight line-clamp-1">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. HERO SLIDER                                       */}
      {/* ==================================================== */}
      <HeroSlider banners={banners} />

      {/* ==================================================== */}
      {/* 3. VALUE PILLARS (NOBERO STYLE)                      */}
      {/* ==================================================== */}
      <section className="bg-[#F5F6F8] py-5 border-y border-[#E8E9EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="flex items-center space-x-3 p-3 bg-white border border-[#E8E9EA] rounded-xl shadow-xs">
            <div className="p-2 bg-[#EEF2FF] text-[#242F66] rounded-lg shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-[familyBold] text-[#181B2D] uppercase">Free Shipping</p>
              <p className="text-[11px] text-[#666875] font-[familyMedium]">On all prepaid orders</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white border border-[#E8E9EA] rounded-xl shadow-xs">
            <div className="p-2 bg-[#E6FFEE] text-[#008C2D] rounded-lg shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-[familyBold] text-[#181B2D] uppercase">100% Cotton</p>
              <p className="text-[11px] text-[#666875] font-[familyMedium]">Pre-shrunk bio-washed</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white border border-[#E8E9EA] rounded-xl shadow-xs">
            <div className="p-2 bg-[#FAF6E8] text-[#715D0B] rounded-lg shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-[familyBold] text-[#181B2D] uppercase">7 Days Easy Return</p>
              <p className="text-[11px] text-[#666875] font-[familyMedium]">Hassle-free doorstep pickup</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white border border-[#E8E9EA] rounded-xl shadow-xs">
            <div className="p-2 bg-[#EEF2FF] text-[#242F66] rounded-lg shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-[familyBold] text-[#181B2D] uppercase">Secure Payments</p>
              <p className="text-[11px] text-[#666875] font-[familyMedium]">UPI, Cards & Cash on Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. MATCH THE MOOD (4 TILES)                          */}
      {/* ==================================================== */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-[familyBold] text-[#181B2D] tracking-tight">
            Match The Mood
          </h2>
          <Link to="/shop" className="text-xs font-[familyBold] text-[#242F66] hover:underline flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {matchTheMoodCards.map((card, idx) => (
            <Link
              key={idx}
              to={card.link}
              className="group relative rounded-xl overflow-hidden shadow-xs border border-[#E8E9EA] bg-stone-100 aspect-[3/4] flex flex-col justify-end"
            >
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. SHOP BY COLLECTION (CIRCLES / TILES)              */}
      {/* ==================================================== */}
      <section className="py-10 bg-[#F5F6F8] border-y border-[#E8E9EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-[familyBold] text-[#181B2D] tracking-tight">
              Shop by Collection
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
            {shopByCollectionCards.map((item, idx) => (
              <Link
                key={idx}
                to={item.link}
                className="group flex flex-col items-center text-center p-2 rounded-xl bg-white border border-[#E8E9EA] hover:border-[#242F66] transition-all shadow-2xs"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-stone-50 mb-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-[familyBold] text-[#181B2D] group-hover:text-[#242F66] line-clamp-1">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. OUR BESTSELLERS (TABBED PRODUCT SECTION)          */}
      {/* ==================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-[#FFF3EE] text-[#FF4D00] text-[10px] font-[familyBold] uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 fill-[#FF4D00]" />
              <span>POPULAR ON NOBERO</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D] tracking-tight">
              Our Bestsellers
            </h2>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: '🔥 All' },
              { id: 'co-ords', label: 'Co-Ord Sets' },
              { id: 't-shirts', label: 'Oversized Tees' },
              { id: 'joggers', label: 'Fashion Joggers' },
              { id: 'hoodies', label: 'Hoodies' },
              { id: 'denim', label: 'Shackets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setBestSellerTab(tab.id)}
                className={`px-4 py-2 text-xs font-[familyBold] rounded-full transition-all shrink-0 cursor-pointer ${
                  bestSellerTab === tab.id
                    ? 'bg-[#242F66] text-white shadow-sm scale-105'
                    : 'bg-[#F5F6F8] text-[#484B5A] hover:bg-[#E8E9EA] border border-[#E8E9EA]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredBestSellers.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. PRIMARY PROMO BANNER                              */}
      {/* ==================================================== */}
      <section className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop?category=t-shirts" className="block rounded-2xl overflow-hidden border border-[#E8E9EA] shadow-sm">
          <img
            src="https://nobero.com/cdn/shop/files/FULL-SLEEVE_T-SHIRT.jpg?v=1787831897"
            alt="Full Sleeve T-Shirts"
            className="hidden md:block w-full h-auto object-cover"
          />
          <img
            src="https://nobero.com/cdn/shop/files/full_sleeve_Mobile.jpg?v=1787831879"
            alt="Full Sleeve T-Shirts"
            className="block md:hidden w-full h-auto object-cover"
          />
        </Link>
      </section>

      {/* ==================================================== */}
      {/* 8. NOBERO FAVOURITE SECTION                          */}
      {/* ==================================================== */}
      <section className="py-12 bg-[#FAF6E8] border-y border-[#F0E4B6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-[familyBold] uppercase tracking-wider text-[#715D0B]">
                HANDPICKED BY NOBERO
              </span>
              <h2 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D] tracking-tight mt-0.5">
                Nobero Favourite
              </h2>
            </div>
            <Link to="/shop" className="text-xs font-[familyBold] text-[#242F66] hover:underline flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {noberoFavourites.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 9. EXPERIENCE NOBERO APP ON MOBILE                   */}
      {/* ==================================================== */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden border border-[#E8E9EA] shadow-sm">
          <img
            src="https://nobero.com/cdn/shop/files/our_app_is_here_-_Desktop_jpg.jpg?v=1768989566"
            alt="Experience Nobero App"
            className="hidden md:block w-full h-auto object-cover"
          />
          <img
            src="https://nobero.com/cdn/shop/files/our_app_is_here_Mobile_-7_jpg.jpg?v=1768989570"
            alt="Experience Nobero App"
            className="block md:hidden w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* ==================================================== */}
      {/* 10. VERIFIED CUSTOMER REVIEWS                        */}
      {/* ==================================================== */}
      <section className="py-14 bg-[#F5F6F8] border-t border-[#E8E9EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-[familyBold] uppercase tracking-wider text-[#242F66]">
              ⭐ 4.9/5 RATED BY 500,000+ CUSTOMERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D] tracking-tight mt-1">
              Customer Impressions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-2xl border border-[#E8E9EA] shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center space-x-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#484B5A] leading-relaxed font-[familyMedium]">
                    "{rev.review}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8E9EA] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-[familyBold] text-[#181B2D]">{rev.name}</p>
                    <p className="text-[10px] text-[#9698A0] font-[familyMedium]">{rev.city}</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 text-[10px] font-[familyBold] text-[#008C2D] bg-[#E6FFEE] px-2 py-0.5 rounded-full">
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
      {/* 11. INSTAGRAM LOOKBOOK GALLERY                       */}
      {/* ==================================================== */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="text-xs font-[familyBold] uppercase tracking-wider text-[#242F66]">#NoberoCommunity</span>
          <h2 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D] tracking-tight">Shop the Looks</h2>
          <p className="text-xs text-[#666875] font-[familyMedium]">
            Tag @nobero.official on Instagram to be featured on our official wall.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {instagramShots.map((item, idx) => (
            <div key={idx} className="group relative aspect-square bg-stone-100 rounded-xl overflow-hidden shadow-xs border border-[#E8E9EA]">
              <img
                src={item.image}
                alt="Instagram lookbook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white space-y-1">
                <InstagramIcon className="w-6 h-6 text-[#F59E0B]" />
                <span className="text-[11px] font-[familyBold]">{item.handle}</span>
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
