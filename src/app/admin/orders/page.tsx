
"use client";

import { useOrderStore } from "@/store/orderStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Filter, MoreHorizontal, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrderStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
          <p className="text-muted-foreground">Theo dõi và cập nhật trạng thái đơn hàng của khách.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-full">
          <Download className="w-4 h-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Mã đơn, tên khách hàng..." className="pl-8 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4">Mã đơn</th>
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Tổng tiền</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Thanh toán</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-primary">{order.id}</td>
                    <td className="p-4">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                    </td>
                    <td className="p-4 font-bold">{formatVND(order.total)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Chờ xử lý' ? 'bg-yellow-500/10 text-yellow-500' : 
                        order.status === 'Đang giao' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium">{order.paymentMethod}</div>
                      <div className={`text-[10px] ${order.paymentStatus === 'Đã thanh toán' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {order.paymentStatus}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Chưa có đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
