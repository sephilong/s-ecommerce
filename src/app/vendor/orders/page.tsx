
"use client";

import { useOrderStore, Order } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MoreHorizontal, Eye, CheckCircle2, Package, Truck, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
           <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Vận hành Đơn hàng</h1>
           <p className="text-muted-foreground text-sm">Xác nhận và đóng gói sản phẩm gửi tới khách hàng.</p>
        </div>
      </div>
      
      <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Mã vận đơn..." className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" />
          </div>
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc trạng thái</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-white/5">
                  <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                    <th className="p-6">Đơn hàng / Ngày</th>
                    <th className="p-6">Sản phẩm chính</th>
                    <th className="p-6 text-center">Doanh thu</th>
                    <th className="p-6 text-center">Trạng thái</th>
                    <th className="p-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                         <div className="font-bold text-primary italic tracking-tight">{o.code}</div>
                         <div className="text-[10px] text-muted-foreground italic uppercase">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</div>
                      </td>
                      <td className="p-6">
                         <div className="font-medium text-sm truncate max-w-[200px]">{o.items[0]?.name}...</div>
                         <div className="text-[10px] text-muted-foreground font-bold">Số lượng: {o.items.length}</div>
                      </td>
                      <td className="p-6 text-center font-black italic text-base">{formatVND(o.total)}</td>
                      <td className="p-6 text-center"><StatusBadge status={o.status} /></td>
                      <td className="p-6 text-right">
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-10 w-10"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-[100] shadow-2xl">
                             <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Xử lý Merchant</DropdownMenuLabel>
                             <DropdownMenuItem 
                              className="gap-3 rounded-xl p-3 cursor-pointer focus:bg-primary focus:text-white" 
                              onSelect={() => setSelectedOrder(o)}
                             >
                                <Eye className="w-4 h-4" /> Chi tiết đơn
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-white/5" />
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer focus:bg-indigo-500 focus:text-white" onSelect={() => handleAction(o.id, 'confirmed')}>
                                <CheckCircle2 className="w-4 h-4" /> Xác nhận có hàng
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer focus:bg-blue-500 focus:text-white" onSelect={() => handleAction(o.id, 'processing')}>
                                <Package className="w-4 h-4" /> Đã đóng gói xong
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

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl rounded-[2.5rem] border-white/10 bg-[#0f0f0f] p-10 overflow-y-auto max-h-[90vh] custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black font-headline italic uppercase tracking-tighter">Thông tin vận đơn <span className="text-primary">{selectedOrder?.code}</span></DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-10 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-3">
                  <p className="text-[10px] font-black uppercase text-primary italic tracking-widest">Khách hàng</p>
                  <div className="space-y-1">
                     <p className="font-bold text-lg leading-none">{selectedOrder.shippingAddress.fullName}</p>
                     <p className="text-sm font-medium">{selectedOrder.shippingAddress.phone}</p>
                  </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-3">
                  <p className="text-[10px] font-black uppercase text-primary italic tracking-widest">Địa chỉ giao</p>
                  <p className="text-xs italic text-muted-foreground leading-relaxed line-clamp-3">{selectedOrder.shippingAddress.street}</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 space-y-3">
                  <p className="text-[10px] font-black uppercase text-primary italic tracking-widest">Tài chính</p>
                  <p className="text-2xl font-black text-primary italic tracking-tighter">{formatVND(selectedOrder.total)}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Sản phẩm yêu cầu</p>
                 <div className="divide-y divide-white/5">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-4">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative">
                               <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                            </div>
                            <div>
                               <p className="font-bold text-sm">{item.name}</p>
                               <p className="text-[10px] text-muted-foreground uppercase font-black italic">SL: {item.qty}</p>
                            </div>
                         </div>
                         <span className="font-black italic">{formatVND(item.price * item.qty)}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-end gap-3">
                 <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => setSelectedOrder(null)}>Đóng lại</Button>
                 <Button className="rounded-full px-10 h-12 font-black italic uppercase tracking-tighter shadow-xl shadow-primary/20">In phiếu đóng gói</Button>
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
  return <Badge className={`rounded-full px-3 py-1 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
