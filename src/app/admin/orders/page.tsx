
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, MoreHorizontal, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminOrdersPage() {
  const orders = [
    { id: "#SCHUB-12345", customer: "Nguyễn Văn A", date: "12/03/2025", total: "25.990.000₫", status: "Chờ xử lý", payment: "Đã thanh toán" },
    { id: "#SCHUB-12344", customer: "Trần Thị B", date: "11/03/2025", total: "6.500.000₫", status: "Đang giao", payment: "COD" },
    { id: "#SCHUB-12343", customer: "Lê Văn C", date: "10/03/2025", total: "32.900.000₫", status: "Hoàn thành", payment: "Đã thanh toán" },
  ];

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
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Lọc
              </Button>
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
                  <th className="p-4">Ngày đặt</th>
                  <th className="p-4">Tổng tiền</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Thanh toán</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-primary">{order.id}</td>
                    <td className="p-4 font-medium">{order.customer}</td>
                    <td className="p-4 text-muted-foreground">{order.date}</td>
                    <td className="p-4 font-bold">{order.total}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Chờ xử lý' ? 'bg-yellow-500/10 text-yellow-500' : 
                        order.status === 'Đang giao' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs">{order.payment}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
