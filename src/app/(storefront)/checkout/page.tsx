
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, QrCode, ShieldCheck, CreditCard, Landmark, Info, Ticket, Tag, Star } from "lucide-react";
import { Coupon } from "@/lib/store-data";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods, storeName } = useConfigStore();
  const { addOrder, orders } = useOrderStore();
  const { profile, updateProfile } = useUserStore();
  const { promotions, coupons, loyaltyConfig } = usePromotionStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", address: "" });

  useEffect(() => {
    if (profile) setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      address: profile.address || ""
    });
  }, [profile]);

  useEffect(() => {
    const activePMs = paymentMethods.filter(p => p.isActive);
    const activeSMs = shippingMethods.filter(s => s.isActive);
    if (activePMs.length > 0 && !selectedPayment) setSelectedPayment(activePMs[0].id);
    if (activeSMs.length > 0 && !selectedShipping) setSelectedShipping(activeSMs[0].id);
  }, [paymentMethods, shippingMethods]);

  const currentShipping = shippingMethods.find(s => s.id === selectedShipping);
  const shippingFee = currentShipping?.price || 0;

  const discountResult: DiscountResult = useMemo(() => {
    return calculateDiscount(
      items, 
      shippingFee, 
      promotions, 
      appliedCoupon, 
      orders.length, 
      loyaltyConfig.earnRate
    );
  }, [items, shippingFee, promotions, appliedCoupon, orders.length, loyaltyConfig]);

  const finalTotal = totalPrice() + shippingFee - discountResult.totalDiscount;

  const handleApplyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (found) {
      setAppliedCoupon(found);
      toast({ title: "Đã áp dụng mã", description: `Giảm thêm từ mã ${found.code}` });
    } else {
      toast({ title: "Mã không hợp lệ", variant: "destructive" });
    }
  };

  const completeOrder = () => {
    const orderId = `SCHUB-${Math.floor(10000 + Math.random() * 90000)}`;
    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
    
    updateProfile(formData);

    const newOrder: Order = {
      id: orderId,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      customerAddress: formData.address,
      items: items.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price, image: i.product.image })),
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
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-headline">Thanh toán an toàn</h2>
            <p className="text-muted-foreground">Môi trường giả lập giao dịch qua {currentPayment?.name}</p>
          </div>
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center bg-white"><QrCode className="h-48 w-48 text-black" /></div>
              <div className="p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Số tiền</p>
                  <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
                </div>
                <Button className="w-full h-12 rounded-full font-bold" onClick={completeOrder}>Xác nhận thanh toán</Button>
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
        <form onSubmit={(e) => { e.preventDefault(); setShowSandbox(true); }} className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold">1</span>
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Họ" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              <Input placeholder="Tên" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <Input placeholder="Số điện thoại" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            <Input placeholder="Địa chỉ chi tiết" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold">2</span>
              Vận chuyển & Thanh toán
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className={`flex items-center justify-between p-5 rounded-2xl border ${selectedShipping === sm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4"><RadioGroupItem value={sm.id} /> <span className="font-bold">{sm.name}</span></div>
                  <span className="font-bold text-primary">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Button type="submit" size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl">
            Đặt hàng • {formatVND(finalTotal)}
          </Button>
        </form>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-8 space-y-8">
              <h2 className="text-2xl font-bold font-headline border-b border-white/5 pb-4">Đơn hàng</h2>
              <div className="space-y-4 pt-4">
                <div className="flex gap-2">
                  <Input placeholder="Mã giảm giá..." value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="rounded-full" />
                  <Button type="button" variant="secondary" className="rounded-full" onClick={handleApplyCoupon}>Áp dụng</Button>
                </div>
                {discountResult.appliedPromotions.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-xs text-accent font-medium">
                    <Tag className="w-3 h-3" /> {p.name}
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm"><span>Tạm tính</span> <span>{formatVND(totalPrice())}</span></div>
                <div className="flex justify-between text-sm"><span>Vận chuyển</span> <span>{formatVND(shippingFee)}</span></div>
                {discountResult.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary font-bold"><span>Giảm giá</span> <span>-{formatVND(discountResult.totalDiscount)}</span></div>
                )}
                <div className="flex justify-between font-bold text-2xl pt-6 border-t border-white/10"><span>Tổng cộng</span> <span className="text-primary">{formatVND(finalTotal)}</span></div>
                
                <div className="mt-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-emerald-500" /> +{discountResult.potentialPoints} Điểm thưởng
                  </div>
                  {discountResult.loyaltyMultiplier > 1 && (
                    <span className="text-[10px] font-black uppercase text-emerald-500">x{discountResult.loyaltyMultiplier} Hấp dẫn!</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
