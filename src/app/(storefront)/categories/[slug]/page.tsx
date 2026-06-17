
import { getTenantConfig } from "@/lib/tenant";
import { CategoryPageClient } from "./CategoryPageClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { categoryJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryMap: Record<string, string> = {
  'dien-tu': 'Điện tử',
  'phu-kien': 'Phụ kiện',
  'gia-dung': 'Gia dụng',
  'thoi-trang': 'Thời trang'
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = categoryMap[slug];
  const tenant = await getTenantConfig("demo");

  if (!categoryName) return { title: 'Danh mục không tồn tại' };

  return {
    title: `${categoryName} | ${tenant.storeName}`,
    description: `Khám phá các sản phẩm ${categoryName} chất lượng cao tại ${tenant.storeName}.`,
    openGraph: {
      title: categoryName,
      description: `Mua sắm sản phẩm ${categoryName} tốt nhất.`,
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName = categoryMap[slug];
  const tenant = await getTenantConfig("demo");

  if (!categoryName) return notFound();

  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;
  const url = `${baseUrl}/categories/${slug}`;
  const products = tenant.products.filter(p => p.category === categoryName);

  return (
    <>
      <JsonLd data={categoryJsonLd(categoryName, products, url)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Trang chủ', url: `${baseUrl}/` },
        { name: categoryName, url },
      ])} />
      <CategoryPageClient 
        slug={slug} 
        categoryName={categoryName} 
        initialTenant={tenant} 
      />
    </>
  );
}
