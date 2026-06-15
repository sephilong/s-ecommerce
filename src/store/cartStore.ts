
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/store-data';

export type CartItem = {
  product: Product;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find(i => i.product.id === product.id);
        
        if (existingItem) {
          set({
            items: items.map(i => 
              i.product.id === product.id 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, { product, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter(i => i.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map(i => 
            i.product.id === productId ? { ...i, quantity } : i
          )
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
    }),
    {
      name: 'scomhub-cart-storage',
    }
  )
);
