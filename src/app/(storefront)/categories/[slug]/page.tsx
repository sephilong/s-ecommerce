
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  
  // Simple mapping for demo
  const categoryName = params.slug === 'dien-tu' ? 'Điện tử' : params.slug === 'phu-kien' ? 'Phụ kiện' : null;
  if (!categoryName) return notFound();

  const filteredProducts = tenant.products.filter(p => p.category === categoryName);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold font-headline mb-2">{categoryName}</h1>
        <p className="text-muted-foreground">Khám phá các sản phẩm trong danh mục {categoryName}.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
