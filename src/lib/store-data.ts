
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

export type PaymentMethod = {
  id: string;
  name: string;
  type: 'vnpay' | 'momo' | 'cod' | 'banking';
  isActive: boolean;
  description?: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  type: 'ghn' | 'ghtk' | 'viettel' | 'grab';
  isActive: boolean;
  price: number;
};

export type PromotionType = 
  | 'percentage' 
  | 'fixed_amount' 
  | 'buy_x_get_y' 
  | 'bundle' 
  | 'tiered' 
  | 'flash_sale' 
  | 'free_shipping' 
  | 'loyalty_multiplier' 
  | 'first_order' 
  | 'referral';

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
  priority: number;
  config: any;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percent' | 'fixed' | 'free_shipping';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  startsAt?: string;
  expiresAt?: string;
}

export interface LoyaltyConfig {
  earnRate: number;
  redeemRate: number;
  minRedeemPoints: number;
  maxRedeemPercent: number;
}

export type Tenant = {
  id: string;
  ownerId?: string; // UID của Reseller nếu là shop riêng
  name: string;
  subdomain: string;
  description: string;
  logo?: string;
  primaryColor: string; // HSL value or Hex
  products: Product[];
  banners: Banner[];
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyConfig: LoyaltyConfig;
  type: 'platform' | 'reseller';
};

const categories = ["Điện tử", "Phụ kiện", "Gia dụng", "Thời trang"];

function slugify(text: string) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, i) => {
    const category = categories[i % categories.length];
    const imageIndex = (i % 4) + 1; 
    const productName = `${category} Premium Model ${i + 1}`;
    return {
      id: `p${i + 1}`,
      name: productName,
      slug: `${slugify(productName)}`,
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
    link: "/products",
    type: 'product',
    isActive: true
  }
];

const mockPromotions: Promotion[] = [
  {
    id: 'promo-1',
    name: 'Giảm giá Điện tử',
    description: 'Giảm 20% cho các sản phẩm Điện tử',
    type: 'percentage',
    isActive: true,
    priority: 10,
    config: {
      discountPercent: 20,
      maxDiscountAmount: 500000,
      appliesTo: 'category',
      targetIds: ['Điện tử']
    }
  },
  {
    id: 'promo-2',
    name: 'Flash Sale Cuối Tuần',
    description: 'Deal sốc theo giờ',
    type: 'flash_sale',
    isActive: true,
    priority: 100,
    config: {
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString(),
      products: [
        { productId: 'p1', salePrice: 2000000, saleQuantity: 10 }
      ]
    }
  }
];

const commonConfig = {
  paymentMethods: [
    { id: "pm1", name: "Thanh toán VNPAY", type: "vnpay", isActive: true, description: "Cổng thanh toán điện tử VNPAY" },
    { id: "pm2", name: "Ví MoMo", type: "momo", isActive: true, description: "Thanh toán qua ví MoMo" },
    { id: "pm3", name: "Chuyển khoản ngân hàng", type: "banking", isActive: true, description: "Quét mã QR chuyển khoản" },
    { id: "pm4", name: "Thanh toán khi nhận hàng (COD)", type: "cod", isActive: true, description: "Thanh toán tiền mặt" },
  ],
  shippingMethods: [
    { id: "sm1", name: "Giao Hàng Nhanh (GHN)", type: "ghn", isActive: true, price: 35000 },
    { id: "sm2", name: "Giao Hàng Tiết Kiệm (GHTK)", type: "ghtk", isActive: true, price: 30000 },
  ],
  loyaltyConfig: {
    earnRate: 10000,
    redeemRate: 100,
    minRedeemPoints: 100,
    maxRedeemPercent: 30
  }
};

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "platform-1",
    name: "S-Com Hub Platform",
    subdomain: "demo",
    description: "Nền tảng thương mại điện tử đa năng, hỗ trợ Việt Nam.",
    primaryColor: "266 79% 63%", // Violet HSL
    products: generateMockProducts(20),
    banners: mockBanners,
    promotions: mockPromotions,
    coupons: [],
    type: 'platform',
    ...commonConfig
  },
  {
    id: "reseller-1",
    ownerId: "uid-reseller-1",
    name: "Phạm Long Store",
    subdomain: "phamlong",
    description: "Cửa hàng ủy quyền của Phạm Long - Công nghệ dẫn đầu.",
    primaryColor: "200 95% 45%", // Blue HSL
    products: generateMockProducts(15),
    banners: mockBanners,
    promotions: [],
    coupons: [],
    type: 'reseller',
    ...commonConfig
  },
  {
    id: "reseller-2",
    ownerId: "uid-reseller-2",
    name: "Shop ABC",
    subdomain: "shopabc",
    description: "Gia dụng thông minh ABC - Tiện ích cho mọi nhà.",
    primaryColor: "142 76% 36%", // Green HSL
    products: generateMockProducts(10),
    banners: mockBanners,
    promotions: [],
    coupons: [],
    type: 'reseller',
    ...commonConfig
  }
];

export function getTenantBySubdomain(subdomain: string) {
  return MOCK_TENANTS.find(t => t.subdomain === subdomain) || MOCK_TENANTS[0];
}
