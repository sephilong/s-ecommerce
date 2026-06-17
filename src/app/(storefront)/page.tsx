
"use client";

import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { Star, ShieldCheck, Truck, ArrowRight, Zap } from "lucide-react";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import Link from "next/link";
import { usePromotionStore } from "@/store/promotionStore";
import { useEffect, useState } from "react";
import { Tenant } from "@/lib/store-data";
import { Button } from "@/components/ui/button";

export default function StorefrontHomePage() {
  const { promotions } = usePromotionStore();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [flashSale, setFlashSale] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const fetchData = async () => {
      const config = await getTenantConfig("demo");
      setTenant(config);
    };
    fetchData();

    const activeFlashSale = promotions.find(p => p.type === 'flash_sale' && p.isActive);
    if (activeFlashSale) {
      setFlashSale(activeFlashSale);
      const timer = setInterval(() => {
        const end = new Date(activeFlashSale.config.endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;
        if (diff <= 0) return clearInterval(timer);
        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft({ h, m, s });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [promotions]);

  if (!tenant) return null;
  
  return (
    <div className="space-y-20 animate-in fade-in duration-700">
      <section className="relative">
        <HeroCarousel banners={tenant.banners} />
      </section>

      <section className="border-y border-white/5 bg-card/30 py-10">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem icon={<Truck />} title="Giao hàng hỏa tốc" desc="Nhận hàng siêu tốc toàn quốc." />
          <FeatureItem icon={<ShieldCheck />} title="Bảo hành 12 tháng" desc="Hỗ trợ 1 đổi 1 trong 30 ngày." />
          <FeatureItem icon={<Star />} title="Ưu đãi Premium" desc="Tích điểm đổi quà không giới hạn." />
        </div>
      </section>

      {flashSale && flashSale.config.products?.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/20 rounded-[2.5rem] p-10 overflow-hidden relative group">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 relative z-10">
              <div className="flex items-center gap-6">
                <Zap className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse" />
                <div>
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase">FLASH SALE</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <TimeBox value={timeLeft.h} label="h" />
                    <span className="font-bold">:</span>
                    <TimeBox value={timeLeft.m} label="m" />
                    <span className="font-bold">:</span>
                    <TimeBox value={timeLeft.s} label="s" />
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" className="rounded-full border-orange-500/50 text-orange-500">
                <Link href="/flash-sale">Săn deal ngay &rarr;</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {flashSale.config.products.slice(0, 4).map((saleItem: any) => {
                const product = tenant.products.find(p => p.id === saleItem.productId);
                if (!product) return null;
                const flashProduct = { ...product, price: saleItem.salePrice, compareAtPrice: product.price };
                return <ProductCard key={product.id} product={flashProduct} />;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-20">
         <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-10">Sản phẩm mới nhất</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenant.products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
         </div>
         <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full px-12 h-14 font-black italic uppercase shadow-xl shadow-primary/20">
               <Link href="/products">Xem tất cả sản phẩm &rarr;</Link>
            </Button>
         </div>
      </section>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-5 p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-primary/5 hover:border-primary/20 transition-all group">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">{icon}</div>
      <div><h3 className="font-bold text-lg">{title}</h3><p className="text-sm text-muted-foreground">{desc}</p></div>
    </div>
  );
}

function TimeBox({ value, label }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-orange-600 text-white font-black h-10 w-10 rounded-xl flex items-center justify-center shadow-lg">{value}</div>
      <span className="text-[9px] font-bold text-muted-foreground uppercase mt-1">{label}</span>
    </div>
  );
}
