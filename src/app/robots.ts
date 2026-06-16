
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/vendor/dashboard/', '/account/'],
    },
    sitemap: 'https://scomhub.vn/sitemap.xml',
  };
}
