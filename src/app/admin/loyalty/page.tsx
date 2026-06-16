
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, TrendingUp, Wallet, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AdminLoyaltyPage() {
  const { loyaltyConfig, updateLoyalty } = usePromotionStore();
  const [config, setConfig] = useState(loyaltyConfig);

  const handleSave = () => {
    updateLoyalty(config);
    toast({ title: "Cập nhật thành công", description: "Cấu hình điểm thưởng đã được lưu." });
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Điểm Thưởng & Thành Viên</h1>
        <p className="text-muted-foreground">Cấu hình cơ chế tích điểm và đổi thưởng cho khách hàng trung thành.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Tỉ lệ tích điểm
            </CardTitle>
            <CardDescription>Khách hàng nhận được bao nhiêu điểm khi mua hàng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Số tiền cho 1 điểm (VND)</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  value={config.earnRate} 
                  onChange={(e) => setConfig({...config, earnRate: parseInt(e.target.value)})}
                />
                <span className="text-sm text-muted-foreground shrink-0">VND = 1 Điểm</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Ví dụ: 10,000đ mua hàng nhận 1 điểm.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" /> Tỉ lệ quy đổi
            </CardTitle>
            <CardDescription>Giá trị của 1 điểm khi dùng để thanh toán.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Giá trị của 1 điểm (VND)</Label>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  value={config.redeemRate}
                  onChange={(e) => setConfig({...config, redeemRate: parseInt(e.target.value)})}
                />
                <span className="text-sm text-muted-foreground shrink-0">Điểm = VND</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Ví dụ: 100 điểm có giá trị 10,000đ.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" /> Điều kiện sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Điểm tối thiểu để đổi</Label>
              <Input 
                type="number" 
                value={config.minRedeemPoints}
                onChange={(e) => setConfig({...config, minRedeemPoints: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label>% Giảm tối đa trên đơn hàng</Label>
              <Input 
                type="number" 
                value={config.maxRedeemPercent}
                onChange={(e) => setConfig({...config, maxRedeemPercent: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="rounded-full px-8">Lưu cấu hình</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
