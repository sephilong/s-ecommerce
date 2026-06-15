
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
  updateProfile: (profile: UserProfile) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: null,
      updateProfile: (profile) => set({ profile }),
    }),
    {
      name: 'scomhub-user-storage',
    }
  )
);
