
"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/lib/store-data";
import { toast } from "@/hooks/use-toast";

interface AddToCartButtonProps extends ButtonProps {
  product: Product;
}

export function AddToCartButton({ product, ...props }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  return (
    <Button onClick={handleAdd} disabled={!product.inStock} {...props}>
      <ShoppingCart className="w-4 h-4 mr-2" />
      {product.inStock ? "Thêm vào giỏ hàng" : "Hết hàng"}
    </Button>
  );
}
