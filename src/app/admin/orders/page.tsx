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
  Package,
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
      if (conversion && conversion.status === 'pending') {
        updateConversionStatus(conversion.id, 'approved');
      }
    }

    const order = orders.find(o => o.id === orderId);
    if (order && order.customerId) {
      addNotification({
        userId: order.customerId,
        title: `Đơn hàng ${status === 'confirmed' ? 'đã xác nhận' : status === 'shipped' ? 'đang giao' : 'đã cập nhật'}`,
        message: `Đơn hàng ${order.code} của bạn đã chuyển sang trạng thái: ${status}.`,
        type: 'order',
        link: '/account/orders'
      });
    }

    toast({
      title: "Cập nhật thành công",
      description: `Đơn hàng đã chuyển sang trạng thái ${status}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight font-headline italic uppercase">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng toàn hệ thống.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-full h-11 px-6 font-bold">
          <Download className="w-4 h-4" /> Xuất báo cáo
        </Button>
      </div>

      <Card className="border-white/5 bg-card/50 shadow-xl rounded-[2rem] overflow-hidden">
        <CardHeader className="p-6 border-b border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm mã đơn, tên khách hàng..." className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mã đơn</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Khách hàng</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center">Tổng tiền</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-center">Trạng thái</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Thanh toán</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="font-bold text-primary italic">{order.code || `#${order.id.substring(0, 8)}`}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1"><Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-bold">{order.shippingAddress?.fullName || 'N/A'}</div>
                      <div className="text-[10px] text-muted-foreground">{order.shippingAddress?.phone}</div>
                    </td>
                    <td className="p-6 font-black text-center">{formatVND(order.total)}</td>
                    <td className="p-6 text-center">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="p-6">
                      <div className="text-xs font-bold uppercase">{order.paymentMethod}</div>
                      <div className={`text-[9px] font-black uppercase ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ xác nhận'}
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-50">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Hành động</DropdownMenuLabel>
                          <DropdownMenuItem 
                            className="gap-3 rounded-xl p-3 cursor-pointer focus:bg-primary focus:text-white" 
                            onSelect={() => setViewingOrder(order)}
                          >
                            <Eye className="w-4 h-4" /> Xem chi tiết đơn
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem 
                            className="gap-3 rounded-xl p-3 cursor-pointer" 
                            onSelect={() => handleUpdateStatus(order.id, 'confirmed')}
                          >
                            <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Xác nhận đơn hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-3 rounded-xl p-3 cursor-pointer" 
                            onSelect={() => handleUpdateStatus(order.id, 'shipped')}
                          >
                            <Truck className="w-4 h-4 text-orange-500" /> Giao hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-3 rounded-xl p-3 cursor-pointer text-destructive focus:bg-destructive/10" 
                            onSelect={() => handleUpdateStatus(order.id, 'cancelled')}
                          >
                            <XCircle className="w-4 h-4" /> Hủy bỏ đơn hàng này
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-24 text-center text-muted-foreground italic">
                      <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      Hệ thống chưa ghi nhận đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-white/10 bg-[#0f0f0f]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline italic flex items-center gap-3">
              <span>ĐƠN HÀNG: {viewingOrder?.code}</span>
              <StatusBadge status={viewingOrder?.status || 'created'} />
            </DialogTitle>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-10 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Thông tin nhận hàng
                  </h4>
                  <div className="p-6 rounded-3xl bg-white/5 space-y-2">
                    <p className="font-bold text-lg">{viewingOrder.shippingAddress?.fullName}</p>
                    <p className="text-sm font-medium flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {viewingOrder.shippingAddress?.phone}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 shrink-0 mt-1" />
                      <p className="leading-relaxed">{viewingOrder.shippingAddress?.street}, {viewingOrder.shippingAddress?.ward}, {viewingOrder.shippingAddress?.district}, {viewingOrder.shippingAddress?.province}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Thanh toán & Vận chuyển
                  </h4>
                  <div className="p-6 rounded-3xl bg-white/5 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Phương thức:</span>
                      <span className="font-black italic uppercase">{viewingOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge className={viewingOrder.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-500 border-none' : 'bg-yellow-500/10 text-yellow-500 border-none'}>
                        {viewingOrder.paymentStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Đơn vị giao:</span>
                      <span className="font-bold">{viewingOrder.shippingMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Hàng hóa đơn hàng ({viewingOrder.items.length})</h4>
                <div className="space-y-3">
                  {viewingOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-background shrink-0">
                          {item.image && <img src={item.image} alt={item.name} className="object-cover h-full w-full" />}
                        </div>
                        <div>
                          <p className="font-bold text-base line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">SL: {item.qty} x {formatVND(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-black italic text-lg text-primary">{formatVND(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                   <div>
                     <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tổng thanh toán</p>
                     <p className="text-4xl font-black italic tracking-tighter text-primary mt-1">{formatVND(viewingOrder.total)}</p>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => setViewingOrder(null)}>Đóng</Button>
                      <Button className="rounded-full px-10 h-12 font-black italic shadow-2xl shadow-primary/20">IN HÓA ĐƠN VAT</Button>
                   </div>
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
  const configs: Record<string, { label: string, class: string }> = {
    created: { label: "Đơn mới", class: "bg-primary/10 text-primary border-none" },
    confirmed: { label: "Đã xác nhận", class: "bg-indigo-500/10 text-indigo-400 border-none" },
    processing: { label: "Đang đóng gói", class: "bg-blue-500/10 text-blue-400 border-none" },
    shipped: { label: "Đang giao", class: "bg-orange-500/10 text-orange-400 border-none" },
    delivered: { label: "Khách đã nhận", class: "bg-emerald-500/10 text-emerald-400 border-none" },
    completed: { label: "Hoàn tất", class: "bg-green-500/20 text-green-500 border-none" },
    cancelled: { label: "Đã hủy", class: "bg-red-500/10 text-red-500 border-none" },
  };
  const config = configs[status] || configs.created;
  return <Badge className={`rounded-full px-4 py-1 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
