
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { Star, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { headers } from "next/headers";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import Link from "next/link";

export default async function HomePage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);

  return (
    <div className="flex flex-col">
      {/* Hero Section with Carousel */}
      <section className="relative">
        <HeroCarousel banners={tenant.banners} />
      </section>

      {/* Features */}
      <section className="border-y border-white/5 bg-card/30 py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem icon={<Truck />} title="Giao hàng hỏa tốc" desc="Nhận hàng từ 2-5 ngày." />
          <FeatureItem icon={<ShieldCheck />} title="Bảo hành 12 tháng" desc="Cam kết chính hãng 100%." />
          <FeatureItem icon={<Star />} title="Ưu đãi thành viên" desc="Tích điểm đổi quà hấp dẫn." />
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-2">Sản phẩm Mới nhất</h2>
              <p className="text-muted-foreground">Những siêu phẩm công nghệ vừa cập bến cửa hàng.</p>
            </div>
            <Link href="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenant.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
