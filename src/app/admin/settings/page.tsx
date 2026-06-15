
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useConfigStore } from "@/store/configStore";
import { CreditCard, Truck, Settings2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const config = useConfigStore();
  const [localStoreName, setLocalStoreName] = useState("");
  const [localStoreDesc, setLocalStoreDesc] = useState("");

  useEffect(() => {
    setLocalStoreName(config.storeName);
    setLocalStoreDesc(config.storeDescription);
  }, [config.storeName, config.storeDescription]);

  const togglePayment = (id: string) => {
    const updated = config.paymentMethods.map(pm => pm.id === id ? { ...pm, isActive: !pm.isActive } : pm);
    config.updatePaymentMethods(updated);
  };

  const toggleShipping = (id: string) => {
    const updated = config.shippingMethods.map(sm => sm.id === id ? { ...sm, isActive: !sm.isActive } : sm);
    config.updateShippingMethods(updated);
  };

  const handleSave = () => {
    config.updateStoreInfo(localStoreName, localStoreDesc);
    toast({
      title: "Đã lưu cấu hình",
      description: "Thay đổi đã được áp dụng cho toàn bộ cửa hàng.",
    });
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cấu hình Hệ thống</h1>
        <p className="text-muted-foreground">Quản lý thanh toán, vận chuyển và thông tin thương hiệu.</p>
      </div>

      <div className="space-y-8">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" /> Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tên cửa hàng</Label>
                <Input value={localStoreName} onChange={(e) => setLocalStoreName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <Textarea value={localStoreDesc} onChange={(e) => setLocalStoreDesc(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Cấu hình Thanh toán
            </CardTitle>
            <CardDescription>Bật/tắt các cổng thanh toán hỗ trợ khách hàng Việt Nam.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.paymentMethods.map((pm) => (
              <div key={pm.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-white/5">
                <div className="space-y-1">
                  <p className="font-bold">{pm.name}</p>
                  <p className="text-xs text-muted-foreground">{pm.description}</p>
                </div>
                <Switch 
                  checked={pm.isActive} 
                  onCheckedChange={() => togglePayment(pm.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Đơn vị vận chuyển
            </CardTitle>
            <CardDescription>Cấu hình các đối tác giao hàng nội địa.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.shippingMethods.map((sm) => (
              <div key={sm.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-white/5">
                <div className="flex flex-col">
                  <p className="font-bold">{sm.name}</p>
                  <p className="text-xs text-muted-foreground">Phí mặc định: {sm.price.toLocaleString('vi-VN')}₫</p>
                </div>
                <Switch 
                  checked={sm.isActive} 
                  onCheckedChange={() => toggleShipping(sm.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button className="rounded-full px-8" onClick={handleSave}>Lưu tất cả cấu hình</Button>
        </div>
      </div>
    </div>
  );
}
