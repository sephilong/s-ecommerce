
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  total: number;
  status: 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';
  paymentStatus: 'Chờ thanh toán' | 'Đã thanh toán';
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
};

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) => set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
      })),
    }),
    {
      name: 'scomhub-order-storage',
    }
  )
);
