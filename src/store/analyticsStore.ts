
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FbPixelEvents } from '@/lib/analytics/facebook-pixel';

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
        // Source logic
        let eventSource = event.source;
        if (!eventSource && typeof window !== 'undefined') {
          const aff = localStorage.getItem('scomhub_affiliate_ref');
          if (aff) eventSource = 'affiliate';
          else eventSource = 'organic';
        }

        // Facebook Pixel Mapping
        if (event.type === 'add_to_cart' && event.productId) {
          FbPixelEvents.addToCart({ id: event.productId, name: event.productName, price: event.value }, 1);
        } else if (event.type === 'begin_checkout') {
          FbPixelEvents.initiateCheckout(event.value || 0, []);
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
          ].slice(0, 2000)
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
      name: 'scomhub-analytics-v2',
    }
  )
);
