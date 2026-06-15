
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { headers } from "next/headers";

export default async function ProductsPage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-headline mb-2">Tất cả sản phẩm</h1>
          <p className="text-muted-foreground">Khám phá danh mục công nghệ đa dạng tại {tenant.name}.</p>
        </div>
        <div className="flex gap-4">
          {/* Filters could go here */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tenant.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
