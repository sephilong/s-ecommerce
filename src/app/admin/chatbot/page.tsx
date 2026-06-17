"use client";

import { useChatbotStore } from "@/store/chatbotStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Bot, 
  Settings2, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Save, 
  Code,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminChatbotSettings() {
  const { config, updateConfig } = useChatbotStore();
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    updateConfig(localConfig);
    toast({ title: "Đã lưu cấu hình", description: "Hệ thống AI Chatbot đã được cập nhật thông tin mới." });
  };

  const embedScript = `<script src="https://cdn.scomhub.vn/widget.js?id=PLATFORM-1" async></script>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Bot className="w-7 h-7" />
            </div>
            AI CHATBOT ENGINE
          </h1>
          <p className="text-muted-foreground font-medium pl-16">Cấu hình trợ lý ảo thông minh và cơ sở tri thức (Knowledge Base).</p>
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
                    <Label htmlFor="enable-bot" className="text-xs font-bold cursor-pointer">Trạng thái Bot</Label>
                    <Switch 
                      id="enable-bot" 
                      checked={localConfig.isEnabled} 
                      onCheckedChange={(v) => setLocalConfig({...localConfig, isEnabled: v})} 
                    />
                  </div>
               </div>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tên Chatbot hiển thị</Label>
                    <Input 
                      value={localConfig.chatbotName} 
                      onChange={(e) => setLocalConfig({...localConfig, chatbotName: e.target.value})}
                      className="h-12 rounded-xl bg-background/50" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">AI Model Engine</Label>
                    <Input value="Gemini 2.5 Flash (S-Com Optimized)" disabled className="h-12 rounded-xl bg-white/5 opacity-50 font-bold" />
                  </div>
               </div>
               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Lời chào mặc định (Greeting)</Label>
                  <Textarea 
                    value={localConfig.greetingMessage} 
                    onChange={(e) => setLocalConfig({...localConfig, greetingMessage: e.target.value})}
                    className="min-h-[100px] rounded-2xl bg-background/50" 
                  />
               </div>
            </CardContent>
          </Card>

          <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
             <CardHeader className="px-0 pt-0">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl italic">Knowledge Base (Cơ sở tri thức)</CardTitle>
                </div>
                <CardDescription>Cung cấp dữ liệu để AI tư vấn khách hàng chính xác theo chính sách của bạn.</CardDescription>
             </CardHeader>
             <CardContent className="px-0 space-y-6">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Chính sách đổi trả & Bảo hành
                   </Label>
                   <Textarea 
                    value={localConfig.returnPolicy} 
                    onChange={(e) => setLocalConfig({...localConfig, returnPolicy: e.target.value})}
                    placeholder="Nhập quy định đổi trả..." 
                    className="min-h-[120px] rounded-2xl bg-background/50" 
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-orange-400" /> Chính sách vận chuyển
                   </Label>
                   <Textarea 
                    value={localConfig.shippingPolicy} 
                    onChange={(e) => setLocalConfig({...localConfig, shippingPolicy: e.target.value})}
                    placeholder="Nhập khu vực và phí giao hàng..." 
                    className="min-h-[120px] rounded-2xl bg-background/50" 
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
                    <Code className="w-4 h-4 text-primary" /> Nhúng vào Website
                 </h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                    Copy đoạn mã bên dưới và dán vào trước thẻ <code className="text-primary font-bold">&lt;/body&gt;</code> của bất kỳ website nào để hiển thị chatbot.
                 </p>
                 <div className="bg-black/60 p-4 rounded-2xl border border-white/10 relative group/code">
                    <pre className="text-[10px] font-mono text-primary/80 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                       {embedScript}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="absolute top-2 right-2 h-7 w-7 rounded-lg hover:bg-primary/20"
                      onClick={() => {
                        navigator.clipboard.writeText(embedScript);
                        toast({ title: "Đã copy mã nhúng!" });
                      }}
                    >
                       <Zap className="w-3.5 h-3.5" />
                    </Button>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3" /> CDN Edge Network Active
                 </div>
              </div>
           </Card>

           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-bold text-sm italic uppercase flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" /> Thống kê AI
              </h3>
              <div className="space-y-4">
                 <StatRow label="Cuộc hội thoại" value="124" />
                 <StatRow label="Tỉ lệ phản hồi" value="99.9%" />
                 <StatRow label="Sản phẩm được hỏi" value="45" />
                 <StatRow label="Ý định: Hỏi giá" value="62%" />
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3">
                 <AlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
                 <p className="text-[10px] text-blue-400/80 italic leading-relaxed">AI đang học hỏi từ 20 sản phẩm hiện có trong kho hàng của bạn.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-xs text-muted-foreground font-medium">{label}</span>
       <span className="text-sm font-black italic text-primary">{value}</span>
    </div>
  );
}
