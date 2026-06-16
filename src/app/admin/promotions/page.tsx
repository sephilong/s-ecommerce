
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
  Users,
  Target,
  Package,
  ShoppingBag
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
    config: { 
      discountPercent: 10, 
      appliesTo: 'order',
      targetIds: []
    }
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
      config: { 
        discountPercent: 10, 
        appliesTo: 'order',
        targetIds: []
      }
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
      default: return { icon: <Tag />, label: 'Khuyến mãi' };
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      config: {
        ...formData.config,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Marketing Engine</h1>
          <p className="text-muted-foreground">Quản lý các chương trình khuyến mãi tự động và linh hoạt.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Tạo khuyến mãi
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Sửa khuyến mãi' : 'Tạo khuyến mãi mới'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên khuyến mãi</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Ví dụ: Giảm giá Điện tử mùa hè" />
                </div>
                <div className="space-y-2">
                  <Label>Loại hình</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as PromotionType})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Giảm %</SelectItem>
                      <SelectItem value="fixed_amount">Giảm tiền mặt</SelectItem>
                      <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="buy_x_get_y">Mua X tặng Y</SelectItem>
                      <SelectItem value="bundle">Combo (Bundle)</SelectItem>
                      <SelectItem value="flash_sale">Flash Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
                <h3 className="text-sm font-bold flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Đối tượng áp dụng</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phạm vi</Label>
                    <Select 
                      value={formData.config?.appliesTo || 'order'} 
                      onValueChange={(val) => handleConfigChange('appliesTo', val)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Toàn đơn hàng</SelectItem>
                        <SelectItem value="category">Theo danh mục</SelectItem>
                        <SelectItem value="product">Theo sản phẩm cụ thể</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.config?.appliesTo !== 'order' && (
                    <div className="space-y-2">
                      <Label>{formData.config?.appliesTo === 'category' ? 'Tên danh mục' : 'Mã sản phẩm (IDs)'}</Label>
                      <Input 
                        placeholder="Cách nhau bằng dấu phẩy..." 
                        value={formData.config?.targetIds?.join(', ') || ''}
                        onChange={(e) => handleConfigChange('targetIds', e.target.value.split(',').map(s => s.trim()))}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <h3 className="text-sm font-bold flex items-center gap-2"><Tag className="w-4 h-4 text-primary" /> Cấu hình giá trị</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.type === 'percentage' && (
                    <>
                      <div className="space-y-2">
                        <Label>Phần trăm giảm (%)</Label>
                        <Input type="number" value={formData.config?.discountPercent} onChange={(e) => handleConfigChange('discountPercent', parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Giảm tối đa (đ)</Label>
                        <Input type="number" value={formData.config?.maxDiscountAmount} onChange={(e) => handleConfigChange('maxDiscountAmount', parseInt(e.target.value))} />
                      </div>
                    </>
                  )}
                  
                  {formData.type === 'fixed_amount' && (
                    <>
                      <div className="space-y-2">
                        <Label>Số tiền giảm (đ)</Label>
                        <Input type="number" value={formData.config?.discountAmount} onChange={(e) => handleConfigChange('discountAmount', parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Đơn tối thiểu (đ)</Label>
                        <Input type="number" value={formData.config?.minimumOrderAmount} onChange={(e) => handleConfigChange('minimumOrderAmount', parseInt(e.target.value))} />
                      </div>
                    </>
                  )}

                  {formData.type === 'free_shipping' && (
                    <>
                      <div className="space-y-2">
                        <Label>Đơn tối thiểu (đ)</Label>
                        <Input type="number" value={formData.config?.minimumOrderAmount} onChange={(e) => handleConfigChange('minimumOrderAmount', parseInt(e.target.value))} />
                      </div>
                      <div className="space-y-2">
                        <Label>Hỗ trợ ship tối đa (đ)</Label>
                        <Input type="number" value={formData.config?.maxShippingFee} onChange={(e) => handleConfigChange('maxShippingFee', parseInt(e.target.value))} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả hiển thị cho khách hàng</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Giảm 20% tối đa 500k cho các sản phẩm điện tử..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Độ ưu tiên (Cao nhất sẽ áp dụng trước)</Label>
                  <Input type="number" value={formData.priority} onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={formData.isActive ? "true" : "false"} onValueChange={(val) => setFormData({...formData, isActive: val === "true"})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Đang hoạt động</SelectItem>
                      <SelectItem value="false">Tạm dừng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full rounded-full h-12 text-lg font-bold">Lưu chương trình</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const details = getPromoDetails(promo.type);
          const appliesToString = promo.config?.appliesTo === 'order' ? 'Toàn đơn' : promo.config?.appliesTo === 'category' ? `DM: ${promo.config?.targetIds?.join(', ')}` : `SP: ${promo.config?.targetIds?.join(', ')}`;
          
          return (
            <Card key={promo.id} className="border-white/5 bg-card/50 overflow-hidden group hover:border-primary/50 transition-all shadow-lg">
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
                    {promo.isActive ? 'Bật' : 'Tắt'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem] italic">"{promo.description}"</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-xl bg-muted/30 border border-white/5 space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Target className="w-3 h-3" /> Áp dụng</span>
                    <span className="text-[10px] font-bold text-foreground block truncate">{appliesToString}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-muted/30 border border-white/5 space-y-1">
                    <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Ưu tiên</span>
                    <span className="text-[10px] font-bold text-primary block">{promo.priority}</span>
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
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Chưa có chương trình khuyến mãi nào được thiết lập.</p>
        </div>
      )}
    </div>
  );
}
