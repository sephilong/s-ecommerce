
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
import { Loader2, CheckCircle2, QrCode, ArrowLeft, ShieldCheck, CreditCard } from "lucide-react";

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
    if (activePMs.length > 0 && !selectedPayment) setSelectedPayment(activePMs[0].id);
    if (activeSMs.length > 0 && !selectedShipping) setSelectedShipping(activeSMs[0].id);
  }, [paymentMethods, shippingMethods, selectedPayment, selectedShipping]);

  const currentShipping = shippingMethods.find(s => s.id === selectedShipping);
  const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
  const finalTotal = totalPrice() + (currentShipping?.price || 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address) {
      toast({ title: "Thông tin còn thiếu", description: "Vui lòng điền đầy đủ thông tin giao hàng.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Simulate gateway processing for Online Payments
    if (currentPayment?.type === 'vnpay' || currentPayment?.type === 'momo') {
      await new Promise(r => setTimeout(r, 1500));
      setShowSandbox(true);
      setLoading(false);
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
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  if (items.length === 0 && !showSandbox) return null;

  if (showSandbox) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4" />
              Giao dịch an toàn qua {currentPayment?.name}
            </div>
            <h2 className="text-3xl font-bold font-headline">Cổng thanh toán Sandbox</h2>
            <p className="text-muted-foreground">Vui lòng quét mã QR hoặc xác nhận để hoàn tất đơn hàng giả lập.</p>
          </div>

          <Card className="border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center bg-white">
                <div className="relative group">
                  <QrCode className="h-48 w-48 text-black transition-transform group-hover:scale-105 duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/5 backdrop-blur-sm p-2 rounded-lg">
                      <span className="text-[10px] font-bold text-black uppercase">Scan Me</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500 font-medium">Sử dụng ứng dụng {currentPayment?.name} để quét</p>
              </div>

              <div className="p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Số tiền cần thanh toán</p>
                      <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Đơn hàng:</span>
                      <span className="font-medium">#SCHUB-SANDBOX</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nội dung:</span>
                      <span className="font-medium line-clamp-1">Thanh toán đơn hàng S-Com Hub</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12 rounded-full font-bold text-lg" onClick={completeOrder} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Xác nhận đã thanh toán"}
                  </Button>
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:bg-transparent" onClick={() => setShowSandbox(false)}>
                    <ArrowLeft className="w-3 h-3 mr-2" /> Quay lại chỉnh sửa đơn hàng
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Powered by S-Com Hub Payment Gateway Simulator</p>
          </div>
        </div>
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
                <Input id="firstName" placeholder="Nguyễn" required value={formData.firstName} onChange={handleInputChange} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Văn A" required value={formData.lastName} onChange={handleInputChange} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="090 123 4567" required value={formData.phone} onChange={handleInputChange} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input id="address" placeholder="123 Lê Lợi, Quận 1, TP. HCM" required value={formData.address} onChange={handleInputChange} className="rounded-xl" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm">2</span>
              Vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className={`relative flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${selectedShipping === sm.id ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={sm.id} id={sm.id} />
                    <span className="font-bold">{sm.name}</span>
                  </div>
                  <span className="font-bold text-primary">{formatVND(sm.price)}</span>
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
                  <Label className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/5 ${selectedPayment === pm.id ? 'border-primary bg-primary/5' : 'border-white/5'}`}>
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-bold">{pm.name}</span>
                      {pm.type !== 'cod' && pm.type !== 'banking' && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">ONLINE</span>
                      )}
                    </div>
                  </Label>
                  {selectedPayment === pm.id && pm.type === 'banking' && (
                    <div className="mt-2 p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2 animate-in slide-in-from-top-2">
                      <p className="text-sm font-bold flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Thông tin chuyển khoản:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <span className="text-muted-foreground">Ngân hàng:</span>
                        <span className="font-bold">MB Bank</span>
                        <span className="text-muted-foreground">Số tài khoản:</span>
                        <span className="font-bold text-primary select-all">0901234567</span>
                        <span className="text-muted-foreground">Chủ tài khoản:</span>
                        <span className="font-bold">NGUYEN VAN A</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-14 rounded-full text-lg font-bold shadow-xl shadow-primary/20" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</> : `Đặt hàng • ${formatVND(finalTotal)}`}
          </Button>
        </form>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24">
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold font-headline">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">SL: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">{formatVND(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tạm tính</span>
                  <span>{formatVND(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
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
