
"use client";

import { useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useOrderStore } from "@/store/orderStore";
import { useVendorStore } from "@/store/vendorStore";
import { Product } from "@/lib/store-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  product: Product;
}

export function ReviewDialog({ product }: ReviewDialogProps) {
  const { profile } = useUserStore();
  const { orders } = useOrderStore();
  const { addReview } = useVendorStore();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Kiểm tra xem khách hàng đã mua sản phẩm này chưa
  const hasPurchased = orders.some(order => 
    order.items.some((item: any) => item.name === product.name) && order.status === 'Hoàn thành'
  );

  const handleSubmit = () => {
    if (!profile) {
      toast({ variant: "destructive", title: "Yêu cầu đăng nhập", description: "Bạn cần đăng nhập để thực hiện đánh giá." });
      return;
    }
    if (comment.length < 10) {
      toast({ variant: "destructive", title: "Nội dung quá ngắn", description: "Vui lòng viết tối thiểu 10 ký tự." });
      return;
    }

    setLoading(true);

    // Mô phỏng API call
    setTimeout(() => {
      const newReview = {
        id: `rev-${Date.now()}`,
        vendorId: 'v-1', // Demo ID
        productId: product.id,
        productName: product.name,
        customerName: `${profile.firstName} ${profile.lastName}`,
        rating: rating,
        comment: comment,
        createdAt: new Date().toISOString()
      };

      addReview(newReview);
      setLoading(false);
      setIsOpen(false);
      setComment("");
      setRating(5);
      toast({ title: "Cảm ơn bạn!", description: "Đánh giá của bạn đã được gửi thành công." });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 italic">
          Đánh giá sản phẩm
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md rounded-[2.5rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline italic uppercase tracking-tighter">Đánh giá sản phẩm</DialogTitle>
          <DialogDescription>Chia sẻ trải nghiệm của bạn về {product.name}</DialogDescription>
        </DialogHeader>

        {!hasPurchased ? (
          <div className="py-8 space-y-6 text-center">
            <div className="h-16 w-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-lg">Chưa thể đánh giá</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rất tiếc, chỉ những khách hàng đã mua và nhận sản phẩm này thành công mới có thể gửi đánh giá.
              </p>
            </div>
            <Button variant="outline" className="rounded-full w-full" onClick={() => setIsOpen(false)}>Quay lại</Button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Xếp hạng của bạn</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setRating(s)} className="transition-transform active:scale-90">
                    <Star className={`w-8 h-8 ${s <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-white/10'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nhận xét chi tiết</Label>
              <Textarea 
                placeholder="Sản phẩm rất tốt, giao hàng nhanh..." 
                className="min-h-[120px] rounded-2xl bg-background/50 border-white/10"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-muted-foreground italic">
                Đánh giá của bạn sẽ giúp những khách hàng khác đưa ra lựa chọn đúng đắn và giúp shop cải thiện dịch vụ.
              </p>
            </div>

            <DialogFooter>
              <Button onClick={handleSubmit} disabled={loading} className="w-full h-14 rounded-2xl font-black italic shadow-xl shadow-primary/30 uppercase tracking-tighter">
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Gửi đánh giá ngay"}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
