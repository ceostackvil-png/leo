import axios from 'axios';
import {
  queryProducts,
  getProductBySlug,
  categories,
  collections,
  banners,
} from '../data/localDataStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('leo_token') || localStorage.getItem('velora_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper to resolve static mock response
const handleStaticFallback = (rawUrl = '', method = 'get') => {
  if (!rawUrl) return null;
  let url = rawUrl;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const parsed = new URL(url);
      url = parsed.pathname + parsed.search;
    }
  } catch (e) {}

  url = url.replace(/^\/?(api\/)?/, '');
  const [pathname, queryString] = url.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));

  // /products or /products?...
  if (pathname === 'products' || pathname.startsWith('products?')) {
    const result = queryProducts(params);
    return { data: result, status: 200, statusText: 'OK', config: {}, headers: {} };
  }

  // /products/:slug
  if (pathname.startsWith('products/')) {
    const slug = pathname.replace('products/', '');
    const product = getProductBySlug(slug);
    if (product) {
      return {
        data: { success: true, data: product },
        status: 200,
        statusText: 'OK',
        config: {},
        headers: {},
      };
    }
  }

  // /categories
  if (pathname === 'categories' || pathname.startsWith('categories')) {
    return {
      data: { success: true, data: categories },
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };
  }

  // /collections
  if (pathname === 'collections' || pathname.startsWith('collections')) {
    return {
      data: { success: true, data: collections },
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };
  }

  // /banners
  if (pathname === 'banners' || pathname.startsWith('banners')) {
    return {
      data: { success: true, data: banners },
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };
  }

  // /cms/settings or /cms
  if (pathname.startsWith('cms')) {
    return {
      data: {
        success: true,
        data: {
          brandName: 'LEO',
          tagline: 'The Art of Sovereign Luxury',
          homepageSections: {
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
          },
        },
      },
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };
  }

  return null;
};

// Response interceptor for error and SPA rewrite fallback to JSON data
api.interceptors.response.use(
  (response) => {
    // If Vercel SPA rewrite returned index.html string for an API endpoint
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<html'))
    ) {
      const fallback = handleStaticFallback(response.config?.url, response.config?.method);
      if (fallback) {
        return fallback;
      }
    }
    return response;
  },
  (error) => {
    const fallback = handleStaticFallback(error.config?.url, error.config?.method);
    if (fallback) {
      return Promise.resolve(fallback);
    }
    return Promise.reject(error);
  }
);

export default api;

