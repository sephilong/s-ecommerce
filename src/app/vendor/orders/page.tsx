
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Printer,
  Download,
  Eye
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

export default function VendorOrdersPage() {
  const { vendorOrders, updateVendorOrder } = useVendorStore();

  const handleUpdateStatus = (id: string, status: any) => {
    updateVendorOrder(id, status);
    toast({ title: "Cập nhật đơn hàng", description: `Đơn hàng đã được chuyển sang trạng thái ${status}` });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý Đơn hàng</h1>
          <p className="text-muted-foreground">Xử lý các đơn hàng phát sinh từ cửa hàng của bạn.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Printer className="w-4 h-4" /> In phiếu giao hàng</Button>
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Download className="w-4 h-4" /> Xuất Excel</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OrderStat label="Tổng đơn hàng" value={0} icon={<ShoppingCart />} color="text-primary" />
        <OrderStat label="Chờ xử lý" value={0} icon={<Clock />} color="text-orange-500" />
        <OrderStat label="Đang giao" value={0} icon={<Truck />} color="text-blue-500" />
        <OrderStat label="Đã hoàn thành" value={0} icon={<CheckCircle2 />} color="text-green-500" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start">
           <TabsTrigger value="all" className="rounded-xl px-8 h-full">Tất cả</TabsTrigger>
           <TabsTrigger value="pending" className="rounded-xl px-8 h-full">Chờ xác nhận</TabsTrigger>
           <TabsTrigger value="shipped" className="rounded-xl px-8 h-full">Đang giao</TabsTrigger>
           <TabsTrigger value="delivered" className="rounded-xl px-8 h-full">Đã giao</TabsTrigger>
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
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mã đơn / Ngày đặt</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Doanh thu / Hoa hồng</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                        <th className="p-6"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {vendorOrders.length > 0 ? vendorOrders.map((o) => (
                        <tr key={o.id}>
                           <td className="p-6">
                              <div className="font-bold">#{o.id}</div>
                              <div className="text-[10px] text-muted-foreground uppercase">{new Date(o.createdAt).toLocaleDateString('vi-VN')}</div>
                           </td>
                           <td className="p-6">
                              <div className="text-xs font-medium">{o.items[0]?.name}</div>
                              <div className="text-[10px] text-muted-foreground">+{o.items.length - 1} sản phẩm khác</div>
                           </td>
                           <td className="p-6">
                              <div className="font-bold">{formatVND(o.vendorEarnings)}</div>
                              <div className="text-[10px] text-red-500 italic">Phí sàn: {formatVND(o.commission)}</div>
                           </td>
                           <td className="p-6">
                              <Badge className="rounded-full">{o.status}</Badge>
                           </td>
                           <td className="p-6 text-right">
                              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10"><Eye className="w-4 h-4" /></Button>
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
