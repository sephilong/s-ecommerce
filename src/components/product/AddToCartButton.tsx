
"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { Product, ProductVariant } from "@/lib/store-data";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

export function AddToCartButton({ product, selectedVariant, ...props }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const logEvent = useAnalyticsStore((state) => state.logEvent);

  const handleAdd = () => {
    // If product has variants, selectedVariant is required
    if (product.hasVariants && !selectedVariant) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng chọn các thuộc tính sản phẩm.",
      });
      return;
    }

    addItem(product, selectedVariant);
    
    // Track Analytics
    logEvent({
      type: 'add_to_cart',
      productId: product.id,
      productName: product.name,
      value: selectedVariant ? selectedVariant.price : product.price,
      category: product.category
    });

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: selectedVariant 
        ? `${product.name} (${Object.values(selectedVariant.combination).join(' - ')})`
        : product.name,
    });
  };

  const isOutOfStock = selectedVariant 
    ? selectedVariant.stock <= 0 
    : !product.inStock;

  return (
    <button 
      onClick={(e) => { e.preventDefault(); handleAdd(); }} 
      disabled={props.disabled || isOutOfStock} 
      className={cn(props.className, "flex items-center justify-center")}
    >
      <ShoppingCart className="w-4 h-4 mr-2" />
      <span>{isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}</span>
    </button>
  );
}
