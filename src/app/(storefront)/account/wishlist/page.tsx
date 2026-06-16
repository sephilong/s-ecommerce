
"use client";

import { useUserStore } from "@/store/userStore";
import { getTenantBySubdomain } from "@/lib/store-data";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function WishlistPage() {
  const { wishlistIds } = useUserStore();
  const tenant = getTenantBySubdomain("demo");

  const wishlistProducts = useMemo(() => {
    return tenant.products.filter(p => wishlistIds.includes(p.id));
  }, [wishlistIds, tenant.products]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">Sản phẩm yêu thích</h1>
          <p className="text-muted-foreground">Danh sách các sản phẩm bạn đã lưu để mua sau.</p>
        </div>
        {wishlistProducts.length > 0 && (
          <p className="text-xs font-bold uppercase tracking-widest text-primary italic">
            Tổng cộng: {wishlistProducts.length} sản phẩm
          </p>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-card/20 rounded-[2.5rem] border border-dashed border-white/10 space-y-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <Heart className="w-10 h-10 text-primary opacity-20" />
          </div>
          <div className="space-y-2">
            <p className="text-lg font-bold italic uppercase tracking-widest">Danh sách yêu thích đang trống</p>
            <p className="text-muted-foreground max-w-sm mx-auto">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi và thêm vào danh sách này.</p>
          </div>
          <Button asChild className="rounded-full px-10 h-12 font-black italic uppercase tracking-tighter shadow-xl shadow-primary/20">
            <Link href="/products">Khám phá ngay <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      )}
    </div>
  );
}
