
"use client";

import { useAffiliateStore, AffiliateConversion } from "@/store/affiliateStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download,
  Users,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminAffiliatePage() {
  const { conversions, updateConversionStatus } = useAffiliateStore();

  const handleStatusUpdate = (id: string, status: AffiliateConversion['status']) => {
    updateConversionStatus(id, status);
    toast({ title: "Cập nhật", description: `Đã chuyển trạng thái hoa hồng thành ${status}` });
  };

  const stats = [
    { label: "Tổng chuyển đổi", value: conversions.length, icon: <TrendingUp />, color: "text-blue-500" },
    { label: "Đang chờ duyệt", value: conversions.filter(c => c.status === 'pending').length, icon: <Clock />, color: "text-yellow-500" },
    { label: "Đã phê duyệt", value: conversions.filter(c => c.status === 'approved').length, icon: <CheckCircle2 />, color: "text-green-500" },
    { label: "Tổng hoa hồng", value: formatVND(conversions.reduce((acc, c) => acc + c.commission, 0)), icon: <DollarSign />, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Affiliate</h1>
          <p className="text-muted-foreground">Phê duyệt hoa hồng và quản lý đối tác tiếp thị.</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-full">
          <Download className="w-4 h-4" /> Xuất báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="bg-card/50 border-white/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Mã đơn hàng, mã Ref..." className="pl-8 h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Lọc
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4">Ngày</th>
                  <th className="p-4">Mã Ref</th>
                  <th className="p-4">Đơn hàng</th>
                  <th className="p-4">Hoa hồng</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {conversions.length > 0 ? conversions.map((conv) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-mono font-bold text-primary">{conv.affiliateCode}</td>
                    <td className="p-4">
                      <div className="font-medium">{conv.orderId}</div>
                      <div className="text-[10px] text-muted-foreground">Giá trị: {formatVND(conv.amount)}</div>
                    </td>
                    <td className="p-4 font-bold">{formatVND(conv.commission)}</td>
                    <td className="p-4">
                      <Badge variant={conv.status === 'approved' ? 'default' : conv.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                        {conv.status === 'approved' ? 'Đã duyệt' : conv.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {conv.status === 'pending' && (
                          <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => handleStatusUpdate(conv.id, 'approved')}>
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleStatusUpdate(conv.id, 'rejected')}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground italic">Chưa có đơn hàng hoa hồng nào cần xử lý.</td>
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
