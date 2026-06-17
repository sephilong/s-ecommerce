
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { formatVND } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  Heart, 
  Share2, 
  Check, 
  ChevronRight,
  Info
} from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { useUserStore } from "@/store/userStore";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Product, Tenant, ProductVariant } from "@/lib/store-data";

interface Props {
  slug: string;
  initialProduct: Product;
  initialTenant: Tenant;
}

export function ProductDetailClient({ slug, initialProduct, initialTenant }: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const { toggleWishlist, isInWishlist } = useUserStore();

  const isFavorite = isInWishlist(initialProduct.id);

  // Find active variant based on selected attributes
  const activeVariant = useMemo(() => {
    if (!initialProduct.hasVariants || !initialProduct.variants) return null;
    
    return initialProduct.variants.find(v => 
      Object.entries(selectedAttributes).every(([key, value]) => v.combination[key] === value) &&
      Object.keys(selectedAttributes).length === (initialProduct.attributes?.length || 0)
    );
  }, [selectedAttributes, initialProduct]);

  const displayPrice = activeVariant ? activeVariant.price : initialProduct.price;
  const displayComparePrice = activeVariant ? activeVariant.compareAtPrice : initialProduct.compareAtPrice;
  const displayImage = activeVariant?.image || initialProduct.image;
  const displaySku = activeVariant?.sku || "SKU-MAIN-STORE";

  const images = [
    displayImage,
    "https://picsum.photos/seed/p2/800/800",
    "https://picsum.photos/seed/p3/800/800",
    "https://picsum.photos/seed/p4/800/800",
  ];

  const [activeImage, setActiveImage] = useState(images[0]);

  const handleAttributeSelect = (name: string, value: string) => {
    setSelectedAttributes(prev => ({ ...prev, [name]: value }));
  };

  const relatedProducts = initialTenant.products
    .filter(p => p.category === initialProduct.category && p.id !== initialProduct.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12 space-y-16 animate-in fade-in duration-700">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/products" className="hover:text-primary">Sản phẩm</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary">{initialProduct.category}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: IMAGES */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 bg-card shadow-2xl group">
            <Image
              src={activeImage || displayImage}
              alt={initialProduct.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute top-4 right-4">
               <Button size="icon" variant="secondary" className="rounded-full shadow-xl" onClick={() => {
                 navigator.clipboard.writeText(window.location.href);
                 toast({ title: "Đã sao chép liên kết" });
               }}>
                 <Share2 className="w-4 h-4" />
               </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer transition-all bg-card",
                  activeImage === img ? "border-primary ring-2 ring-primary/20 scale-95" : "hover:border-primary/50"
                )}
                onClick={() => setActiveImage(img)}
              >
                 <Image src={img} alt="Thumb" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: CONTENT */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] px-3 py-1">
                {initialProduct.category}
              </Badge>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{displaySku}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-headline italic tracking-tighter uppercase leading-tight">
              {initialProduct.name}
            </h1>
            
            <div className="flex items-center gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-primary italic tracking-tighter">
                  {formatVND(displayPrice)}
                </span>
                {displayComparePrice && (
                  <span className="text-sm text-muted-foreground line-through italic">
                    {formatVND(displayComparePrice)}
                  </span>
                )}
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                 <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tình trạng</p>
                 <p className={cn("text-sm font-bold flex items-center gap-1", (activeVariant ? activeVariant.stock > 0 : initialProduct.inStock) ? "text-green-500" : "text-red-500")}>
                   <Check className="w-3 h-3" /> {(activeVariant ? activeVariant.stock > 0 : initialProduct.inStock) ? "Còn hàng" : "Hết hàng"}
                 </p>
              </div>
            </div>
          </div>

          {/* VARIANT SELECTOR */}
          {initialProduct.hasVariants && initialProduct.attributes && (
            <div className="space-y-6 py-6 border-y border-white/5">
              {initialProduct.attributes.map((attr) => (
                <div key={attr.name} className="space-y-3">
                  <div className="flex justify-between">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{attr.name}</Label>
                    <span className="text-[10px] text-primary font-bold">{selectedAttributes[attr.name] || "Chưa chọn"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attr.values.map((val) => {
                      const isSelected = selectedAttributes[attr.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeSelect(attr.name, val)}
                          className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                            isSelected 
                              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                              : "bg-white/5 border-white/10 hover:border-primary/50 text-muted-foreground"
                          )}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-6">
             <div className="flex gap-4">
                <AddToCartButton 
                  product={initialProduct} 
                  selectedVariant={activeVariant || undefined}
                  disabled={initialProduct.hasVariants && !activeVariant}
                  className="flex-1 h-16 rounded-2xl text-xl font-black italic shadow-xl shadow-primary/20 uppercase tracking-tighter bg-primary text-white disabled:opacity-50 disabled:grayscale" 
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-16 w-16 rounded-2xl", isFavorite && "bg-red-500/10 text-red-500 border-red-500/20")}
                  onClick={() => toggleWishlist(initialProduct.id)}
                >
                   <Heart className={cn("w-6 h-6", isFavorite && "fill-current")} />
                </Button>
             </div>

             {initialProduct.hasVariants && !activeVariant && (
               <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2">
                  <Info className="w-4 h-4 text-orange-500" />
                  <p className="text-[10px] text-orange-500 font-bold uppercase italic">Vui lòng chọn đầy đủ các thuộc tính để mua hàng</p>
               </div>
             )}
             
             <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                   <Truck className="w-5 h-5 text-primary mx-auto" />
                   <p className="text-[9px] font-black uppercase tracking-widest">Giao nhanh</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                   <ShieldCheck className="w-5 h-5 text-primary mx-auto" />
                   <p className="text-[9px] font-black uppercase tracking-widest">Bảo hành 12th</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center space-y-1">
                   <RefreshCcw className="w-5 h-5 text-primary mx-auto" />
                   <p className="text-[9px] font-black uppercase tracking-widest">Đổi trả 7 ngày</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <section className="space-y-8">
         <h2 className="text-3xl font-black italic tracking-tighter uppercase">Sản phẩm liên quan</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
         </div>
      </section>
    </div>
  );
}
