import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, ChevronDown, Check, Grid3X3, Grid2X2, LayoutGrid } from 'lucide-react';
import api from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

import {
  queryProducts,
  categories as initialCategories,
  collections as initialCollections,
} from '../data/localDataStore';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQueryResult = queryProducts({ limit: 12 });
  const [products, setProducts] = useState(() => initialQueryResult.data);
  const [categories, setCategories] = useState(() => initialCategories);
  const [collections, setCollections] = useState(() => initialCollections);
  const [pagination, setPagination] = useState(() => initialQueryResult.pagination);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 2, 3, or 4

  // Filter states derived from URL query parameters
  const selectedCategory = searchParams.get('category') || '';
  const selectedCollection = searchParams.get('collection') || '';
  const selectedGender = searchParams.get('gender') || '';
  const selectedSize = searchParams.get('size') || '';
  const selectedColor = searchParams.get('color') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const isFeatured = searchParams.get('isFeatured') || '';
  const isBestSeller = searchParams.get('isBestSeller') || '';
  const inStock = searchParams.get('inStock') || '';
  const keyword = searchParams.get('keyword') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = searchParams.get('page') || '1';

  // Fetch taxonomies once
  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          api.get('/categories'),
          api.get('/collections'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.data);
        if (colRes.data.success) setCollections(colRes.data.data);
      } catch (err) {
        console.error('Failed to load taxonomies:', err);
      }
    };
    fetchTaxonomies();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('limit', '12');
        const res = await api.get(`/products?${queryParams.toString()}`);
        if (res.data.success) {
          setProducts(res.data.data);
          setPagination(res.data.pagination);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams();
    if (keyword) newParams.set('keyword', keyword);
    setSearchParams(newParams);
  };

  const sizesList = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36'];
  const colorsList = ['Noir Black', 'Bone White', 'Camel Tan', 'Charcoal', 'Champagne', 'Indigo'];

  const activeFiltersCount = [
    selectedCategory, selectedCollection, selectedGender, selectedSize,
    selectedColor, minPrice, maxPrice, isNewArrival, isFeatured, isBestSeller, inStock
  ].filter(Boolean).length;

  const quickFilterTabs = [
    { label: '🔥 All Products', cat: '', coll: '' },
    { label: '✨ Co-Ord Sets', cat: 'co-ords', coll: '' },
    { label: '👖 Fashion Joggers', cat: 'joggers', coll: '' },
    { label: '👕 Oversized T-Shirts', cat: 't-shirts', coll: '' },
    { label: '🧥 Hoodies & Jackets', cat: 'winter-edition', coll: '' },
    { label: '👔 Textured Shackets', cat: 'denim', coll: '' },
    { label: '🌿 Pure Linen', cat: 'linen', coll: '' },
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center py-6 sm:py-8 border-b border-[#E8E9EA] space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF2FF] border border-[#242F66]/20 text-[#242F66] text-xs font-[familyBold] uppercase tracking-wider">
            <span>NOBERO OFFICIAL COLLECTION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-[familyBold] text-[#181B2D] tracking-tight">
            {keyword
              ? `Results for "${keyword}"`
              : selectedCategory
              ? categories.find(c => c.slug === selectedCategory)?.name || 'Collection'
              : selectedCollection
              ? collections.find(c => c.slug === selectedCollection)?.name || 'Curated Lookbook'
              : selectedGender
              ? `${selectedGender}'s Apparel`
              : 'All Apparel & Everyday Fashion'}
          </h1>
          <p className="text-xs sm:text-sm text-[#666875] max-w-lg mx-auto font-[familyMedium]">
            Premium coordinated sets, everyday fashion joggers, heavy oversized tees, and cozy winterwear.
          </p>
        </div>

        {/* Quick Horizontal Filter Pills (Nobero style) */}
        <div className="py-4 flex items-center gap-2.5 overflow-x-auto no-scrollbar border-b border-[#E8E9EA]">
          {quickFilterTabs.map((tab, idx) => {
            const isActive = (!tab.cat && !selectedCategory) || (selectedCategory === tab.cat);
            return (
              <button
                key={idx}
                onClick={() => {
                  updateFilter('category', tab.cat);
                  if (tab.coll) updateFilter('collection', tab.coll);
                }}
                className={`px-4 py-2 rounded-full text-xs font-[familyBold] whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                  isActive
                    ? 'bg-[#242F66] text-white font-[familyBold] shadow-sm scale-105'
                    : 'bg-[#F5F6F8] text-[#484B5A] hover:bg-[#E8E9EA] border border-[#E8E9EA]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Bar (Filters trigger, sorting, layout switcher) */}
        <div className="py-4 sm:py-5 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 text-xs">
          <div className="flex items-center space-x-4">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2.5 rounded-lg border border-stone-300 bg-stone-900 text-white hover:bg-black transition-colors font-semibold"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
            </button>

            <span className="hidden lg:inline text-stone-500 font-medium">
              Showing <strong className="text-stone-900 font-bold">{pagination.totalItems}</strong> Products
            </span>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-stone-500 uppercase tracking-wider text-[11px] font-semibold hidden sm:inline">Sort:</span>
              <select
                value={sort}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400 font-semibold cursor-pointer shadow-sm"
              >
                <option value="newest">Newest Drops</option>
                <option value="bestselling">🔥 Best Sellers</option>
                <option value="featured">✨ Featured Picks</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden md:flex items-center space-x-1 border border-stone-200 rounded-lg p-1 bg-stone-50 shadow-inner">
              <button
                onClick={() => setGridCols(2)}
                className={`p-1.5 rounded transition-all ${gridCols === 2 ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-black'}`}
                aria-label="2 columns grid"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded transition-all ${gridCols === 3 ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-black'}`}
                aria-label="3 columns grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridCols(4)}
                className={`p-1.5 rounded transition-all ${gridCols === 4 ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-black'}`}
                aria-label="4 columns grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Badges */}
        {activeFiltersCount > 0 && (
          <div className="py-3 flex flex-wrap items-center gap-2 border-b border-stone-200 text-xs">
            <span className="text-stone-500 font-semibold text-[11px] mr-1">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-semibold">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => updateFilter('category', '')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {selectedGender && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 font-semibold">
                <span>Gender: {selectedGender}</span>
                <button onClick={() => updateFilter('gender', '')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {selectedCollection && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 font-semibold">
                <span>Collection: {selectedCollection}</span>
                <button onClick={() => updateFilter('collection', '')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-semibold">
                <span>Size: {selectedSize}</span>
                <button onClick={() => updateFilter('size', '')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {selectedColor && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-stone-100 border border-stone-300 text-stone-800 font-semibold">
                <span>Color: {selectedColor}</span>
                <button onClick={() => updateFilter('color', '')}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-300 text-rose-900 font-semibold">
                <span>₹{minPrice || 0} - ₹{maxPrice || 'Any'}</span>
                <button onClick={() => { updateFilter('minPrice', ''); updateFilter('maxPrice', ''); }}><X className="w-3.5 h-3.5" /></button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-rose-600 hover:text-rose-800 underline text-xs font-bold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 text-xs pr-4 border-r border-stone-200">
            {/* Gender Facet */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Department</h3>
              <div className="space-y-1.5">
                {['Men', 'Unisex'].map((g) => (
                  <button
                    key={g}
                    onClick={() => updateFilter('gender', selectedGender === g ? '' : g)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      selectedGender === g ? 'bg-amber-400 text-stone-950 font-bold shadow-sm' : 'text-stone-700 hover:bg-stone-200/70 font-medium'
                    }`}
                  >
                    <span>{g === 'Men' ? "Men's Wear" : 'Unisex Comfort'}</span>
                    {selectedGender === g && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Facet */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Categories</h3>
              <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    onClick={() => updateFilter('category', selectedCategory === c.slug ? '' : c.slug)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      selectedCategory === c.slug ? 'bg-stone-900 text-white font-bold' : 'text-stone-700 hover:bg-stone-200/70 font-medium'
                    }`}
                  >
                    <span>{c.name}</span>
                    {selectedCategory === c.slug && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Facet */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Lookbooks & Editions</h3>
              <div className="space-y-1">
                {collections.map((col) => (
                  <button
                    key={col.slug}
                    onClick={() => updateFilter('collection', selectedCollection === col.slug ? '' : col.slug)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                      selectedCollection === col.slug ? 'bg-stone-900 text-white font-bold' : 'text-stone-700 hover:bg-stone-200/70 font-medium'
                    }`}
                  >
                    <span className="line-clamp-1">{col.name}</span>
                    {selectedCollection === col.slug && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Facet */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Select Size</h3>
              <div className="grid grid-cols-4 gap-1.5">
                {sizesList.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                    className={`py-2 rounded-lg text-center font-bold text-xs uppercase transition-all ${
                      selectedSize === s
                        ? 'bg-amber-400 text-stone-950 shadow-md ring-2 ring-stone-900 scale-105'
                        : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Presets */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
              <h3 className="font-bold text-stone-900 uppercase tracking-wider text-xs">Price Range</h3>
              <div className="space-y-1">
                {[
                  { label: 'Under ₹1,499', min: '', max: '1499' },
                  { label: '₹1,500 — ₹2,499', min: '1500', max: '2499' },
                  { label: '₹2,500 — ₹3,999', min: '2500', max: '3999' },
                  { label: 'Above ₹4,000', min: '4000', max: '' },
                ].map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      updateFilter('minPrice', tier.min);
                      updateFilter('maxPrice', tier.max);
                    }}
                    className="block w-full text-left px-3 py-1.5 rounded-lg text-xs text-stone-700 hover:bg-stone-200 font-medium transition-colors"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock === 'true'}
                  onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : '')}
                  className="rounded text-amber-500 focus:ring-amber-400 w-4 h-4"
                />
                <span className="text-xs text-stone-900 font-bold">In Stock & Ready to Ship</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 sm:gap-6`}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length > 0 ? (
              <div className={`grid grid-cols-2 md:grid-cols-3 ${
                gridCols === 4 ? 'lg:grid-cols-4' : gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
              } gap-4 sm:gap-6`}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-stone-50 rounded-2xl border border-stone-200 p-8 space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-2xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-stone-900">No products match your current filters</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing some filters or searching for different keywords to view more apparel.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-stone-900 text-white text-xs uppercase tracking-wider font-bold rounded-xl hover:bg-black transition-colors shadow-md"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-stone-200 flex items-center justify-center space-x-2 text-xs">
                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  const isCurrent = Number(page) === pNum;
                  return (
                    <button
                      key={pNum}
                      onClick={() => updateFilter('page', pNum.toString())}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold transition-all ${
                        isCurrent
                          ? 'border-stone-900 bg-stone-900 text-white shadow-md'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-900'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setIsFilterDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-xs h-full bg-white shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h2 className="text-lg font-bold text-stone-900">Filter Products</h2>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="p-1 rounded-full hover:bg-stone-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Options */}
              <div className="py-4 space-y-5 text-xs">
                {/* Department */}
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">Department</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Men', 'Unisex'].map((g) => (
                      <button
                        key={g}
                        onClick={() => updateFilter('gender', selectedGender === g ? '' : g)}
                        className={`px-3.5 py-2 rounded-lg font-bold border ${selectedGender === g ? 'bg-amber-400 border-stone-900 text-stone-950' : 'bg-stone-50 border-stone-200'}`}
                      >
                        {g === 'Men' ? "Men's Wear" : 'Unisex'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">Categories</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => updateFilter('category', selectedCategory === c.slug ? '' : c.slug)}
                        className={`block w-full text-left px-3 py-2 rounded-lg font-medium ${selectedCategory === c.slug ? 'bg-stone-900 text-white font-bold' : 'hover:bg-stone-100'}`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider mb-2">Sizes</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {sizesList.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                        className={`py-2 rounded-lg font-bold border text-center ${selectedSize === s ? 'bg-amber-400 border-stone-900 text-stone-950' : 'bg-stone-50 border-stone-200'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsFilterDrawerOpen(false)}
              className="w-full py-3.5 bg-stone-900 text-white rounded-xl uppercase tracking-wider text-xs font-bold shadow-lg"
            >
              Apply Filters ({pagination.totalItems} Products)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
