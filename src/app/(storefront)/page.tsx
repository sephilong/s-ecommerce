
"use client";

import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { Star, ShieldCheck, Truck, ArrowRight, Zap, Ticket, Gift, Tag } from "lucide-react";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import Link from "next/link";
import { usePromotionStore } from "@/store/promotionStore";
import { useEffect, useState } from "react";
import { Tenant, Product } from "@/lib/store-data";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { promotions, coupons } = usePromotionStore();
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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative">
        <HeroCarousel banners={tenant.banners} />
      </section>

      {/* Features Bar */}
      <section className="border-y border-white/5 bg-card/30 py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureItem icon={<Truck />} title="Giao hàng hỏa tốc" desc="Nhận hàng từ 2-5 ngày." />
          <FeatureItem icon={<ShieldCheck />} title="Bảo hành 12 tháng" desc="Cam kết chính hãng 100%." />
          <FeatureItem icon={<Star />} title="Ưu đãi thành viên" desc="Tích điểm đổi quà hấp dẫn." />
        </div>
      </section>

      {/* Flash Sale Section */}
      {flashSale && flashSale.config.products?.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
          <div className="container mx-auto px-4">
            <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-10 h-10 text-orange-500 fill-orange-500 animate-bounce" />
                    <h2 className="text-4xl font-bold font-headline italic tracking-tighter uppercase">Flash Sale</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Kết thúc sau:</span>
                    <div className="flex items-center gap-2">
                      <TimeBox value={timeLeft.h} label="giờ" />
                      <span className="font-bold text-primary animate-pulse">:</span>
                      <TimeBox value={timeLeft.m} label="phút" />
                      <span className="font-bold text-primary animate-pulse">:</span>
                      <TimeBox value={timeLeft.s} label="giây" />
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary/10">
                  <Link href="/flash-sale">Xem toàn bộ deal <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {flashSale.config.products.slice(0, 4).map((saleItem: any) => {
                  const product = tenant.products.find(p => p.id === saleItem.productId);
                  if (!product) return null;
                  const flashProduct = { ...product, price: saleItem.salePrice, compareAtPrice: product.price };
                  return (
                    <div key={product.id} className="relative">
                      <ProductCard product={flashProduct} />
                      <div className="mt-4 px-4">
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative">
                          <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-1000" 
                            style={{ width: `${Math.floor(Math.random() * 60 + 20)}%` }} 
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white uppercase italic">Sắp cháy hàng</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Coupon Discovery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
              <Ticket className="w-8 h-8 text-primary" /> Voucher dành cho bạn
            </h2>
            <p className="text-muted-foreground">Lưu mã để sử dụng khi thanh toán.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.filter(c => c.isActive).slice(0, 3).map(coupon => (
              <div key={coupon.id} className="group bg-card/50 border border-white/5 p-6 rounded-3xl relative overflow-hidden hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-full">Code: {coupon.code}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{coupon.discountType === 'percent' ? `Giảm ${coupon.discountValue}%` : `Giảm ${formatVND(coupon.discountValue)}`}</h3>
                <p className="text-xs text-muted-foreground mb-6 line-clamp-1">{coupon.description}</p>
                <Button className="w-full rounded-full h-10 group-hover:bg-primary group-hover:text-white" variant="secondary">Thu thập ngay</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-headline mb-2">Siêu phẩm Mới</h2>
              <p className="text-muted-foreground">Khám phá các sản phẩm công nghệ vừa cập bến.</p>
            </div>
            <Link href="/products" className="text-primary font-semibold hover:underline flex items-center gap-1">
              Khám phá tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tenant.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Other Promotions Section */}
      {promotions.filter(p => p.type !== 'flash_sale' && p.isActive).length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotions.filter(p => p.type !== 'flash_sale' && p.isActive).slice(0, 2).map((promo, idx) => (
                <div key={promo.id} className={`p-10 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between h-72 ${idx === 0 ? 'bg-indigo-600 text-white' : 'bg-primary text-white'}`}>
                  <div className="relative z-10 space-y-4">
                    <Badge variant="outline" className="border-white/30 text-white rounded-full bg-white/10">{promo.type.toUpperCase()}</Badge>
                    <h3 className="text-3xl font-bold font-headline">{promo.name}</h3>
                    <p className="text-white/80 max-w-xs">{promo.description}</p>
                  </div>
                  <div className="relative z-10">
                    <Button asChild variant="secondary" className="rounded-full px-8">
                      <Link href="/products">Sắm ngay &rarr;</Link>
                    </Button>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
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

function TimeBox({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-primary text-white font-bold h-10 w-10 rounded-xl flex items-center justify-center text-lg shadow-lg shadow-primary/20">
        {value}
      </div>
      <span className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-widest">{label}</span>
    </div>
  );
}

function Badge({ children, className, variant }: any) {
  return <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold ${className}`}>{children}</span>;
}
