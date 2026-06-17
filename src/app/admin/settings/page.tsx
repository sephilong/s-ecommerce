
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfigStore } from "@/store/configStore";
import { 
  CreditCard, 
  Truck, 
  Settings2, 
  Facebook, 
  MessageCircle, 
  Video, 
  ShieldCheck, 
  Save, 
  Globe 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";

export default function AdminSettingsPage() {
  const config = useConfigStore();
  const searchParams = useSearchParams();
  const [localStoreName, setLocalStoreName] = useState("");
  const [localStoreDesc, setLocalStoreDesc] = useState("");
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "general");

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
      description: "Thay đổi đã được áp dụng cho toàn bộ nền tảng.",
    });
  };

  return (
    <div className="max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">Cấu hình Hệ thống</h1>
          <p className="text-muted-foreground">Thiết lập các tham số cốt lõi cho toàn bộ hệ sinh thái S-Com Hub.</p>
        </div>
        <Button className="rounded-full px-10 h-12 font-bold shadow-xl shadow-primary/20 gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" /> Lưu tất cả cấu hình
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto gap-2">
           <TabsTrigger value="general" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Cấu hình Chung</TabsTrigger>
           <TabsTrigger value="social" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Social Commerce</TabsTrigger>
           <TabsTrigger value="payment" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Thanh toán</TabsTrigger>
           <TabsTrigger value="shipping" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Vận chuyển</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-8 space-y-8">
          <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 shadow-2xl">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 italic">
                <Settings2 className="w-5 h-5 text-primary" /> Thông tin Nền tảng
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground">Tên nền tảng hiển thị</Label>
                  <Input value={localStoreName} onChange={(e) => setLocalStoreName(e.target.value)} className="h-12 rounded-xl bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-muted-foreground">Domain chính (Root)</Label>
                  <Input value="scomhub.vn" disabled className="h-12 rounded-xl bg-white/5 opacity-50 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black text-muted-foreground">Mô tả hệ thống (SEO)</Label>
                <Textarea value={localStoreDesc} onChange={(e) => setLocalStoreDesc(e.target.value)} className="min-h-[120px] rounded-2xl bg-background/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Facebook className="text-blue-500 w-6 h-6" />
                    <h3 className="text-xl font-bold italic">Facebook Platform</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Global Facebook App ID</Label>
                       <Input placeholder="Nhập App ID dùng chung cho toàn sàn..." className="h-11 rounded-xl bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Global Meta Pixel ID</Label>
                       <Input placeholder="Dùng để track traffic toàn sàn..." className="h-11 rounded-xl bg-background" />
                    </div>
                 </div>
              </Card>

              <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <MessageCircle className="text-[#0190F3] w-6 h-6" />
                    <h3 className="text-xl font-bold italic">Zalo API Integration</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Zalo App ID</Label>
                       <Input placeholder="Nhập App ID từ Zalo Developer..." className="h-11 rounded-xl bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Zalo Secret Key</Label>
                       <Input type="password" placeholder="••••••••••••" className="h-11 rounded-xl bg-background" />
                    </div>
                 </div>
              </Card>

              <Card className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary">
                       <Video className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter">Tính năng Live Commerce</h3>
                       <p className="text-sm text-muted-foreground">Cho phép các Merchant sử dụng hệ thống tự động chốt đơn qua livestream Facebook/Tiktok.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest italic">Trạng thái Nền tảng: SẴN SÀNG</span>
                    <Switch checked={true} />
                 </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.paymentMethods.map((pm) => (
                <Card key={pm.id} className="bg-[#111] border-white/5 rounded-[2rem] p-8 hover:border-primary/30 transition-all group">
                   <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <Switch 
                        checked={pm.isActive} 
                        onCheckedChange={() => togglePayment(pm.id)}
                      />
                   </div>
                   <h3 className="text-lg font-bold italic">{pm.name}</h3>
                   <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{pm.description}</p>
                </Card>
              ))}
           </div>
        </TabsContent>

        <TabsContent value="shipping" className="mt-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.shippingMethods.map((sm) => (
                <Card key={sm.id} className="bg-[#111] border-white/5 rounded-[2rem] p-8 hover:border-primary/30 transition-all group">
                   <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Truck className="w-6 h-6" />
                      </div>
                      <Switch 
                        checked={sm.isActive} 
                        onCheckedChange={() => toggleShipping(sm.id)}
                      />
                   </div>
                   <h3 className="text-lg font-bold italic">{sm.name}</h3>
                   <p className="text-xs text-muted-foreground mt-1">Phí vận chuyển mặc định: <span className="text-primary font-bold">{sm.price.toLocaleString('vi-VN')}₫</span></p>
                </Card>
              ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
