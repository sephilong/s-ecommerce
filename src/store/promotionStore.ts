
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Promotion, Coupon, LoyaltyConfig, MOCK_TENANTS } from '@/lib/store-data';

interface PromotionState {
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyConfig: LoyaltyConfig;
  
  // Promotion Actions
  addPromotion: (promo: Promotion) => void;
  updatePromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;
  
  // Coupon Actions
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (id: string) => void;
  
  // Loyalty Actions
  updateLoyalty: (config: LoyaltyConfig) => void;
}

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set) => ({
      promotions: MOCK_TENANTS[0].promotions,
      coupons: MOCK_TENANTS[0].coupons,
      loyaltyConfig: MOCK_TENANTS[0].loyaltyConfig,

      addPromotion: (promo) => set((state) => ({ 
        promotions: [promo, ...state.promotions] 
      })),
      updatePromotion: (updatedPromo) => set((state) => ({
        promotions: state.promotions.map(p => p.id === updatedPromo.id ? updatedPromo : p)
      })),
      deletePromotion: (id) => set((state) => ({
        promotions: state.promotions.filter(p => p.id !== id)
      })),

      addCoupon: (coupon) => set((state) => ({ 
        coupons: [coupon, ...state.coupons] 
      })),
      updateCoupon: (updatedCoupon) => set((state) => ({
        coupons: state.coupons.map(c => c.id === updatedCoupon.id ? updatedCoupon : c)
      })),
      deleteCoupon: (id) => set((state) => ({
        coupons: state.coupons.filter(c => c.id !== id)
      })),

      updateLoyalty: (loyaltyConfig) => set({ loyaltyConfig }),
    }),
    {
      name: 'scomhub-promotion-storage',
    }
  )
);
