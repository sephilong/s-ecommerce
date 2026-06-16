
"use client";

import { useVendorStore, VendorOrder } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  ShoppingCart, 
  Truck, 
  CheckCircle2, 
  Clock,
  Printer,
  Download,
  Eye,
  Check,
  Package,
  XCircle,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function VendorOrdersPage() {
  const { vendorOrders, updateVendorOrder } = useVendorStore();
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);
  const [trackingNum, setTrackingNum] = useState("");

  const handleUpdateStatus = (id: string, status: VendorOrder['status']) => {
    updateVendorOrder(id, status, status === 'shipped' ? trackingNum : undefined);
    toast({ title: "Thành công", description: `Đơn hàng đã được chuyển sang trạng thái ${status}` });
    setSelectedOrder(null);
    setTrackingNum("");
  };

  const handlePrintNote = (orderId: string) => {
    toast({ title: "Đang tạo phiếu...", description: `Phiếu giao hàng cho đơn ${orderId} đang được tải xuống.` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Xử lý và xác nhận đơn hàng từ khách hàng của bạn.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Download className="w-4 h-4" /> Xuất Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderStat label="Tổng đơn hàng" value={vendorOrders.length} icon={<ShoppingCart />} color="text-primary" />
        <OrderStat label="Chờ xác nhận" value={vendorOrders.filter(o => o.status === 'pending').length} icon={<Clock />} color="text-orange-500" />
        <OrderStat label="Đang giao" value={vendorOrders.filter(o => o.status === 'shipped').length} icon={<Truck />} color="text-blue-500" />
        <OrderStat label="Đã hoàn thành" value={vendorOrders.filter(o => o.status === 'delivered').length} icon={<CheckCircle2 />} color="text-green-500" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start">
           <TabsTrigger value="all" className="rounded-xl px-8 h-full">Tất cả đơn</TabsTrigger>
           <TabsTrigger value="pending" className="rounded-xl px-8 h-full">Chờ xác nhận</TabsTrigger>
           <TabsTrigger value="processing" className="rounded-xl px-8 h-full">Đang xử lý</TabsTrigger>
           <TabsTrigger value="shipped" className="rounded-xl px-8 h-full">Đang giao</TabsTrigger>
        </TabsList>

        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] mt-6 overflow-hidden shadow-2xl">
          <CardHeader className="p-6 border-b border-white/5">
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Mã đơn hàng, tên khách..." className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" />
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead className="bg-muted/20 border-b border-white/5">
                      <tr className="text-left">
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Đơn hàng / Khách hàng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Thanh toán (Sau phí)</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                        <th className="p-6"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {vendorOrders.length > 0 ? vendorOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                           <td className="p-6">
                              <div className="font-bold text-primary italic">#{o.orderId}</div>
                              <div className="text-xs font-medium mt-1">{o.customerName}</div>
                              <div className="text-[10px] text-muted-foreground uppercase">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</div>
                           </td>
                           <td className="p-6">
                              <div className="text-xs font-bold">{o.items[0]?.name}</div>
                              <div className="text-[10px] text-muted-foreground">SL: {o.items[0]?.qty} | +{o.items.length - 1} món khác</div>
                           </td>
                           <td className="p-6">
                              <div className="font-black text-base">{formatVND(o.vendorEarnings)}</div>
                              <div className="text-[10px] text-red-500 italic">Phí sàn (10%): {formatVND(o.commission)}</div>
                           </td>
                           <td className="p-6">
                              <Badge variant={o.status === 'pending' ? 'secondary' : o.status === 'shipped' ? 'default' : 'outline'} className="rounded-full">
                                {o.status === 'pending' ? 'Chờ xác nhận' : o.status === 'processing' ? 'Đang đóng gói' : o.status === 'shipped' ? 'Đang giao' : 'Hoàn thành'}
                              </Badge>
                           </td>
                           <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                 {o.status === 'pending' && (
                                   <Button size="sm" className="rounded-full bg-primary h-8 px-4 font-bold" onClick={() => handleUpdateStatus(o.id, 'processing')}>
                                      <Check className="w-3 h-3 mr-1" /> Xác nhận
                                   </Button>
                                 )}
                                 {o.status === 'processing' && (
                                   <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-full bg-blue-500 h-8 px-4 font-bold">
                                          <Truck className="w-3 h-3 mr-1" /> Giao hàng
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                         <DialogHeader>
                                            <DialogTitle>Thông tin vận chuyển</DialogTitle>
                                            <DialogDescription>Nhập mã vận đơn từ đơn vị vận chuyển để khách hàng theo dõi.</DialogDescription>
                                         </DialogHeader>
                                         <div className="py-4 space-y-4">
                                            <div className="space-y-2">
                                               <Label>Mã vận đơn (Tracking ID)</Label>
                                               <Input placeholder="VD: GHN123456789..." value={trackingNum} onChange={(e) => setTrackingNum(e.target.value)} />
                                            </div>
                                         </div>
                                         <DialogFooter>
                                            <Button className="w-full rounded-xl" onClick={() => handleUpdateStatus(o.id, 'shipped')}>Xác nhận gửi hàng</Button>
                                         </DialogFooter>
                                      </DialogContent>
                                   </Dialog>
                                 )}
                                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => handlePrintNote(o.orderId)}>
                                    <Printer className="w-4 h-4" />
                                 </Button>
                              </div>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="p-20 text-center text-muted-foreground italic">Bạn chưa có đơn hàng nào phát sinh.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

function OrderStat({ label, value, icon, color }: any) {
  return (
    <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group">
      <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
        <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
      </div>
    </Card>
  );
}
