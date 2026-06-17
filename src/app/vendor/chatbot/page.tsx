
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  Settings2, 
  Sparkles, 
  Save, 
  ShieldCheck, 
  Truck, 
  BrainCircuit,
  MessageSquare,
  Zap,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export default function VendorChatbotPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, updateStoreBranding } = useVendorStore();
  const vendor = profile ? getVendorByUserId(profile.email) : null;

  const [localConfig, setLocalConfig] = useState({
    isEnabled: true,
    botName: "Shop Assistant",
    greeting: "Chào bạn! Shop có thể giúp gì cho bạn?",
    knowledgeBase: ""
  });

  useEffect(() => {
    if (vendor?.chatbotConfig) {
      setLocalConfig({
        isEnabled: vendor.chatbotConfig.isEnabled,
        botName: vendor.chatbotConfig.botName,
        greeting: vendor.chatbotConfig.greeting,
        knowledgeBase: vendor.chatbotConfig.knowledgeBase
      });
    }
  }, [vendor]);

  const handleSave = () => {
    if (!vendor) return;
    updateStoreBranding(vendor.id, { chatbotConfig: localConfig });
    toast({ title: "Đã lưu cấu hình AI", description: "Trợ lý ảo đã được cập nhật kiến thức mới." });
  };

  if (!vendor) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            AI ASSISTANT
          </h1>
          <p className="text-muted-foreground font-medium pl-16">Cấu hình trợ lý ảo chuyên biệt cho gian hàng của bạn.</p>
        </div>
        <Button onClick={handleSave} className="rounded-xl h-11 px-8 font-black italic shadow-xl shadow-primary/20 gap-2">
          <Save className="w-4 h-4" /> LƯU THIẾT LẬP
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <CardHeader className="px-0 pt-0">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Settings2 className="w-5 h-5 text-primary" />
                    <CardTitle className="text-xl italic">Cấu hình Cơ bản</CardTitle>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl">
                    <Label className="text-xs font-bold cursor-pointer">Trạng thái Bot</Label>
                    <Switch 
                      checked={localConfig.isEnabled} 
                      onCheckedChange={(v) => setLocalConfig({...localConfig, isEnabled: v})} 
                    />
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tên Chatbot</Label>
                  <Input 
                    value={localConfig.botName} 
                    onChange={(e) => setLocalConfig({...localConfig, botName: e.target.value})}
                    className="h-12 rounded-xl bg-background/50" 
                  />
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lời chào khách hàng</Label>
                  <Textarea 
                    value={localConfig.greeting} 
                    onChange={(e) => setLocalConfig({...localConfig, greeting: e.target.value})}
                    className="min-h-[100px] rounded-2xl bg-background/50" 
                  />
               </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
             <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl italic">Knowledge Base (Cơ sở tri thức)</CardTitle>
                </div>
                <CardDescription>Dữ liệu riêng của shop giúp AI tư vấn chính xác hơn (chính sách, FAQ riêng).</CardDescription>
             </CardHeader>
             <CardContent className="px-0 pt-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground">Thông tin bổ sung cho AI</Label>
                   <Textarea 
                    value={localConfig.knowledgeBase} 
                    onChange={(e) => setLocalConfig({...localConfig, knowledgeBase: e.target.value})}
                    placeholder="VD: Shop chỉ bán hàng chính hãng Apple, bảo hành tại trung tâm ủy quyền. Phí ship nội thành 20k..." 
                    className="min-h-[200px] rounded-2xl bg-background/50" 
                   />
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-6">
                 <h3 className="font-bold text-sm italic uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Tại sao dùng AI?
                 </h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    AI tự động trả lời 24/7 giúp bạn không bỏ lỡ khách hàng tiềm năng, giảm tải cho đội ngũ CSKH và tăng tỉ lệ chốt đơn ngay lập tức.
                 </p>
                 <div className="pt-4 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-muted-foreground">Tốc độ phản hồi:</span>
                       <span className="text-primary italic">&lt; 1s</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                       <span className="text-muted-foreground">Tỉ lệ tự động hóa:</span>
                       <span className="text-primary italic">~80%</span>
                    </div>
                 </div>
              </div>
           </Card>

           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-bold text-sm italic uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Thống kê của Shop
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Số tin nhắn AI xử lý:</span>
                    <span className="text-sm font-black italic">42</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Sản phẩm được gợi ý:</span>
                    <span className="text-sm font-black italic">15</span>
                 </div>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                 <Info className="w-4 h-4 text-blue-400 shrink-0" />
                 <p className="text-[10px] text-blue-400/80 italic">AI đang sử dụng dữ liệu kho hàng hiện tại để tư vấn cho khách.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
