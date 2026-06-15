
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { headers } from "next/headers";

export default async function HomePage() {
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  const heroImage = PlaceHolderImages[0];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-40"
            priority
            data-ai-hint="electronics banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
              <Star className="w-4 h-4 fill-primary" />
              <span>Thương hiệu uy tín hàng đầu</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight">
              {tenant.description.split(' ').slice(0, 2).join(' ')} <span className="gradient-text">Hiện Đại</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Khám phá bộ sưu tập những sản phẩm công nghệ mới nhất tại {tenant.name}.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="rounded-full px-8 gap-2 group">
                Mua sắm ngay
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
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
          <h2 className="text-3xl font-bold mb-12 font-headline">Sản phẩm Mới nhất</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenant.products.map((product) => (
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
