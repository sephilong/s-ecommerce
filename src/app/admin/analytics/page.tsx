
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Phân tích</h1>
          <p className="text-muted-foreground">Theo dõi hiệu suất kinh doanh của cửa hàng.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng này</CardTitle>
            <DollarSign className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125.000.000₫</div>
            <p className="text-xs text-green-500 mt-1">+15.2% so với tháng trước</p>
          </CardContent>
        </Card>
        {/* Add more stats... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/50 border-white/5 h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Biểu đồ doanh thu đang được xử lý dữ liệu...</p>
          </div>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader>
            <CardTitle>Nguồn truy cập</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span>Trực tiếp</span>
              <span className="font-bold">45%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Mạng xã hội</span>
              <span className="font-bold">30%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Tìm kiếm</span>
              <span className="font-bold">25%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
