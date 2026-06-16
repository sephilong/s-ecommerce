
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  MessageSquare, 
  Zap, 
  Bell, 
  Settings2, 
  ShieldCheck, 
  FileText,
  Smartphone,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  History
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useNotificationStore } from "@/store/notificationStore";

export default function AdminNotificationManagement() {
  const [loading, setLoading] = useState(false);
  const { notifications } = useNotificationStore();

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Cập nhật thành công", description: "Cấu hình cổng thông báo đã được lưu lại." });
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            NOTIFICATION HUB
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Thiết lập hệ thống thông báo đa kênh: Email, SMS, Zalo và Push.
          </p>
        </div>
        <Button onClick={handleSave} className="rounded-xl h-11 px-8 font-black italic shadow-xl shadow-primary/20 gap-2">
           {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
           LƯU CẤU HÌNH
        </Button>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto gap-2">
           <TabsTrigger value="channels" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Kênh kết nối (APIs)</TabsTrigger>
           <TabsTrigger value="templates" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Email Templates</TabsTrigger>
           <TabsTrigger value="history" className="rounded-xl px-8 h-full font-bold text-xs uppercase italic">Nhật ký gửi</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold italic flex items-center gap-2"><Mail className="w-5 h-5 text-blue-400" /> Email (SMTP/SendGrid)</h3>
                 <Switch checked={true} />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">API Key / Token</Label>
                    <Input type="password" value="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="h-11 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Sender Email</Label>
                    <Input value="notifications@scomhub.vn" className="h-11 rounded-xl" />
                 </div>
                 <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <p className="text-[10px] text-blue-400 italic">Đã xác thực tên miền SPF/DKIM.</p>
                 </div>
              </div>
           </Card>

           <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold italic flex items-center gap-2">
                   <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-[10px] font-black">Z</div> 
                   Zalo Official Account (ZNS)
                 </h3>
                 <Badge className="bg-yellow-500 text-black border-none font-black italic">PRO REQUIRED</Badge>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Zalo OA ID</Label>
                    <Input placeholder="Nhập OA ID..." className="h-11 rounded-xl" />
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Access Token (Long-lived)</Label>
                    <Input type="password" placeholder="Nhập Token..." className="h-11 rounded-xl" />
                 </div>
                 <Button variant="outline" className="w-full rounded-xl gap-2 font-bold text-xs h-11 border-blue-600/30 text-blue-500 hover:bg-blue-600/10">
                    <CheckCircle2 className="w-4 h-4" /> Kiểm tra kết nối Zalo
                 </Button>
              </div>
           </Card>

           <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold italic flex items-center gap-2"><Smartphone className="w-5 h-5 text-orange-400" /> SMS Gateway (ESMS.vn)</h3>
                 <Switch checked={false} />
              </div>
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">Brandname</Label>
                       <Input value="SCOMHUB" className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black text-muted-foreground">API Key</Label>
                       <Input type="password" value="key_123" className="h-11 rounded-xl" />
                    </div>
                 </div>
                 <p className="text-[10px] text-muted-foreground leading-relaxed italic">Sử dụng cho gửi mã OTP đăng ký và xác thực tài khoản.</p>
              </div>
           </Card>

           <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-bold italic flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> Web Push (FCM)</h3>
                 <Switch checked={true} />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-muted-foreground">Firebase Server Key</Label>
                    <Input type="password" value="AAA_xxxxxxxxxxxxxxxxxxxxxx" className="h-11 rounded-xl" />
                 </div>
                 <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <Zap className="w-5 h-5 text-primary" />
                    <p className="text-[10px] text-primary italic">Thông báo tức thời cho Admin khi có đơn hàng mới.</p>
                 </div>
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                   { name: "Welcome Email", type: "Account", status: "Active" },
                   { name: "Order Confirmation", type: "Transactional", status: "Active" },
                   { name: "Shipping Update", type: "Transactional", status: "Active" },
                   { name: "Abandoned Cart", type: "Marketing", status: "Inactive" },
                   { name: "Review Invitation", type: "Loyalty", status: "Active" },
                   { name: "Payout Success", type: "Finance", status: "Active" },
                 ].map((tm, i) => (
                   <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <FileText className="w-5 h-5" />
                         </div>
                         <Badge variant={tm.status === 'Active' ? 'default' : 'secondary'} className="rounded-full text-[8px] uppercase">{tm.status}</Badge>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{tm.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{tm.type}</p>
                      <div className="pt-6 flex gap-2">
                         <Button size="sm" variant="outline" className="flex-1 rounded-xl text-[10px] font-bold">PREVIEW</Button>
                         <Button size="sm" className="flex-1 rounded-xl text-[10px] font-bold">EDIT</Button>
                      </div>
                   </div>
                 ))}
              </div>
           </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="bg-muted/30 border-b border-white/5">
                       <tr className="text-left">
                          <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Thời gian</th>
                          <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Kênh</th>
                          <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Người nhận</th>
                          <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Nội dung</th>
                          <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {notifications.slice(0, 10).map((n) => (
                         <tr key={n.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-6 text-xs text-muted-foreground whitespace-nowrap">{new Date(n.createdAt).toLocaleString('vi-VN')}</td>
                            <td className="p-6"><Badge variant="outline" className="rounded-full text-[9px] uppercase">Push/App</Badge></td>
                            <td className="p-6 font-bold text-xs">{n.userId}</td>
                            <td className="p-6">
                               <p className="font-bold text-xs line-clamp-1">{n.title}</p>
                               <p className="text-[10px] text-muted-foreground line-clamp-1">{n.message}</p>
                            </td>
                            <td className="p-6"><Badge className="bg-green-500/10 text-green-500 border-none rounded-full px-2 py-0.5 text-[8px] uppercase">Delivered</Badge></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
