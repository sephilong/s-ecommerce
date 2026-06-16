
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

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  accountInfo: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface AffiliateRequest {
  id: string;
  userId: string;
  userName: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface AffiliateState {
  conversions: AffiliateConversion[];
  links: AffiliateLink[];
  payoutRequests: PayoutRequest[];
  affiliateRequests: AffiliateRequest[];
  stats: {
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    balance: number;
  };
  
  // Actions
  addConversion: (conv: AffiliateConversion) => void;
  updateConversionStatus: (id: string, status: AffiliateConversion['status']) => void;
  addLink: (link: AffiliateLink) => void;
  incrementClick: (code: string) => void;
  
  // Requests & Payouts
  submitAffiliateRequest: (req: AffiliateRequest) => void;
  updateAffiliateRequest: (id: string, status: AffiliateRequest['status']) => void;
  requestPayout: (payout: PayoutRequest) => void;
  updatePayoutStatus: (id: string, status: PayoutRequest['status']) => void;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set, get) => ({
      conversions: [],
      links: [],
      payoutRequests: [],
      affiliateRequests: [],
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
      updateConversionStatus: (id, status) => set((state) => {
        const conv = state.conversions.find(c => c.id === id);
        // If status changes to rejected, adjust balance
        let balanceAdjustment = 0;
        if (status === 'rejected' && conv?.status !== 'rejected') balanceAdjustment = -conv!.commission;
        
        return {
          conversions: state.conversions.map(c => c.id === id ? { ...c, status } : c),
          stats: { ...state.stats, balance: state.stats.balance + balanceAdjustment }
        };
      }),
      addLink: (link) => set((state) => ({
        links: [link, ...state.links]
      })),
      incrementClick: (code) => {
        const links = get().links;
        set({
          links: links.map(l => l.code === code ? { ...l, clicks: l.clicks + 1 } : l),
          stats: { ...get().stats, totalClicks: get().stats.totalClicks + 1 }
        });
      },
      submitAffiliateRequest: (req) => set((state) => ({
        affiliateRequests: [req, ...state.affiliateRequests]
      })),
      updateAffiliateRequest: (id, status) => set((state) => ({
        affiliateRequests: state.affiliateRequests.map(r => r.id === id ? { ...r, status } : r)
      })),
      requestPayout: (payout) => set((state) => ({
        payoutRequests: [payout, ...state.payoutRequests],
        stats: { ...state.stats, balance: state.stats.balance - payout.amount }
      })),
      updatePayoutStatus: (id, status) => set((state) => ({
        payoutRequests: state.payoutRequests.map(p => p.id === id ? { ...p, status } : p)
      }))
    }),
    {
      name: 'scomhub-affiliate-storage',
    }
  )
);
