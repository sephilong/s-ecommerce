
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Tag, Trash2, Edit2, Zap, Truck, Percent, Gift, Layers, 
  TrendingUp, Target, Search, Check, Settings2, CalendarDays, BarChart, UserPlus
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { Promotion, PromotionType, MOCK_TENANTS } from "@/lib/store-data";

export default function AdminPromotionsPage() {
  const { promotions, addPromotion, deletePromotion, updatePromotion } = usePromotionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [selectorTargetField, setSelectorTargetField] = useState<string>('targetIds');
  const [productSearch, setProductSearch] = useState("");
  
  const allProducts = MOCK_TENANTS[0].products;

  const [formData, setFormData] = useState<Partial<Promotion>>({
    name: "",
    description: "",
    type: "percentage",
    priority: 1,
    isActive: true,
    config: { 
      discountPercent: 10, 
      appliesTo: 'order',
      targetIds: [],
      applicableProductIds: [],
      giftProductIds: [],
      bundleProductIds: [],
      products: [],
      tiers: [{ minimumQuantity: 5, discountPercent: 5 }],
      pointsMultiplier: 1,
      startTime: "",
      endTime: ""
    }
  });

  const handleSave = () => {
    if (!formData.name) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập tên khuyến mãi", variant: "destructive" });
      return;
    }

    if (editingPromo) {
      updatePromotion({ ...editingPromo, ...formData } as Promotion);
      toast({ title: "Cập nhật thành công" });
    } else {
      addPromotion({ ...formData, id: `promo-${Date.now()}` } as Promotion);
      toast({ title: "Đã thêm khuyến mãi" });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "", description: "", type: "percentage", priority: 1, isActive: true,
      config: { discountPercent: 10, appliesTo: 'order', targetIds: [], tiers: [], products: [], startTime: "", endTime: "" }
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData(promo);
    setIsOpen(true);
  };

  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, config: { ...prev.config, [key]: value } }));
  };

  const getPromoIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="text-blue-500" />;
      case 'fixed_amount': return <Tag className="text-green-500" />;
      case 'buy_x_get_y': return <Gift className="text-pink-500" />;
      case 'bundle': return <Layers className="text-orange-500" />;
      case 'flash_sale': return <Zap className="text-yellow-500" />;
      case 'free_shipping': return <Truck className="text-cyan-500" />;
      case 'tiered': return <BarChart className="text-purple-500" />;
      case 'loyalty_multiplier': return <TrendingUp className="text-emerald-500" />;
      case 'first_order': return <UserPlus className="text-blue-600" />;
      case 'referral': return <Target className="text-red-500" />;
      default: return <Tag />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Hệ thống Khuyến mãi</h1>
          <p className="text-muted-foreground">Cấu hình linh hoạt 10 loại hình Marketing.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Tạo chiến dịch mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPromo ? 'Chỉnh sửa' : 'Thiết lập'} chương trình</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên chương trình</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Loại hình</Label>
                  <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as PromotionType})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Giảm % đơn hàng</SelectItem>
                      <SelectItem value="fixed_amount">Giảm tiền mặt</SelectItem>
                      <SelectItem value="buy_x_get_y">Mua X tặng Y</SelectItem>
                      <SelectItem value="bundle">Combo (Bundle)</SelectItem>
                      <SelectItem value="tiered">Mua nhiều giảm sâu (Tiered)</SelectItem>
                      <SelectItem value="flash_sale">Flash Sale</SelectItem>
                      <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                      <SelectItem value="loyalty_multiplier">Nhân điểm thưởng</SelectItem>
                      <SelectItem value="first_order">Ưu đãi khách mới</SelectItem>
                      <SelectItem value="referral">Thưởng giới thiệu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dynamic Config UI Based on Type */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-white/5 space-y-4">
                <h3 className="text-sm font-bold flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /> Cấu hình chi tiết</h3>
                
                {formData.type === 'tiered' && (
                  <div className="space-y-4">
                    <Label>Các mốc giảm giá</Label>
                    {formData.config?.tiers?.map((tier: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input type="number" placeholder="Số lượng tối thiểu" value={tier.minimumQuantity} onChange={(e) => {
                          const newTiers = [...formData.config.tiers];
                          newTiers[idx].minimumQuantity = parseInt(e.target.value);
                          handleConfigChange('tiers', newTiers);
                        }} />
                        <Input type="number" placeholder="% Giảm" value={tier.discountPercent} onChange={(e) => {
                          const newTiers = [...formData.config.tiers];
                          newTiers[idx].discountPercent = parseInt(e.target.value);
                          handleConfigChange('tiers', newTiers);
                        }} />
                        <Button variant="ghost" size="icon" onClick={() => handleConfigChange('tiers', formData.config.tiers.filter((_: any, i: number) => i !== idx))}>×</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => handleConfigChange('tiers', [...(formData.config?.tiers || []), { minimumQuantity: 0, discountPercent: 0 }])}>+ Thêm mốc</Button>
                  </div>
                )}

                {formData.type === 'loyalty_multiplier' && (
                  <div className="space-y-2">
                    <Label>Hệ số nhân điểm (Ví dụ: 2 = x2 điểm)</Label>
                    <Input type="number" value={formData.config?.pointsMultiplier} onChange={(e) => handleConfigChange('pointsMultiplier', parseFloat(e.target.value))} />
                  </div>
                )}

                {/* Standard Targeting UI */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Đối tượng áp dụng</Label>
                    <Select value={formData.config?.appliesTo || 'order'} onValueChange={(val) => handleConfigChange('appliesTo', val)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="order">Toàn đơn hàng</SelectItem>
                        <SelectItem value="category">Theo danh mục</SelectItem>
                        <SelectItem value="product">Sản phẩm cụ thể</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.config?.appliesTo !== 'order' && (
                    <div className="space-y-2">
                      <Label>Lựa chọn cụ thể</Label>
                      <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => {
                        setSelectorTargetField('targetIds');
                        setIsProductSelectorOpen(true);
                      }}>
                        {formData.config?.targetIds?.length ? `Đã chọn ${formData.config.targetIds.length}` : "Nhấn để chọn..."}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bắt đầu</Label>
                  <Input type="datetime-local" value={formData.config?.startTime?.slice(0, 16)} onChange={(e) => handleConfigChange('startTime', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Kết thúc</Label>
                  <Input type="datetime-local" value={formData.config?.endTime?.slice(0, 16)} onChange={(e) => handleConfigChange('endTime', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả hiển thị khách hàng</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Giảm giá cực sốc..." />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full h-12 rounded-full font-bold">Lưu chương trình</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <Card key={promo.id} className="border-white/5 bg-card/40 rounded-[2rem] overflow-hidden group hover:border-primary/50 transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {getPromoIcon(promo.type)}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{promo.type}</div>
                    <CardTitle className="text-base line-clamp-1">{promo.name}</CardTitle>
                  </div>
                </div>
                <Badge variant={promo.isActive ? 'default' : 'secondary'} className="rounded-full">
                  {promo.isActive ? 'Bật' : 'Tắt'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground min-h-[3rem] italic">"{promo.description}"</p>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleEdit(promo)}><Edit2 className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive rounded-full" onClick={() => deletePromotion(promo.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Product Selector Popup */}
      <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Chọn đối tượng</DialogTitle></DialogHeader>
          <div className="py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-10 rounded-full" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} />
            </div>
            <ScrollArea className="h-72 border rounded-2xl p-2">
              <div className="space-y-1">
                {(formData.config?.appliesTo === 'category' ? categories : allProducts).map((item: any) => {
                  const id = typeof item === 'string' ? item : item.id;
                  const name = typeof item === 'string' ? item : item.name;
                  const isSelected = formData.config?.targetIds?.includes(id);
                  return (
                    <div key={id} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted'}`}
                      onClick={() => {
                        const current = formData.config.targetIds || [];
                        const next = current.includes(id) ? current.filter((i: string) => i !== id) : [...current, id];
                        handleConfigChange('targetIds', next);
                      }}>
                      <span className="text-sm font-medium">{name}</span>
                      {isSelected && <Check className="w-4 h-4 text-primary" />}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter><Button onClick={() => setIsProductSelectorOpen(false)} className="w-full rounded-full">Xác nhận</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
