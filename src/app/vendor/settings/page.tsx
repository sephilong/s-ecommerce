
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Store, ImageIcon, Image as ImageIconLucide, Save, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function VendorSettingsPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, updateStoreBranding } = useVendorStore();
  const vendor = profile ? getVendorByUserId(profile.email) : null;

  const [formData, setFormData] = useState({
    logo: "",
    banner: "",
    description: ""
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        logo: vendor.storeLogo || "",
        banner: vendor.storeBanner || "",
        description: vendor.storeDescription || ""
      });
    }
  }, [vendor]);

  const handleSave = () => {
    if (!vendor) return;
    updateStoreBranding(vendor.id, formData);
    toast({ title: "Đã cập nhật", description: "Thông tin gian hàng của bạn đã được lưu thành công." });
  };

  if (!vendor) return null;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Thiết lập Gian hàng</h1>
          <p className="text-muted-foreground">Xây dựng thương hiệu và uy tín cho shop của bạn.</p>
        </div>
        <Button asChild variant="outline" className="rounded-xl border-white/10">
          <Link href={`/shop/${vendor.storeSlug}`} target="_blank"><ExternalLink className="w-4 h-4 mr-2" /> Xem Shop thực tế</Link>
        </Button>
      </div>

      <div className="space-y-8">
        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] p-10">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl italic">Thương hiệu & Hình ảnh</CardTitle>
            <CardDescription>Logo và Banner là những thứ đầu tiên khách hàng nhìn thấy.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-4">
                  <Label>Logo Shop (Tỉ lệ 1:1)</Label>
                  <div className="relative h-40 w-40 rounded-3xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all">
                     {formData.logo ? (
                       <Image src={formData.logo} alt="Logo" fill className="object-cover" />
                     ) : (
                       <Store className="w-12 h-12 text-muted-foreground opacity-20" />
                     )}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIconLucide className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <Input 
                    placeholder="URL ảnh Logo..." 
                    value={formData.logo} 
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                    className="h-10 rounded-xl bg-background/50 border-white/5" 
                  />
               </div>

               <div className="space-y-4">
                  <Label>Banner Shop (Tỉ lệ 16:9)</Label>
                  <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all">
                     {formData.banner ? (
                       <Image src={formData.banner} alt="Banner" fill className="object-cover" />
                     ) : (
                       <ImageIconLucide className="w-12 h-12 text-muted-foreground opacity-20" />
                     )}
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIconLucide className="w-6 h-6 text-white" />
                     </div>
                  </div>
                  <Input 
                    placeholder="URL ảnh Banner..." 
                    value={formData.banner} 
                    onChange={(e) => setFormData({...formData, banner: e.target.value})}
                    className="h-10 rounded-xl bg-background/50 border-white/5" 
                  />
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] p-10">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-xl italic">Nội dung giới thiệu</CardTitle>
          </CardHeader>
          <CardContent className="px-0 space-y-6">
             <div className="space-y-2">
                <Label>Tên hiển thị cửa hàng</Label>
                <Input value={vendor.storeName} disabled className="h-12 rounded-xl bg-muted/20 opacity-60" />
                <p className="text-[10px] text-muted-foreground italic">Tên Shop chỉ có thể thay đổi thông qua yêu cầu hỗ trợ Admin.</p>
             </div>
             <div className="space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Hãy viết gì đó thật hấp dẫn về cửa hàng của bạn..." 
                  className="min-h-[150px] rounded-2xl bg-background/50 border-white/5" 
                />
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
           <Button onClick={handleSave} className="h-14 px-12 rounded-2xl font-black italic shadow-xl shadow-primary/20 gap-2">
              <Save className="w-5 h-5" /> LƯU THIẾT LẬP
           </Button>
        </div>
      </div>
    </div>
  );
}
