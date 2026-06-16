
"use client";

import { useOrderStore, Order } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Eye, CheckCircle2, Package, Truck, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export default function VendorOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleAction = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    const order = orders.find(o => o.id === id);
    if (order?.customerId) {
      addNotification({ userId: order.customerId, title: `Cập nhật đơn ${order.code}`, message: `Trạng thái: ${status.toUpperCase()}`, type: 'order', link: '/account/orders' });
    }
    toast({ title: "Thành công", description: `Đơn hàng hiện là: ${status}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Xử lý Đơn hàng</h1>
      
      <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-6 border-b border-white/5">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm mã đơn hàng..." className="pl-10 rounded-xl bg-background/50 border-white/10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-white/5">
              <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                <th className="p-6">Mã đơn / Ngày</th>
                <th className="p-6">Sản phẩm</th>
                <th className="p-6 text-center">Thanh toán</th>
                <th className="p-6 text-center">Vận hành</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary italic">{o.code}</td>
                  <td className="p-6 text-xs">{o.items[0]?.name}...</td>
                  <td className="p-6 text-center font-black">{formatVND(o.total)}</td>
                  <td className="p-6 text-center"><StatusBadge status={o.status} /></td>
                  <td className="p-6 text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-50">
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => setSelectedOrder(o)}>
                          <Eye className="w-4 h-4" /> Chi tiết đơn
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleAction(o.id, 'confirmed')}>
                          <CheckCircle2 className="w-4 h-4" /> Xác nhận ngay
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleAction(o.id, 'processing')}>
                          <Package className="w-4 h-4" /> Đóng gói xong
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl rounded-[2.5rem] border-white/10 bg-[#0f0f0f]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase">Thông tin vận đơn {selectedOrder?.code}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary">Khách hàng</p>
                  <p className="font-bold">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-xs">{selectedOrder.shippingAddress.phone}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary">Địa chỉ</p>
                  <p className="text-xs italic">{selectedOrder.shippingAddress.street}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary">Tài chính</p>
                  <p className="text-lg font-black text-primary">{formatVND(selectedOrder.total)}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-end gap-3">
                 <Button variant="outline" className="rounded-full px-8" onClick={() => setSelectedOrder(null)}>Đóng</Button>
                 <Button className="rounded-full px-8 font-bold italic shadow-lg shadow-primary/20">IN PHIẾU GIAO</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const configs: any = {
    created: { label: "Đơn mới", class: "bg-primary/10 text-primary border-none" },
    confirmed: { label: "Chờ gói", class: "bg-indigo-500/10 text-indigo-400 border-none" },
    processing: { label: "Đang gói", class: "bg-blue-500/10 text-blue-400 border-none" },
    shipped: { label: "Đang giao", class: "bg-orange-500/10 text-orange-400 border-none" },
  };
  const config = configs[status] || configs.created;
  return <Badge className={`rounded-full px-3 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
