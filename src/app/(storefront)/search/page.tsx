
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { headers } from "next/headers";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  const query = searchParams.q || "";
  
  const filteredProducts = tenant.products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto mb-16 text-center space-y-6">
        <h1 className="text-4xl font-bold font-headline">Tìm kiếm sản phẩm</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            className="h-14 pl-12 rounded-full bg-card/50 border-white/10 text-lg" 
            placeholder="Nhập tên sản phẩm bạn đang tìm..." 
            defaultValue={query}
          />
        </div>
        {query && (
          <p className="text-muted-foreground">Tìm thấy {filteredProducts.length} kết quả cho từ khóa "<span className="text-primary font-bold">{query}</span>"</p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 opacity-50">
          <Search className="w-16 h-16 mx-auto mb-4" />
          <p>Rất tiếc, chúng tôi không tìm thấy sản phẩm nào khớp với yêu cầu của bạn.</p>
        </div>
      ) : null}
    </div>
  );
}
