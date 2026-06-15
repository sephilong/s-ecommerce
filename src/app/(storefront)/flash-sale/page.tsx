
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { headers } from "next/headers";
import { Timer } from "lucide-react";

export default async function FlashSalePage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  const flashSaleProducts = tenant.products.filter(p => p.compareAtPrice);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-primary to-accent rounded-[2rem] p-12 mb-12 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-bold">
            <Timer className="w-5 h-5" />
            <span>Kết thúc sau: 05:24:12</span>
          </div>
          <h1 className="text-5xl font-bold text-white font-headline">Flash Sale Cuối Tuần</h1>
          <p className="text-white/80 text-xl max-w-xl">Cơ hội sở hữu những siêu phẩm công nghệ với giá ưu đãi cực sốc. Chỉ áp dụng trong thời gian giới hạn.</p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)]" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {flashSaleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
