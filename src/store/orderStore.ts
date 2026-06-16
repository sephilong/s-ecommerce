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

const MOCK_INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    code: "SCHUB-2025-8891",
    tenantId: "demo",
    customerId: "vana@gmail.com",
    vendorId: "v-1",
    items: [
      { productId: "p1", name: "Điện tử Premium Model 1", qty: 1, price: 1200000, image: "https://picsum.photos/seed/p1/600/600" }
    ],
    shippingAddress: {
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      email: "vana@gmail.com",
      street: "123 Lê Lợi",
      ward: "Bến Thành",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "VN"
    },
    shippingProviderId: "ghn",
    shippingMethod: "Giao Hàng Nhanh",
    shippingFee: 35000,
    paymentMethod: "VNPAY",
    paymentStatus: "paid",
    subtotal: 1200000,
    discountTotal: 0,
    shippingDiscount: 0,
    total: 1235000,
    status: "created",
    createdAt: new Date().toISOString()
  },
  {
    id: "ord-2",
    code: "SCHUB-2025-4421",
    tenantId: "demo",
    customerId: "thib@yahoo.com",
    vendorId: "v-1",
    items: [
      { productId: "p2", name: "Phụ kiện Model 2", qty: 2, price: 450000, image: "https://picsum.photos/seed/p2/600/600" }
    ],
    shippingAddress: {
      fullName: "Trần Thị B",
      phone: "0912345678",
      email: "thib@yahoo.com",
      street: "456 Nguyễn Huệ",
      ward: "Bến Nghé",
      district: "Quận 1",
      province: "TP. Hồ Chí Minh",
      country: "VN"
    },
    shippingProviderId: "ghtk",
    shippingMethod: "Giao Hàng Tiết Kiệm",
    shippingFee: 30000,
    paymentMethod: "COD",
    paymentStatus: "pending",
    subtotal: 900000,
    discountTotal: 50000,
    shippingDiscount: 30000,
    total: 880000,
    status: "processing",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: MOCK_INITIAL_ORDERS,
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
          } as Order;
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
      name: 'scomhub-order-storage-v18',
    }
  )
);
