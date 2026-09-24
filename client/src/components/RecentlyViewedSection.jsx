import React, { useState, useEffect } from 'react';
import { History, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const RecentlyViewedSection = () => {
  const [products, setProducts] = useState([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      try {
        if (isAuthenticated) {
          const res = await api.get('/auth/recently-viewed');
          if (res.data.success && res.data.data && res.data.data.length > 0) {
            setProducts(res.data.data);
            return;
          }
        }

        // Fallback to localStorage for guests
        const localIds = JSON.parse(localStorage.getItem('leo_recently_viewed') || '[]');
        if (localIds.length > 0) {
          const res = await api.get('/products?limit=12');
          if (res.data.success) {
            const matches = res.data.data.filter(p => localIds.includes(p._id));
            setProducts(matches.slice(0, 4));
          }
        }
      } catch (err) {
        console.warn('Could not load recently viewed products:', err.message);
      }
    };

    loadRecentlyViewed();
  }, [isAuthenticated]);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-[#FAF9F5] border-t border-velora-border" aria-label="Recently Viewed Products">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center space-x-2 mb-8">
          <History className="w-4 h-4 text-velora-champagne" />
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-velora-black">
            Recently Viewed by You
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
