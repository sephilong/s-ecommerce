
import { Product } from "./store-data";

export interface ActiveFilters {
  categoryIds: string[];
  brandIds: string[];
  priceMin?: number;
  priceMax?: number;
  inStock: boolean;
  onSale: boolean;
  rating?: number;
  attributes: Record<string, string[]>;
  sort: string;
}

export interface SearchFacets {
  brands: { label: string; value: string; count: number }[];
  categories: { id: string; name: string; slug: string; productCount: number; children?: any[] }[];
  priceRange: { min: number; max: number };
  priceHistogram: { min: number; max: number; count: number }[];
  ratings: { value: string; count: number }[];
  attributes: Record<string, { label: string; value: string; count: number }[]>;
}

export function parseFiltersFromSearchParams(searchParams: URLSearchParams): ActiveFilters {
  const attributes: Record<string, string[]> = {};
  searchParams.forEach((value, key) => {
    if (key.startsWith('attr_')) {
      const attrName = key.replace('attr_', '');
      if (!attributes[attrName]) attributes[attrName] = [];
      attributes[attrName].push(value);
    }
  });

  return {
    categoryIds: searchParams.getAll('category'),
    brandIds: searchParams.getAll('brand'),
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
    rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
    attributes,
    sort: searchParams.get('sort') || 'newest',
  };
}

export function generateFacets(products: Product[]): SearchFacets {
  // Mock logic to generate facets from product list
  const brands = [
    { label: 'Apple', value: 'apple', count: 12 },
    { label: 'Samsung', value: 'samsung', count: 8 },
    { label: 'Xiaomi', value: 'xiaomi', count: 6 },
  ];

  const categories = [
    { 
      id: 'cat-1', name: 'Điện tử', slug: 'dien-tu', productCount: 42,
      children: [
        { id: 'cat-1-1', name: 'Điện thoại', slug: 'dien-thoai', productCount: 20 },
        { id: 'cat-1-2', name: 'Laptop', slug: 'laptop', productCount: 22 },
      ]
    },
    { id: 'cat-2', name: 'Thời trang', slug: 'thoi-trang', productCount: 15 },
  ];

  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 10000000);

  // Simple histogram
  const step = (maxPrice - minPrice) / 10;
  const priceHistogram = Array.from({ length: 10 }).map((_, i) => ({
    min: minPrice + (i * step),
    max: minPrice + ((i + 1) * step),
    count: Math.floor(Math.random() * 20) + 5
  }));

  return {
    brands,
    categories,
    priceRange: { min: minPrice, max: maxPrice },
    priceHistogram,
    ratings: [
      { value: '4', count: 23 },
      { value: '3', count: 45 },
      { value: '2', count: 12 },
    ],
    attributes: {
      'Màu sắc': [
        { label: 'Đỏ', value: 'red', count: 8 },
        { label: 'Xanh', value: 'blue', count: 12 },
        { label: 'Trắng', value: 'white', count: 5 },
      ],
      'Kích thước': [
        { label: 'S', value: 's', count: 10 },
        { label: 'M', value: 'm', count: 15 },
        { label: 'L', value: 'l', count: 8 },
      ]
    }
  };
}
