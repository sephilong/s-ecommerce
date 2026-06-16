
"use client";

import { useCartStore } from "@/store/cartStore";
import { useConfigStore } from "@/store/configStore";
import { useOrderStore, Order } from "@/store/orderStore";
import { useUserStore } from "@/store/userStore";
import { usePromotionStore } from "@/store/promotionStore";
import { formatVND } from "@/lib/currency";
import { calculateDiscount, DiscountResult } from "@/lib/promotion-engine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, QrCode, ArrowLeft, ShieldCheck, CreditCard, Landmark, Info, Ticket, Tag } from "lucide-react";
import { Coupon } from "@/lib/store-data";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods } = useConfigStore();
  const { addOrder } = useOrderStore();
  const { profile, updateProfile } = useUserStore();
  const { promotions, coupons } = usePromotionStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: ""
  });

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
  const shippingFee = currentShipping?.price || 0;

  const discountResult: DiscountResult = useMemo(() => {
    return calculateDiscount(items, shippingFee, promotions, appliedCoupon);
  }, [items, shippingFee, promotions, appliedCoupon]);

  const finalTotal = totalPrice() + shippingFee - discountResult.totalDiscount;

  const handleApplyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      setAppliedCoupon(found);
      toast({ title: "Đã áp dụng mã", description: `Bạn được giảm thêm từ mã ${found.code}` });
    } else {
      toast({ title: "Mã không hợp lệ", description: "Vui lòng kiểm tra lại mã giảm giá.", variant: "destructive" });
    }
  };

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
    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
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
    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
    
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
    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
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
            <p><strong>Hướng dẫn Test:</strong> Đây là mã QR giả lập. Nhấn nút <strong>"Xác nhận đã thanh toán"</strong> để hoàn tất.</p>
          </div>

          <Card className="border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center bg-white">
                <QrCode className="h-48 w-48 text-black" />
                <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-wider">Mô phỏng quét mã {currentPayment?.name}</p>
              </div>
              <div className="p-8 space-y-6 flex flex-col justify-between bg-card/10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Số tiền</p>
                      <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button className="w-full h-12 rounded-full font-bold text-lg" onClick={completeOrder} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : "Xác nhận đã thanh toán"}
                  </Button>
                  <Button variant="ghost" className="w-full text-xs" onClick={() => setShowSandbox(false)}>Quay lại</Button>
                </div>
              </div>
            </div>
          </Card>
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
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold">1</span>
              Thông tin giao hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input id="firstName" placeholder="Họ" required value={formData.firstName} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
              <Input id="lastName" placeholder="Tên" required value={formData.lastName} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
            </div>
            <Input id="phone" placeholder="Số điện thoại" required value={formData.phone} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
            <Input id="address" placeholder="Địa chỉ chi tiết" required value={formData.address} onChange={handleInputChange} className="rounded-xl h-12 bg-card/30" />
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold">2</span>
              Vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 ${selectedShipping === sm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={sm.id} id={sm.id} />
                    <span className="font-bold">{sm.name}</span>
                  </div>
                  <span className="font-bold text-primary">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold">3</span>
              Thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.filter(p => p.isActive).map((pm) => (
                <div key={pm.id} className="space-y-2">
                  <Label className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer hover:bg-white/5 ${selectedPayment === pm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                    <RadioGroupItem value={pm.id} id={pm.id} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-bold">{pm.name}</span>
                    </div>
                  </Label>
                  {selectedPayment === pm.id && pm.type === 'banking' && (
                    <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl space-y-4">
                      <p className="text-sm font-bold flex items-center gap-2 text-primary"><Landmark className="w-5 h-5" /> Thông tin chuyển khoản:</p>
                      <div className="grid grid-cols-2 gap-y-3 text-xs bg-background/50 p-4 rounded-xl">
                        <span className="text-muted-foreground">MB Bank:</span> <span className="font-bold">0901234567</span>
                        <span className="text-muted-foreground">Chủ TK:</span> <span className="font-bold uppercase">NGUYEN VAN A</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/30" disabled={loading}>
            {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : `Đặt hàng • ${formatVND(finalTotal)}`}
          </Button>
        </form>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-bold font-headline border-b border-white/5 pb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Mã giảm giá..." 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="rounded-full bg-background/50"
                  />
                  <Button type="button" variant="secondary" className="rounded-full" onClick={handleApplyCoupon}>Áp dụng</Button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between p-3 bg-primary/10 border border-primary/20 rounded-2xl text-xs font-bold text-primary">
                    <div className="flex items-center gap-2"><Ticket className="w-4 h-4" /> Đã áp dụng: {appliedCoupon.code}</div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setAppliedCoupon(undefined)}>×</Button>
                  </div>
                )}
                {discountResult.appliedPromotions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Khuyến mãi tự động</p>
                    {discountResult.appliedPromotions.map(p => (
                      <div key={p.id} className="flex items-center gap-2 text-xs text-accent font-medium">
                        <Tag className="w-3 h-3" /> {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="font-medium text-foreground">{formatVND(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Vận chuyển</span>
                  <span className="font-medium text-foreground">{formatVND(shippingFee)}</span>
                </div>
                {discountResult.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary font-bold">
                    <span>Giảm giá</span>
                    <span>-{formatVND(discountResult.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-2xl pt-6 border-t border-white/10">
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
