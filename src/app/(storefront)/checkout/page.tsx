"use client";

import { useCartStore } from "@/store/cartStore";
import { useConfigStore } from "@/store/configStore";
import { useOrderStore, Order } from "@/store/orderStore";
import { useUserStore } from "@/store/userStore";
import { usePromotionStore } from "@/store/promotionStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
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
import { CreditCard, Check, Star, Truck, AlertCircle } from "lucide-react";
import { Coupon } from "@/lib/store-data";
import { getTenantConfig } from "@/lib/tenant";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods, shippingMethods } = useConfigStore();
  const { addOrder } = useOrderStore();
  const { profile } = useUserStore();
  const { promotions, coupons, loyaltyConfig } = usePromotionStore();
  const { addNotification } = useNotificationStore();
  const logEvent = useAnalyticsStore((state) => state.logEvent);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [activeTenant, setActiveTenant] = useState<any>(null);

  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", address: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      address: profile.address || "",
      email: profile.email || ""
    });
    
    const resolveTenant = async () => {
      const host = typeof window !== 'undefined' ? window.location.host : "demo";
      const subdomain = host.split('.')[0] || "demo";
      const tenant = await getTenantConfig(subdomain);
      setActiveTenant(tenant);
    };
    resolveTenant();

    // Track Begin Checkout
    logEvent({ type: 'begin_checkout', value: totalPrice() });
  }, [profile, logEvent, totalPrice]);

  useEffect(() => {
    const activePMs = paymentMethods.filter(p => p.isActive);
    const activeSMs = shippingMethods.filter(s => s.isActive);
    if (activePMs.length > 0 && !selectedPayment) setSelectedPayment(activePMs[0].id);
    if (activeSMs.length > 0 && !selectedShipping) setSelectedShipping(activeSMs[0].id);
  }, [paymentMethods, shippingMethods, selectedPayment, selectedShipping]);

  const currentShipping = shippingMethods.find(s => s.id === selectedShipping);
  const shippingFee = currentShipping?.price || 0;

  const discountResult: DiscountResult = useMemo(() => {
    return calculateDiscount(
      items, 
      shippingFee, 
      promotions, 
      appliedCoupon, 
      0, 
      loyaltyConfig.earnRate
    );
  }, [items, shippingFee, promotions, appliedCoupon, loyaltyConfig]);

  const finalTotal = totalPrice() + shippingFee - discountResult.totalDiscount;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ.";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên.";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại.";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ nhận hàng.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const completeOrder = () => {
    if (!validateForm()) return;
    setLoading(true);

    const currentPayment = paymentMethods.find(p => p.id === selectedPayment);
    const orderCode = `SCHUB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: orderCode,
      tenantId: activeTenant?.id || 'demo',
      customerId: profile?.email || 'guest',
      
      items: items.map(i => ({ 
        productId: i.product.id,
        name: i.product.name, 
        qty: i.quantity, 
        price: i.product.price, 
        image: i.product.image 
      })),
      
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        street: formData.address,
        ward: "N/A", district: "N/A", province: "N/A", country: "VN"
      },
      
      shippingProviderId: currentShipping?.id || 'default',
      shippingMethod: currentShipping?.name || "N/A",
      shippingFee: shippingFee,
      
      paymentMethod: currentPayment?.name || "COD",
      paymentStatus: currentPayment?.type === 'cod' ? 'pending' : 'paid',
      
      subtotal: totalPrice(),
      discountTotal: discountResult.orderDiscount,
      shippingDiscount: discountResult.shippingDiscount,
      total: finalTotal,
      
      appliedCouponCode: appliedCoupon?.code,
      status: 'created',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addOrder(newOrder);
      
      // Track Purchase Event
      logEvent({ type: 'purchase', value: finalTotal });

      // TRIGGER NOTIFICATIONS
      if (profile) {
        addNotification({
          userId: profile.email,
          title: 'Đặt hàng thành công',
          message: `Đơn hàng ${orderCode} của bạn đã được tiếp nhận và đang chờ xác nhận.`,
          type: 'order',
          link: '/account/orders'
        });
      }
      
      // Admin notification
      addNotification({
        userId: 'admin',
        title: 'Đơn hàng mới!',
        message: `Có đơn hàng mới ${orderCode} giá trị ${formatVND(finalTotal)}.`,
        type: 'order',
        link: '/admin/orders'
      });

      setLoading(false);
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  const handleApplyCoupon = () => {
    const found = coupons.find(c => c.code === couponCode.toUpperCase() && c.isActive);
    if (found) {
      setAppliedCoupon(found);
      toast({ title: "Thành công", description: "Mã giảm giá đã được áp dụng!" });
    } else {
      toast({ variant: "destructive", title: "Lỗi", description: "Mã không hợp lệ hoặc đã hết hạn." });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold">Giỏ hàng của bạn đang trống</h2>
        <Button className="mt-4 rounded-full" onClick={() => router.push("/products")}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-headline mb-12 text-center italic tracking-tighter uppercase">THANH TOÁN ĐƠN HÀNG</h1>
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
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Địa chỉ nhận hàng <span className="text-destructive">*</span></Label>
              <Input placeholder="Số nhà, tên đường..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className={`rounded-xl bg-card/50 ${errors.address ? 'border-destructive' : ''}`} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 italic">02</span>
              Phương thức thanh toán
            </h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 gap-4">
              {paymentMethods.filter(p => p.isActive).map((pm) => (
                <Label key={pm.id} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${selectedPayment === pm.id ? 'border-primary bg-primary/10' : 'border-white/5'}`}>
                  <div className="flex items-center gap-4">
                    <RadioGroupItem value={pm.id} /> 
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                      <span className="font-bold">{pm.name}</span>
                    </div>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Button onClick={completeOrder} size="lg" className="w-full h-16 rounded-2xl text-xl font-bold group" disabled={loading}>
            {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"} <Check className="w-6 h-6 ml-2" />
          </Button>
        </div>

        <div className="space-y-8">
          <Card className="border-white/5 bg-card/40 backdrop-blur-xl sticky top-24 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardContent className="p-10 space-y-8">
              <h2 className="text-2xl font-bold font-headline border-b border-white/5 pb-4 italic tracking-tighter uppercase">Tóm tắt đơn hàng</h2>
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
                  <span>Phí ship:</span> <span>{formatVND(shippingFee)}</span>
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
                    <Star className="w-4 h-4 fill-emerald-500" /> +{discountResult.potentialPoints} Điểm thưởng tích lũy
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
