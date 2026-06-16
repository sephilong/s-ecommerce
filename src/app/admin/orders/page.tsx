
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
  Filter
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
      addNotification({ userId: order.customerId, title: `Đơn hàng ${status}`, message: `Đơn hàng ${order.code} đã cập nhật: ${status.toUpperCase()}.`, type: 'order', link: '/account/orders' });
    }
    toast({ title: "Cập nhật thành công", description: `Đơn hàng đã chuyển sang trạng thái ${status}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
           <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý Đơn hàng</h1>
           <p className="text-muted-foreground text-sm">Hệ thống xử lý Fulfillment tập trung toàn sàn.</p>
        </div>
        <Button variant="outline" className="rounded-full px-8 h-12 font-bold gap-2"><Download className="w-4 h-4" /> Kết xuất báo cáo</Button>
      </div>

      <Card className="border-white/5 bg-card/40 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Mã đơn, khách hàng..." className="pl-10 h-12 rounded-xl bg-background/50 border-white/10" />
          </div>
          <Button variant="outline" className="rounded-xl h-12 gap-2 border-white/10"><Filter className="w-4 h-4" /> Lọc đơn</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-white/5">
                  <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                    <th className="p-6">Mã đơn hàng</th>
                    <th className="p-6">Khách hàng</th>
                    <th className="p-6 text-center">Tổng thanh toán</th>
                    <th className="p-6 text-center">Trạng thái</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-6 font-bold text-primary italic tracking-tight">{order.code}</td>
                      <td className="p-6">
                         <div className="font-bold">{order.shippingAddress?.fullName}</div>
                         <div className="text-[10px] text-muted-foreground italic">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td className="p-6 font-black text-center text-base">{formatVND(order.total)}</td>
                      <td className="p-6 text-center"><StatusBadge status={order.status} /></td>
                      <td className="p-6 text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 transition-colors"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-[100] shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Tác vụ Fulfillment</DropdownMenuLabel>
                            <DropdownMenuItem 
                              className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" 
                              onSelect={() => setViewingOrder(order)}
                            >
                              <Eye className="w-4 h-4" /> Xem chi tiết đơn
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleUpdateStatus(order.id, 'confirmed')}>
                              <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Xác nhận đơn
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => handleUpdateStatus(order.id, 'shipped')}>
                              <Truck className="w-4 h-4 text-orange-500" /> Bàn giao vận chuyển
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-3xl rounded-[2.5rem] bg-[#0f0f0f] border-white/10 p-10 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black font-headline italic uppercase tracking-tighter">Chi tiết đơn <span className="text-primary">{viewingOrder?.code}</span></DialogTitle>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-10 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 p-6 rounded-[2rem] bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest italic">Vận chuyển đến</p>
                  <div className="space-y-1">
                     <p className="font-bold text-lg">{viewingOrder.shippingAddress.fullName}</p>
                     <p className="text-sm font-medium">{viewingOrder.shippingAddress.phone}</p>
                     <p className="text-xs text-muted-foreground italic leading-relaxed">{viewingOrder.shippingAddress.street}</p>
                  </div>
                </div>
                <div className="space-y-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col justify-between">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest italic">Vận hành</p>
                  <div className="space-y-2">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Thanh toán:</span>
                        <span className="font-bold text-indigo-400">{viewingOrder.paymentMethod}</span>
                     </div>
                     <StatusBadge status={viewingOrder.status} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Danh mục hàng hóa</p>
                <div className="divide-y divide-white/5">
                   {viewingOrder.items.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-center py-4 group">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-white/5 overflow-hidden relative border border-white/10">
                             <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                          </div>
                          <div>
                             <span className="font-bold text-sm block">{item.name}</span>
                             <span className="text-[10px] text-muted-foreground uppercase font-black">Số lượng: {item.qty}</span>
                          </div>
                       </div>
                       <span className="font-black italic text-primary">{formatVND(item.price * item.qty)}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex flex-col items-end space-y-2">
                <div className="flex justify-between w-48 text-sm text-muted-foreground">
                   <span>Tạm tính:</span>
                   <span className="font-bold">{formatVND(viewingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between w-48 text-sm text-muted-foreground">
                   <span>Phí giao:</span>
                   <span className="font-bold text-green-500">{formatVND(viewingOrder.shippingFee)}</span>
                </div>
                <div className="flex justify-between w-64 pt-4 text-3xl font-black italic tracking-tighter">
                  <span className="uppercase">Tổng cộng</span>
                  <span className="text-primary">{formatVND(viewingOrder.total)}</span>
                </div>
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
    created: { label: "Đơn mới", class: "bg-primary/10 text-primary border-none shadow-sm" },
    confirmed: { label: "Xác nhận", class: "bg-indigo-500/10 text-indigo-400 border-none shadow-sm" },
    shipped: { label: "Đang giao", class: "bg-orange-500/10 text-orange-400 border-none shadow-sm" },
    completed: { label: "Hoàn tất", class: "bg-green-500/20 text-green-500 border-none shadow-sm" },
  };
  const config = configs[status] || configs.created;
  return <Badge className={`rounded-full px-3 py-1 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
