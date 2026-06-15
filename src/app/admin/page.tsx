
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign, Package } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Tổng doanh thu", value: "125.000.000₫", icon: <DollarSign className="w-5 h-5 text-primary" />, change: "+12.5% so với tháng trước" },
    { title: "Đơn hàng mới", value: "48", icon: <ShoppingBag className="w-5 h-5 text-primary" />, change: "+5 đơn mới hôm nay" },
    { title: "Sản phẩm", value: "156", icon: <Package className="w-5 h-5 text-primary" />, change: "12 sản phẩm sắp hết hàng" },
    { title: "Khách hàng", value: "1,240", icon: <Users className="w-5 h-5 text-primary" />, change: "+24 khách hàng mới" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground">Chào mừng quay trở lại hệ thống quản trị S-Com Hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-white/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Chưa có đơn hàng nào mới trong 24h qua.</div>
          </CardContent>
        </Card>
        <Card className="border-white/5 bg-card/50">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Dữ liệu đang được cập nhật...</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
