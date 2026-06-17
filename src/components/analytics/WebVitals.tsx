
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals({ ga4Id }: { ga4Id?: string }) {
  useReportWebVitals((metric) => {
    if (ga4Id && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'web_vitals',
        metric_name: metric.name,          // LCP, FID, CLS, TTFB, FCP
        metric_value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_rating: metric.rating,      // 'good' | 'needs-improvement' | 'poor'
        metric_delta: metric.delta,
      });
    }
    
    if (metric.rating === 'poor') {
      console.warn(`[Core Web Vitals] Poor ${metric.name}: ${metric.value}`, metric);
    }
  });

  return null;
}
