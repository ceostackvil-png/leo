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
  Check,
  Copy,
  MapPin
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
  const { success, info } = useToast();

  const initialProd = getProductBySlug(slug);
  const [product, setProduct] = useState(() => initialProd);
  const [relatedProducts, setRelatedProducts] = useState(() =>
    queryProducts({ category: initialProd?.category, limit: 4 }).data
  );
  const [reviews, setReviews] = useState([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(() => initialProd?.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(() => initialProd?.colors?.[0]?.name || 'Classic');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(!initialProd);

  // Pincode Delivery Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState('');

  // Accordion Toggles
  const [openAccordions, setOpenAccordions] = useState({
    description: true,
    material: true,
    shipping: false,
    offers: false,
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
          setSelectedColor(prod.colors?.[0]?.name || 'Classic');
          setSelectedImageIdx(0);

          // Record Recently Viewed
          try {
            const viewed = JSON.parse(localStorage.getItem('nobero_recently_viewed') || '[]');
            const filtered = viewed.filter(p => p._id !== prod._id);
            localStorage.setItem('nobero_recently_viewed', JSON.stringify([prod, ...filtered].slice(0, 6)));
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

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      info('Please enter a valid 6-digit Indian pincode');
      return;
    }
    const days = pincode.startsWith('11') || pincode.startsWith('40') || pincode.startsWith('56') || pincode.startsWith('50') || pincode.startsWith('60') ? '2-3 business days' : '3-5 business days';
    setDeliveryEstimate(`Express delivery by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} (${days})`);
    setPincodeChecked(true);
    success('Delivery available for ' + pincode);
  };

  const copyCouponCode = (code) => {
    navigator.clipboard?.writeText(code);
    success(`Coupon code ${code} copied!`);
  };

  if (isLoading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold text-[#181B2D]">Garment Not Found</h2>
        <p className="text-xs text-stone-500 mt-2">The requested piece may have been archived or removed from the catalog.</p>
        <Link to="/shop" className="mt-6 px-6 py-3 bg-[#242F66] text-white text-xs uppercase tracking-wider font-bold rounded-lg shadow-md hover:bg-[#181B2D]">
          Explore All Products
        </Link>
      </div>
    );
  }

  const isSaved = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85' }];

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
    <div className="bg-[#FFFFFF] min-h-screen pt-28 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="py-3 text-[11px] sm:text-xs text-[#666875] flex items-center space-x-2 font-[familyMedium]">
          <Link to="/" className="hover:text-[#242F66]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#242F66]">Shop</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug || product.category}`} className="hover:text-[#242F66] capitalize">
                {product.category.name || product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#181B2D] truncate max-w-xs font-[familySemiBold]">{product.title}</span>
        </div>

        {/* Main Product Layout: Gallery + Purchasing Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 pt-2">
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Vertical Thumbnails */}
            {images.length > 1 && (
              <div className="flex sm:flex-col space-x-2.5 sm:space-x-0 sm:space-y-2.5 shrink-0 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 sm:w-20 aspect-[3/4] rounded-lg bg-stone-50 overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIdx === idx ? 'border-[#242F66] ring-1 ring-[#242F66] shadow-sm' : 'border-[#E8E9EA] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Active Image Viewport with Zoom */}
            <div
              className="flex-1 aspect-[3/4] rounded-xl bg-stone-100 overflow-hidden shadow-sm relative group cursor-crosshair border border-[#E8E9EA]"
              onMouseMove={(e) => {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                e.currentTarget.querySelector('img').style.transformOrigin = `${x}% ${y}%`;
              }}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector('img').style.transform = 'scale(1.65)';
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

              {/* Nobero PDP Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                {product.discountPercentage > 0 && (
                  <span className="bg-[#242F66] text-white text-[10px] sm:text-xs font-[familyBold] uppercase px-2.5 py-1 rounded shadow-sm">
                    {product.discountPercentage}% OFF
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-[#FF4D00] text-white text-[10px] font-[familyBold] uppercase px-2 py-0.5 rounded shadow-sm">
                    🔥 BESTSELLER
                  </span>
                )}
              </div>

              {/* Wishlist Button inside Image */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white backdrop-blur rounded-full shadow-md transition-all hover:scale-110"
                aria-label="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#E11D48] text-[#E11D48]' : 'text-[#181B2D]'}`} />
              </button>
            </div>
          </div>

          {/* RIGHT: Purchasing Form & Attributes */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-[familySemiBold] uppercase tracking-wider">
                <span className="text-[#242F66] bg-[#EEF2FF] px-2.5 py-0.5 rounded font-[familyBold]">
                  {product.brandName || 'NOBERO'}
                </span>
                <span className="text-[#9698A0] font-[familyMedium]">SKU: {product.sku || 'NBR-AW26'}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-[familyBold] text-[#181B2D] mt-2 tracking-tight">
                {product.title}
              </h1>

              {/* Rating & Review Jump */}
              <div className="flex items-center space-x-2.5 mt-2 text-xs">
                <div className="inline-flex items-center space-x-1 bg-[#F5F6F8] border border-[#E8E9EA] px-2 py-0.5 rounded text-[#181B2D] font-[familyBold]">
                  <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-[#9698A0]">|</span>
                  <span className="text-[#666875] font-[familyMedium]">{reviews.length > 0 ? reviews.length : '48'} Ratings</span>
                </div>
                <span className="text-[#008C2D] font-[familyBold] text-xs">✓ Verified Quality</span>
              </div>

              {/* Price & Savings */}
              <div className="flex items-baseline space-x-3 mt-3.5">
                <span className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D]">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-[#9698A0] line-through font-[familyMedium]">
                    ₹{product.compareAtPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="text-xs font-[familyBold] text-[#008C2D] bg-[#E6FFEE] px-2 py-0.5 rounded">
                    Save ₹{((product.compareAtPrice || 0) - (product.price || 0)).toLocaleString('en-IN')} ({product.discountPercentage}% OFF)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#666875] mt-0.5 font-[familyMedium]">Inclusive of all taxes & doorstep delivery</p>
            </div>

            {/* Exact Nobero Special Offer Box */}
            <div className="relative p-3.5 border border-[#F0E4B6] rounded-xl shadow-xs" style={{ background: 'linear-gradient(180deg, #FAF6E8 0%, #FFFFFF 64%)' }}>
              <div className="absolute right-3 top-2 text-[#008C2D] font-[familyBold] text-[10px] sm:text-xs bg-[#E6FFEE] px-2 py-0.5 rounded">
                Save Extra 15%
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#FEF3C7] flex items-center justify-center text-base shrink-0">
                  🎁
                </div>
                <div>
                  <h5 className="font-[familyBold] text-[#715D0B] text-xs sm:text-sm">Shop any 3 Get Extra 15% Off</h5>
                  <p className="text-[11px] text-[#666875] font-[familyMedium] mt-0.5">
                    Use code <span className="font-[familyBold] text-[#181B2D]">B3G15</span> at checkout
                  </p>
                </div>
              </div>
              <hr className="my-2.5 border-t border-dashed border-[#E8E9EA]" />
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-[familyBold] text-[#666875]">
                  <span>Code:</span>
                  <span className="text-[#181B2D] font-mono uppercase bg-white px-2 py-0.5 rounded border border-[#E8E9EA]">B3G15</span>
                  <button onClick={() => copyCouponCode('B3G15')} className="p-1 hover:bg-[#FAF6E8] rounded transition-colors" title="Copy coupon">
                    <Copy className="w-3.5 h-3.5 text-[#242F66]" />
                  </button>
                </div>
                <button
                  onClick={() => toggleAccordion('offers')}
                  className="flex items-center text-[#666875] hover:text-[#181B2D] font-[familyMedium] text-[11px] gap-1"
                >
                  <span>Offer T&C</span>
                  {openAccordions.offers ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
              {openAccordions.offers && (
                <div className="mt-2 pt-2 border-t border-[#F0E4B6]/60 text-[11px] text-[#666875] space-y-1 font-[familyMedium]">
                  <p>• Applicable across all apparel in your cart.</p>
                  <p>• Minimum quantity requirement: 3 items.</p>
                  <p>• Cannot be combined with code APP300.</p>
                </div>
              )}
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs uppercase font-[familyBold] text-[#181B2D] block mb-2">
                  Select Color: <span className="text-[#242F66] font-[familyBold]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        selectedColor === c.name
                          ? 'border-[#242F66] bg-[#EEF2FF] text-[#242F66] font-[familyBold] ring-1 ring-[#242F66]'
                          : 'border-[#E8E9EA] bg-white text-[#484B5A] hover:border-[#9698A0]'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full border border-stone-200" style={{ backgroundColor: c.hex }} />
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
                  <label className="text-xs uppercase font-[familyBold] text-[#181B2D]">
                    Select Size: <span className="text-[#242F66] font-[familyBold]">{selectedSize}</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-xs text-[#242F66] hover:underline font-[familyBold]"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 rounded-lg text-xs uppercase font-[familyBold] border text-center transition-all ${
                        selectedSize === s
                          ? 'border-[#242F66] bg-[#242F66] text-white shadow-sm ring-2 ring-[#242F66]/30'
                          : 'border-[#E8E9EA] bg-white text-[#181B2D] hover:border-[#242F66]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-3">
                <label className="text-xs uppercase font-[familyBold] text-[#181B2D]">Quantity:</label>
                <div className="flex items-center border border-[#E8E9EA] rounded-lg bg-[#F5F6F8] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-[#666875] hover:bg-[#E8E9EA] transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-[familyBold] px-3 w-8 text-center text-[#181B2D]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-[#666875] hover:bg-[#E8E9EA] transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs">
                {product.stock <= (product.lowStockThreshold || 5) ? (
                  <span className="text-[#FF4D00] font-[familyBold] bg-[#FFF3EE] px-2.5 py-1 rounded">
                    🔥 Only {product.stock} left in stock
                  </span>
                ) : (
                  <span className="text-[#008C2D] font-[familyBold] bg-[#E6FFEE] px-2.5 py-1 rounded">
                    ✓ In Stock & Ready to Ship
                  </span>
                )}
              </div>
            </div>

            {/* CTAs: Add to Bag and Buy Now */}
            <div className="space-y-2.5 pt-2">
              <div className="flex space-x-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#242F66] text-white py-3.5 rounded-xl text-xs uppercase tracking-wider font-[familyBold] hover:bg-[#181B2D] transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>ADD TO CART — ₹{((product.price || 0) * quantity).toLocaleString('en-IN')}</span>
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3.5 border border-[#E8E9EA] rounded-xl bg-white hover:bg-[#F5F6F8] transition-colors shadow-xs"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#E11D48] text-[#E11D48]' : 'text-[#181B2D]'}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="w-full bg-[#F59E0B] text-[#181B2D] py-3.5 rounded-xl text-xs uppercase tracking-wider font-[familyBold] hover:bg-[#D97706] hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>⚡ BUY NOW • INSTANT CHECKOUT</span>
              </button>
            </div>

            {/* Exact Nobero Pincode Serviceability Box */}
            <div className="p-3.5 bg-[#F5F6F8] rounded-xl border border-[#E8E9EA] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-[familyBold] text-[#181B2D]">
                  <MapPin className="w-4 h-4 text-[#242F66]" />
                  <span>Check Delivery Details</span>
                </div>
                <span className="text-[10px] font-[familyBold] text-[#008C2D] bg-[#E6FFEE] px-2 py-0.5 rounded">
                  FREE SHIPPING
                </span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeChecked(false);
                  }}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 bg-white border border-[#E8E9EA] rounded-lg px-3 py-2 text-xs text-[#181B2D] font-[familyMedium] placeholder:text-[#9698A0] focus:outline-none focus:ring-1 focus:ring-[#242F66]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#242F66] text-white text-xs font-[familyBold] rounded-lg hover:bg-[#181B2D] transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeChecked && (
                <div className="text-xs text-[#008C2D] font-[familyBold] flex items-center gap-1.5 pt-1">
                  <Check className="w-4 h-4" />
                  <span>{deliveryEstimate}</span>
                </div>
              )}
            </div>

            {/* Nobero Trust Badges */}
            <div className="p-3.5 bg-white rounded-xl border border-[#E8E9EA] space-y-2 text-xs text-[#484B5A] font-[familyMedium]">
              <div className="flex items-center space-x-2.5">
                <Truck className="w-4 h-4 text-[#242F66] shrink-0" />
                <span>Free Express Delivery on all prepaid & COD orders above ₹999</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <RotateCcw className="w-4 h-4 text-[#008C2D] shrink-0" />
                <span>7-Day Hassle-Free Returns & Size Exchanges</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>100% Cotton & Pre-Shrunk Bio-Washed Fabrics</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#E8E9EA] pt-3 space-y-2 text-xs">
              {/* Description Accordion */}
              <div className="border-b border-[#E8E9EA] pb-2.5">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between py-2 text-left font-[familyBold] text-[#181B2D] uppercase tracking-wider"
                >
                  <span>Product Details</span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.description && (
                  <div className="pt-1 text-[#666875] space-y-2 leading-relaxed font-[familyMedium]">
                    <p>{product.description}</p>
                    {product.features && product.features.length > 0 && (
                      <ul className="list-disc pl-4 space-y-1 pt-1 text-[#181B2D]">
                        {product.features.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Material & Care */}
              <div className="border-b border-[#E8E9EA] pb-2.5">
                <button
                  onClick={() => toggleAccordion('material')}
                  className="w-full flex items-center justify-between py-2 text-left font-[familyBold] text-[#181B2D] uppercase tracking-wider"
                >
                  <span>Material & Care</span>
                  {openAccordions.material ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.material && (
                  <div className="pt-1 text-[#666875] font-[familyMedium] space-y-1.5 leading-relaxed">
                    <p><strong className="text-[#181B2D]">Fabric:</strong> {product.material || '100% Super Combed Cotton'}</p>
                    <p><strong className="text-[#181B2D]">Wash Care:</strong> {product.careInstructions || 'Machine wash gentle with like colors. Do not bleach.'}</p>
                  </div>
                )}
              </div>

              {/* Shipping & 7-Day Returns */}
              <div className="border-b border-[#E8E9EA] pb-2.5">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between py-2 text-left font-[familyBold] text-[#181B2D] uppercase tracking-wider"
                >
                  <span>7-Day Easy Returns & Exchange</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <div className="pt-1 text-[#666875] font-[familyMedium] space-y-1.5 leading-relaxed">
                    <p>Dispatched within 24 business hours from our central warehouse.</p>
                    <p>Standard delivery arrives in 2–4 business days with real-time SMS tracking.</p>
                    <p className="text-[#008C2D] font-[familyBold]">
                      ✓ Doorstep Pickup Available for size exchange and returns.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section id="reviews" className="mt-20 pt-12 border-t border-[#E8E9EA]">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#242F66] font-[familyBold]">Customer Feedback</span>
              <h2 className="text-2xl font-[familyBold] text-[#181B2D] mt-1">
                Verified Reviews ({reviews.length > 0 ? reviews.length : '48'})
              </h2>
            </div>
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="mt-4 md:mt-0 px-5 py-2.5 bg-[#242F66] text-white hover:bg-[#181B2D] transition-colors text-xs font-[familyBold] uppercase tracking-wider rounded-lg shadow-sm"
            >
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Rating Summary Box */}
            <div className="md:col-span-4 p-6 bg-[#F5F6F8] border border-[#E8E9EA] rounded-xl space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-[familyBold] text-[#181B2D]">{product.rating || 4.9}</span>
                <div>
                  <div className="flex text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#666875] font-[familyMedium] mt-0.5 block">
                    Based on verified customer purchases
                  </span>
                </div>
              </div>
              <div className="border-t border-[#E8E9EA] pt-3 text-xs text-[#666875] font-[familyMedium]">
                <p>98% of buyers recommend this product for comfort and fit.</p>
              </div>
            </div>

            {/* Reviews Stream */}
            <div className="md:col-span-8 space-y-4">
              {reviews.length === 0 ? (
                <div className="p-6 bg-[#F5F6F8] border border-[#E8E9EA] rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-[familyBold] text-[#181B2D]">Rohit V.</span>
                      <span className="inline-flex items-center space-x-1 text-[10px] text-[#008C2D] bg-[#E6FFEE] px-2 py-0.5 rounded font-[familyBold]">
                        <Check className="w-3 h-3" />
                        <span>Verified Buyer • Mumbai</span>
                      </span>
                    </div>
                    <span className="text-[#9698A0] text-[11px]">2 days ago</span>
                  </div>
                  <div className="flex items-center space-x-1 text-[#F59E0B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <h4 className="text-sm font-[familyBold] text-[#181B2D]">Exact quality as described, supreme fit!</h4>
                  <p className="text-xs text-[#666875] font-[familyMedium] leading-relaxed">
                    Fabric weight is amazing and the drape is completely on point. Washed once and no shrinkage at all. Highly recommended!
                  </p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-5 bg-white border border-[#E8E9EA] rounded-xl space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-[familyBold] text-[#181B2D]">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-[#008C2D] bg-[#E6FFEE] px-2 py-0.5 rounded font-[familyBold]">
                            <Check className="w-3 h-3" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[#9698A0] text-[11px]">
                        {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1 text-[#F59E0B]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < rev.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E8E9EA]'}`}
                        />
                      ))}
                    </div>

                    <h4 className="text-sm font-[familyBold] text-[#181B2D]">{rev.title}</h4>
                    <p className="text-xs text-[#666875] font-[familyMedium] leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-[#E8E9EA]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#242F66] font-[familyBold]">Similar Styles</span>
                <h2 className="text-xl sm:text-2xl font-[familyBold] text-[#181B2D]">You May Also Like</h2>
              </div>
              <Link to="/shop" className="text-xs font-[familyBold] text-[#242F66] hover:underline">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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

