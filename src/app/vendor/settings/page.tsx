
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
  Languages, 
  Mail, 
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
    customDomain: "",
    taxId: "",
    notificationEmail: ""
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        logo: vendor.storeLogo || "",
        banner: vendor.storeBanner || "",
        description: vendor.storeDescription || "",
        customDomain: vendor.storeSlug + ".com",
        taxId: vendor.idNumber || "",
        notificationEmail: vendor.userId || ""
      });
    }
  }, [vendor]);

  const handleSave = () => {
    if (!vendor) return;
    updateStoreBranding(vendor.id, formData);
    toast({ title: "Đã cập nhật cấu hình", description: "Mọi thay đổi đã được áp dụng ngay lập tức cho cửa hàng." });
  };

  if (!vendor) return null;

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">Merchant Console</h1>
          <p className="text-muted-foreground font-medium">Thiết lập chuyên sâu cho thương hiệu và vận hành.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-white/10 h-12 font-bold px-8 bg-white/5">
          <Link href={`/shop/${vendor.storeSlug}`} target="_blank"><ExternalLink className="w-4 h-4 mr-2" /> Xem Cửa hàng</Link>
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="bg-[#111] border border-white/5 p-1.5 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto gap-2">
           <TabsTrigger value="branding" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Branding</TabsTrigger>
           <TabsTrigger value="domain" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Domain & SEO</TabsTrigger>
           <TabsTrigger value="payment" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Thanh toán</TabsTrigger>
           <TabsTrigger value="shipping" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Vận chuyển</TabsTrigger>
           <TabsTrigger value="staff" className="rounded-xl px-8 h-full data-[state=active]:bg-primary font-bold text-xs uppercase italic">Nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="mt-8 space-y-8">
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
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><ImageIcon className="w-6 h-6 text-white" /></div>
                          </div>
                          <Input value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="URL ảnh Logo..." className="h-11 rounded-xl bg-black border-white/10" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold italic border-b border-white/5 pb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-primary" /> Thông tin mô tả</h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Tên hiển thị Merchant</Label>
                          <Input value={vendor.storeName} disabled className="h-11 rounded-xl bg-white/5 opacity-50 font-bold" />
                       </div>
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

        <TabsContent value="domain" className="mt-8 space-y-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10">
              <div className="space-y-8 max-w-2xl">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                       <Globe className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-bold italic">Tên miền tùy chỉnh (Custom Domain)</h3>
                       <p className="text-sm text-muted-foreground">Kết nối domain riêng để nâng tầm uy tín thương hiệu.</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                       <Label className="text-xs font-bold">Domain mặc định (S-Com Hub)</Label>
                       <div className="flex gap-2">
                          <Input value={`${vendor.storeSlug}.scomhub.vn`} disabled className="h-12 rounded-xl bg-white/5" />
                          <Badge className="bg-green-500/10 text-green-500 border-none uppercase font-black tracking-tighter">Active</Badge>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-xs font-bold">Domain riêng của bạn</Label>
                       <div className="flex gap-2">
                          <Input value={formData.customDomain} onChange={(e) => setFormData({...formData, customDomain: e.target.value})} placeholder="www.yourshop.com" className="h-12 rounded-xl bg-black" />
                          <Button variant="secondary" className="rounded-xl px-8 font-bold">Kết nối</Button>
                       </div>
                       <p className="text-[10px] text-muted-foreground italic">Trỏ bản ghi A về IP: 1.2.3.4 để hoàn tất xác thực SSL.</p>
                    </div>
                 </div>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="payment" className="mt-8 space-y-8">
            <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10">
              <div className="space-y-6">
                 <h3 className="text-xl font-bold italic flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Cổng thanh toán Merchant</h3>
                 <p className="text-sm text-muted-foreground">Kích hoạt các phương thức thanh toán khách hàng có thể dùng tại cửa hàng của bạn.</p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <PaymentSwitch label="Thanh toán khi nhận hàng (COD)" isActive={true} />
                    <PaymentSwitch label="Ví MoMo Merchant" isActive={false} />
                    <PaymentSwitch label="Cổng VNPAY (QR Pay)" isActive={true} />
                    <PaymentSwitch label="Thanh toán Thẻ (Stripe)" isActive={false} />
                 </div>
              </div>
            </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold italic flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Staff Accounts</h3>
                 <Button className="rounded-full gap-2 font-bold px-6"><Plus className="w-4 h-4" /> Thêm nhân viên</Button>
              </div>
              <div className="space-y-4">
                 <StaffItem name="Admin (Chủ shop)" role="Owner" email={vendor.userId} />
                 <StaffItem name="Nguyễn Văn Sales" role="Manager" email="sales@shop.vn" />
              </div>
           </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-12 border-t border-white/5">
         <Button onClick={handleSave} size="lg" className="h-16 px-16 rounded-2xl font-black italic shadow-2xl shadow-primary/40 gap-3 text-lg">
            <Save className="w-6 h-6" /> LƯU TẤT CẢ THIẾT LẬP
         </Button>
      </div>
    </div>
  );
}

function PaymentSwitch({ label, isActive }: { label: string, isActive: boolean }) {
  return (
    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
       <span className="text-sm font-bold">{label}</span>
       <Switch checked={isActive} />
    </div>
  );
}

function StaffItem({ name, role, email }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
       <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary italic">{name[0]}</div>
          <div>
             <p className="text-sm font-bold">{name}</p>
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{email}</p>
          </div>
       </div>
       <Badge className="bg-primary/20 text-primary border-none text-[10px] rounded-full px-3">{role}</Badge>
    </div>
  );
}
