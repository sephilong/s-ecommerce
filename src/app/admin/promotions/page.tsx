
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
  Target,
  ShoppingBag,
  Search,
  Check,
  X
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { Promotion, PromotionType, MOCK_TENANTS, Product } from "@/lib/store-data";

export default function AdminPromotionsPage() {
  const { promotions, addPromotion, deletePromotion, updatePromotion } = usePromotionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  
  // Product Selector State
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [selectorTargetField, setSelectorTargetField] = useState<'targetIds' | 'applicableProductIds' | 'giftProductIds'>('targetIds');
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
      buyQuantity: 1,
      getQuantity: 1,
      getDiscount: 100
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
        targetIds: [],
        applicableProductIds: [],
        giftProductIds: [],
        buyQuantity: 1,
        getQuantity: 1,
        getDiscount: 100
      }
    });
    setEditingPromo(null);
  };

  const handleEdit = (promo: Promotion) => {
    setEditingPromo(promo);
    setFormData(promo);
    setIsOpen(true);
  };

  const handleConfigChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [key]: value
      }
    }));
  };

  const openProductSelector = (field: 'targetIds' | 'applicableProductIds' | 'giftProductIds') => {
    setSelectorTargetField(field);
    setIsProductSelectorOpen(true);
    setProductSearch("");
  };

  const filteredProductsForSelector = useMemo(() => {
    return allProducts.filter(p => 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
      p.id.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch, allProducts]);

  const toggleProductSelection = (productId: string) => {
    const currentSelection = formData.config?.[selectorTargetField] || [];
    const newSelection = currentSelection.includes(productId)
      ? currentSelection.filter((id: string) => id !== productId)
      : [...currentSelection, productId];
    handleConfigChange(selectorTargetField, newSelection);
  };

  const getPromoDetails = (type: string) => {
    switch (type) {
      case 'percentage': return { icon: <Percent className="text-blue-500" />, label: 'Giảm %' };
      case 'fixed_amount': return { icon: <Tag className="text-green-500" />, label: 'Giảm tiền mặt' };
      case 'buy_x_get_y': return { icon: <Gift className="text-pink-500" />, label: 'Mua X tặng Y' };
      case 'bundle': return { icon: <Layers className="text-orange-500" />, label: 'Combo Bundle' };
      case 'flash_sale': return { icon: <Zap className="text-yellow-500" />, label: 'Flash Sale' };
      case 'free_shipping': return { icon: <Truck className="text-cyan-500" />, label: 'Miễn phí ship' };
      default: return { icon: <Tag />, label: 'Khuyến mãi' };
    }
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

              {/* Dynamic Target Selection (for all types except flash sale/bundle which have fixed targets) */}
              {formData.type !== 'flash_sale' && formData.type !== 'bundle' && (
                <div className="space-y-4 p-4 rounded-2xl bg-muted/30 border border-white/5">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Đối tượng áp dụng</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phạm vi áp dụng</Label>
                      <Select 
                        value={formData.config?.appliesTo || 'order'} 
                        onValueChange={(val) => handleConfigChange('appliesTo', val)}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="order">Toàn đơn hàng</SelectItem>
                          <SelectItem value="category">Theo danh mục</SelectItem>
                          <SelectItem value="product">Sản phẩm cụ thể</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.config?.appliesTo === 'category' ? (
                      <div className="space-y-2">
                        <Label>Tên danh mục (cách nhau dấu phẩy)</Label>
                        <Input 
                          placeholder="Ví dụ: Điện tử, Phụ kiện..." 
                          value={formData.config?.targetIds?.join(', ') || ''}
                          onChange={(e) => handleConfigChange('targetIds', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>
                    ) : formData.config?.appliesTo === 'product' ? (
                      <div className="space-y-2">
                        <Label>Chọn sản phẩm</Label>
                        <div className="flex gap-2">
                          <Input 
                            readOnly
                            placeholder="Chọn sản phẩm..." 
                            value={formData.config?.targetIds?.length ? `${formData.config.targetIds.length} sản phẩm` : "Nhấp để chọn"}
                            onClick={() => openProductSelector('targetIds')}
                            className="cursor-pointer bg-background/50"
                          />
                          <Button variant="outline" type="button" onClick={() => openProductSelector('targetIds')}>Chọn</Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Type-specific Configuration */}
              {formData.type === 'buy_x_get_y' && (
                <div className="space-y-4 p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10">
                  <h3 className="text-sm font-bold flex items-center gap-2"><Gift className="w-4 h-4 text-pink-500" /> Cấu hình Mua X Tặng Y</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số lượng mua (X)</Label>
                      <Input type="number" value={formData.config?.buyQuantity} onChange={(e) => handleConfigChange('buyQuantity', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Số lượng tặng (Y)</Label>
                      <Input type="number" value={formData.config?.getQuantity} onChange={(e) => handleConfigChange('getQuantity', parseInt(e.target.value))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sản phẩm mua áp dụng</Label>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        placeholder="Chọn sản phẩm mua..." 
                        value={formData.config?.applicableProductIds?.length ? `${formData.config.applicableProductIds.length} sản phẩm` : "Tất cả"} 
                        onClick={() => openProductSelector('applicableProductIds')}
                        className="cursor-pointer bg-background/50"
                      />
                      <Button variant="outline" type="button" onClick={() => openProductSelector('applicableProductIds')}>Chọn</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Sản phẩm tặng (Để trống nếu tặng cùng loại mua)</Label>
                    <div className="flex gap-2">
                      <Input 
                        readOnly 
                        placeholder="Chọn sản phẩm tặng..." 
                        value={formData.config?.giftProductIds?.length ? `${formData.config.giftProductIds.length} sản phẩm` : "Cùng loại"} 
                        onClick={() => openProductSelector('giftProductIds')}
                        className="cursor-pointer bg-background/50"
                      />
                      <Button variant="outline" type="button" onClick={() => openProductSelector('giftProductIds')}>Chọn</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>% Giảm cho quà (100% = Free)</Label>
                    <Input type="number" max={100} value={formData.config?.getDiscount} onChange={(e) => handleConfigChange('getDiscount', parseInt(e.target.value))} />
                  </div>
                </div>
              )}

              {formData.type === 'percentage' && (
                <div className="space-y-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phần trăm giảm (%)</Label>
                      <Input type="number" value={formData.config?.discountPercent} onChange={(e) => handleConfigChange('discountPercent', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Giảm tối đa (đ)</Label>
                      <Input type="number" value={formData.config?.maxDiscountAmount} onChange={(e) => handleConfigChange('maxDiscountAmount', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'fixed_amount' && (
                <div className="space-y-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Số tiền giảm (đ)</Label>
                      <Input type="number" value={formData.config?.discountAmount} onChange={(e) => handleConfigChange('discountAmount', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Đơn tối thiểu (đ)</Label>
                      <Input type="number" value={formData.config?.minimumOrderAmount} onChange={(e) => handleConfigChange('minimumOrderAmount', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              {formData.type === 'free_shipping' && (
                <div className="space-y-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Đơn tối thiểu (đ)</Label>
                      <Input type="number" value={formData.config?.minimumOrderAmount} onChange={(e) => handleConfigChange('minimumOrderAmount', parseInt(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Hỗ trợ ship tối đa (đ)</Label>
                      <Input type="number" value={formData.config?.maxShippingFee} onChange={(e) => handleConfigChange('maxShippingFee', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Mô tả hiển thị khách hàng</Label>
                <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Giảm giá ưu đãi..." />
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
                      <SelectItem value="true">Đang bật</SelectItem>
                      <SelectItem value="false">Đang tắt</SelectItem>
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

      {/* Product Selector Dialog */}
      <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chọn sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm sản phẩm..." 
                className="pl-10"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
            </div>
            <ScrollArea className="h-[400px] border border-white/5 rounded-xl p-2">
              <div className="space-y-1">
                {filteredProductsForSelector.map(product => (
                  <div 
                    key={product.id} 
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      formData.config?.[selectorTargetField]?.includes(product.id) 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50 border border-transparent'
                    }`}
                    onClick={() => toggleProductSelection(product.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={formData.config?.[selectorTargetField]?.includes(product.id)} 
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{product.name}</span>
                        <span className="text-[10px] text-muted-foreground">{product.id} • {product.category}</span>
                      </div>
                    </div>
                    {formData.config?.[selectorTargetField]?.includes(product.id) && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsProductSelectorOpen(false)} className="w-full">Xác nhận ({formData.config?.[selectorTargetField]?.length || 0})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => {
          const details = getPromoDetails(promo.type);
          const { config } = promo;
          
          let scopeText = "Toàn đơn";
          if (config?.appliesTo === 'category') scopeText = `DM: ${config.targetIds?.join(', ')}`;
          if (config?.appliesTo === 'product') scopeText = `${config.targetIds?.length || 0} SP`;
          if (promo.type === 'buy_x_get_y') scopeText = `Mua ${config.buyQuantity} Tặng ${config.getQuantity}`;

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
                    <span className="text-[9px] text-muted-foreground uppercase font-bold flex items-center gap-1"><Target className="w-3 h-3" /> Phạm vi</span>
                    <span className="text-[10px] font-bold text-foreground block truncate">{scopeText}</span>
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
    </div>
  );
}
