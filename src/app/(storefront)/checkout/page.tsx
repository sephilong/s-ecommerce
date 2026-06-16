
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
import { CreditCard, Check, Star, Loader2, ArrowLeft } from "lucide-react";
import { Coupon } from "@/lib/store-data";
import { getTenantConfig } from "@/lib/tenant";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore();
  const { paymentMethods } = useConfigStore();
  const { addOrder } = useOrderStore();
  const { profile } = useUserStore();
  const { promotions, coupons, loyaltyConfig } = usePromotionStore();
  const { addNotification } = useNotificationStore();
  const logEvent = useAnalyticsStore((state) => state.logEvent);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [activeTenant, setActiveTenant] = useState<any>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "", address: "", email: "" });

  useEffect(() => {
    if (profile) setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
      address: profile.address || "",
      email: profile.email || ""
    });
    
    const resolveTenant = async () => {
      const tenant = await getTenantConfig("demo");
      setActiveTenant(tenant);
    };
    resolveTenant();
    logEvent({ type: 'begin_checkout', value: totalPrice() });
  }, [profile, logEvent, totalPrice]);

  useEffect(() => {
    const activePMs = paymentMethods.filter(p => p.isActive);
    if (activePMs.length > 0 && !selectedPayment) setSelectedPayment(activePMs[0].id);
  }, [paymentMethods, selectedPayment]);

  const discountResult: DiscountResult = useMemo(() => {
    return calculateDiscount(items, 30000, promotions, appliedCoupon, 0, loyaltyConfig.earnRate);
  }, [items, promotions, appliedCoupon, loyaltyConfig]);

  const finalTotal = totalPrice() + 30000 - discountResult.totalDiscount;

  const completeOrder = () => {
    if (!formData.phone || !formData.address) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng nhập số điện thoại và địa chỉ." });
      return;
    }
    setLoading(true);
    const orderCode = `SCHUB-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      code: orderCode,
      tenantId: activeTenant?.id || 'demo',
      customerId: profile?.email || 'guest',
      items: items.map(i => ({ productId: i.product.id, name: i.product.name, qty: i.quantity, price: i.product.price, image: i.product.image })),
      shippingAddress: { fullName: `${formData.firstName} ${formData.lastName}`, phone: formData.phone, email: formData.email, street: formData.address, ward: "N/A", district: "N/A", province: "N/A", country: "VN" },
      shippingProviderId: 'default',
      shippingMethod: "Giao hàng tiêu chuẩn",
      shippingFee: 30000,
      paymentMethod: selectedPayment === 'pm4' ? 'COD' : 'Online',
      paymentStatus: 'pending',
      subtotal: totalPrice(),
      discountTotal: discountResult.totalDiscount,
      shippingDiscount: 0,
      total: finalTotal,
      status: 'created',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      addOrder(newOrder);
      logEvent({ type: 'purchase', value: finalTotal });
      if (profile) {
        addNotification({ userId: profile.email, title: 'Đặt hàng thành công', message: `Đơn hàng ${orderCode} đang chờ xác nhận.`, type: 'order', link: '/account/orders' });
      }
      addNotification({ userId: 'admin', title: 'Đơn hàng mới!', message: `Đơn hàng ${orderCode} giá trị ${formatVND(finalTotal)}.`, type: 'order', link: '/admin/orders' });
      setLoading(false);
      clearCart();
      router.push("/checkout/success");
    }, 1500);
  };

  if (items.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
      <h2 className="text-2xl font-bold italic uppercase">Giỏ hàng đang trống</h2>
      <Button onClick={() => router.push("/")} className="rounded-full">Quay lại mua sắm</Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-12 animate-in slide-in-from-left duration-500">
          <div className="space-y-2">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Thanh toán an toàn</h1>
            <p className="text-muted-foreground">Vui lòng cung cấp thông tin nhận hàng chính xác.</p>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3"><span className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white italic shadow-lg shadow-primary/20 text-sm">1</span> Thông tin người nhận</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Họ</Label>
                  <Input placeholder="Nguyễn" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-12 rounded-xl bg-card/50" />
              </div>
              <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tên</Label>
                  <Input placeholder="Văn A" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-12 rounded-xl bg-card/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Số điện thoại</Label>
              <Input placeholder="090..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl bg-card/50" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Địa chỉ chi tiết</Label>
              <Input placeholder="Số nhà, tên đường..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl bg-card/50" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-3"><span className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-white italic shadow-lg shadow-primary/20 text-sm">2</span> Phương thức thanh toán</h2>
            <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.filter(p => p.isActive).map(pm => (
                <Label key={pm.id} className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all ${selectedPayment === pm.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/5 hover:bg-white/5'}`}>
                  <RadioGroupItem value={pm.id} />
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                    <span className="font-bold text-sm">{pm.name}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </section>

          <Button onClick={completeOrder} className="w-full h-16 rounded-2xl text-xl font-black italic uppercase tracking-tighter shadow-2xl shadow-primary/30" disabled={loading}>
            {loading ? <><Loader2 className="animate-spin mr-2" /> Đang xử lý...</> : "Xác nhận đơn hàng"}
          </Button>
        </div>

        <aside className="w-full lg:w-[400px] space-y-6 animate-in slide-in-from-right duration-500">
            <Card className="bg-card/40 backdrop-blur-xl border-white/5 rounded-[2.5rem] p-8 h-fit sticky top-24">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter border-b border-white/10 pb-4 mb-6">Đơn hàng</h2>
              <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 shrink-0 relative">
                          <img src={item.product.image} alt={item.product.name} className="object-cover h-full w-full" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{item.product.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{item.quantity} x {formatVND(item.product.price)}</p>
                      </div>
                      <span className="font-bold text-sm">{formatVND(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold uppercase text-[10px]">Tạm tính</span>
                    <span className="font-medium">{formatVND(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-bold uppercase text-[10px]">Phí vận chuyển</span>
                    <span className="font-medium text-green-500">{formatVND(30000)}</span>
                  </div>
                  {discountResult.totalDiscount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span className="font-black uppercase text-[10px]">Khuyến mãi</span>
                      <span className="font-black italic">-{formatVND(discountResult.totalDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-2xl font-black italic pt-4 border-t border-white/20">
                    <span className="tracking-tighter">TỔNG CỘNG</span>
                    <span className="text-primary tracking-tighter">{formatVND(finalTotal)}</span>
                  </div>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-1">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                    <Star className="w-3 h-3 fill-current" /> Điểm thưởng dự kiến
                  </p>
                  <p className="text-lg font-black text-emerald-500">+{discountResult.potentialPoints} POINTS</p>
              </div>
            </Card>
            
            <Link href="/cart" className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Quay lại giỏ hàng
            </Link>
        </aside>
      </div>
    </div>
  );
}
