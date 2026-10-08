import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag, Truck, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingRemaining,
    isFreeShipping,
    freeShippingThreshold,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponCode;
    if (!code || !code.trim()) return;
    setIsApplying(true);
    await applyCoupon(code);
    setIsApplying(false);
    setCouponCode('');
  };

  const progressPercent = Math.min(100, Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[75vh] pt-36 pb-20 flex flex-col items-center justify-center text-center px-6 font-sans">
        <div className="w-16 h-16 bg-[#F5F6F8] rounded-full flex items-center justify-center mb-5 border border-[#E8E9EA]">
          <ShoppingBag className="w-8 h-8 text-[#242F66] stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D]">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-[#666875] max-w-sm mt-2 leading-relaxed font-[familyMedium]">
          Explore heavyweight oversized tees, raw denim jackets, linen shirts, and winter hoodies built for daily comfort.
        </p>
        <Link
          to="/shop"
          className="mt-6 px-8 py-3.5 bg-[#242F66] text-white text-xs uppercase tracking-wider font-[familyBold] rounded-xl hover:bg-[#181B2D] transition-colors shadow-md"
        >
          Explore All Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] pt-32 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-[#E8E9EA] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#242F66] font-[familyBold]">My Bag</span>
            <h1 className="text-2xl sm:text-3xl font-[familyBold] text-[#181B2D] mt-0.5">
              Items in Bag ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
            </h1>
          </div>
          <button onClick={clearCart} className="text-xs font-[familyMedium] text-[#E11D48] hover:underline">
            Clear Bag
          </button>
        </div>

        {/* Free Shipping Progress Alert */}
        <div className="my-5 p-4 bg-[#FDF8E8] border border-[#CA592B1A] rounded-xl text-xs">
          {isFreeShipping ? (
            <div className="flex items-center text-[#008C2D] font-[familyBold] space-x-2">
              <Check className="w-4 h-4" />
              <span>Congratulations! You have unlocked Free Express Delivery for this order.</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-[#181B2D] font-[familyMedium]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#242F66]" />
                  <span>
                    Add <strong className="text-[#242F66] font-[familyBold]">₹{freeShippingRemaining.toLocaleString('en-IN')}</strong> more for <strong className="text-[#008C2D] font-[familyBold]">FREE SHIPPING</strong>
                  </span>
                </div>
                <span className="text-[11px] text-[#666875] font-[familyBold]">{progressPercent}%</span>
              </div>
              <div className="w-full bg-[#E8E9EA] h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-[#242F66] h-full transition-all duration-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-2">
          {/* Cart Table */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item.key} className="flex gap-4 p-4 bg-white border border-[#E8E9EA] rounded-xl shadow-xs items-center">
                {/* Product Image */}
                <Link to={`/product/${item.slug}`} className="w-20 sm:w-24 aspect-[3/4] bg-stone-100 rounded-lg overflow-hidden shrink-0 border border-[#E8E9EA]">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <Link to={`/product/${item.slug}`} className="text-sm sm:text-base font-[familyBold] text-[#181B2D] hover:text-[#242F66] line-clamp-1">
                      {item.title}
                    </Link>
                    <div className="text-xs text-[#666875] font-[familyMedium] flex flex-wrap gap-2 mt-1">
                      <span className="bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#E8E9EA]">Size: <strong className="text-[#181B2D]">{item.size}</strong></span>
                      {item.color && (
                        <span className="bg-[#F5F6F8] px-2 py-0.5 rounded border border-[#E8E9EA]">Color: <strong className="text-[#181B2D]">{item.color}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#E8E9EA] rounded-lg bg-[#F5F6F8]">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="p-1.5 text-[#666875] hover:bg-[#E8E9EA] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-[familyBold] text-[#181B2D]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="p-1.5 text-[#666875] hover:bg-[#E8E9EA] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-sm sm:text-base font-[familyBold] text-[#181B2D]">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.key)}
                        className="text-[11px] text-[#E11D48] hover:underline font-[familyMedium] mt-0.5 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <Link to="/shop" className="text-xs font-[familyBold] text-[#242F66] hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="p-5 sm:p-6 bg-[#F5F6F8] border border-[#E8E9EA] rounded-xl space-y-5 sticky top-28">
              <h3 className="text-lg font-[familyBold] text-[#181B2D]">Order Summary</h3>

              {/* Coupon Section */}
              {coupon ? (
                <div className="flex items-center justify-between bg-[#E6FFEE] border border-[#008C2D]/30 p-3 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-[#008C2D]" />
                    <div>
                      <span className="font-[familyBold] uppercase text-[#008C2D]">{coupon.code} Applied</span>
                      <span className="text-[#008C2D] block font-[familyMedium]">You saved ₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-[#E11D48] hover:underline text-xs font-[familyBold]">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={(e) => { e.preventDefault(); handleApplyCoupon(); }} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter Coupon (e.g. B3G15)"
                      className="bg-white border border-[#E8E9EA] rounded-lg px-3 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#242F66] uppercase font-[familyMedium]"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="bg-[#242F66] text-white text-xs px-4 py-2 rounded-lg font-[familyBold] hover:bg-[#181B2D] transition-colors disabled:opacity-50 shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                  {/* Quick Coupon Chips */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('APP300')}
                      className="text-[10px] font-[familyBold] text-[#242F66] bg-white border border-[#E8E9EA] hover:border-[#242F66] px-2 py-1 rounded transition-colors"
                    >
                      Use APP300 (₹300 Off)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon('B3G15')}
                      className="text-[10px] font-[familyBold] text-[#715D0B] bg-[#FAF6E8] border border-[#F0E4B6] hover:border-[#715D0B] px-2 py-1 rounded transition-colors"
                    >
                      Use B3G15 (15% Off)
                    </button>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-[#666875] font-[familyMedium] pt-2 border-t border-[#E8E9EA]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-[#181B2D] font-[familyBold]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#008C2D] font-[familyBold]">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-[#181B2D] font-[familyBold]">
                    {shipping === 0 ? <span className="text-[#008C2D] font-[familyBold] uppercase text-[11px]">Free</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (Included)</span>
                  <span className="text-[#181B2D] font-[familyBold]">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E8E9EA] text-base font-[familyBold] text-[#181B2D]">
                  <span>Total Amount</span>
                  <span className="text-xl text-[#242F66]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#242F66] text-white py-3.5 rounded-xl text-xs uppercase tracking-wider font-[familyBold] hover:bg-[#181B2D] transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#666875] font-[familyMedium] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008C2D]" />
                <span>100% Safe & Secure Checkout with UPI, Cards & COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

