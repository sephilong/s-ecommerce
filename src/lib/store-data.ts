
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
  config: any; // Flexible config based on type
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
  earnRate: number; // 10000đ = 1 điểm
  redeemRate: number; // 1 điểm = 100đ
  minRedeemPoints: number;
  maxRedeemPercent: number;
}

export type Tenant = {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  logo?: string;
  primaryColor: string;
  products: Product[];
  banners: Banner[];
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyConfig: LoyaltyConfig;
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
    name: 'Flash Sale Cuối Tuần',
    description: 'Giảm 15% cho toàn bộ ngành hàng Điện tử',
    type: 'percentage',
    isActive: true,
    priority: 1,
    config: {
      discountPercent: 15,
      appliesTo: 'category',
      targetIds: ['Điện tử']
    }
  },
  {
    id: 'promo-2',
    name: 'Miễn phí vận chuyển',
    description: 'Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ',
    type: 'free_shipping',
    isActive: true,
    priority: 2,
    config: {
      minimumOrderAmount: 2000000,
      maxShippingFee: 50000
    }
  }
];

const mockCoupons: Coupon[] = [
  {
    id: 'cp-1',
    code: 'SCOMNEW',
    description: 'Giảm 50.000đ cho đơn hàng đầu tiên từ 500.000đ',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderAmount: 500000,
    usageCount: 0,
    isActive: true
  },
  {
    id: 'cp-2',
    code: 'TECH20',
    description: 'Giảm 20% tối đa 200.000đ',
    discountType: 'percent',
    discountValue: 20,
    maxDiscountAmount: 200000,
    usageCount: 0,
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
    banners: mockBanners,
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
    promotions: mockPromotions,
    coupons: mockCoupons,
    loyaltyConfig: {
      earnRate: 10000,
      redeemRate: 100,
      minRedeemPoints: 100,
      maxRedeemPercent: 30
    }
  }
];

export function getTenantBySubdomain(subdomain: string) {
  return MOCK_TENANTS.find(t => t.subdomain === subdomain) || MOCK_TENANTS[0];
}
