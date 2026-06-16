
import { MetadataRoute } from 'next';
import { MOCK_TENANTS } from '@/lib/store-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = MOCK_TENANTS[0];
  const baseUrl = 'https://scomhub.vn';

  // Base routes
  const routes = ['', '/products', '/flash-sale', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Dynamic product routes
  const productRoutes = tenant.products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.createdAt).toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...productRoutes];
}
