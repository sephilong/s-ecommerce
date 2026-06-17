
import { MetadataRoute } from 'next';
import { MOCK_TENANTS } from '@/lib/store-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const tenant = MOCK_TENANTS[0];
  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;

  // Base routes
  const routes = ['', '/products', '/flash-sale', '/blog', '/search'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes = tenant.products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Categories
  const categories = ["Điện tử", "Phụ kiện", "Gia dụng", "Thời trang"];
  const categoryRoutes = categories.map(cat => ({
    url: `${baseUrl}/categories/${cat.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...productRoutes, ...categoryRoutes];
}
