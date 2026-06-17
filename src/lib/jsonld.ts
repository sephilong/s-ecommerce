
import { Product, Tenant } from "./store-data";

/** Trang sản phẩm */
export function productJsonLd(product: Product, tenant: Tenant) {
  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription ?? product.description,
    sku: product.sku || product.id,
    image: [product.image],
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand.name,
    } : { '@type': 'Brand', name: tenant.storeName },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: 'VND',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: tenant.storeName },
    },
    ...(product.reviewCount && product.reviewCount > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.ratingAverage || 5,
        reviewCount: product.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    } : {}),
  };
}

/** Breadcrumb — dùng cho mọi trang có path */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Trang danh mục / listing */
export function categoryJsonLd(categoryName: string, products: Product[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    url,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        url: `${url.split('/categories')[0]}/products/${p.slug}`,
        image: p.image,
        offers: { '@type': 'Offer', price: p.price, priceCurrency: 'VND' },
      },
    })),
  };
}

/** Organization — trang chủ & footer */
export function organizationJsonLd(tenant: Tenant) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: tenant.storeName,
    url: `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`,
    logo: tenant.logoUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: tenant.contactPhone,
      contactType: 'customer service',
      availableLanguage: 'Vietnamese',
    },
    sameAs: [
      tenant.socialCommerce.socialLinks?.facebook,
      tenant.socialCommerce.socialLinks?.zalo,
      tenant.socialCommerce.socialLinks?.tiktok,
    ].filter(Boolean),
  };
}

/** WebSite — cho homepage, enable Sitelinks Searchbox */
export function websiteJsonLd(tenant: Tenant) {
  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: tenant.storeName,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${baseUrl}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** FAQ — cho trang hỗ trợ hoặc sản phẩm */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
