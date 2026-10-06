import products from './products.json';
import categories from './categories.json';
import collections from './collections.json';
import banners from './banners.json';

/**
 * Filter, sort, and paginate products in-memory from local JSON data
 */
export const queryProducts = (params = {}) => {
  let list = [...products];

  // Category filter (by slug or id)
  if (params.category) {
    list = list.filter(
      (p) =>
        p.category === params.category ||
        (p.categoryName && p.categoryName.toLowerCase() === params.category.toLowerCase()) ||
        (p.category && p.category.includes(params.category))
    );
  }

  // Collection filter
  if (params.collection) {
    list = list.filter(
      (p) =>
        p.collectionRef === params.collection ||
        (p.collectionName && p.collectionName.toLowerCase().includes(params.collection.toLowerCase())) ||
        (p.collectionRef && p.collectionRef.includes(params.collection))
    );
  }

  // Gender filter
  if (params.gender && params.gender !== 'All' && params.gender !== '') {
    list = list.filter((p) => p.gender === params.gender || p.gender === 'Unisex');
  }

  // Boolean flags
  if (params.isFeatured === 'true' || params.isFeatured === true) {
    list = list.filter((p) => p.isFeatured);
  }
  if (params.isBestSeller === 'true' || params.isBestSeller === true) {
    list = list.filter((p) => p.isBestSeller);
  }
  if (params.isNewArrival === 'true' || params.isNewArrival === true) {
    list = list.filter((p) => p.isNewArrival);
  }
  if (params.inStock === 'true' || params.inStock === true) {
    list = list.filter((p) => p.variants && p.variants.some((v) => v.stock > 0));
  }

  // Price range
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    if (!isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    if (!isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  // Size filter
  if (params.size) {
    list = list.filter((p) => p.sizes && p.sizes.includes(params.size));
  }

  // Color filter
  if (params.color) {
    list = list.filter(
      (p) =>
        p.colors &&
        p.colors.some((c) => c.name.toLowerCase().includes(params.color.toLowerCase()))
    );
  }

  // Search / keyword
  const keyword = params.keyword || params.search || params.q || '';
  if (keyword.trim()) {
    const query = keyword.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query)) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(query)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
    );
  }

  // Sorting
  const sort = params.sort || 'newest';
  if (sort === 'price-asc' || sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc' || sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sort === 'popular' || sort === 'bestseller') {
    list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  } else {
    // newest / default
    list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  }

  const totalItems = list.length;
  const page = parseInt(params.page, 10) || 1;
  const limit = parseInt(params.limit, 10) || 12;
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const startIndex = (page - 1) * limit;
  const paginatedList = list.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: paginatedList,
    pagination: {
      page,
      limit,
      totalPages,
      totalItems,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Find single product by slug, ID, or SKU
 */
export const getProductBySlug = (identifier) => {
  if (!identifier) return null;
  const decoded = decodeURIComponent(identifier).toLowerCase();
  const found = products.find(
    (p) =>
      p.slug.toLowerCase() === decoded ||
      p._id === identifier ||
      (p.sku && p.sku.toLowerCase() === decoded)
  );
  return found || null;
};

export { products, categories, collections, banners };
