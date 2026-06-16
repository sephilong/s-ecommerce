
"use client";

import { useOrderStore, Order } from "@/store/orderStore";
import { useAffiliateStore } from "@/store/affiliateStore";
import { useNotificationStore } from "@/store/notificationStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Eye, 
  Truck, 
  CheckCircle2, 
  XCircle,
  ShoppingCart,
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { conversions, updateConversionStatus } = useAffiliateStore();
  const { addNotification } = useNotificationStore();
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    if (status === 'completed') {
      const conversion = conversions.find(c => c.orderId === orderId);
      if (conversion && conversion.status === 'pending') updateConversionStatus(conversion.id, 'approved');
    }
    const order = orders.find(o => o.id === orderId);
    if (order?.customerId) {
      addNotification({ userId: order.customerId, title: `Đơn hàng ${status}`, message: `Đơn hàng ${order.code} đã cập nhật: ${status}.`, type: 'order', link: '/account/orders' });
    }
    toast({ title: "Cập nhật thành công", description: `Đơn hàng đã chuyển sang trạng thái ${status}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline italic uppercase">Quản lý Đơn hàng</h1>
        <Button variant="outline" className="rounded-full"><Download className="w-4 h-4 mr-2" /> Xuất báo cáo</Button>
      </div>

      <Card className="border-white/5 bg-card/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm mã đơn, khách hàng..." className="pl-10 rounded-xl bg-background/50" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-white/5">
              <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                <th className="p-6">Mã đơn</th>
                <th className="p-6">Khách hàng</th>
                <th className="p-6 text-center">Tổng tiền</th>
                <th className="p-6 text-center">Trạng thái</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 font-bold text-primary italic">{order.code}</td>
                  <td className="p-6">{order.shippingAddress?.fullName}</td>
                  <td className="p-6 font-black text-center">{formatVND(order.total)}</td>
                  <td className="p-6 text-center"><StatusBadge status={order.status} /></td>
                  <td className="p-6 text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-50">
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => setViewingOrder(order)}>
                          <Eye className="w-4 h-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleUpdateStatus(order.id, 'confirmed')}>
                          <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Xác nhận
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleUpdateStatus(order.id, 'shipped')}>
                          <Truck className="w-4 h-4 text-orange-500" /> Giao hàng
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

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] bg-[#0f0f0f] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic uppercase">Chi tiết đơn {viewingOrder?.code}</DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-8 py-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2 p-4 rounded-2xl bg-white/5">
                  <p className="text-[10px] font-black uppercase text-primary">Thông tin khách hàng</p>
                  <p className="font-bold">{viewingOrder.shippingAddress.fullName}</p>
                  <p className="text-xs text-muted-foreground">{viewingOrder.shippingAddress.phone}</p>
                  <p className="text-xs italic mt-2">{viewingOrder.shippingAddress.street}</p>
                </div>
                <div className="space-y-2 p-4 rounded-2xl bg-white/5">
                  <p className="text-[10px] font-black uppercase text-primary">Thanh toán & Vận chuyển</p>
                  <p className="font-bold">{viewingOrder.paymentMethod}</p>
                  <StatusBadge status={viewingOrder.status} />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Sản phẩm</p>
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                    <span className="text-sm">{item.name} x {item.qty}</span>
                    <span className="font-bold">{formatVND(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="text-right border-t border-white/10 pt-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Tổng thanh toán</p>
                <p className="text-3xl font-black italic text-primary">{formatVND(viewingOrder.total)}</p>
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
    created: { label: "Mới", class: "bg-primary/10 text-primary border-none" },
    confirmed: { label: "Đã xác nhận", class: "bg-indigo-500/10 text-indigo-400 border-none" },
    shipped: { label: "Đang giao", class: "bg-orange-500/10 text-orange-400 border-none" },
    completed: { label: "Hoàn tất", class: "bg-green-500/20 text-green-500 border-none" },
  };
  const config = configs[status] || configs.created;
  return <Badge className={`rounded-full px-3 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
