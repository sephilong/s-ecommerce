
import { PlaceHolderImages } from "./placeholder-images";

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
  createdAt: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  type: 'product' | 'promotion';
  isActive: boolean;
};

export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  logo?: string;
  primaryColor: string;
  products: Product[];
  banners: Banner[];
};

const categories = ["Điện tử", "Phụ kiện", "Gia dụng", "Thời trang"];

const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[i % categories.length];
    const imageIndex = (i % 4) + 1; // Use available product placeholders 1-4
    return {
      id: `p${i + 1}`,
      name: `${category} Premium Model ${i + 1}`,
      slug: `${category.toLowerCase().replace(/ /g, '-')}-premium-${i + 1}`,
      price: 500000 + (Math.random() * 10000000),
      compareAtPrice: Math.random() > 0.5 ? 12000000 + (Math.random() * 5000000) : undefined,
      image: PlaceHolderImages[imageIndex].imageUrl,
      description: `Mô tả chi tiết cho sản phẩm ${category} thế hệ mới. Đầy đủ tính năng và bảo hành chính hãng.`,
      category: category,
      inStock: Math.random() > 0.1,
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString()
    };
  });
};

const mockBanners: Banner[] = [
  {
    id: "b1",
    title: "Siêu Phẩm Công Nghệ 2025",
    subtitle: "Giảm giá lên đến 30% cho các dòng máy tính xách tay đời mới nhất.",
    imageUrl: PlaceHolderImages[0].imageUrl,
    link: "/products/dien-tu-premium-3",
    type: 'product',
    isActive: true
  },
  {
    id: "b2",
    title: "Tuần Lễ Phụ Kiện",
    subtitle: "Mua 1 tặng 1 cho tất cả các loại ốp lưng và cáp sạc cao cấp.",
    imageUrl: "https://picsum.photos/seed/promo1/1200/600",
    link: "/flash-sale",
    type: 'promotion',
    isActive: true
  }
];

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    name: "S-Com Hub Demo Store",
    subdomain: "demo",
    description: "Nền tảng thương mại điện tử đa năng, hỗ trợ Việt Nam.",
    primaryColor: "#9757EA",
    products: generateMockProducts(20),
    banners: mockBanners
  }
];

export function getTenantBySubdomain(subdomain: string) {
  return MOCK_TENANTS.find(t => t.subdomain === subdomain) || MOCK_TENANTS[0];
}
