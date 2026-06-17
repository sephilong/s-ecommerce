
import { getTenantConfig } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { productJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getTenantConfig("demo");
  const product = tenant.products.find(p => p.slug === slug);

  if (!product) return { title: 'Sản phẩm không tồn tại' };

  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;
  const url = `${baseUrl}/products/${product.slug}`;

  return {
    title: product.seoTitle ?? `${product.name} | ${tenant.storeName}`,
    description: product.seoDescription ?? (product.shortDescription || product.description.substring(0, 160)),
    keywords: product.seoKeywords?.join(', '),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url: url,
      title: product.seoTitle ?? product.name,
      description: product.seoDescription ?? product.description.substring(0, 160),
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
      locale: 'vi_VN',
    },
    other: {
      'og:type': 'product',
      'product:price:amount': String(product.price),
      'product:price:currency': 'VND',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand?.name || tenant.storeName,
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await getTenantConfig("demo");
  const product = tenant.products.find(p => p.slug === slug);

  if (!product) return notFound();

  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;

  return (
    <>
      <JsonLd data={productJsonLd(product, tenant)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Trang chủ', url: `${baseUrl}/` },
        { name: product.category, url: `${baseUrl}/categories/${product.category.toLowerCase().replace(/\s+/g, '-')}` },
        { name: product.name, url: `${baseUrl}/products/${product.slug}` },
      ])} />
      <ProductDetailClient slug={slug} initialProduct={product} initialTenant={tenant} />
    </>
  );
}
