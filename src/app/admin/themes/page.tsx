
"use client";

import { useThemeStore, Theme, ThemeConfig } from "@/store/themeStore";
import { useBuilderStore } from "@/store/builderStore";
import { useVendorStore } from "@/store/vendorStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Palette, 
  Eye, 
  Check, 
  Download, 
  Upload, 
  Trash2, 
  Sparkles,
  Info,
  Code,
  Layout,
  Store,
  RefreshCcw
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
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

export default function AdminThemesPage() {
  const { themes, platformThemeId, setPlatformTheme, addTheme, deleteTheme } = useThemeStore();
  const { updateTheme: updateBuilderTheme } = useBuilderStore();
  const { vendors, updateStorefrontConfig } = useVendorStore();
  
  const [importJson, setReplyJson] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleApplyToPlatform = (theme: Theme) => {
    setPlatformTheme(theme.id);
    updateBuilderTheme(theme.config);
    toast({ title: "Đã áp dụng theme", description: `${theme.name} hiện là giao diện mặc định của hệ thống.` });
  };

  const handleApplyToVendor = (vendorId: string, theme: Theme) => {
    updateStorefrontConfig(vendorId, { sections: [], theme: theme.config });
    toast({ title: "Thành công", description: `Đã áp dụng theme ${theme.name} cho Vendor.` });
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (!parsed.name || !parsed.config) throw new Error("JSON không đúng định dạng Theme.");
      
      const newTheme: Theme = {
        ...parsed,
        id: `custom-${Date.now()}`,
        thumbnail: parsed.thumbnail || 'https://picsum.photos/seed/custom/600/400',
        author: parsed.author || 'Admin Import',
        isPremium: !!parsed.isPremium
      };
      
      addTheme(newTheme);
      setIsImportOpen(false);
      setReplyJson("");
      toast({ title: "Nhập theme thành công", description: `Theme ${newTheme.name} đã được thêm vào kho.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Lỗi định dạng", description: e.message });
    }
  };

  const sampleJson = JSON.stringify({
    name: "My Awesome Theme",
    description: "Mô tả theme của bạn...",
    config: {
      primaryColor: "200 95% 45%",
      borderRadius: "12px",
      mode: "dark",
      fontFamily: "Inter"
    }
  }, null, 2);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Palette className="w-7 h-7" />
            </div>
            KHO GIAO DIỆN (THEMES)
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Quản lý 10 theme chuyên nghiệp và tùy biến giao diện cho toàn bộ hệ thống.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full h-11 px-6 font-bold gap-2 border-white/10">
                <Upload className="w-4 h-4" /> Import Theme
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle className="font-headline italic">IMPORT CUSTOM THEME</DialogTitle>
                <DialogDescription>Dán mã JSON cấu hình theme vào ô bên dưới để thêm giao diện mới.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                 <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                      <Code className="w-3 h-3" /> Cấu trúc mẫu
                    </p>
                    <pre className="text-[10px] font-mono text-primary/70 leading-relaxed overflow-x-auto">
                      {sampleJson}
                    </pre>
                 </div>
                 <Textarea 
                  placeholder="Dán mã JSON tại đây..." 
                  value={importJson}
                  onChange={(e) => setReplyJson(e.target.value)}
                  className="min-h-[150px] rounded-2xl bg-background/50 border-white/5"
                 />
              </div>
              <DialogFooter>
                <Button className="w-full rounded-xl h-12 font-bold" onClick={handleImport}>Xác nhận Import</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="rounded-full h-11 px-6 font-bold gap-2 shadow-xl shadow-primary/20">
            <Plus className="w-4 h-4" /> Thiết kế mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => (
          <Card key={theme.id} className={`bg-card/40 border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/50 transition-all ${platformThemeId === theme.id ? 'ring-2 ring-primary border-primary/50' : ''}`}>
            <div className="relative aspect-video overflow-hidden">
               <Image src={theme.thumbnail} alt={theme.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" className="rounded-full h-9 px-4 font-bold text-xs"><Eye className="w-4 h-4 mr-1" /> Preview</Button>
               </div>
               {theme.isPremium && (
                 <Badge className="absolute top-4 right-4 bg-yellow-500 text-black font-black italic rounded-full px-3 py-1 shadow-lg">
                   <Sparkles className="w-3 h-3 mr-1" /> PREMIUM
                 </Badge>
               )}
               {platformThemeId === theme.id && (
                 <Badge className="absolute top-4 left-4 bg-primary text-white font-black italic rounded-full px-3 py-1 shadow-lg">
                   <Check className="w-3 h-3 mr-1" /> ĐANG DÙNG
                 </Badge>
               )}
            </div>
            
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-headline italic">{theme.name}</CardTitle>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Bởi {theme.author}</p>
                </div>
                <div 
                  className="h-6 w-6 rounded-full border border-white/10" 
                  style={{ backgroundColor: `hsl(${theme.config.primaryColor})` }}
                />
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
               <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">"{theme.description}"</p>
               <div className="mt-4 flex gap-2">
                  <Badge variant="outline" className="rounded-full text-[8px] bg-white/5 border-white/10">{theme.config.mode.toUpperCase()}</Badge>
                  <Badge variant="outline" className="rounded-full text-[8px] bg-white/5 border-white/10">RADIUS: {theme.config.borderRadius}</Badge>
               </div>
            </CardContent>

            <CardFooter className="pt-0 flex gap-2">
               <Button 
                onClick={() => handleApplyToPlatform(theme)}
                className={`flex-1 rounded-xl h-10 font-bold text-xs ${platformThemeId === theme.id ? 'bg-green-500 hover:bg-green-600' : ''}`}
                disabled={platformThemeId === theme.id}
               >
                 {platformThemeId === theme.id ? "Đang áp dụng" : "Dùng toàn sàn"}
               </Button>
               
               <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 rounded-xl h-10 font-bold text-xs gap-2">
                       <Store className="w-3.5 h-3.5" /> Gán cho Shop
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-[2.5rem]">
                    <DialogHeader>
                      <DialogTitle className="font-headline italic">CHỌN CỬA HÀNG ÁP DỤNG</DialogTitle>
                      <DialogDescription>Giao diện của Vendor sẽ được cập nhật ngay lập tức sang {theme.name}.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                       {vendors.map(v => (
                         <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group/vendor">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary italic">
                                  {v.storeName.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-sm">{v.storeName}</p>
                                  <p className="text-[10px] text-muted-foreground">{v.storeSlug}.scomhub.vn</p>
                               </div>
                            </div>
                            <Button size="sm" className="rounded-full h-8 px-4 font-bold opacity-0 group-hover/vendor:opacity-100 transition-opacity" onClick={() => handleApplyToVendor(v.id, theme)}>Gán ngay</Button>
                         </div>
                       ))}
                    </div>
                  </DialogContent>
               </Dialog>

               <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 text-destructive" onClick={() => deleteTheme(theme.id)}>
                 <Trash2 className="w-4 h-4" />
               </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <RefreshCcw className="w-8 h-8" />
               </div>
               <h2 className="text-3xl font-black font-headline italic tracking-tighter uppercase leading-none">Khôi phục Theme Gốc</h2>
               <p className="text-muted-foreground leading-relaxed">
                  Nếu bạn gặp sự cố với các theme tùy chỉnh hoặc muốn quay lại giao diện tiêu chuẩn của S-Com Hub, bạn có thể nhấn nút khôi phục để đưa hệ thống về trạng thái Midnight Tech nguyên bản.
               </p>
               <Button className="rounded-full px-10 h-12 font-bold shadow-lg shadow-primary/20">Khôi phục mặc định &rarr;</Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square bg-white/5 rounded-3xl border border-white/10 border-dashed flex items-center justify-center">
                    <Layout className="w-8 h-8 text-muted-foreground opacity-20" />
                 </div>
               ))}
            </div>
         </div>
      </Card>
    </div>
  );
}
