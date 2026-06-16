
"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { Product } from "@/lib/store-data";
import { toast } from "@/hooks/use-toast";

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
}

export function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const logEvent = useAnalyticsStore((state) => state.logEvent);

  const handleAdd = () => {
    addItem(product);
    
    // Track Analytics
    logEvent({
      type: 'add_to_cart',
      productId: product.id,
      productName: product.name,
      value: product.price,
      category: product.category
    });

    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  return (
    <button 
      onClick={(e) => { e.preventDefault(); handleAdd(); }} 
      disabled={!product.inStock} 
      className={props.className}
    >
      <ShoppingCart className="w-4 h-4 mr-2 inline-block" />
      {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
    </button>
  );
}
