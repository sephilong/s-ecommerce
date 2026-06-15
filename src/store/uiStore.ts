
import { create } from 'zustand';

interface UIState {
  isCartDrawerOpen: boolean;
  isMobileMenuOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  toggleMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartDrawerOpen: false,
  isMobileMenuOpen: false,
  setCartDrawerOpen: (open) => set({ isCartDrawerOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
