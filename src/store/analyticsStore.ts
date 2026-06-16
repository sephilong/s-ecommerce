
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AnalyticsEvent {
  id: string;
  type: 'page_view' | 'add_to_cart' | 'begin_checkout' | 'purchase';
  productId?: string;
  productName?: string;
  category?: string;
  value?: number;
  timestamp: string;
  sessionId: string;
  source?: string; // 'organic', 'affiliate', 'ads'
}

interface AnalyticsState {
  events: AnalyticsEvent[];
  sessionId: string;
  logEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId'>) => void;
  getFunnelStats: () => {
    views: number;
    carts: number;
    checkouts: number;
    purchases: number;
  };
}

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set, get) => ({
      events: [],
      sessionId: `sess-${Math.random().toString(36).substring(7)}`,
      logEvent: (event) => set((state) => {
        // Lấy source từ localStorage nếu có (do logic affiliate đã lưu)
        let eventSource = event.source;
        if (!eventSource && typeof window !== 'undefined') {
          const aff = localStorage.getItem('scomhub_affiliate_ref');
          if (aff) eventSource = 'affiliate';
          else eventSource = 'organic';
        }

        return {
          events: [
            {
              ...event,
              source: eventSource,
              id: `ev-${Date.now()}-${Math.random().toString(36).substring(7)}`,
              timestamp: new Date().toISOString(),
              sessionId: state.sessionId
            },
            ...state.events
          ].slice(0, 2000) // Giữ tối đa 2000 sự kiện gần nhất
        };
      }),
      getFunnelStats: () => {
        const events = get().events;
        return {
          views: events.filter(e => e.type === 'page_view').length,
          carts: events.filter(e => e.type === 'add_to_cart').length,
          checkouts: events.filter(e => e.type === 'begin_checkout').length,
          purchases: events.filter(e => e.type === 'purchase').length,
        };
      }
    }),
    {
      name: 'scomhub-analytics-v1',
    }
  )
);
