
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function AdminPromotionsPage() {
  const { promotions } = usePromotionStore();

  const getPromoDetails = (promo: any) => {
    switch (promo.type) {
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
          <p className="text-muted-foreground">Quản lý 10 loại hình khuyến mãi và chiến dịch marketing.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="rounded-full">Mô phỏng Engine</Button>
           <Button className="gap-2 rounded-full">
            <Plus className="w-4 h-4" />
            Tạo khuyến mãi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const details = getPromoDetails(promo);
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
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(promo.config).slice(0, 3).map(([key, val]) => (
                      <Badge key={key} variant="outline" className="text-[9px] py-0 px-1 bg-background/50">
                        {key}: {String(val)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-full">
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 rounded-full">
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
          <p className="text-muted-foreground">Chưa có chương trình khuyến mãi nào được tạo.</p>
          <Button className="mt-4 rounded-full">Tạo ngay bây giờ</Button>
        </div>
      )}
    </div>
  );
}
