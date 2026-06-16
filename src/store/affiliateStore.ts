
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AffiliateConversion {
  id: string;
  orderId: string;
  affiliateCode: string;
  productName: string;
  amount: number;
  commission: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected' | 'refunded';
  clickTime: string;
  orderTime: string;
  approveTime?: string;
  paidTime?: string;
  attributionDays: number;
  createdAt: string;
}

export interface AffiliateLink {
  id: string;
  productId: string;
  productName: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
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

export interface AffiliateTransaction {
  id: string;
  type: 'commission' | 'withdraw' | 'adjustment' | 'refund';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface ClickLog {
  id: string;
  code: string;
  ip: string;
  device: string;
  browser: string;
  timestamp: string;
}

interface AffiliateState {
  conversions: AffiliateConversion[];
  links: AffiliateLink[];
  payoutRequests: PayoutRequest[];
  affiliateRequests: AffiliateRequest[];
  transactions: AffiliateTransaction[];
  clickLogs: ClickLog[];
  stats: {
    totalClicks: number;
    totalConversions: number;
    totalEarnings: number;
    balance: number;
    pendingCommission: number;
    paidCommission: number;
  };
  
  // Actions
  addConversion: (conv: AffiliateConversion) => void;
  updateConversionStatus: (id: string, status: AffiliateConversion['status']) => void;
  addLink: (link: AffiliateLink) => void;
  deleteLink: (id: string) => void;
  logClick: (log: ClickLog) => void;
  
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
      transactions: [],
      clickLogs: [],
      stats: {
        totalClicks: 0,
        totalConversions: 0,
        totalEarnings: 0,
        balance: 0,
        pendingCommission: 0,
        paidCommission: 0,
      },
      addConversion: (conv) => set((state) => {
        const newConversions = [conv, ...state.conversions];
        const newStats = {
          ...state.stats,
          totalConversions: state.stats.totalConversions + 1,
          pendingCommission: state.stats.pendingCommission + conv.commission,
        };
        return { conversions: newConversions, stats: newStats };
      }),
      updateConversionStatus: (id, status) => set((state) => {
        const conv = state.conversions.find(c => c.id === id);
        if (!conv) return state;

        let { balance, pendingCommission, paidCommission, totalEarnings } = state.stats;
        
        if (status === 'approved' && conv.status === 'pending') {
          pendingCommission -= conv.commission;
          balance += conv.commission;
          totalEarnings += conv.commission;
          // Add transaction
          const tx: AffiliateTransaction = {
            id: `tx-${Date.now()}`,
            type: 'commission',
            amount: conv.commission,
            description: `Hoa hồng đơn hàng #${conv.orderId}`,
            status: 'completed',
            createdAt: new Date().toISOString()
          };
          state.transactions = [tx, ...state.transactions];
        } else if (status === 'paid' && conv.status === 'approved') {
          // Logic usually handled via payout
        } else if (status === 'rejected' && conv.status === 'pending') {
          pendingCommission -= conv.commission;
        }

        return {
          conversions: state.conversions.map(c => c.id === id ? { ...c, status, approveTime: status === 'approved' ? new Date().toISOString() : c.approveTime } : c),
          stats: { ...state.stats, balance, pendingCommission, paidCommission, totalEarnings }
        };
      }),
      addLink: (link) => set((state) => ({
        links: [link, ...state.links]
      })),
      deleteLink: (id) => set((state) => ({
        links: state.links.filter(l => l.id !== id)
      })),
      logClick: (log) => set((state) => ({
        clickLogs: [log, ...state.clickLogs],
        stats: { ...state.stats, totalClicks: state.stats.totalClicks + 1 }
      })),
      submitAffiliateRequest: (req) => set((state) => ({
        affiliateRequests: [req, ...state.affiliateRequests]
      })),
      updateAffiliateRequest: (id, status) => set((state) => ({
        affiliateRequests: state.affiliateRequests.map(r => r.id === id ? { ...r, status } : r)
      })),
      requestPayout: (payout) => set((state) => {
        const tx: AffiliateTransaction = {
          id: `tx-po-${Date.now()}`,
          type: 'withdraw',
          amount: payout.amount,
          description: `Rút tiền về ${payout.bankName}`,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        return {
          payoutRequests: [payout, ...state.payoutRequests],
          transactions: [tx, ...state.transactions],
          stats: { ...state.stats, balance: state.stats.balance - payout.amount }
        };
      }),
      updatePayoutStatus: (id, status) => set((state) => {
        const payout = state.payoutRequests.find(p => p.id === id);
        if (status === 'paid' && payout) {
          state.stats.paidCommission += payout.amount;
        } else if (status === 'rejected' && payout) {
          state.stats.balance += payout.amount;
        }
        return {
          payoutRequests: state.payoutRequests.map(p => p.id === id ? { ...p, status } : p)
        };
      })
    }),
    {
      name: 'scomhub-affiliate-storage-v2',
    }
  )
);
