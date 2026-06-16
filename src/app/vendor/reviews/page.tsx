
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MessageSquare, Reply, User, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function VendorReviewsPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, vendorReviews, replyToReview } = useVendorStore();
  const vendor = profile ? getVendorByUserId(profile.email) : null;
  const myReviews = vendorReviews.filter(r => r.vendorId === vendor?.id);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleReply = (id: string) => {
    if (!replyText[id]?.trim()) return;
    replyToReview(id, replyText[id]);
    toast({ title: "Đã gửi phản hồi", description: "Khách hàng sẽ nhận được thông báo về phản hồi này." });
    setReplyText({ ...replyText, [id]: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Đánh giá & Phản hồi</h1>
        <p className="text-muted-foreground">Lắng nghe ý kiến từ khách hàng để cải thiện dịch vụ của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 text-center space-y-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Trung bình Rating</p>
            <h3 className="text-5xl font-black italic text-yellow-500">4.9</h3>
            <div className="flex justify-center gap-1">
               {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
            </div>
         </Card>
         <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 text-center space-y-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tổng số đánh giá</p>
            <h3 className="text-5xl font-black italic">{myReviews.length}</h3>
            <p className="text-[10px] text-green-500 font-bold uppercase">+5 trong tuần này</p>
         </Card>
         <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 text-center space-y-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tỉ lệ phản hồi</p>
            <h3 className="text-5xl font-black italic text-primary">85%</h3>
            <p className="text-[10px] text-muted-foreground">Tốc độ trung bình: 2h</p>
         </Card>
      </div>

      <div className="space-y-6">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold font-headline italic">DANH SÁCH BÌNH LUẬN</h2>
            <div className="flex gap-2">
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Tìm theo sản phẩm..." className="pl-10 h-10 rounded-xl bg-background/50 border-white/10" />
               </div>
               <Button variant="outline" className="rounded-xl h-10 border-white/10"><Filter className="w-4 h-4" /></Button>
            </div>
         </div>

         <div className="space-y-6">
            {myReviews.map((rv) => (
              <Card key={rv.id} className="bg-[#151515] border-white/5 rounded-[2rem] p-8 space-y-6 group hover:border-primary/30 transition-all">
                 <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {rv.customerName.charAt(0)}
                       </div>
                       <div>
                          <div className="font-bold flex items-center gap-2">
                            {rv.customerName}
                            <Badge className="bg-green-500/10 text-green-500 text-[8px] h-4 border-none px-1.5 uppercase">Đã mua hàng</Badge>
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase mt-0.5">{new Date(rv.createdAt).toLocaleDateString('vi-VN')}</div>
                       </div>
                    </div>
                    <div className="flex gap-0.5">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={`w-3.5 h-3.5 ${i < rv.rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="text-[10px] uppercase font-black text-primary tracking-widest flex items-center gap-2">
                       <MessageSquare className="w-3 h-3" /> {rv.productName}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90 italic">"{rv.comment}"</p>
                 </div>

                 {rv.reply ? (
                   <div className="bg-white/5 rounded-2xl p-6 border-l-4 border-primary space-y-2">
                      <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Phản hồi từ Shop</div>
                      <p className="text-xs text-muted-foreground leading-relaxed italic">"{rv.reply}"</p>
                   </div>
                 ) : (
                   <div className="space-y-4 pt-4 border-t border-white/5">
                      <Textarea 
                        placeholder="Cảm ơn khách hàng hoặc giải đáp thắc mắc..." 
                        value={replyText[rv.id] || ""}
                        onChange={(e) => setReplyText({ ...replyText, [rv.id]: e.target.value })}
                        className="bg-background/50 border-white/5 rounded-xl min-h-[80px]" 
                      />
                      <div className="flex justify-end">
                         <Button onClick={() => handleReply(rv.id)} className="rounded-full h-10 px-6 font-bold gap-2">
                            <Reply className="w-4 h-4" /> Gửi phản hồi
                         </Button>
                      </div>
                   </div>
                 )}
              </Card>
            ))}

            {myReviews.length === 0 && (
              <div className="text-center py-24 bg-muted/10 rounded-[2.5rem] border border-dashed border-white/10">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground italic">Shop của bạn hiện chưa có đánh giá nào.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
