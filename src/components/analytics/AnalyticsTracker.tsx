
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useAnalyticsStore } from '@/store/analyticsStore';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const logEvent = useAnalyticsStore((state) => state.logEvent);

  useEffect(() => {
    // Track Page View
    logEvent({
      type: 'page_view',
      productId: pathname.includes('/products/') ? pathname.split('/').pop() : undefined,
    });
    
    // Giả lập GA4/Meta Pixel Call
    if (window.dataLayer) {
      // window.dataLayer.push({ event: 'page_view', path: pathname });
    }
  }, [pathname, searchParams, logEvent]);

  return null; // Component ẩn, chỉ làm nhiệm vụ tracking
}
