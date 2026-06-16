
"use client";

import { useOrderStore, Order } from "@/store/orderStore";
import { useAffiliateStore } from "@/store/affiliateStore";
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
  Clock,
  ShoppingCart,
  MapPin,
  Phone,
  User,
  CreditCard,
  Package
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
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    
    if (status === 'Hoàn thành') {
      const conversion = conversions.find(c => c.orderId === orderId);
      if (conversion && conversion.status === 'pending') {
        updateConversionStatus(conversion.id, 'approved');
        toast({ title: "Affiliate", description: "Hoa hồng cho đơn hàng này đã được tự động phê duyệt." });
      }
    }

    toast({
      title: "Cập nhật thành công",
      description: `Đơn hàng ${orderId} đã chuyển sang trạng thái ${status}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng của khách trên toàn sàn.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-full">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Card className="border-white/5 bg-card/50 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Mã đơn, tên khách hàng..." className="pl-10 h-10 rounded-full bg-background/50 border-white/10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mã đơn</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Khách hàng</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Tổng tiền</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                  <th className="p-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Thanh toán</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-primary italic">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-[10px] text-muted-foreground">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 font-black">{formatVND(order.total)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Chờ xử lý' ? 'bg-yellow-500/10 text-yellow-500' : 
                        order.status === 'Đang giao' ? 'bg-blue-500/10 text-blue-500' : 
                        order.status === 'Đã hủy' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-bold">{order.paymentMethod}</div>
                      <div className={`text-[10px] font-medium ${order.paymentStatus === 'Đã thanh toán' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-[#0f0f0f] border-white/5 z-50">
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 py-2">Hành động</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer" onClick={() => setViewingOrder(order)}>
                            <Eye className="w-4 h-4" /> Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground px-3 py-2">Trạng thái</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer" onClick={() => handleUpdateStatus(order.id, 'Chờ xử lý')}>
                            <Clock className="w-4 h-4 text-yellow-500" /> Chờ xử lý
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer" onClick={() => handleUpdateStatus(order.id, 'Đang giao')}>
                            <Truck className="w-4 h-4 text-blue-500" /> Đang giao
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 rounded-lg cursor-pointer" onClick={() => handleUpdateStatus(order.id, 'Hoàn thành')}>
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Hoàn thành
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive rounded-lg focus:bg-destructive/10 cursor-pointer" onClick={() => handleUpdateStatus(order.id, 'Đã hủy')}>
                            <XCircle className="w-4 h-4" /> Hủy đơn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-20 text-center text-muted-foreground italic font-medium">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      Chưa có đơn hàng nào được đặt trên hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!viewingOrder} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] border-white/10 bg-[#0f0f0f]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic flex items-center gap-2">
              CHI TIẾT ĐƠN HÀNG <span className="text-primary">#{viewingOrder?.id}</span>
            </DialogTitle>
          </DialogHeader>
          
          {viewingOrder && (
            <div className="space-y-8 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <User className="w-4 h-4" /> Thông tin nhận hàng
                  </h4>
                  <div className="space-y-2">
                    <p className="font-bold text-lg">{viewingOrder.customerName}</p>
                    <p className="text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {viewingOrder.customerPhone}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <p>{viewingOrder.customerAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <CreditCard className="w-4 h-4" /> Thanh toán & Vận chuyển
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phương thức:</span>
                      <span className="font-bold">{viewingOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge className={viewingOrder.paymentStatus === 'Đã thanh toán' ? 'bg-green-500/10 text-green-500 border-none' : 'bg-yellow-500/10 text-yellow-500 border-none'}>
                        {viewingOrder.paymentStatus}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Đơn vị giao:</span>
                      <span className="font-bold">{viewingOrder.shippingMethod}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4">
                <h4 className="font-bold flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Package className="w-4 h-4" /> Danh sách sản phẩm
                </h4>
                <div className="space-y-4">
                  {viewingOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/5 bg-background">
                          {item.image && <img src={item.image} alt={item.name} className="object-cover h-full w-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Số lượng: {item.qty} x {formatVND(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-black text-primary">{formatVND(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] uppercase font-black text-muted-foreground">Tổng thanh toán</p>
                   <div className="text-3xl font-black italic tracking-tighter text-primary">{formatVND(viewingOrder.total)}</div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                 <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => setViewingOrder(null)}>Đóng</Button>
                 <Button className="rounded-full px-8 h-12 font-black italic shadow-xl shadow-primary/20">IN HÓA ĐƠN</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
