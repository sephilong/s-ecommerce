
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  role: 'user' | 'affiliate' | 'reseller';
  affiliateStatus: 'none' | 'pending' | 'active';
  affiliateCode?: string;
};

interface UserState {
  profile: UserProfile | null;
  collectedCouponIds: string[];
  updateProfile: (profile: Partial<UserProfile>) => void;
  collectCoupon: (couponId: string) => void;
  hasCollected: (couponId: string) => boolean;
  requestAffiliate: () => void;
  setAffiliateActive: (code: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: {
        firstName: "Khách",
        lastName: "Hàng",
        phone: "",
        address: "",
        role: "user",
        affiliateStatus: "none"
      },
      collectedCouponIds: [],
      updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : null
      })),
      collectCoupon: (couponId) => {
        const current = get().collectedCouponIds;
        if (!current.includes(couponId)) {
          set({ collectedCouponIds: [...current, couponId] });
        }
      },
      hasCollected: (couponId) => {
        return get().collectedCouponIds.includes(couponId);
      },
      requestAffiliate: () => set((state) => ({
        profile: state.profile ? { ...state.profile, affiliateStatus: "pending" } : null
      })),
      setAffiliateActive: (code) => set((state) => ({
        profile: state.profile ? { 
          ...state.profile, 
          role: "affiliate", 
          affiliateStatus: "active",
          affiliateCode: code
        } : null
      }))
    }),
    {
      name: 'scomhub-user-storage',
    }
  )
);
