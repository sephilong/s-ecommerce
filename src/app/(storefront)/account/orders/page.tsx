
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatVND } from "@/lib/currency";

export default function MyOrdersPage() {
  const orders = [
    { id: "SCHUB-12345", date: "12/03/2025", total: 25990000, status: "Chờ xử lý" },
    { id: "SCHUB-12344", date: "11/03/2025", total: 6500000, status: "Đang giao" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Đơn hàng của tôi</h1>
        <p className="text-muted-foreground">Theo dõi tiến độ và lịch sử mua hàng.</p>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order.id} className="bg-card/50 border-white/5 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Mã đơn hàng: <span className="text-foreground font-bold">{order.id}</span></div>
                    <div className="text-sm text-muted-foreground">Ngày đặt: {order.date}</div>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Chờ xử lý' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      {order.status}
                    </span>
                    <div className="font-bold text-lg">{formatVND(order.total)}</div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button variant="outline" size="sm" className="rounded-full">Chi tiết</Button>
                  <Button variant="ghost" size="sm" className="rounded-full">Liên hệ hỗ trợ</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10">
            <p className="text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
