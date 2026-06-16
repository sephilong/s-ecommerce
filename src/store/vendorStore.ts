
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/store-data';

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
  createdAt: string;
}

export interface VendorOrder {
  id: string;
  orderId: string; // ID đơn hàng tổng
  vendorId: string;
  items: any[];
  subtotal: number;
  commission: number;
  vendorEarnings: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface VendorState {
  vendors: Vendor[];
  vendorOrders: VendorOrder[];
  vendorProducts: Product[];
  
  // Actions for Admin
  registerVendor: (vendor: Vendor) => void;
  updateVendorStatus: (id: string, status: Vendor['status']) => void;
  updateVendorCommission: (id: string, rate: number) => void;
  
  // Actions for Vendor
  addVendorProduct: (product: Product) => void;
  updateVendorProduct: (product: Product) => void;
  updateVendorOrder: (id: string, status: VendorOrder['status']) => void;
  
  // Getters
  getVendorByUserId: (userId: string) => Vendor | undefined;
  getVendorProducts: (vendorId: string) => Product[];
  getVendorOrders: (vendorId: string) => VendorOrder[];
}

export const useVendorStore = create<VendorState>()(
  persist(
    (set, get) => ({
      vendors: [
        {
          id: 'v-1',
          userId: 'user-vana',
          storeName: 'Điện Máy Xanh Mock',
          storeSlug: 'dien-may-xanh',
          storeDescription: 'Chuyên cung cấp đồ gia dụng chính hãng.',
          businessType: 'company',
          idNumber: '0123456789',
          bankName: 'Vietcombank',
          accountNumber: '9999888777',
          accountName: 'NGUYEN VAN A',
          status: 'approved',
          commissionRate: 10,
          totalRevenue: 50000000,
          balance: 4500000,
          createdAt: new Date().toISOString()
        }
      ],
      vendorOrders: [],
      vendorProducts: [],

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
        vendorProducts: [product, ...state.vendorProducts]
      })),

      updateVendorProduct: (updatedProduct) => set((state) => ({
        vendorProducts: state.vendorProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      })),

      updateVendorOrder: (id, status) => set((state) => ({
        vendorOrders: state.vendorOrders.map(o => o.id === id ? { ...o, status } : o)
      })),

      getVendorByUserId: (userId) => get().vendors.find(v => v.userId === userId),
      getVendorProducts: (vendorId) => get().vendorProducts.filter(p => p.id.startsWith(`v-${vendorId}`)), // Giả định ID sp có prefix vendor
      getVendorOrders: (vendorId) => get().vendorOrders.filter(o => o.vendorId === vendorId),
    }),
    {
      name: 'scomhub-vendor-storage-v1',
    }
  )
);
