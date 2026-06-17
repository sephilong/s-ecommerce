
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { 
  Store, 
  ImageIcon, 
  Save, 
  ExternalLink, 
  Globe, 
  CreditCard, 
  Truck, 
  Facebook, 
  MessageCircle,
  Video,
  Settings2,
  Users,
  ShieldCheck,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export default function MerchantSettingsPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, updateStoreBranding } = useVendorStore();
  const vendor = profile ? getVendorByUserId(profile.email) : null;

  const [formData, setFormData] = useState({
    logo: "",
    banner: "",
    description: "",
    socialConfig: {
      facebookAppId: "",
      facebookPixelId: "",
      zaloOaId: "",
      fbPageId: "",
      enableLiveCommerce: false
    }
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        logo: vendor.storeLogo || "",
        banner: vendor.storeBanner || "",
        description: vendor.storeDescription || "",
        socialConfig: {
          facebookAppId: vendor.socialConfig?.facebookAppId || "",
          facebookPixelId: vendor.socialConfig?.facebookPixelId || "",
          zaloOaId: vendor.socialConfig?.zaloOaId || "",
          fbPageId: vendor.socialConfig?.fbPageId || "",
          enableLiveCommerce: !!vendor.socialConfig?.enableLiveCommerce
        }
      });
    }
  }, [vendor]);

  const handleSave = () => {
    if (!vendor) return;
    updateStoreBranding(vendor.id, {
      storeLogo: formData.logo,
      storeDescription: formData.description,
      socialConfig: formData.socialConfig
    });
    toast({ title: "Đã cập nhật cấu hình", description: "Cấu hình Social Commerce và thương hiệu đã được lưu." });
  };

  if (!vendor) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">Merchant Console</h1>
          <p className="text-muted-foreground font-medium">Thiết lập chuyên sâu cho thương hiệu và vận hành.</p>
        </div>
        <Button onClick={handleSave} className="rounded-xl h-12 font-black italic px-8 shadow-xl shadow-primary/20 gap-2">
           <Save className="w-4 h-4" /> LƯU TẤT CẢ
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="bg-[#111] border border-white/5 p-1.5 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto gap-2">
           <TabsTrigger value="branding" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Branding</TabsTrigger>
           <TabsTrigger value="social" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Social Commerce</TabsTrigger>
           <TabsTrigger value="payment" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Thanh toán</TabsTrigger>
           <TabsTrigger value="shipping" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Vận chuyển</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold italic border-b border-white/5 pb-4 flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> Visual Assets</h3>
                    <div className="space-y-6">
                       <div className="space-y-4">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Logo Cửa hàng</Label>
                          <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all">
                             {formData.logo ? (
                               <Image src={formData.logo} alt="Logo" fill className="object-cover" />
                             ) : (
                               <Store className="w-12 h-12 text-muted-foreground opacity-20" />
                             )}
                          </div>
                          <Input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="URL ảnh Logo..." className="h-11 rounded-xl bg-black border-white/10" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold italic border-b border-white/5 pb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Thông tin mô tả</h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Giới thiệu ngắn (About)</Label>
                          <Textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Mô tả sự chuyên nghiệp của cửa hàng..." 
                            className="min-h-[150px] rounded-[1.5rem] bg-black border-white/10 p-6 leading-relaxed" 
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-8 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <Facebook className="text-blue-500 w-6 h-6" />
                    <h3 className="text-xl font-bold italic">Facebook Integration</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Facebook App ID</Label>
                       <Input value={formData.socialConfig.facebookAppId} onChange={e => setFormData({...formData, socialConfig: {...formData.socialConfig, facebookAppId: e.target.value}})} className="h-11 rounded-xl bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Meta Pixel ID</Label>
                       <Input value={formData.socialConfig.facebookPixelId} onChange={e => setFormData({...formData, socialConfig: {...formData.socialConfig, facebookPixelId: e.target.value}})} className="h-11 rounded-xl bg-background" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Facebook Page ID</Label>
                       <Input value={formData.socialConfig.fbPageId} onChange={e => setFormData({...formData, socialConfig: {...formData.socialConfig, fbPageId: e.target.value}})} className="h-11 rounded-xl bg-background" />
                    </div>
                 </div>
              </Card>

              <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
                 <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                    <MessageCircle className="text-[#0190F3] w-6 h-6" />
                    <h3 className="text-xl font-bold italic">Zalo OA Config</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Zalo Official Account ID</Label>
                       <Input value={formData.socialConfig.zaloOaId} onChange={e => setFormData({...formData, socialConfig: {...formData.socialConfig, zaloOaId: e.target.value}})} className="h-11 rounded-xl bg-background" />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">Dùng để hiển thị nút Chat Zalo và gửi thông báo đơn hàng.</p>
                 </div>
              </Card>

              <Card className="md:col-span-2 bg-primary/5 border border-primary/20 rounded-[2rem] p-8 flex flex-col md:flex-row justify-between items-center gap-8">
                 <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-[1.5rem] bg-primary/20 flex items-center justify-center text-primary">
                       <Video className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                       <h3 className="text-xl font-black italic uppercase tracking-tighter">Facebook Live Commerce</h3>
                       <p className="text-sm text-muted-foreground">Tự động nhận diện bình luận đặt hàng và gửi link thanh toán cho khách lúc Livestream.</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-black/40 px-6 py-3 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest">{formData.socialConfig.enableLiveCommerce ? 'Kích hoạt' : 'Vô hiệu hóa'}</span>
                    <Switch 
                       checked={formData.socialConfig.enableLiveCommerce} 
                       onCheckedChange={v => setFormData({...formData, socialConfig: {...formData.socialConfig, enableLiveCommerce: v}})} 
                    />
                 </div>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="payment" className="mt-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10">
              <p className="text-muted-foreground italic">Quản lý các cổng thanh toán của gian hàng tại đây...</p>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
