
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useOrderStore, Order, OrderStatus } from "@/store/orderStore";
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
  MoreVertical,
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
  const { orders, updateOrderStatus, bulkUpdateStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNum, setTrackingNum] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, activeTab, searchTerm]);

  const handleAction = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    toast({ title: "Cập nhật thành công", description: `Đơn hàng đã chuyển sang: ${status}` });
  };

  const handlePrint = (type: string, order: Order) => {
    toast({ title: `Đang in ${type}`, description: `Mã đơn: ${order.code}` });
    // In real app, this would open a window.print() or generate a PDF
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">QUẢN LÝ ĐƠN HÀNG & VẬN HÀNH</h1>
          <p className="text-muted-foreground text-sm">Xử lý đơn hàng, in phiếu giao và theo dõi vận chuyển.</p>
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
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start overflow-x-auto">
           <TabsTrigger value="all" className="rounded-xl px-6 h-full">Tất cả</TabsTrigger>
           <TabsTrigger value="created" className="rounded-xl px-6 h-full">Mới nhất</TabsTrigger>
           <TabsTrigger value="confirmed" className="rounded-xl px-6 h-full">Đã xác nhận</TabsTrigger>
           <TabsTrigger value="processing" className="rounded-xl px-6 h-full">Đang xử lý</TabsTrigger>
           <TabsTrigger value="shipped" className="rounded-xl px-6 h-full">Đang giao</TabsTrigger>
           <TabsTrigger value="completed" className="rounded-xl px-6 h-full">Hoàn thành</TabsTrigger>
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
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-11 border-white/10"><ArrowRight className="w-4 h-4 mr-2" /> Logistics Connect</Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead className="bg-muted/20 border-b border-white/5">
                      <tr className="text-left">
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mã đơn / Khách hàng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm / Số lượng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Thanh toán (Tổng)</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái vận hành</th>
                        <th className="p-6"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors group">
                           <td className="p-6">
                              <div className="font-bold text-primary italic text-base">{o.code || `#${o.id.substring(0, 8)}`}</div>
                              <div className="text-xs font-medium mt-1">{o.shippingAddress.fullName}</div>
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
                              {o.trackingCode && <div className="text-[9px] text-primary mt-1 font-mono">TRACK: {o.trackingCode}</div>}
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
                                      <DialogContent>
                                         <DialogHeader>
                                            <DialogTitle className="font-headline italic uppercase">Gửi hàng vận chuyển</DialogTitle>
                                            <DialogDescription>Chọn đơn vị và nhập mã vận đơn để khách hàng theo dõi.</DialogDescription>
                                         </DialogHeader>
                                         <div className="py-4 space-y-4">
                                            <div className="space-y-2">
                                               <Label>Mã vận đơn (AWB / Tracking ID)</Label>
                                               <Input placeholder="VD: GHN123456789..." value={trackingNum} onChange={(e) => setTrackingNum(e.target.value)} className="h-12" />
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
                                       <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-white/5">
                                          <MoreHorizontal className="w-4 h-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/5 z-50">
                                       <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 py-2">Vận hành fulfillment</DropdownMenuLabel>
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3" onClick={() => setSelectedOrder(o)}>
                                          <Eye className="w-4 h-4" /> Xem chi tiết & Lịch sử
                                       </DropdownMenuItem>
                                       <DropdownMenuSeparator className="bg-white/5" />
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3" onClick={() => handlePrint('Phiếu giao hàng', o)}>
                                          <Printer className="w-4 h-4" /> In Phiếu giao (Packing Slip)
                                       </DropdownMenuItem>
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3" onClick={() => handlePrint('Hóa đơn', o)}>
                                          <FileText className="w-4 h-4" /> In Hóa đơn (Invoice)
                                       </DropdownMenuItem>
                                       <DropdownMenuSeparator className="bg-white/5" />
                                       <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10" onClick={() => handleAction(o.id, 'cancelled')}>
                                          <XCircle className="w-4 h-4" /> Hủy bỏ đơn hàng
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </div>
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={5} className="p-24 text-center text-muted-foreground italic">
                              <div className="flex flex-col items-center gap-4 opacity-30">
                                 <ClipboardList className="w-16 h-16" />
                                 <p>Danh sách đơn hàng trống hoặc không khớp với bộ lọc.</p>
                              </div>
                           </td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </Tabs>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-white/10 bg-[#0f0f0f]">
          <DialogHeader>
            <DialogTitle className="text-3xl font-headline italic flex items-center justify-between pr-8">
              <span>ĐƠN HÀNG {selectedOrder?.code}</span>
              <StatusBadge status={selectedOrder?.status || 'created'} />
            </DialogTitle>
            <DialogDescription>Chi tiết vận hành và thông tin tài chính của đơn hàng.</DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-10 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <Mail className="w-3.5 h-3.5" /> Khách hàng & Liên hệ
                    </h4>
                    <div className="p-5 rounded-2xl bg-white/5 space-y-2">
                       <p className="font-bold text-lg">{selectedOrder.shippingAddress.fullName}</p>
                       <p className="text-sm font-medium">{selectedOrder.shippingAddress.phone}</p>
                       <div className="text-xs text-muted-foreground leading-relaxed italic">"{selectedOrder.customerNote || 'Không có ghi chú'}"</div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <Truck className="w-3.5 h-3.5" /> Vận chuyển tới
                    </h4>
                    <div className="p-5 rounded-2xl bg-white/5 text-sm space-y-1">
                       <p className="font-bold">{selectedOrder.shippingAddress.street}</p>
                       <p>{selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}</p>
                       <p>{selectedOrder.shippingAddress.province}</p>
                       <Badge variant="outline" className="mt-2 text-[9px] uppercase border-white/10">{selectedOrder.shippingMethod}</Badge>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-primary flex items-center gap-2">
                       <FileText className="w-3.5 h-3.5" /> Tài chính đơn hàng
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
                       <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Phí ship:</span>
                          <span className="font-bold">{formatVND(selectedOrder.shippingFee)}</span>
                       </div>
                       <Separator className="bg-white/5" />
                       <div className="flex justify-between text-lg font-black italic text-primary">
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
                                <p className="text-[10px] text-muted-foreground uppercase font-medium">Đơn giá: {formatVND(item.price)} x {item.qty}</p>
                             </div>
                          </div>
                          <span className="font-black italic text-base">{formatVND(item.price * item.qty)}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-white/10">
                 <div className="flex gap-3">
                    <Button variant="outline" className="rounded-full px-6 gap-2" onClick={() => handlePrint('Invoice', selectedOrder)}>
                       <Printer className="w-4 h-4" /> IN HÓA ĐƠN
                    </Button>
                    <Button variant="outline" className="rounded-full px-6 gap-2" onClick={() => handlePrint('Packing Slip', selectedOrder)}>
                       <Package className="w-4 h-4" /> IN PHIẾU GIAO
                    </Button>
                 </div>
                 <Button className="rounded-full px-12 h-12 font-black italic tracking-tighter shadow-xl shadow-primary/20" onClick={() => setSelectedOrder(null)}>ĐÓNG CHI TIẾT</Button>
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
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/5 transition-colors" />
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const configs: Record<string, { label: string, class: string }> = {
    created: { label: "Đơn mới", class: "bg-primary/10 text-primary border-none" },
    confirmed: { label: "Đã xác nhận", class: "bg-indigo-500/10 text-indigo-400 border-none" },
    processing: { label: "Đang đóng gói", class: "bg-blue-500/10 text-blue-400 border-none" },
    shipped: { label: "Đang giao hàng", class: "bg-orange-500/10 text-orange-400 border-none" },
    delivered: { label: "Khách đã nhận", class: "bg-emerald-500/10 text-emerald-400 border-none" },
    completed: { label: "Hoàn tất", class: "bg-green-500/20 text-green-500 border-none" },
    cancelled: { label: "Đã hủy", class: "bg-red-500/10 text-red-500 border-none" },
    refunded: { label: "Hoàn tiền", class: "bg-gray-500/10 text-gray-400 border-none" },
  };
  const config = configs[status] || configs.created;
  return <Badge className={`rounded-full px-3 py-0.5 text-[9px] font-black uppercase italic ${config.class}`}>{config.label}</Badge>;
}
