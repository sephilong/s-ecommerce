
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, MOCK_TENANTS } from '@/lib/store-data';

export interface Vendor {
  id: string;
  userId: string;
  storeName: string;
  storeSlug: string;
  storeDescription: string;
  storeLogo?: string;
  storeBanner?: string;
  businessType: 'individual' | 'company';
  businessName?: string;
  taxCode?: string;
  idNumber: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  commissionRate: number;
  totalRevenue: number;
  balance: number;
  pendingBalance: number;
  createdAt: string;
  storefrontConfig?: {
    sections: any[];
    theme: any;
  };
}

export interface VendorOrder {
  id: string;
  orderId: string;
  vendorId: string;
  customerName: string;
  items: any[];
  subtotal: number;
  commission: number;
  vendorEarnings: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface VendorReview {
  id: string;
  vendorId: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  reply?: string;
  createdAt: string;
}

interface VendorState {
  vendors: Vendor[];
  vendorOrders: VendorOrder[];
  vendorProducts: (Product & { vendorId: string, status: 'pending' | 'approved' | 'rejected', rejectReason?: string })[];
  vendorReviews: VendorReview[];
  currentVendor: Vendor | null;
  
  registerVendor: (vendor: Vendor) => void;
  updateVendorStatus: (id: string, status: Vendor['status']) => void;
  updateVendorCommission: (id: string, rate: number) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason: string) => void;
  
  addVendorProduct: (product: any) => void;
  updateVendorProduct: (product: any) => void;
  deleteVendorProduct: (productId: string) => void;
  updateVendorOrder: (id: string, status: VendorOrder['status'], tracking?: string) => void;
  updateStoreBranding: (id: string, updates: { logo?: string, banner?: string, description?: string }) => void;
  updateStorefrontConfig: (vendorId: string, config: { sections: any[], theme: any }) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  setCurrentVendor: (vendor: Vendor | null) => void;
  addReview: (review: VendorReview) => void;
  
  getVendorByUserId: (userId: string) => Vendor | undefined;
  getVendorProducts: (vendorId: string) => any[];
  getVendorOrders: (vendorId: string) => VendorOrder[];
}

// Khởi tạo vendorProducts với toàn bộ sản phẩm mẫu để có thể chỉnh sửa và lưu lại
const INITIAL_PRODUCTS = [
  ...MOCK_TENANTS[0].products.map(p => ({
    ...p,
    vendorId: 'system',
    status: 'approved' as const
  })),
  // Thêm một số sản phẩm từ vendor v-1 mặc định
  ...MOCK_TENANTS[0].products.slice(0, 3).map(p => ({
    ...p,
    id: `v1-${p.id}`,
    vendorId: 'v-1',
    status: 'approved' as const
  }))
];

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      vendors: [
        {
          id: 'v-1',
          userId: 'user-vana',
          storeName: 'S-Com Official Store',
          storeSlug: 's-com-official',
          storeDescription: 'Chuyên cung cấp các sản phẩm công nghệ chính hãng từ hệ thống S-Com Hub.',
          businessType: 'company',
          idNumber: '0123456789',
          bankName: 'Vietcombank',
          accountNumber: '9999888777',
          accountName: 'NGUYEN VAN A',
          status: 'approved',
          commissionRate: 10,
          totalRevenue: 50000000,
          balance: 4500000,
          pendingBalance: 1200000,
          createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          storefrontConfig: undefined
        }
      ],
      vendorOrders: [
        {
          id: 'vo-1',
          orderId: 'SCHUB-8821',
          vendorId: 'v-1',
          customerName: 'Trần Minh Quân',
          items: [{ name: 'Chuột Gaming G-Pro', qty: 1, price: 1200000 }],
          subtotal: 1200000,
          commission: 120000,
          vendorEarnings: 1080000,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ],
      vendorProducts: INITIAL_PRODUCTS,
      vendorReviews: [
        {
          id: 'rv-1',
          vendorId: 'v-1',
          productId: 'p1',
          productName: 'Điện tử Premium Model 1',
          customerName: 'Hoàng Anh',
          rating: 5,
          comment: 'Hàng giao nhanh, đóng gói cẩn thận. Shop phục vụ tốt!',
          createdAt: new Date().toISOString()
        }
      ],
      currentVendor: null,

      registerVendor: (vendor) => set((state) => ({
        vendors: [vendor, ...state.vendors]
      })),

      updateVendorStatus: (id, status) => set((state) => ({
        vendors: state.vendors.map(v => v.id === id ? { ...v, status } : v)
      })),

      updateVendorCommission: (id, rate) => set((state) => ({
        vendors: state.vendors.map(v => v.id === id ? { ...v, commissionRate: rate } : v)
      })),

      addVendorProduct: (product) => set((state) => ({
        vendorProducts: [{ ...product, status: product.status || 'pending' }, ...state.vendorProducts]
      })),

      updateVendorProduct: (updatedProduct) => set((state) => ({
        vendorProducts: state.vendorProducts.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p)
      })),

      deleteVendorProduct: (productId) => set((state) => ({
        vendorProducts: state.vendorProducts.filter(p => p.id !== productId)
      })),

      approveProduct: (productId) => set((state) => ({
        vendorProducts: state.vendorProducts.map(p => p.id === productId ? { ...p, status: 'approved' } : p)
      })),

      rejectProduct: (productId, reason) => set((state) => ({
        vendorProducts: state.vendorProducts.map(p => p.id === productId ? { ...p, status: 'rejected', rejectReason: reason } : p)
      })),

      updateVendorOrder: (id, status, tracking) => set((state) => ({
        vendorOrders: state.vendorOrders.map(o => o.id === id ? { ...o, status, trackingNumber: tracking || o.trackingNumber } : o)
      })),

      updateStoreBranding: (id, updates) => set((state) => ({
        vendors: state.vendors.map(v => v.id === id ? { 
          ...v, 
          storeLogo: updates.logo || v.storeLogo,
          storeBanner: updates.banner || v.storeBanner,
          storeDescription: updates.description || v.storeDescription
        } : v)
      })),

      updateStorefrontConfig: (vendorId, config) => set((state) => ({
        vendors: state.vendors.map(v => v.id === vendorId ? { ...v, storefrontConfig: config } : v)
      })),

      replyToReview: (reviewId, reply) => set((state) => ({
        vendorReviews: state.vendorReviews.map(r => r.id === reviewId ? { ...r, reply } : r)
      })),

      setCurrentVendor: (currentVendor) => set({ currentVendor }),

      addReview: (review) => set((state) => ({
        vendorReviews: [review, ...state.vendorReviews]
      })),

      getVendorByUserId: (userId) => get().vendors.find(v => v.userId === userId),
      getVendorProducts: (vendorId) => get().vendorProducts.filter(p => p.vendorId === vendorId),
      getVendorOrders: (vendorId) => get().vendorOrders.filter(o => o.vendorId === vendorId),
    }),
    {
      name: 'scomhub-vendor-storage-v8',
    }
  )
);
