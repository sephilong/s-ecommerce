
import { getTenantConfig } from "@/lib/tenant";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";

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

  const url = `https://scomhub.vn/products/${product.slug}`;

  return {
    title: product.name,
    description: product.description.substring(0, 160),
    openGraph: {
      type: 'website',
      url: url,
      title: `${product.name} | S-Com Hub`,
      description: product.description.substring(0, 160),
      images: [{ url: product.image, width: 1200, height: 630 }],
      locale: 'vi_VN',
    },
    other: {
      'product:price:amount': String(product.price),
      'product:price:currency': 'VND',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand?.name || 'S-Com Hub',
      'zalo:og:url': url
    }
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tenant = await getTenantConfig("demo");
  const product = tenant.products.find(p => p.slug === slug);

  if (!product) return notFound();

  // Structured Data for Product
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.brand?.name || "S-Com Hub"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://scomhub.vn/products/${product.slug}`,
      "priceCurrency": "VND",
      "price": product.price,
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductDetailClient slug={slug} initialProduct={product} initialTenant={tenant} />
    </>
  );
}
