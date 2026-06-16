
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AffiliateConversion {
  id: string;
  orderId: string;
  affiliateCode: string;
  amount: number;
  commission: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  code: string;
  clicks: number;
  conversions: number;
  earnings: number;
}

interface AffiliateState {
  conversions: AffiliateConversion[];
  links: AffiliateLink[];
  stats: {
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    balance: number;
  };
  addConversion: (conv: AffiliateConversion) => void;
  updateConversionStatus: (id: string, status: AffiliateConversion['status']) => void;
  addLink: (link: AffiliateLink) => void;
  incrementClick: (code: string) => void;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set, get) => ({
      conversions: [],
      links: [],
      stats: {
        totalClicks: 0,
        totalConversions: 0,
        totalEarnings: 0,
        balance: 0,
      },
      addConversion: (conv) => set((state) => ({
        conversions: [conv, ...state.conversions],
        stats: {
          ...state.stats,
          totalConversions: state.stats.totalConversions + 1,
          totalEarnings: state.stats.totalEarnings + conv.commission,
          balance: state.stats.balance + conv.commission,
        }
      })),
      updateConversionStatus: (id, status) => set((state) => ({
        conversions: state.conversions.map(c => c.id === id ? { ...c, status } : c)
      })),
      addLink: (link) => set((state) => ({
        links: [link, ...state.links]
      })),
      incrementClick: (code) => {
        const links = get().links;
        set({
          links: links.map(l => l.code === code ? { ...l, clicks: l.clicks + 1 } : l),
          stats: { ...get().stats, totalClicks: get().stats.totalClicks + 1 }
        });
      }
    }),
    {
      name: 'scomhub-affiliate-storage',
    }
  )
);
