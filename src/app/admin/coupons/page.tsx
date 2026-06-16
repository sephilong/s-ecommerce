
"use client";

import { usePromotionStore } from "@/store/promotionStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Copy, Scissors } from "lucide-react";

export default function AdminCouponsPage() {
  const { coupons } = usePromotionStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mã Giảm Giá (Coupons)</h1>
          <p className="text-muted-foreground">Tạo các mã voucher cho khách hàng nhập tại giỏ hàng.</p>
        </div>
        <Button className="gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Tạo mã mới
        </Button>
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
                  <th className="p-4">Đã dùng</th>
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
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="w-3 h-3" /></Button>
                      </div>
                    </td>
                    <td className="p-4 font-bold">
                      {cp.discountType === 'percent' ? `${cp.discountValue}%` : `${cp.discountValue.toLocaleString()}₫`}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {cp.minOrderAmount ? `Đơn từ ${cp.minOrderAmount.toLocaleString()}₫` : 'Mọi đơn hàng'}
                    </td>
                    <td className="p-4">{cp.usageCount} lần</td>
                    <td className="p-4">
                      <Badge variant={cp.isActive ? 'default' : 'secondary'}>
                        {cp.isActive ? 'Bật' : 'Tắt'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
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
