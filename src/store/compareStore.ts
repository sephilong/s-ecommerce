
"use client";

import { create } from 'zustand';
import { Product } from '@/lib/store-data';

interface CompareState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareState>((set) => ({
  items: [],
  addItem: (product) => set((state) => {
    if (state.items.find(i => i.id === product.id)) return state;
    if (state.items.length >= 4) return state;
    return { items: [...state.items, product] };
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.id !== productId)
  })),
  clearCompare: () => set({ items: [] }),
}));
