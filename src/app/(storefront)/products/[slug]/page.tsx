
import { getTenantConfig } from "@/lib/tenant";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  
  const product = tenant.products.find(p => p.slug === slug);
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/5 bg-card">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <Badge variant="outline" className="text-primary border-primary/20">
              {product.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-foreground">
                {formatVND(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through decoration-primary/50">
                  {formatVND(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="pt-6 border-t border-white/5 space-y-6">
            <AddToCartButton product={product} size="lg" className="w-full h-14 rounded-full text-lg" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-muted/30">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium">Giao hàng nhanh</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-muted/30">
                <ShieldCheck className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium">Bảo hành 12 tháng</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-muted/30">
                <RefreshCcw className="w-6 h-6 text-primary mb-2" />
                <span className="text-xs font-medium">7 ngày đổi trả</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
