
"use client";

import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold font-headline">Giỏ hàng của bạn đang trống</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm công nghệ mới nhất của chúng tôi.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-12">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-6 p-6 rounded-2xl bg-card/50 border border-white/5 backdrop-blur-sm">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0 border border-white/5">
                <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-3 bg-background/50 rounded-lg p-1 border border-white/5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-bold">{formatVND(item.product.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-3xl bg-primary/5 border border-primary/20 space-y-6">
            <h2 className="text-xl font-bold font-headline">Tổng đơn hàng</h2>
            <div className="space-y-4 pt-4 border-t border-primary/10">
              <div className="flex justify-between text-muted-foreground">
                <span>Tạm tính</span>
                <span>{formatVND(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Vận chuyển</span>
                <span className="text-accent">Miễn phí</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-primary/10">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(totalPrice())}</span>
              </div>
            </div>
            <Button asChild className="w-full h-14 rounded-full text-lg group">
              <Link href="/checkout-vendor" className="flex items-center justify-center gap-2">
                Tiến hành đặt hàng
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
