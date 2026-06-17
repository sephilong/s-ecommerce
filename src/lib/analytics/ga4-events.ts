
'use client';

/**
 * GA4 Enhanced Ecommerce Events Utility
 */

type GA4Event =
  | 'view_item' | 'add_to_cart' | 'remove_from_cart'
  | 'view_cart' | 'begin_checkout' | 'add_payment_info'
  | 'add_shipping_info' | 'purchase' | 'refund'
  | 'view_item_list' | 'select_item' | 'search';

declare global {
  interface Window { dataLayer: any[]; }
}

export function pushGA4Event(event: GA4Event, params: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  
  // Clear previous ecommerce object to prevent bleed through
  window.dataLayer.push({ ecommerce: null });
  
  window.dataLayer.push({
    event,
    ecommerce: params
  });
}
