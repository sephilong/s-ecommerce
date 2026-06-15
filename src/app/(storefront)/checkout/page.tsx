
"use client";

import { useCartStore } from "@/store/cartStore";
import { useConfigStore } from "@/store/configStore";
import { useOrderStore, Order } from "@/store/orderStore";
import { useUserStore } from "@/store/userStore";
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
import { Loader2, CheckCircle2, QrCode, ArrowLeft, ShieldCheck, CreditCard, Landmark, Info } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods } = useConfigStore();
  const { addOrder } = useOrderStore();
  const { profile, updateProfile } = useUserStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

  // Pre-fill form from saved profile
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    }
  }, [profile]);

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

    if (currentPayment?.type === 'vnpay' || currentPayment?.type === 'momo') {
      await new Promise(r => setTimeout(r, 1200));
      setShowSandbox(true);
      setLoading(false);
      return;
    }

    completeOrder();
  };

  const completeOrder = () => {
    const orderId = `SCHUB-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Save profile for next time
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      address: formData.address
    });

    const newOrder: Order = {
      id: orderId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      items: items.map(i => ({ 
        name: i.product.name, 
        qty: i.quantity, 
        price: i.product.price,
        image: i.product.image
      })),
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
            <p className="text-muted-foreground">Môi trường giả lập để kiểm tra luồng đặt hàng của S-Com Hub.</p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 flex gap-3 text-yellow-500 text-sm">
            <Info className="w-5 h-5 shrink-0" />
            <p>
              <strong>Hướng dẫn Test:</strong> Đây là mã QR giả lập. Bạn <strong>không cần</strong> quét bằng điện thoại thật. Chỉ cần nhấn nút <strong>"Xác nhận đã thanh toán"</strong> bên dưới để hoàn tất luồng test.
            </p>
          </div>

          <Card className="border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center bg-white">
                <div className="relative group">
                  <QrCode className="h-48 w-48 text-black transition-transform group-hover:scale-105 duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-black/5 backdrop-blur-sm p-2 rounded-lg border border-black/10">
                      <span className="text-[10px] font-bold text-black uppercase">Mã giả lập</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-wider">Mô phỏng quét mã {currentPayment?.name}</p>
              </div>

              <div className="p-8 space-y-6 flex flex-col justify-between bg-card/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Số tiền cần thanh toán</p>
                      <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Mã đơn hàng:</span>
                      <span className="font-bold text-foreground">#SCHUB-SANDBOX</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Nhà cung cấp:</span>
                      <span className="font-bold text-foreground">{currentPayment?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-12 rounded-full font-bold text-lg shadow-lg shadow-primary/20" onClick={completeOrder} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Xác nhận đã thanh toán"}
                  </Button>
                  <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:bg-transparent" onClick={() => setShowSandbox(false)}>
                    <ArrowLeft className="w-3 h-3 mr-2" /> Quay lại chỉnh sửa
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-medium">Powered by S-Com Hub Payment Gateway Simulator</p>
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
          {/* Section 1: Delivery Information */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">1</span>
              Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Họ</Label>
                <Input id="firstName" placeholder="Nguyễn" required value={formData.firstName} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Tên</Label>
                <Input id="lastName" placeholder="Văn A" required value={formData.lastName} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="090 123 4567" required value={formData.phone} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input id="address" placeholder="123 Lê Lợi, Quận 1, TP. HCM" required value={formData.address} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
            </div>
            {profile && (
              <p className="text-[10px] text-primary italic font-medium">
                * Chúng tôi đã tự động điền thông tin từ đơn hàng trước của bạn.
              </p>
            )}
          </section>

          {/* Section 2: Shipping */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">2</span>
              Vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 ${selectedShipping === sm.id ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={sm.id} id={sm.id} />
                    <span className="font-bold text-base">{sm.name}</span>
                  </div>
                  <span className="font-bold text-primary">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          {/* Section 3: Payment */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30">3</span>
              Thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.filter(p => p.isActive).map((pm) => (
                <div key={pm.id} className="space-y-2">
                  <Label className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 ${selectedPayment === pm.id ? 'border-primary bg-primary/10 shadow-lg shadow-primary/5' : 'border-white/5'}`}>
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-bold text-base">{pm.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mt-0.5">{pm.description}</span>
                      </div>
                    </div>
                  </Label>
                  
                  {selectedPayment === pm.id && pm.type === 'banking' && (
                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-sm font-bold flex items-center gap-2 text-primary">
                        <Landmark className="w-5 h-5" /> Thông tin chuyển khoản trực tiếp:
                      </p>
                      <div className="grid grid-cols-2 gap-y-3 text-xs bg-background/50 p-4 rounded-xl border border-white/5">
                        <span className="text-muted-foreground">Ngân hàng:</span>
                        <span className="font-bold">MB Bank (Quân Đội)</span>
                        <span className="text-muted-foreground">Số tài khoản:</span>
                        <span className="font-bold text-primary text-sm select-all">0901234567</span>
                        <span className="text-muted-foreground">Chủ tài khoản:</span>
                        <span className="font-bold uppercase tracking-wider text-sm">NGUYEN VAN A</span>
                      </div>
                    </div>
                  )}

                  {selectedPayment === pm.id && (pm.type === 'vnpay' || pm.type === 'momo') && (
                    <div className="p-4 bg-primary/5 border border-primary/20 border-dashed rounded-2xl space-y-2 animate-in slide-in-from-top-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" /> Bạn sẽ được chuyển đến trang Sandbox an toàn để "quét mã giả lập" sau khi nhấn nút bên dưới.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={loading}>
            {loading ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Đang chuẩn bị...</> : `Đặt hàng • ${formatVND(finalTotal)}`}
          </Button>
        </form>

        {/* Order Summary Sticky Sidebar */}
        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-bold font-headline border-b border-white/5 pb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center gap-6 group">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/10 shrink-0 group-hover:border-primary/50 transition-colors">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                        <div className="absolute top-0 right-0 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg font-bold">x{item.quantity}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap">{formatVND(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="font-medium text-foreground">{formatVND(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Phí vận chuyển ({currentShipping?.name || 'Chưa chọn'})</span>
                  <span className="font-medium text-foreground">{formatVND(currentShipping?.price || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-2xl pt-6 border-t border-white/10">
                  <span>Tổng cộng</span>
                  <span className="text-primary animate-pulse-slow">{formatVND(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
