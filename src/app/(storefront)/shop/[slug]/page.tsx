
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useBuilderStore, SectionConfig } from "@/store/builderStore";
import { ProductCard } from "@/components/product/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Star, Users, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatVND } from "@/lib/currency";

export default function VendorShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { vendors, vendorProducts, setCurrentVendor } = useVendorStore();
  const { sections: builderSections, theme } = useBuilderStore();
  const [loading, setLoading] = useState(true);

  const vendor = useMemo(() => {
    return vendors.find(v => v.storeSlug?.toLowerCase() === slug.toLowerCase());
  }, [vendors, slug]);

  useEffect(() => {
    if (vendor) {
      setCurrentVendor(vendor);
    }
    setLoading(false);
    return () => setCurrentVendor(null);
  }, [vendor, setCurrentVendor]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!vendor) return notFound();

  // Shop Products for the grid renderer
  const shopProducts = vendorProducts.filter(p => p.vendorId === vendor.id && p.status === 'approved');

  // NẾU VENDOR CÓ CẤU HÌNH BUILDER -> RENDER THEO BUILDER
  // (Ở bản MVP này chúng ta lấy tạm từ BuilderStore chung, thực tế sẽ lấy từ JSON trong Firestore của Vendor)
  const hasCustomLayout = builderSections.length > 0;

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500">
      <style jsx global>{`
        :root {
          --primary: ${theme.primaryColor};
          --radius: ${theme.borderRadius};
        }
      `}</style>

      {!hasCustomLayout ? (
        <div className="container mx-auto px-4 py-12">
          {/* Default Header - Giữ nguyên giao diện cũ nếu chưa builder */}
          <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
              <div className="h-32 w-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shrink-0 overflow-hidden">
                {vendor.storeLogo ? <Image src={vendor.storeLogo} alt={vendor.storeName} width={128} height={128} className="object-cover h-full w-full" /> : <Store className="w-16 h-16 text-primary" />}
              </div>
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">{vendor.storeName}</h1>
                  <Badge className="bg-primary/20 text-primary border-none gap-1 py-1 px-3"><CheckCircle2 className="w-3 h-3" /> Official Store</Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{vendor.storeDescription}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline italic uppercase tracking-tighter border-b border-white/5 pb-4">TẤT CẢ SẢN PHẨM ({shopProducts.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {shopProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
           {/* RENDER THEO CẤU HÌNH BUILDER */}
           {builderSections.map((section) => (
             <ShopSectionRenderer key={section.id} section={section} products={shopProducts} theme={theme} />
           ))}
        </div>
      )}
    </div>
  );
}

function ShopSectionRenderer({ section, products, theme }: { section: SectionConfig, products: any[], theme: any }) {
  switch (section.type) {
    case 'hero':
      return (
        <section 
          className="relative overflow-hidden flex items-center justify-center text-center py-32 md:py-48"
          style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}
        >
          <div className="absolute inset-0 z-0">
             <Image src={section.content.imageUrl || 'https://picsum.photos/seed/hero/1200/600'} alt="Hero" fill className="object-cover opacity-60" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
          <div className="container px-4 relative z-10 space-y-8 max-w-4xl">
             <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none animate-in slide-in-from-bottom-8 duration-700">{section.content.title}</h1>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in slide-in-from-bottom-6 duration-700">{section.content.subtitle}</p>
             <Button className="rounded-full px-16 h-16 text-lg font-black italic shadow-2xl animate-in slide-in-from-bottom-4 duration-700" style={{ backgroundColor: `hsl(${theme.primaryColor})`, borderRadius: theme.borderRadius }}>
               {section.content.buttonText}
             </Button>
          </div>
        </section>
      );

    case 'product_grid':
      return (
        <section className="py-20" style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}>
          <div className="container px-4">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-12 flex items-center gap-4">
               {section.content.title}
               <div className="h-1 flex-1 bg-white/5" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, section.content.limit || 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      );

    case 'banner':
       return (
         <div className="container px-4 py-12" style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}>
            <div className="relative aspect-[21/7] rounded-[2.5rem] overflow-hidden group">
               <Image src={section.content.imageUrl} alt="Banner" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col items-start justify-center p-12 md:p-20">
                  <h3 className="text-3xl md:text-5xl font-black italic text-white mb-6 uppercase tracking-tighter max-w-md">{section.content.title}</h3>
                  <Button size="lg" className="rounded-full font-bold px-10 h-14" style={{ backgroundColor: `hsl(${theme.primaryColor})` }}>Mua Ngay &rarr;</Button>
               </div>
            </div>
         </div>
       );

    default:
      return null;
  }
}
