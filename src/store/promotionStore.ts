
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Promotion, Coupon, LoyaltyConfig, MOCK_TENANTS } from '@/lib/store-data';

interface PromotionState {
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyConfig: LoyaltyConfig;
  updatePromotions: (promotions: Promotion[]) => void;
  updateCoupons: (coupons: Coupon[]) => void;
  updateLoyalty: (config: LoyaltyConfig) => void;
}

export const usePromotionStore = create<PromotionState>()(
  persist(
    (set) => ({
      promotions: MOCK_TENANTS[0].promotions,
      coupons: MOCK_TENANTS[0].coupons,
      loyaltyConfig: MOCK_TENANTS[0].loyaltyConfig,
      updatePromotions: (promotions) => set({ promotions }),
      updateCoupons: (coupons) => set({ coupons }),
      updateLoyalty: (loyaltyConfig) => set({ loyaltyConfig }),
    }),
    {
      name: 'scomhub-promotion-storage',
    }
  )
);
