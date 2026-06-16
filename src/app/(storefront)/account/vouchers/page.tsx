
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, Timer } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function VoucherWalletPage() {
  const { coupons } = usePromotionStore();
  const { collectedCouponIds } = useUserStore();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Đã sao chép", description: `Mã ${code} đã được lưu vào bộ nhớ tạm.` });
  };

  const userCoupons = coupons.filter(c => collectedCouponIds.includes(c.id) && c.isActive);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Ví Voucher</h1>
        <p className="text-muted-foreground">Danh sách các mã giảm giá bạn đã thu thập.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userCoupons.map((coupon) => (
          <Card key={coupon.id} className="bg-card/50 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Ticket className="w-6 h-6" />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full gap-2 text-xs"
                  onClick={() => handleCopy(coupon.code)}
                >
                  <Copy className="w-3 h-3" /> {coupon.code}
                </Button>
              </div>
              <CardTitle className="text-xl mt-4">
                {coupon.discountType === 'percent' ? `Giảm ${coupon.discountValue}%` : `Giảm ${coupon.discountValue.toLocaleString()}₫`}
              </CardTitle>
              <CardDescription className="text-xs">{coupon.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                <Timer className="w-3 h-3" /> HSD: Không thời hạn
              </div>
              <Button asChild size="sm" className="rounded-full text-[10px] font-bold h-8 px-4">
                <Link href="/products">Dùng ngay</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {userCoupons.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10 space-y-4">
          <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Ví của bạn hiện chưa có voucher nào.</p>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/">Khám phá ưu đãi</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
