"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useOrderStore, Order, OrderStatus } from "@/store/orderStore";
import { useNotificationStore } from "@/store/notificationStore";
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
  ChevronRight,
  FileText,
  ClipboardList,
  Mail,
  ArrowRight
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function VendorOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { addNotification } = useNotificationStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNum, setTrackingNum] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderCode = o.code || "";
      const customerName = o.shippingAddress?.fullName || "";
      const matchesSearch = orderCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, activeTab, searchTerm]);

  const handleAction = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    
    // Notify Customer
    const order = orders.find(o => o.id === id);
    if (order && order.customerId) {
      addNotification({
        userId: order.customerId,
        title: `Cập nhật đơn hàng ${order.code}`,
        message: `Đơn hàng của bạn đã chuyển sang trạng thái: ${status.toUpperCase()}.`,
        type: 'order',
        link: '/account/orders'
      });
    }

    toast({ title: "Thành công", description: `Đơn hàng đã chuyển sang: ${status}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">QUẢN LÝ ĐƠN HÀNG & FULFILLMENT</h1>
          <p className="text-muted-foreground text-sm">Xử lý đơn hàng, nhập mã vận đơn và in phiếu giao.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Download className="w-4 h-4" /> Xuất Excel</Button>
          <Button className="rounded-xl h-11 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
            <CheckCircle2 className="w-4 h-4" /> Xác nhận hàng loạt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderStat label="Tổng đơn hàng" value={orders.length} icon={<ShoppingCart />} color="text-primary" />
        <OrderStat label="Chờ xác nhận" value={orders.filter(o => o.status === 'created').length} icon={<Clock />} color="text-orange-500" />
        <OrderStat label="Đang đóng gói" value={orders.filter(o => o.status === 'processing').length} icon={<Package />} color="text-blue-500" />
        <OrderStat label="Đã giao hàng" value={orders.filter(o => o.status === 'shipped').length} icon={<Truck />} color="text-green-500" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1.5 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto">
           <TabsTrigger value="all" className="rounded-xl px-6 h-full font-bold">Tất cả</TabsTrigger>
           <TabsTrigger value="created" className="rounded-xl px-6 h-full font-bold">Mới nhất</TabsTrigger>
           <TabsTrigger value="confirmed" className="rounded-xl px-6 h-full font-bold">Đã xác nhận</TabsTrigger>
           <TabsTrigger value="processing" className="rounded-xl px-6 h-full font-bold">Đang xử lý</TabsTrigger>
           <TabsTrigger value="shipped" className="rounded-xl px-6 h-full font-bold">Đang giao</TabsTrigger>
        </TabsList>

        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] mt-6 overflow-hidden shadow-2xl">
          <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
             <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Mã đơn hàng, tên khách..." 
                  className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button variant="outline" className="rounded-xl h-11 border-white/10"><ArrowRight className="w-4 h-4 mr-2" /> Logistics Connect</Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead className="bg-muted/20 border-b border-white/5">
                      <tr className="text-left font-black">
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Mã đơn / Khách hàng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Sản phẩm / Số lượng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Tài chính</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái vận hành</th>
                        <th className="p-6"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                           <td className="p-6">
                              <div className="font-bold text-primary italic text-base">{o.code}</div>
                              <div className="text-xs font-medium mt-1">{o.shippingAddress?.fullName || 'Khách vãng lai'}</div>
                              <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" /> {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                           </td>
                           <td className="p-6">
                              <div className="text-xs font-bold truncate max-w-[200px]">{o.items[0]?.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-1">
                                {o.items.length > 1 ? `Và ${o.items.length - 1} sản phẩm khác` : `Số lượng: ${o.items[0]?.qty}`}
                              </div>
                           </td>
                           <td className="p-6">
                              <div className="font-black text-base">{formatVND(o.total)}</div>
                              <div className={`text-[9px] font-bold uppercase mt-1 ${o.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                                {o.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                              </div>
                           </td>
                           <td className="p-6">
                              <StatusBadge status={o.status} />
                              {o.trackingCode && <div className="text-[9px] text-primary mt-1 font-mono font-bold italic">TRACK: {o.trackingCode}</div>}
                           </td>
                           <td className="p-6 text-right">
                              <div className="flex justify-end gap-2">
                                 {o.status === 'created' && (
                                   <Button size="sm" className="rounded-full bg-primary h-9 px-5 font-bold italic" onClick={() => handleAction(o.id, 'confirmed')}>
                                      XÁC NHẬN ĐƠN
                                   </Button>
                                 )}
                                 {o.status === 'confirmed' && (
                                   <Button size="sm" className="rounded-full bg-blue-600 h-9 px-5 font-bold italic" onClick={() => handleAction(o.id, 'processing')}>
                                      ĐÓNG GÓI
                                   </Button>
                                 )}
                                 {o.status === 'processing' && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-full bg-orange-600 h-9 px-5 font-bold italic">
                                          GIAO HÀNG
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="rounded-3xl">
                                         <DialogHeader>
                                            <DialogTitle className="font-headline italic uppercase">Gửi hàng vận chuyển</DialogTitle>
                                            <DialogDescription>Nhập mã vận đơn (AWB) từ đối tác GHN/GHTK để khách theo dõi.</DialogDescription>
                                         </DialogHeader>
                                         <div className="py-4 space-y-4">
                                            <div className="space-y-2">
                                               <Label>Mã vận đơn (Tracking ID)</Label>
                                               <Input placeholder="VD: GHN99887766..." value={trackingNum} onChange={(e) => setTrackingNum(e.target.value)} className="h-12 rounded-xl" />
                                            </div>
                                         </div>
                                         <DialogFooter>
                                            <Button className="w-full h-12 rounded-xl font-bold" onClick={() => { handleAction(o.id, 'shipped'); setTrackingNum(""); }}>Xác nhận đã gửi hàng</Button>
                                         </DialogFooter>
                                      </DialogContent>
                                   </Dialog>
                                 )}

                                 <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/10 hover:bg-white/5">
                                          <MoreHorizontal className="w-4 h-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-50">
                                       <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Quản lý Fulfillment</DropdownMenuLabel>
                                       <DropdownMenuItem 
                                          className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" 
                                          onSelect={() => setSelectedOrder(o)}
                                       >
                                          <Eye className="w-4 h-4" /> Chi tiết & Hành trình
                                       </DropdownMenuItem>
                                       <DropdownMenuSeparator className="bg-white/5" />
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer">
                                          <Printer className="w-4 h-4" /> In Phiếu giao (Packing Slip)
                                       </DropdownMenuItem>
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer">
                                          <FileText className="w-4 h-4" /> In Hóa đơn bán lẻ
                                       </DropdownMenuItem>
                                       <DropdownMenuSeparator className="bg-white/5" />
                                       <DropdownMenuItem 
                                          className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 cursor-pointer" 
                                          onSelect={() => handleAction(o.id, 'cancelled')}
                                       >
                                          <XCircle className="w-4 h-4" /> Hủy bỏ đơn hàng này
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </div>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="p-24 text-center text-muted-foreground italic">
                              Hệ thống chưa có đơn hàng nào khớp với bộ lọc.
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </Tabs>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-white/10 bg-[#0f0f0f]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline italic flex items-center justify-between pr-8">
              <span>ĐƠN HÀNG {selectedOrder?.code}</span>
              <StatusBadge status={selectedOrder?.status || 'created'} />
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-10 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <Mail className="w-3.5 h-3.5" /> Khách hàng & Giao nhận
                    </h4>
                    <div className="p-5 rounded-2xl bg-white/5 space-y-2">
                       <p className="font-bold text-lg">{selectedOrder.shippingAddress?.fullName}</p>
                       <p className="text-sm font-medium">{selectedOrder.shippingAddress?.phone}</p>
                       <div className="text-xs text-muted-foreground mt-2 italic">
                         {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <Truck className="w-3.5 h-3.5" /> Phương thức
                    </h4>
                    <div className="p-5 rounded-2xl bg-white/5 text-sm space-y-3">
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Vận chuyển:</span>
                          <span className="font-bold">{selectedOrder.shippingMethod}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Thanh toán:</span>
                          <span className="font-bold">{selectedOrder.paymentMethod}</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Trạng thái phí:</span>
                          <Badge variant="outline" className={selectedOrder.paymentStatus === 'paid' ? 'text-green-500 border-green-500/20' : 'text-orange-500 border-orange-500/20'}>
                             {selectedOrder.paymentStatus.toUpperCase()}
                          </Badge>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <FileText className="w-3.5 h-3.5" /> Thành tiền
                    </h4>
                    <div className="p-5 rounded-2xl bg-white/5 space-y-3">
                       <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Tạm tính:</span>
                          <span className="font-bold">{formatVND(selectedOrder.subtotal)}</span>
                       </div>
                       <div className="flex justify-between text-xs text-red-400">
                          <span className="text-muted-foreground">Giảm giá:</span>
                          <span className="font-bold">-{formatVND(selectedOrder.discountTotal)}</span>
                       </div>
                       <Separator className="bg-white/5" />
                       <div className="flex justify-between text-xl font-black italic text-primary">
                          <span>TỔNG:</span>
                          <span>{formatVND(selectedOrder.total)}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Danh mục hàng hóa ({selectedOrder.items.length})</h4>
                 <div className="space-y-3">
                    {selectedOrder.items.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/5 bg-background">
                                <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                             </div>
                             <div>
                                <p className="font-bold text-sm">{item.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">Số lượng: {item.qty} x {formatVND(item.price)}</p>
                             </div>
                          </div>
                          <span className="font-black italic text-base">{formatVND(item.price * item.qty)}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
                 <Button variant="outline" className="rounded-full px-8 h-12 font-bold" onClick={() => setSelectedOrder(null)}>ĐÓNG</Button>
                 <Button className="rounded-full px-12 h-12 font-black italic tracking-tighter shadow-xl shadow-primary/20">IN PHIẾU GIAO HÀNG</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderStat({ label, value, icon, color }: any) {
  return (
    <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
      <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
        <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
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
