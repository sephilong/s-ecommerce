
import { MetadataRoute } from 'next';
import { MOCK_TENANTS } from '@/lib/store-data';

export default function robots(): MetadataRoute.Robots {
  const tenant = MOCK_TENANTS[0];
  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/vendor/', '/account/', '/api/', '/checkout-vendor/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
