
"use client";

import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Đặt hàng thành công",
        description: "Cảm ơn bạn đã mua sắm tại S-Com Hub.",
      });
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-12 text-center">Thanh toán</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-headline">Thông tin giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input id="firstName" placeholder="Nguyễn" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Văn A" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="email@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="090 123 4567" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" placeholder="123 Lê Lợi, Quận 1, TP. HCM" required />
            </div>
          </div>

          <div className="pt-6">
            <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg" disabled={loading}>
              {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
            </Button>
          </div>
        </form>

        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-card border border-white/5">
            <h2 className="text-2xl font-bold font-headline mb-6">Đơn hàng của bạn</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center gap-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
                      <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm shrink-0">{formatVND(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between font-bold text-xl">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatVND(totalPrice())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
