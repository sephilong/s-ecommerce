
"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfigStore } from "@/store/configStore";
import { 
  CreditCard, 
  Truck, 
  Settings2, 
  Facebook, 
  MessageCircle, 
  Save, 
  Globe,
  Search,
  BarChart3,
  ExternalLink,
  Code,
  Tag,
  ShieldCheck,
  SearchCode,
  Smartphone,
  QrCode,
  CircleDollarSign,
  Lock,
  Edit
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center animate-pulse text-primary font-black italic uppercase">Đang tải cấu hình...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const config = useConfigStore();
  const searchParams = useSearchParams();
  const [localStoreName, setLocalStoreName] = useState("");
  const [localStoreDesc, setLocalStoreDesc] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [editingPayment, setEditingPayment] = useState<any>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    setLocalStoreName(config.storeName);
    setLocalStoreDesc(config.storeDescription);
  }, [config.storeName, config.storeDescription]);

  const handleSave = () => {
    config.updateStoreInfo(localStoreName, localStoreDesc);
    toast({
      title: "Đã lưu cấu hình",
      description: "Thay đổi đã được áp dụng cho toàn bộ nền tảng.",
    });
  };

  const savePaymentConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates: any = {};
    formData.forEach((val, key) => { updates[key] = val; });
    
    config.updatePaymentConfig(editingPayment.id, updates);
    setEditingPayment(null);
    toast({ title: "Đã cập nhật", description: `Cấu hình ${editingPayment.name} đã được lưu.` });
  };

  const merchantFeedUrl = typeof window !== 'undefined' ? `${window.location.origin}/api/feeds/google-merchant` : '/api/feeds/google-merchant';

  return (
    <div className="max-w-5xl space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">Cấu hình Hệ thống</h1>
          <p className="text-muted-foreground font-medium italic">Thiết lập các cổng thanh toán, vận chuyển và SEO cho toàn sàn.</p>
        </div>
        <Button className="rounded-full px-10 h-12 font-black italic uppercase shadow-xl shadow-primary/20 gap-2" onClick={handleSave}>
          <Save className="w-4 h-4" /> Lưu tất cả
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1.5 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto gap-2">
           <TabsTrigger value="general" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Cấu hình Chung</TabsTrigger>
           <TabsTrigger value="social" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Social Commerce</TabsTrigger>
           <TabsTrigger value="google" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Google & SEO</TabsTrigger>
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
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Tên nền tảng hiển thị</Label>
                  <Input value={localStoreName} onChange={(e) => setLocalStoreName(e.target.value)} className="h-12 rounded-xl bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Domain chính (Root)</Label>
                  <Input value="scomhub.vn" disabled className="h-12 rounded-xl bg-white/5 opacity-50 font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-muted-foreground">Mô tả hệ thống (SEO)</Label>
                <Textarea value={localStoreDesc} onChange={(e) => setLocalStoreDesc(e.target.value)} className="min-h-[120px] rounded-2xl bg-background/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.paymentMethods.map((pm) => (
                <Card key={pm.id} className="bg-[#111] border-white/5 rounded-[2rem] p-8 hover:border-primary/30 transition-all group relative overflow-hidden">
                   <div className="flex items-center justify-between mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {pm.type === 'vnpay' && <ShieldCheck className="w-6 h-6" />}
                        {pm.type === 'momo' && <Smartphone className="w-6 h-6" />}
                        {pm.type === 'banking' && <QrCode className="w-6 h-6" />}
                        {pm.type === 'cod' && <CircleDollarSign className="w-6 h-6" />}
                      </div>
                      <Switch 
                        checked={pm.isActive} 
                        onCheckedChange={(v) => config.togglePaymentMethod(pm.id, v)} 
                      />
                   </div>
                   <h3 className="text-xl font-black italic uppercase tracking-tighter">{pm.name}</h3>
                   <p className="text-xs text-muted-foreground mt-2 leading-relaxed h-10 line-clamp-2">{pm.description}</p>
                   
                   <div className="pt-8 flex justify-end">
                      <Button variant="outline" size="sm" className="rounded-full h-10 px-6 gap-2 font-bold" onClick={() => setEditingPayment(pm)}>
                        <Edit className="w-3.5 h-3.5" /> Thiết lập API
                      </Button>
                   </div>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* CÁC TABS KHÁC GIỮ NGUYÊN (Google, Social, Shipping) */}
        <TabsContent value="google" className="mt-8 space-y-8">
           <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 shadow-2xl">
              <CardHeader className="px-0 pt-0">
                 <CardTitle className="flex items-center gap-2 italic">
                    <BarChart3 className="w-5 h-5 text-primary" /> Google Analytics & SEO
                 </CardTitle>
              </CardHeader>
              <CardContent className="px-0 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground">GA4 Measurement ID</Label>
                       <Input placeholder="G-XXXXXXXXXX" className="h-11 rounded-xl bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-muted-foreground">Search Console Code</Label>
                       <Input placeholder="google-site-verification" className="h-11 rounded-xl bg-background" />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Configuration Dialog */}
      <Dialog open={!!editingPayment} onOpenChange={(o) => !o && setEditingPayment(null)}>
        <DialogContent className="max-w-xl rounded-[2.5rem] bg-[#0f0f0f] border-white/10 p-10">
          {editingPayment && (
            <form onSubmit={savePaymentConfig}>
              <DialogHeader>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                   <Lock className="w-6 h-6" />
                </div>
                <DialogTitle className="text-3xl font-headline italic uppercase tracking-tighter">CẤU HÌNH {editingPayment.name}</DialogTitle>
                <DialogDescription>Nhập thông tin kết nối từ nhà cung cấp để thực hiện giao dịch thực.</DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-8">
                 {editingPayment.type === 'vnpay' && (
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>VNPAY TmnCode (Mã Terminal)</Label>
                        <Input name="tmnCode" defaultValue={editingPayment.config.tmnCode} placeholder="VD: SCOM0001" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>VNPAY HashKey (Chuỗi bí mật)</Label>
                        <Input name="hashKey" type="password" defaultValue={editingPayment.config.hashKey} placeholder="SECRET_KEY" className="h-11 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label>URL Cổng thanh toán (Sandbox/Prod)</Label>
                        <Input name="baseUrl" defaultValue={editingPayment.config.baseUrl} className="h-11 rounded-xl bg-muted/50" />
                      </div>
                   </div>
                 )}

                 {editingPayment.type === 'momo' && (
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Partner Code</Label>
                           <Input name="partnerCode" defaultValue={editingPayment.config.partnerCode} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <Label>Access Key</Label>
                           <Input name="accessKey" defaultValue={editingPayment.config.accessKey} className="h-11 rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secret Key</Label>
                        <Input name="secretKey" type="password" defaultValue={editingPayment.config.secretKey} className="h-11 rounded-xl" />
                      </div>
                   </div>
                 )}

                 {editingPayment.type === 'banking' && (
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên ngân hàng (VietQR)</Label>
                        <Input name="bankName" defaultValue={editingPayment.config.bankName} placeholder="VD: Vietcombank" className="h-11 rounded-xl" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Số tài khoản</Label>
                           <Input name="accountNo" defaultValue={editingPayment.config.accountNo} className="h-11 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                           <Label>Mã BIN Ngân hàng</Label>
                           <Input name="bin" defaultValue={editingPayment.config.bin} placeholder="970436" className="h-11 rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Tên chủ tài khoản (Viết hoa)</Label>
                        <Input name="accountName" defaultValue={editingPayment.config.accountName} className="h-11 rounded-xl uppercase" />
                      </div>
                   </div>
                 )}

                 {editingPayment.type === 'cod' && (
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Hướng dẫn thanh toán cho khách</Label>
                        <Textarea name="instructions" defaultValue={editingPayment.config.instructions} className="min-h-[120px] rounded-2xl" />
                      </div>
                   </div>
                 )}
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full h-14 rounded-2xl font-black italic uppercase shadow-xl shadow-primary/30 text-lg">Lưu cấu hình API</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
