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
const handleStaticFallback = (url = '', method = 'get') => {
  const cleanUrl = url.replace(/^(\/api|\/)/, '');
  const [pathname, queryString] = cleanUrl.split('?');
  const params = Object.fromEntries(new URLSearchParams(queryString || ''));

  // /products or /products?...
  if (pathname === 'products') {
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

  // /cms/settings
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
            monolithLookbook: true,
            silkEditFeature: true,
            bengaluruBespoke: true,
            cashmereStory: true,
            craftsmanship: true,
            values: true,
            instagramFeed: true,
            newsletter: true,
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

// Response interceptor for error fallback to JSON data
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend network fails or 404/500/timeout occurs on Vercel static deployment
    if (
      !error.response ||
      error.response.status === 404 ||
      error.response.status === 500 ||
      error.response.status === 502 ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED'
    ) {
      const fallback = handleStaticFallback(error.config?.url, error.config?.method);
      if (fallback) {
        return Promise.resolve(fallback);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

