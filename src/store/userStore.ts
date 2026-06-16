
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
};

interface UserState {
  profile: UserProfile | null;
  collectedCouponIds: string[];
  updateProfile: (profile: UserProfile) => void;
  collectCoupon: (couponId: string) => void;
  hasCollected: (couponId: string) => boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      collectedCouponIds: [],
      updateProfile: (profile) => set({ profile }),
      collectCoupon: (couponId) => {
        const current = get().collectedCouponIds;
        if (!current.includes(couponId)) {
          set({ collectedCouponIds: [...current, couponId] });
        }
      },
      hasCollected: (couponId) => {
        return get().collectedCouponIds.includes(couponId);
      },
    }),
    {
      name: 'scomhub-user-storage',
    }
  )
);
