
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from '@/lib/store-data';

export type CartItem = {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void; // Using a unique string now
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        // Find if an item with the same product ID and same variant ID exists
        const existingItem = items.find(i => 
          i.product.id === product.id && 
          i.selectedVariant?.id === variant?.id
        );
        
        if (existingItem) {
          set({
            items: items.map(i => 
              (i.product.id === product.id && i.selectedVariant?.id === variant?.id)
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          });
        } else {
          set({ items: [...items, { product, selectedVariant: variant, quantity }] });
        }
      },
      removeItem: (itemId) => {
        // In this complex case, we usually would need a more robust ID. 
        // For simplicity in this mock, we filter by product and variant ID combo.
        set({ items: get().items.filter(i => {
          const uniqueId = i.selectedVariant ? `${i.product.id}-${i.selectedVariant.id}` : i.product.id;
          return uniqueId !== itemId;
        }) });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(i => {
            const uniqueId = i.selectedVariant ? `${i.product.id}-${i.selectedVariant.id}` : i.product.id;
            return uniqueId === itemId ? { ...i, quantity } : i;
          })
        });
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      totalPrice: () => get().items.reduce((acc, i) => {
        const price = i.selectedVariant ? i.selectedVariant.price : i.product.price;
        return acc + price * i.quantity;
      }, 0),
    }),
    {
      name: 'scomhub-cart-storage-v2',
    }
  )
);
