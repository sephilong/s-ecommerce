
import { PlaceHolderImages } from "./placeholder-images";

export type VariantAttribute = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  sku: string;
  combination: Record<string, string>; // e.g., { "Màu sắc": "Titan", "Dung lượng": "256GB" }
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  description: string;
  shortDescription?: string;
  category: string;
  inStock: boolean;
  createdAt: string;
  updatedAt?: string;
  attributes?: VariantAttribute[];
  variants?: ProductVariant[];
  hasVariants?: boolean;
  brand?: { name: string };
  sku?: string;
  barcode?: string;
  tags?: string[];
  googleProductCategory?: string;
  reviewCount?: number;
  ratingAverage?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
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

export interface GoogleEcosystemConfig {
  ga4MeasurementId?: string;
  gtmContainerId?: string;
  searchConsoleVerificationCode?: string;
  googleAdsId?: string;
  googleAdsConversionLabel?: string;
  merchantCenterId?: string;
  reportWebVitalsToGA: boolean;
}

export interface SocialCommerceConfig {
  facebookAppId?: string;
  facebookPageId?: string;
  facebookPixelId?: string;
  facebookOauthToken?: string;
  showFacebookLikeButton: boolean;
  showFacebookShareButton: boolean;
  showFacebookComments: boolean;
  enableLiveCommerce: boolean;
  zaloOaId?: string;
  showZaloChatWidget: boolean;
  showZaloShareButton: boolean;
  socialLinks: {
    facebook?: string;
    zalo?: string;
    tiktok?: string;
    youtube?: string;
    instagram?: string;
  };
}

export type Tenant = {
  id: string;
  ownerId?: string;
  name: string;
  storeName: string;
  subdomain: string;
  customDomain?: string;
  description: string;
  logo?: string;
  logoUrl?: string;
  primaryColor: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: {
    street: string;
    district: string;
    province: string;
  };
  openingHours?: any;
  products: Product[];
  banners: Banner[];
  paymentMethods: PaymentMethod[];
  shippingMethods: ShippingMethod[];
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyConfig: LoyaltyConfig;
  socialCommerce: SocialCommerceConfig;
  googleEcosystem: GoogleEcosystemConfig;
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
      slug: slugify(productName),
      price: 500000 + (i * 200000),
      compareAtPrice: i % 2 === 0 ? 12000000 : undefined,
      image: PlaceHolderImages[imageIndex].imageUrl,
      description: `Mô tả chi tiết cho sản phẩm ${category} thế hệ mới. Đầy đủ tính năng và bảo hành chính hãng.`,
      shortDescription: `Sản phẩm ${category} chất lượng cao, bền bỉ.`,
      category: category,
      brand: { name: "S-Com Elite" },
      inStock: true,
      createdAt: new Date(2025, 0, 1 + i).toISOString(),
      updatedAt: new Date(2025, 0, 1 + i).toISOString(),
      sku: `SKU-P${i+1}`,
      tags: [category.toLowerCase(), 'premium'],
      reviewCount: 15,
      ratingAverage: 4.8
    };
  });
};

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
  },
  socialCommerce: {
    facebookAppId: "placeholder_app_id",
    facebookPageId: "placeholder_page_id",
    facebookPixelId: "placeholder_pixel_id",
    showFacebookLikeButton: true,
    showFacebookShareButton: true,
    showFacebookComments: true,
    enableLiveCommerce: true,
    zaloOaId: "placeholder_zalo_id",
    showZaloChatWidget: true,
    showZaloShareButton: true,
    socialLinks: {
      facebook: "https://facebook.com/scomhub",
      zalo: "https://zalo.me/scomhub",
      tiktok: "https://tiktok.com/@scomhub"
    }
  },
  googleEcosystem: {
    reportWebVitalsToGA: true,
    ga4MeasurementId: "G-XXXXXXXXXX",
    gtmContainerId: "GTM-XXXXXXX"
  }
};

export const MOCK_TENANTS: Tenant[] = [
  {
    id: "platform-1",
    name: "S-Com Hub Platform",
    storeName: "S-Com Hub",
    subdomain: "demo",
    description: "Nền tảng thương mại điện tử đa năng, hỗ trợ Việt Nam.",
    primaryColor: "266 79% 63%",
    logoUrl: "https://picsum.photos/seed/logo/200/200",
    contactPhone: "1900 1234",
    contactEmail: "contact@scomhub.vn",
    address: { street: "123 Lê Lợi", district: "Quận 1", province: "TP. Hồ Chí Minh" },
    products: generateMockProducts(20),
    banners: [],
    promotions: [],
    coupons: [],
    type: 'platform',
    ...commonConfig
  }
];

export function getTenantBySubdomain(subdomain: string) {
  return MOCK_TENANTS.find(t => t.subdomain === subdomain) || MOCK_TENANTS[0];
}
