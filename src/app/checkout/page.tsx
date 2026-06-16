
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
import { CreditCard, Check, Star, Loader2 } from "lucide-react";
import { Coupon } from "@/lib/store-data";
import { getTenantConfig } from "@/lib/tenant";
import { Header } from "@/components/layout/Header";

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
      paymentMethod: "COD",
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

  if (items.length === 0) return <div className="p-20 text-center"><Button onClick={() => router.push("/")}>Quay lại trang chủ</Button></div>;

  return (
    <div className="min-h-screen bg-background">
      {activeTenant && <Header tenant={activeTenant} />}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12 text-center uppercase italic tracking-tighter">THANH TOÁN</h1>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white italic">1</span> Thông tin nhận hàng</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Họ" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                <Input placeholder="Tên" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <Input placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <Input placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </section>
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white italic">2</span> Phương thức</h2>
              <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                {paymentMethods.filter(p => p.isActive).map(pm => (
                  <Label key={pm.id} className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer">
                    <RadioGroupItem value={pm.id} /> <span className="font-bold">{pm.name}</span>
                  </Label>
                ))}
              </RadioGroup>
            </section>
            <Button onClick={completeOrder} className="w-full h-14 rounded-2xl text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "XÁC NHẬN ĐẶT HÀNG"}
            </Button>
          </div>
          <Card className="bg-card/40 rounded-3xl p-8 h-fit sticky top-24">
             <h2 className="text-xl font-bold border-b pb-4 mb-4 italic uppercase">Đơn hàng của bạn</h2>
             <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.product.name} x {item.quantity}</span>
                    <span className="font-bold">{formatVND(item.product.price * item.quantity)}</span>
                  </div>
                ))}
             </div>
             <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-sm"><span>Tạm tính</span><span>{formatVND(totalPrice())}</span></div>
                <div className="flex justify-between text-sm text-primary"><span>Giảm giá</span><span>-{formatVND(discountResult.totalDiscount)}</span></div>
                <div className="flex justify-between text-xl font-black italic pt-4"><span>TỔNG CỘNG</span><span className="text-primary">{formatVND(finalTotal)}</span></div>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
