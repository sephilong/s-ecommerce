
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'created' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderLineItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
  image: string;
  variantOptions?: Record<string, string>;
}

export interface Address {
  fullName: string;
  phone: string;
  email?: string;
  street: string;
  ward: string;
  district: string;
  province: string;
  country: string;
}

export interface Order {
  id: string;
  code: string; // #ORD-2024-001234
  tenantId: string;
  customerId?: string;
  vendorId?: string;
  
  items: OrderLineItem[];
  
  shippingAddress: Address;
  billingAddress?: Address;
  
  shippingProviderId: string;
  shippingMethod: string;
  shippingFee: number;
  estimatedDeliveryDate?: string;
  trackingCode?: string;
  trackingUrl?: string;
  
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  
  subtotal: number;
  discountTotal: number;
  shippingDiscount: number;
  total: number;
  
  appliedCouponCode?: string;
  pointsEarned?: number;
  pointsUsed?: number;
  
  customerNote?: string;
  merchantNote?: string;
  
  status: OrderStatus;
  cancelReason?: string;
  
  createdAt: string;
  confirmedAt?: string;
  processingAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  updateOrderPayment: (orderId: string, status: PaymentStatus) => void;
  bulkUpdateStatus: (orderIds: string[], status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status, notes) => set((state) => ({
        orders: state.orders.map(o => {
          if (o.id !== orderId) return o;
          const timestampField = `${status}At` as keyof Order;
          return { 
            ...o, 
            status, 
            merchantNote: notes || o.merchantNote,
            [timestampField]: new Date().toISOString()
          };
        })
      })),
      updateOrderPayment: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, paymentStatus: status } : o)
      })),
      bulkUpdateStatus: (orderIds, status) => set((state) => ({
        orders: state.orders.map(o => orderIds.includes(o.id) ? { ...o, status, [`${status}At`]: new Date().toISOString() } : o)
      })),
    }),
    {
      name: 'scomhub-order-storage-v16',
    }
  )
);
