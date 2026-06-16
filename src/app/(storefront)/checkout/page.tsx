
"use client";

import { useCartStore } from "@/store/cartStore";
import { useConfigStore } from "@/store/configStore";
import { useOrderStore, Order } from "@/store/orderStore";
import { useUserStore } from "@/store/userStore";
import { usePromotionStore } from "@/store/promotionStore";
import { useAffiliateStore } from "@/store/affiliateStore";
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
import { QrCode, CreditCard, Truck, Star, Tag, Check, Info, AlertCircle } from "lucide-react";
import { Coupon } from "@/lib/store-data";
import { getTenantConfig } from "@/lib/tenant";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods } = useConfigStore();
  const { addOrder, orders } = useOrderStore();
  const { profile, updateProfile } = useUserStore();
  const { promotions, coupons, loyaltyConfig } = usePromotionStore();
  const { addConversion } = useAffiliateStore();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [activeTenant, setActiveTenant] = useState<any>(null);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      address: profile.address || ""
    });
    
    // Resolve current tenant to check for Reseller Commission
    const resolveTenant = async () => {
      const subdomain = window.location.host.split('.')[0] || "demo";
      const tenant = await getTenantConfig(subdomain);
      setActiveTenant(tenant);
    };
    resolveTenant();
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ.";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên.";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại.";
    else if (!/^\d{10,11}$/.test(formData.phone.trim())) newErrors.phone = "Số điện thoại không hợp lệ.";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ nhận hàng.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const completeOrder = () => {
    if (!validateForm()) return;

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

    setLoading(true);

    // Attribution Logic: 
    // 1. Reseller Attribution (Priority if on reseller storefront)
    if (activeTenant && activeTenant.type === 'reseller' && activeTenant.ownerId) {
       addConversion({
          id: `conv-reseller-${Date.now()}`,
          orderId: orderId,
          affiliateCode: `RESELLER-${activeTenant.subdomain.toUpperCase()}`,
          amount: finalTotal,
          commission: finalTotal * 0.15, // Reseller commission rate is 15%
          status: 'pending',
          createdAt: new Date().toISOString()
        });
    } else {
      // 2. Product Affiliate Attribution (Catch ?ref= from localStorage)
      const storedRef = localStorage.getItem("scomhub_affiliate_ref");
      if (storedRef) {
        const { code, timestamp } = JSON.parse(storedRef);
        const windowDays = 30;
        const isWithinWindow = (Date.now() - timestamp) < (windowDays * 24 * 60 * 60 * 1000);
        if (isWithinWindow) {
          addConversion({
            id: `conv-aff-${Date.now()}`,
            orderId: orderId,
            affiliateCode: code,
            amount: finalTotal,
            commission: finalTotal * 0.1, // Affiliate rate is 10%
            status: 'pending',
            createdAt: new Date().toISOString()
          });
        }
      }
    }

    setTimeout(() => {
      addOrder(newOrder);
      setLoading(false);
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  const handleCheckoutAction = () => {
    if (!validateForm()) {
      toast({ variant: "destructive", title: "Thông tin chưa đầy đủ", description: "Vui lòng điền thông tin nhận hàng." });
      return;
    }
    const currentPM = paymentMethods.find(p => p.id === selectedPayment);
    if (currentPM?.type === 'cod') completeOrder();
    else setShowSandbox(true);
  };

  if (items.length === 0 && !showSandbox) {
    router.push("/cart");
    return null;
  }

  if (showSandbox) {
    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl space-y-8 animate-in fade-in zoom-in-95">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold font-headline">Thanh toán an toàn</h2>
            <p className="text-muted-foreground">Vui lòng quét mã QR bên dưới để hoàn tất giao dịch qua {currentPayment?.name}</p>
          </div>
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 flex flex-col items-center justify-center bg-white">
                <QrCode className="h-48 w-48 text-black" />
                <p className="mt-4 text-[10px] text-black font-bold uppercase tracking-widest">Quét để trả {formatVND(finalTotal)}</p>
              </div>
              <div className="p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Tổng thanh toán</p>
                  <p className="text-2xl font-bold text-primary">{formatVND(finalTotal)}</p>
                  <p className="text-xs text-muted-foreground mt-2">Mã đơn hàng: #SCHUB-TEMP</p>
                </div>
                <div className="space-y-3">
                   <Button className="w-full h-12 rounded-full font-bold" onClick={completeOrder} disabled={loading}>
                    {loading ? "Đang xử lý..." : "Xác nhận đã chuyển khoản"}
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
      <h1 className="text-4xl font-bold font-headline mb-12 text-center italic tracking-tighter">THANH TOÁN ĐƠN HÀNG</h1>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 italic">01</span>
              Thông tin nhận hàng
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Họ <span className="text-destructive">*</span></Label>
                <Input placeholder="Nhập họ..." value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className={`rounded-xl bg-card/50 ${errors.firstName ? 'border-destructive' : ''}`} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tên <span className="text-destructive">*</span></Label>
                <Input placeholder="Nhập tên..." value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className={`rounded-xl bg-card/50 ${errors.lastName ? 'border-destructive' : ''}`} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Số điện thoại <span className="text-destructive">*</span></Label>
              <Input placeholder="0901234567" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`rounded-xl bg-card/50 ${errors.phone ? 'border-destructive' : ''}`} />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Địa chỉ <span className="text-destructive">*</span></Label>
              <Input placeholder="Số nhà, tên đường..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={`rounded-xl bg-card/50 ${errors.address ? 'border-destructive' : ''}`} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 italic">02</span>
              Đơn vị vận chuyển
            </h2>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="grid grid-cols-1 gap-4">
              {shippingMethods.filter(s => s.isActive).map((sm) => (
                <Label key={sm.id} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selectedShipping === sm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={sm.id} /> 
                    <div>
                      <span className="font-bold block">{sm.name}</span>
                      <span className="text-[10px] text-muted-foreground">Dự kiến 2-4 ngày</span>
                    </div>
                  </div>
                  <span className="font-bold text-primary">{formatVND(sm.price)}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 italic">03</span>
              Phương thức thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.filter(p => p.isActive).map((pm) => (
                <Label key={pm.id} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selectedPayment === pm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={pm.id} /> 
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                      <div>
                        <span className="font-bold block">{pm.name}</span>
                        <span className="text-[10px] text-muted-foreground">{pm.description}</span>
                      </div>
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Button onClick={handleCheckoutAction} size="lg" className="w-full h-16 rounded-2xl text-xl font-bold group">
            XÁC NHẬN ĐẶT HÀNG <Check className="w-6 h-6 ml-2 group-hover:scale-110 transition-transform" />
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-10 space-y-8">
              <h2 className="text-2xl font-bold font-headline border-b border-white/5 pb-4 italic tracking-tighter">TÓM TẮT ĐƠN HÀNG</h2>
              <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="object-cover h-full w-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.product.name}</p>
                      <p className="text-[10px] text-muted-foreground">SL: {item.quantity} x {formatVND(item.product.price)}</p>
                    </div>
                    <span className="font-bold text-sm">{formatVND(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  <Input placeholder="Mã ưu đãi..." value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="rounded-full h-11" />
                  <Button variant="secondary" className="rounded-full px-6 h-11" onClick={handleApplyCoupon}>Áp dụng</Button>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Tạm tính</span> <span>{formatVND(totalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Phí vận chuyển</span> <span>{formatVND(shippingFee)}</span>
                </div>
                {discountResult.totalDiscount > 0 && (
                  <div className="flex justify-between text-sm text-primary font-black uppercase tracking-widest">
                    <span>Tổng giảm giá</span> <span>-{formatVND(discountResult.totalDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-3xl pt-6 border-t border-white/10 italic tracking-tighter">
                  <span>TỔNG CỘNG</span> <span className="text-primary">{formatVND(finalTotal)}</span>
                </div>
                <div className="mt-6 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-tighter">
                    <Star className="w-4 h-4 fill-emerald-500" /> +{discountResult.potentialPoints} Điểm thưởng dự kiến
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
