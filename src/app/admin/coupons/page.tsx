
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Copy, Trash2, Edit, CalendarDays } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Coupon } from "@/lib/store-data";

export default function AdminCouponsPage() {
  const { coupons, addCoupon, deleteCoupon, updateCoupon } = usePromotionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    description: "",
    discountType: "fixed",
    discountValue: 0,
    minOrderAmount: 0,
    isActive: true,
    startsAt: "",
    expiresAt: ""
  });

  const handleSave = () => {
    if (!formData.code || !formData.discountValue) {
      toast({ title: "Thiếu thông tin", description: "Vui lòng nhập mã và giá trị giảm giá", variant: "destructive" });
      return;
    }

    if (editingCoupon) {
      updateCoupon({ ...editingCoupon, ...formData } as Coupon);
      toast({ title: "Đã cập nhật", description: `Mã ${formData.code} đã được cập nhật.` });
    } else {
      const newCoupon: Coupon = {
        ...formData,
        id: `cp-${Date.now()}`,
        usageCount: 0,
      } as Coupon;
      addCoupon(newCoupon);
      toast({ title: "Đã tạo mã", description: `Mã ${formData.code} đã sẵn sàng.` });
    }
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "fixed",
      discountValue: 0,
      minOrderAmount: 0,
      isActive: true,
      startsAt: "",
      expiresAt: ""
    });
    setEditingCoupon(null);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setIsOpen(true);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Đã sao chép", description: `Mã ${code} đã được lưu vào bộ nhớ tạm.` });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mã Giảm Giá (Coupons)</h1>
          <p className="text-muted-foreground">Tạo các mã voucher cho khách hàng nhập khi thanh toán.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full">
              <Plus className="w-4 h-4" />
              Tạo mã mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCoupon ? 'Chỉnh sửa mã' : 'Tạo mã giảm giá mới'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã Code</Label>
                  <Input value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="SALE20" />
                </div>
                <div className="space-y-2">
                  <Label>Loại giảm giá</Label>
                  <Select value={formData.discountType} onValueChange={(val) => setFormData({...formData, discountType: val as any})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Số tiền cố định (đ)</SelectItem>
                      <SelectItem value="percent">Phần trăm (%)</SelectItem>
                      <SelectItem value="free_shipping">Miễn phí vận chuyển</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Giá trị giảm</Label>
                  <Input type="number" value={formData.discountValue} onChange={(e) => setFormData({...formData, discountValue: parseInt(e.target.value)})} />
                </div>
                <div className="space-y-2">
                  <Label>Đơn tối thiểu</Label>
                  <Input type="number" value={formData.minOrderAmount} onChange={(e) => setFormData({...formData, minOrderAmount: parseInt(e.target.value)})} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CalendarDays className="w-3 h-3" /> Hiệu lực từ</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.startsAt ? formData.startsAt.slice(0, 16) : ''} 
                    onChange={(e) => setFormData({...formData, startsAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><CalendarDays className="w-3 h-3" /> Hết hạn vào</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.expiresAt ? formData.expiresAt.slice(0, 16) : ''} 
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : ''})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả hiển thị</Label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Giảm 50k cho đơn từ 500k..." />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="isActive" checked={formData.isActive} onCheckedChange={(val) => setFormData({...formData, isActive: !!val})} />
                <Label htmlFor="isActive" className="cursor-pointer">Kích hoạt mã giảm giá này</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave} className="w-full rounded-full h-12 font-bold">Lưu mã giảm giá</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm mã coupon..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4">Mã CODE</th>
                  <th className="p-4">Ưu đãi</th>
                  <th className="p-4">Điều kiện</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((cp) => (
                  <tr key={cp.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="bg-primary/10 text-primary px-2 py-1 rounded font-bold">{cp.code}</code>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyCode(cp.code)}><Copy className="w-3 h-3" /></Button>
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      {cp.discountType === 'percent' ? `${cp.discountValue}%` : `${cp.discountValue.toLocaleString()}₫`}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {cp.minOrderAmount ? `Đơn từ ${cp.minOrderAmount.toLocaleString()}₫` : 'Mọi đơn hàng'}
                    </td>
                    <td className="p-4 text-[10px] text-muted-foreground">
                      {cp.expiresAt ? `Hết hạn: ${new Date(cp.expiresAt).toLocaleDateString('vi-VN')}` : 'Vĩnh viễn'}
                    </td>
                    <td className="p-4">
                      <Badge variant={cp.isActive ? 'default' : 'secondary'}>
                        {cp.isActive ? 'Bật' : 'Tắt'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(cp)}><Edit className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCoupon(cp.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
