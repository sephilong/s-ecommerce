import Image from "next/image";
import Link from "next/link";
import { Product, formatVND } from "@/lib/store-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-card rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          data-ai-hint="product image"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-primary text-white font-bold">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Hết hàng</span>
          </div>
        )}
      </Link>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">{product.category}</div>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatVND(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatVND(product.compareAtPrice)}
              </span>
            )}
          </div>
          <Button size="icon" className="rounded-full h-10 w-10 shrink-0" disabled={!product.inStock}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
