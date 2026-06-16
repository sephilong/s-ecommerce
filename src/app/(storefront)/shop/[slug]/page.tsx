
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Store, Star, Users, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { useMemo, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

export default function VendorShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { vendors, vendorProducts } = useVendorStore();

  const vendor = useMemo(() => vendors.find(v => v.storeSlug === slug), [vendors, slug]);
  
  if (!vendor) return notFound();

  // Lọc sản phẩm của vendor này
  const shopProducts = vendorProducts.filter(p => p.vendorId === vendor.id && p.status === 'approved');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Vendor Header */}
      <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
          <div className="h-32 w-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
             {vendor.storeLogo ? (
               <Image src={vendor.storeLogo} alt={vendor.storeName} width={100} height={100} className="rounded-2xl object-cover" />
             ) : (
               <Store className="w-16 h-16 text-primary" />
             )}
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">{vendor.storeName}</h1>
              <Badge className="bg-primary/20 text-primary border-none gap-1 py-1 px-3">
                <CheckCircle2 className="w-3 h-3" /> Official Store
              </Badge>
            </div>
            
            <p className="text-muted-foreground max-w-2xl">{vendor.storeDescription}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2 font-bold text-yellow-500">
                <Star className="w-4 h-4 fill-yellow-500" /> 4.9/5.0 <span className="text-muted-foreground font-normal">(1.2k Đánh giá)</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" /> 12.5k Người theo dõi
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" /> Tham gia từ {new Date(vendor.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold font-headline italic">SẢN PHẨM CỦA SHOP ({shopProducts.length})</h2>
        </div>

        {shopProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shopProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-muted/10 rounded-[2.5rem] border border-dashed border-white/10">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground italic">Shop hiện chưa có sản phẩm nào được đăng bán.</p>
          </div>
        )}
      </div>
    </div>
  );
}
