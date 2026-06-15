
"use client";

import { useCartStore } from "@/store/cartStore";
import { useConfigStore } from "@/store/configStore";
import { useOrderStore, Order } from "@/store/orderStore";
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
import { Loader2, CheckCircle2, QrCode } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods } = useConfigStore();
  const { addOrder } = useOrderStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  // Customer info state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    const activePMs = paymentMethods.filter(p => p.isActive);
    const activeSMs = shippingMethods.filter(s => s.isActive);
    if (activePMs.length > 0) setSelectedPayment(activePMs[0].id);
    if (activeSMs.length > 0) setSelectedShipping(activeSMs[0].id);
  }, [paymentMethods, shippingMethods]);

  const currentShipping = shippingMethods.find(s => s.id === selectedShipping);
  const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
  const finalTotal = totalPrice() + (currentShipping?.price || 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate gateway processing for Online Payments
    if (currentPayment?.type === 'vnpay' || currentPayment?.type === 'momo') {
      await new Promise(r => setTimeout(r, 1000));
      setShowSandbox(true);
      return;
    }

    completeOrder();
  };

  const completeOrder = () => {
    const orderId = `SCHUB-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      items: items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
      total: finalTotal,
      status: 'Chờ xử lý',
      paymentStatus: currentPayment?.type === 'cod' ? 'Chờ thanh toán' : 'Đã thanh toán',
      paymentMethod: currentPayment?.name || "N/A",
      shippingMethod: currentShipping?.name || "N/A",
      createdAt: new Date().toISOString()
    };

    addOrder(newOrder);
    
    setTimeout(() => {
      setLoading(false);
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  if (items.length === 0) return null;

  if (showSandbox) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center max-w-lg text-center space-y-8 animate-in zoom-in-95">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Giả lập cổng thanh toán {currentPayment?.name}</h2>
          <p className="text-muted-foreground">Vui lòng không đóng trình duyệt. Hệ thống đang kết nối với Sandbox của {currentPayment?.type.toUpperCase()}.</p>
        </div>
        <Card className="w-full bg-card/50 border-white/5 p-8 space-y-6">
          <div className="bg-white p-4 rounded-xl inline-block mx-auto">
             <QrCode className="h-40 w-40 text-black" />
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase text-muted-foreground font-bold">Số tiền thanh toán</p>
            <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
          </div>
          <Button className="w-full h-12 rounded-full" onClick={completeOrder}>Xác nhận đã thanh toán (Simulate Success)</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-12 text-center">Thanh toán</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">1</span>
              Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input id="firstName" placeholder="Nguyễn" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Văn A" required value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="090 123 4567" required value={formData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input id="address" placeholder="123 Lê Lợi, Quận 1, TP. HCM" required value={formData.address} onChange={handleInputChange} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">2</span>
              Vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className="relative flex items-center justify-between p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={sm.id} id={sm.id} />
                    <span className="font-bold">{sm.name}</span>
                  </div>
                  <span className="font-bold">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">3</span>
              Thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.filter(p => p.isActive).map((pm) => (
                <div key={pm.id}>
                  <Label className="relative flex items-center gap-3 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/5">
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <span className="font-bold">{pm.name}</span>
                  </Label>
                  {selectedPayment === pm.id && pm.type === 'banking' && (
                    <div className="mt-2 p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2 animate-in slide-in-from-top-2">
                      <p className="text-sm font-bold">Thông tin chuyển khoản:</p>
                      <p className="text-xs">Ngân hàng: MB Bank</p>
                      <p className="text-xs">Số tài khoản: 0901234567</p>
                      <p className="text-xs">Chủ tài khoản: NGUYEN VAN A</p>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg font-bold" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : `Đặt hàng • ${formatVND(finalTotal)}`}
          </Button>
        </form>

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
                  <span>{formatVND(currentShipping?.price || 0)}</span>
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
