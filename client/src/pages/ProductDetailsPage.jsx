import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Ruler,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Check
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/ProductCard';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { ReviewModal } from '../components/ReviewModal';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';

import { getProductBySlug, queryProducts } from '../data/localDataStore';

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();

  const initialProd = getProductBySlug(slug);
  const [product, setProduct] = useState(() => initialProd);
  const [relatedProducts, setRelatedProducts] = useState(() =>
    queryProducts({ category: initialProd?.category, limit: 4 }).data
  );
  const [reviews, setReviews] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(() => initialProd?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(() => initialProd?.colors?.[0]?.name || 'Noir');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(!initialProd);

  // Accordion Toggles
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    material: true,
    shipping: false,
  });

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.data;
          setProduct(prod);
          setSelectedSize(prod.sizes?.[0] || 'M');
          setSelectedColor(prod.colors?.[0]?.name || 'Noir');
          setSelectedImageIdx(0);

          // Record Recently Viewed
          try {
            const viewed = JSON.parse(localStorage.getItem('velora_recently_viewed') || '[]');
            const filtered = viewed.filter(p => p._id !== prod._id);
            localStorage.setItem('velora_recently_viewed', JSON.stringify([prod, ...filtered].slice(0, 6)));
          } catch (e) {}

          // Fetch related products & reviews
          const [relRes, revRes] = await Promise.all([
            api.get(`/products/${prod._id}/related`),
            api.get(`/reviews/product/${prod._id}`),
          ]);
          if (relRes.data.success) setRelatedProducts(relRes.data.data);
          if (revRes.data.success) setReviews(revRes.data.data);
        }
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h2 className="font-editorial text-3xl font-normal">Garment Not Found</h2>
        <p className="text-xs text-velora-muted mt-2">The requested piece may have been archived or removed.</p>
        <Link to="/shop" className="mt-6 px-6 py-3 bg-velora-black text-white text-xs uppercase tracking-widest">
          Explore Archive
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85' }];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  const toggleAccordion = (key) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="py-3 text-xs text-stone-500 flex items-center space-x-2 font-medium">
          <Link to="/" className="hover:text-stone-900">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-stone-900">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-stone-900">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-stone-900 truncate max-w-xs font-semibold">{product.title}</span>
        </div>

        {/* Main Product Layout: Gallery + Purchasing Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 pt-4">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 shrink-0 overflow-x-auto sm:overflow-visible">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 sm:w-20 aspect-[3/4] rounded-xl bg-stone-100 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Active Image Viewport with Zoom */}
            <div
              className="flex-1 aspect-[3/4] rounded-2xl bg-stone-100 overflow-hidden shadow-md relative group cursor-crosshair border border-stone-200/80"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.querySelector('img').style.transformOrigin = `${x}% ${y}%`;
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.75)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1)';
              }}
            >
              <img
                src={images[selectedImageIdx]?.url}
                alt={product.title}
                className="w-full h-full object-cover object-center transition-transform duration-200 ease-out"
              />
              {product.status === 'Coming Soon' && (
                <span className="absolute top-4 left-4 bg-amber-500 text-stone-950 text-xs uppercase tracking-wider px-3.5 py-1.5 font-bold rounded-full shadow-lg">
                  Coming Soon {product.launchDate ? `• Drops ${new Date(product.launchDate).toLocaleDateString()}` : ''}
                </span>
              )}
              {product.discountPercentage > 0 && product.status !== 'Coming Soon' && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  SAVE {product.discountPercentage}% OFF
                </span>
              )}
              {product.status === 'Out of Stock' && (
                <span className="absolute top-4 right-4 bg-stone-900 text-white text-xs uppercase tracking-wider px-3 py-1 font-bold rounded-full">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* RIGHT: Purchasing Form & Attributes */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                <span className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  {product.brandName || 'LEO ORIGINAL'}
                </span>
                <span className="text-stone-400 font-medium">SKU: {product.sku}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">
                {product.title}
              </h1>

              {/* Rating & Review Jump */}
              <div className="flex items-center space-x-3 mt-2.5 text-xs">
                <div className="inline-flex items-center space-x-1 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-md text-amber-900 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-stone-400 font-normal">|</span>
                  <span className="text-stone-600 font-medium">{reviews.length > 0 ? reviews.length : '38'} verified reviews</span>
                </div>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline space-x-3 mt-4">
                <span className="text-3xl font-extrabold text-stone-900">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-base text-stone-400 line-through font-medium">
                    ₹{product.compareAtPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    You save ₹{((product.compareAtPrice || 0) - (product.price || 0)).toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Inclusive of all taxes & doorstep delivery</p>
            </div>

            {/* Special Coupon Box Offer */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl text-xs space-y-1.5 shadow-sm">
              <div className="flex items-center space-x-2 text-stone-900 font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Special Privilege Offers</span>
              </div>
              <p className="text-xs text-stone-700">
                Use code <strong className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">LEO10</strong> for 10% instant discount on orders above ₹2,499.
              </p>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs uppercase font-bold text-stone-700 block mb-2">
                  Select Color: <span className="text-stone-900 font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-amber-400 bg-stone-900 text-white font-bold shadow-sm'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-inner" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector + Size Guide */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-bold text-stone-700">
                    Select Size: <span className="text-stone-900 font-extrabold">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-xs text-amber-600 hover:text-amber-700 font-bold underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide & Fits</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 rounded-xl text-xs uppercase font-bold border text-center transition-all ${
                        selectedSize === s
                          ? 'border-stone-900 bg-amber-400 text-stone-950 shadow-md ring-2 ring-stone-900'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Counter & Stock Status */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-3">
                <label className="text-xs uppercase font-bold text-stone-700">Qty:</label>
                <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 overflow-hidden shadow-inner">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-3 w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 hover:bg-stone-200 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs">
                {product.status === 'Coming Soon' ? (
                  <span className="text-amber-800 font-bold bg-amber-100 px-3 py-1 rounded-full">
                    Coming Soon
                  </span>
                ) : !product.inStock || product.stock === 0 ? (
                  <span className="text-rose-700 font-bold bg-rose-100 px-3 py-1 rounded-full">
                    Sold Out
                  </span>
                ) : product.stock <= (product.lowStockThreshold || 5) ? (
                  <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    🔥 Only {product.stock} pieces left
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    ✓ In Stock & Ready to Dispatch
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || product.status === 'Coming Soon' || product.status === 'Out of Stock'}
                  className="flex-1 bg-stone-900 text-white py-4 rounded-xl text-xs uppercase tracking-wider font-extrabold hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>⚡ ADD TO BAG — ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-4 border border-stone-300 rounded-xl bg-white hover:bg-stone-50 transition-colors shadow-sm"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'}`} />
                </button>
              </div>

              {product.inStock && product.status !== 'Coming Soon' && (
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-amber-400 text-stone-950 py-3.5 rounded-xl text-xs uppercase tracking-wider font-extrabold hover:bg-amber-300 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>🚀 BUY IT NOW • Instant Checkout</span>
                </button>
              )}
            </div>

            {/* Value Highlights */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs text-stone-700 font-medium">
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Free Express Doorstep Shipping on all prepaid orders</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>7-Day Hassle-Free Return & Size Exchange Policy</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Delivered in signature LEO luxury presentation packaging</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-stone-200 pt-4 space-y-3 text-xs">
              {/* Description Accordion */}
              <div className="border-b border-stone-200 pb-3">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-stone-900 uppercase tracking-wider"
                >
                  <span>Product Details & Silhouette</span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.description && (
                  <div className="pt-2 text-stone-600 space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 pt-1 font-medium text-stone-700">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div className="border-b border-stone-200 pb-3">
                <button
                  onClick={() => toggleAccordion('material')}
                  className="w-full flex items-center justify-between py-2 text-left font-bold text-stone-900 uppercase tracking-wider"
                >
                  <span>Material & Care Instructions</span>
                  {openAccordions.material ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.material && (
                  <div className="pt-2 text-stone-600 font-light space-y-2 leading-relaxed">
                    <p><strong className="text-velora-black font-medium">Composition:</strong> {product.material}</p>
                    <p><strong className="text-velora-black font-medium">Care:</strong> {product.careInstructions}</p>
                  </div>
                )}
              </div>

              {/* Shipping & 7-Day Returns */}
              <div className="border-b border-velora-border pb-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between py-2 text-left uppercase tracking-widest font-semibold text-velora-black"
                >
                  <span>7-Day Free Returns & Delivery</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <div className="pt-2 text-stone-600 font-light space-y-2 leading-relaxed">
                    <p>All garments are prepared and dispatched within 24 business hours from our central atelier.</p>
                    <p>Standard delivery arrives in 2–4 business days with end-to-end SMS & WhatsApp tracking.</p>
                    <p className="pt-1 text-emerald-800 font-medium">
                      ✓ 7-Day Doorstep Pickup: If you need a size exchange or return, request it directly from your Account Orders within 7 days of delivery.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-28 pt-16 border-t border-velora-border">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Client Impressions</span>
              <h2 className="font-editorial text-3xl font-normal text-velora-black mt-1">
                Verified Reviews ({reviews.length})
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 md:mt-0 px-6 py-3 border border-velora-black bg-white hover:bg-velora-black hover:text-white transition-colors text-xs uppercase tracking-widest font-medium"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Rating Summary Box */}
            <div className="md:col-span-4 p-6 bg-[#F0EDE6] border border-velora-border space-y-4">
              <div className="flex items-center space-x-3">
                <span className="font-editorial text-5xl font-normal text-velora-black">{product.rating || 5.0}</span>
                <div>
                  <div className="flex text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-velora-muted font-light mt-0.5 block">
                    Based on {reviews.length} authentic purchases
                  </span>
                </div>
              </div>
              <div className="border-t border-stone-300 pt-3 text-xs space-y-2 text-stone-600 font-light">
                <p>98% of clients recommend this piece for fit and tactile craftsmanship.</p>
              </div>
            </div>

            {/* Reviews Stream */}
            <div className="md:col-span-8 space-y-6">
              {reviews.length === 0 ? (
                <div className="py-8 text-center text-velora-muted text-xs font-light bg-white border border-velora-border p-6">
                  Be the first to share an evaluation of this garment.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-6 bg-white border border-velora-border space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-velora-black">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium">
                            <Check className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-stone-400 text-[11px]">
                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                        />
                      ))}
                    </div>

                    <h4 className="font-editorial text-lg text-velora-black font-normal">{rev.title}</h4>
                    <p className="text-xs font-light text-stone-600 leading-relaxed">{rev.comment}</p>
                    <div className="text-[11px] text-velora-muted font-light pt-1">
                      <span>Fit: <strong className="text-stone-800 font-medium">{rev.fitFeedback}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-28 pt-16 border-t border-velora-border">
            <div className="text-center max-w-xl mx-auto mb-12 space-y-1">
              <span className="text-xs uppercase tracking-[0.3em] text-velora-champagne font-medium">Curated Pairings</span>
              <h2 className="font-editorial text-3xl font-normal text-velora-black">You May Also Admire</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      <ReviewModal
        product={product}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={(newRev) => setReviews(prev => [newRev, ...prev])}
      />
    </div>
  );
};
