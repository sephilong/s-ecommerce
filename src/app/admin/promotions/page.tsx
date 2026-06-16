
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Tag, 
  Trash2, 
  Edit2, 
  Zap, 
  Truck, 
  Percent, 
  Gift, 
  Layers, 
  TrendingUp, 
  UserPlus, 
  Users 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Promotion, PromotionType } from "@/lib/store-data";

export default function AdminPromotionsPage() {
  const { promotions, addPromotion, deletePromotion, updatePromotion } = usePromotionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: "",
    description: "",
    type: "percentage",
    priority: 1,
    isActive: true,
    config: { discountPercent: 10, appliesTo: 'order' }
  });

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập tên khuyến mãi", variant: "destructive" });
      return;
    }

    if (editingPromo) {
      updatePromotion({ ...editingPromo, ...formData } as Promotion);
      toast({ title: "Cập nhật thành công", description: "Khuyến mãi đã được cập nhật." });
    } else {
      const newPromo: Promotion = {
        ...formData,
        id: `promo-${Date.now()}`,
      } as Promotion;
      addPromotion(newPromo);
      toast({ title: "Đã thêm", description: "Chương trình khuyến mãi mới đã được tạo." });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "percentage",
      priority: 1,
      isActive: true,
      config: { discountPercent: 10, appliesTo: 'order' }
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData(promo);
    setIsOpen(true);
  };

  const getPromoDetails = (type: string) => {
    switch (type) {
      case 'percentage': return { icon: <Percent className="text-blue-500" />, label: 'Giảm %' };
      case 'fixed_amount': return { icon: <Tag className="text-green-500" />, label: 'Giảm tiền mặt' };
      case 'buy_x_get_y': return { icon: <Gift className="text-pink-500" />, label: 'Mua X tặng Y' };
      case 'bundle': return { icon: <Layers className="text-orange-500" />, label: 'Combo Bundle' };
      case 'tiered': return { icon: <TrendingUp className="text-indigo-500" />, label: 'Giảm theo cấp độ' };
      case 'flash_sale': return { icon: <Zap className="text-yellow-500" />, label: 'Flash Sale' };
      case 'free_shipping': return { icon: <Truck className="text-cyan-500" />, label: 'Miễn phí ship' };
      case 'loyalty_multiplier': return { icon: <TrendingUp className="text-purple-500" />, label: 'Nhân điểm thưởng' };
      case 'first_order': return { icon: <UserPlus className="text-emerald-500" />, label: 'Ưu đãi đơn đầu' };
      case 'referral': return { icon: <Users className="text-slate-500" />, label: 'Thưởng giới thiệu' };
      default: return { icon: <Tag />, label: 'Khuyến mãi' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Marketing Engine</h1>
          <p className="text-muted-foreground">Quản lý các chương trình khuyến mãi tự động.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Tạo khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Tên khuyến mãi</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ví dụ: Giảm giá mùa hè" />
              </div>
              <div className="space-y-2">
                <Label>Loại hình</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as PromotionType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Giảm %</SelectItem>
                    <SelectItem value="fixed_amount">Giảm tiền mặt</SelectItem>
                    <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                    <SelectItem value="flash_sale">Flash Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Nhập mô tả ngắn gọn..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Độ ưu tiên</Label>
                  <Input type="number" value={formData.priority} onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.isActive ? "true" : "false"} onValueChange={(val) => setFormData({...formData, isActive: val === "true"})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Hoạt động</SelectItem>
                      <SelectItem value="false">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full rounded-full">Lưu khuyến mãi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const details = getPromoDetails(promo.type);
          return (
            <Card key={promo.id} className="border-white/5 bg-card/50 overflow-hidden group hover:border-primary/50 transition-all">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                      {details.icon}
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{details.label}</div>
                      <CardTitle className="text-base line-clamp-1">{promo.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant={promo.isActive ? 'default' : 'secondary'} className="rounded-full text-[10px]">
                    {promo.isActive ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">{promo.description}</p>
                
                <div className="p-3 rounded-xl bg-muted/30 border border-white/5 space-y-2">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Độ ưu tiên:</span>
                    <span className="font-bold text-primary">{promo.priority}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => handleEdit(promo)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => deletePromotion(promo.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-white/10">
          <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Chưa có chương trình khuyến mãi nào.</p>
        </div>
      )}
    </div>
  );
}
