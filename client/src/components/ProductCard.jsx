import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { QuickAddModal } from './QuickAddModal';

export const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || '');
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();

  const isSaved = isInWishlist(product._id);
  const primaryImage = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85';
  const secondaryImage = product.images?.[1]?.url || primaryImage;

  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : product.discountPercentage || 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes?.[1] || product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0]?.name || 'Standard';
    addToCart(product, defaultSize, defaultColor, 1);
    success(`Added ${product.title} (${defaultSize}) to cart!`);
  };

  return (
    <>
      <div
        className="group relative flex flex-col bg-white border border-gray-100 hover:border-gray-300 rounded-2xl p-2 sm:p-2.5 shadow-sm hover:shadow-xl transition-all duration-300 font-sans"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Box */}
        <div className="relative aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={product.title}
              className={`w-full h-full object-cover object-center transition-all duration-500 ${
                isHovered && secondaryImage !== primaryImage ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
              loading="lazy"
            />
            {/* Secondary Image on Hover */}
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.title} alternate view`}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
                  isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                }`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Top Left Badges (Nobero style) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1 z-10 pointer-events-none">
            {product.isBestSeller ? (
              <span className="bg-rose-500 text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wide">
                🔥 BESTSELLER
              </span>
            ) : product.isNewArrival ? (
              <span className="bg-blue-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm tracking-wide">
                ✨ NEW
              </span>
            ) : null}

            {discountPercent > 0 && (
              <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md shadow-sm">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Rating Chip on Bottom Left of Image */}
          {product.rating > 0 && (
            <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm border border-gray-100 z-10">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-extrabold text-slate-800">{product.rating.toFixed(1)}</span>
              <span className="text-[9px] text-gray-400 font-medium">| {product.numReviews || 28}</span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md hover:scale-110 transition-all duration-200 z-10"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-700'
              }`}
            />
          </button>

          {/* Quick Add To Bag Hover Button */}
          <div
            className={`absolute bottom-2.5 right-2.5 z-10 transition-all duration-200 transform ${
              isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={handleQuickAdd}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-all"
              title="Quick Add to Bag"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="pt-3 px-1 flex flex-col space-y-1.5">
          {/* Category & SubCategory */}
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            <span>{product.categoryName || 'Apparel'}</span>
            {product.subCategory && (
              <span className="text-gray-400 font-medium lowercase text-[10px]">
                {product.subCategory}
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            to={`/product/${product.slug}`}
            className="font-bold text-sm sm:text-base text-slate-900 hover:text-amber-700 transition-colors line-clamp-1 leading-snug"
          >
            {product.title}
          </Link>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center space-x-1.5 py-0.5">
              {product.colors.slice(0, 4).map((c, idx) => (
                <button
                  key={idx}
                  title={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-3.5 h-3.5 rounded-full border transition-all ${
                    selectedColor === c.name ? 'ring-2 ring-slate-900 ring-offset-1 scale-110' : 'border-gray-300'
                  }`}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-gray-500 font-semibold">+{product.colors.length - 4} colors</span>
              )}
            </div>
          )}

          {/* Pricing (Nobero style with bold price, strikethrough MRP and discount tag) */}
          <div className="flex items-baseline space-x-2 pt-1">
            <span className="text-base sm:text-lg font-extrabold text-slate-950">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-black text-emerald-600">
                ({discountPercent}% OFF)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </>
  );
};
