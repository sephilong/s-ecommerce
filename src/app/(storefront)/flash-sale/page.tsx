
"use client";

import { useEffect, useState } from "react";
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { usePromotionStore } from "@/store/promotionStore";
import { Timer, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Tenant, Product } from "@/lib/store-data";

export default function FlashSalePage() {
  const { promotions } = usePromotionStore();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [flashSale, setFlashSale] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const config = await getTenantConfig("demo");
      setTenant(config);
      setLoading(false);
    };
    fetchData();

    const activeFlashSale = promotions.find(p => p.type === 'flash_sale' && p.isActive);
    if (activeFlashSale) {
      setFlashSale(activeFlashSale);
      const timer = setInterval(() => {
        const end = new Date(activeFlashSale.config.endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("00:00:00");
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0');
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
        const s = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [promotions]);

  if (loading) return <div className="container mx-auto p-24 text-center"><Loader2 className="animate-spin mx-auto w-10 h-10 text-primary" /></div>;

  if (!flashSale || flashSale.config.products?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6">
        <Zap className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
        <h1 className="text-3xl font-bold font-headline">Hiện không có Flash Sale</h1>
        <p className="text-muted-foreground">Vui lòng quay lại sau để săn những ưu đãi hấp dẫn nhất.</p>
      </div>
    );
  }

  const flashSaleProducts = flashSale.config.products.map((saleItem: any) => {
    const product = tenant?.products.find(p => p.id === saleItem.productId);
    if (!product) return null;
    return { ...product, price: saleItem.salePrice, compareAtPrice: product.price };
  }).filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-[2.5rem] p-12 mb-12 relative overflow-hidden shadow-2xl shadow-orange-500/20">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xl italic uppercase tracking-tighter shadow-xl">
            <Zap className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            <span>KẾT THÚC SAU: {timeLeft}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-headline leading-tight italic tracking-tighter">FLASH SALE <br /> CUỐI TUẦN</h1>
          <p className="text-white/80 text-xl max-w-xl">Cơ hội sở hữu những siêu phẩm công nghệ với giá ưu đãi cực sốc. Chỉ áp dụng trong thời gian giới hạn.</p>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] animate-pulse" />
        <Zap className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {flashSaleProducts.map((product: Product) => (
          <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ProductCard product={product} />
            <div className="mt-4 px-2">
               <div className="h-5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-600 to-red-500 transition-all duration-1000" 
                  style={{ width: `${Math.floor(Math.random() * 40 + 40)}%` }} 
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white uppercase italic tracking-widest">Đã bán {Math.floor(Math.random() * 20 + 10)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
