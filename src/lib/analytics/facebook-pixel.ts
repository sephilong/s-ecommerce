
/**
 * Facebook Pixel Utility for E-commerce tracking.
 */

declare global {
  interface Window { fbq: any; }
}

export function trackFbPixelEvent(event: string, params?: object) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, params);
}

export const FbPixelEvents = {
  viewContent: (product: any) => trackFbPixelEvent('ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: 'VND',
  }),
  addToCart: (product: any, quantity: number) => trackFbPixelEvent('AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price * quantity,
    currency: 'VND',
    num_items: quantity,
  }),
  initiateCheckout: (value: number, itemIds: string[]) => trackFbPixelEvent('InitiateCheckout', {
    content_ids: itemIds,
    value: value,
    currency: 'VND',
  }),
  purchase: (order: any) => trackFbPixelEvent('Purchase', {
    content_ids: order.items.map((i: any) => i.productId),
    content_type: 'product',
    value: order.total,
    currency: 'VND',
    num_items: order.items.length,
    order_id: order.id,
  }),
  search: (query: string) => trackFbPixelEvent('Search', {
    search_string: query,
    content_category: 'product',
  }),
};
