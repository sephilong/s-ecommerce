
"use client";

import { useCartStore } from "@/store/cartStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { getTenantConfig } from "@/lib/tenant";
import { PaymentMethod, ShippingMethod } from "@/lib/store-data";
import { CreditCard, Truck, Wallet, Landmark, TruckIcon } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  useEffect(() => {
    const fetchConfig = async () => {
      const tenant = await getTenantConfig("demo");
      setPaymentMethods(tenant.paymentMethods.filter(pm => pm.isActive));
      setShippingMethods(tenant.shippingMethods.filter(sm => sm.isActive));
      
      if (tenant.paymentMethods.length > 0) setSelectedPayment(tenant.paymentMethods[0].id);
      if (tenant.shippingMethods.length > 0) setSelectedShipping(tenant.shippingMethods[0].id);
    };
    fetchConfig();
  }, []);

  const currentShippingPrice = shippingMethods.find(s => s.id === selectedShipping)?.price || 0;
  const finalTotal = totalPrice() + currentShippingPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
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
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-12 text-center">Thanh toán</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Thông tin khách hàng */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">1</span>
              Thông tin giao hàng
            </h2>
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
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="090 123 4567" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input id="address" placeholder="123 Lê Lợi, Quận 1, TP. HCM" required />
            </div>
          </section>

          {/* Section 2: Vận chuyển */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">2</span>
              Đơn vị vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.map((sm) => (
                <Label key={sm.id} className="relative flex items-center justify-between p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={sm.id} id={sm.id} />
                    <div className="flex flex-col">
                      <span className="font-bold">{sm.name}</span>
                      <span className="text-xs text-muted-foreground">Thời gian dự kiến: 2-4 ngày</span>
                    </div>
                  </div>
                  <span className="font-bold">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          {/* Section 3: Thanh toán */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">3</span>
              Phương thức thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.map((pm) => (
                <Label key={pm.id} className="relative flex flex-col p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <div className="flex items-center gap-3">
                      {pm.type === 'vnpay' && <Image src="https://picsum.photos/seed/vnpay/32/32" alt="vnpay" width={32} height={32} className="rounded" />}
                      {pm.type === 'momo' && <Image src="https://picsum.photos/seed/momo/32/32" alt="momo" width={32} height={32} className="rounded" />}
                      <span className="font-bold">{pm.name}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 pl-7">{pm.description}</p>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg font-bold" disabled={loading}>
            {loading ? "Đang xử lý..." : `Đặt hàng • ${formatVND(finalTotal)}`}
          </Button>
        </form>

        {/* Sidebar Summary */}
        <div className="space-y-8">
          <Card className="border-white/5 bg-card/50 backdrop-blur-sm sticky top-24">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold font-headline">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-white/5">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm">{formatVND(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phí vận chuyển</span>
                  <span>{formatVND(currentShippingPrice)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-white/10">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatVND(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
