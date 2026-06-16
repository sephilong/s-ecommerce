
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Trash2, Edit2, Zap, Truck, Percent } from "lucide-react";

export default function AdminPromotionsPage() {
  const { promotions } = usePromotionStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="w-4 h-4" />;
      case 'free_shipping': return <Truck className="w-4 h-4" />;
      case 'flash_sale': return <Zap className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chương trình Khuyến mãi</h1>
          <p className="text-muted-foreground">Quản lý các chương trình ưu đãi tự động cho cửa hàng.</p>
        </div>
        <Button className="gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Tạo khuyến mãi mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="border-white/5 bg-card/50 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {getIcon(promo.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{promo.name}</CardTitle>
                    <CardDescription>{promo.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={promo.isActive ? 'default' : 'secondary'} className="rounded-full">
                  {promo.isActive ? 'Đang chạy' : 'Tạm dừng'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-white/5 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cấu hình ưu tiên: {promo.priority}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(promo.config).map(([key, val]) => (
                      <div key={key} className="text-xs">
                        <span className="text-muted-foreground">{key}:</span> <span className="font-bold text-primary">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 gap-2 rounded-full">
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
