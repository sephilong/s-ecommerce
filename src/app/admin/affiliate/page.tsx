
"use client";

import { useAffiliateStore, AffiliateConversion, AffiliateRequest, PayoutRequest } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download,
  Users,
  TrendingUp,
  DollarSign,
  Wallet,
  ArrowUpRight,
  UserPlus
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminAffiliatePage() {
  const { 
    conversions, 
    updateConversionStatus, 
    affiliateRequests, 
    updateAffiliateRequest,
    payoutRequests,
    updatePayoutStatus
  } = useAffiliateStore();
  const { setAffiliateActive } = useUserStore();

  const handleApproveAffiliate = (id: string) => {
    updateAffiliateRequest(id, 'approved');
    const code = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    setAffiliateActive(code);
    toast({ title: "Đã phê duyệt", description: "Người dùng đã trở thành Affiliate." });
  };

  const handleStatusUpdate = (id: string, status: AffiliateConversion['status']) => {
    updateConversionStatus(id, status);
    toast({ title: "Cập nhật", description: `Đã chuyển trạng thái hoa hồng thành ${status}` });
  };

  const stats = [
    { label: "Tổng hoa hồng", value: formatVND(conversions.reduce((acc, c) => acc + c.commission, 0)), icon: <DollarSign />, color: "text-primary" },
    { label: "Đang chờ duyệt", value: conversions.filter(c => c.status === 'pending').length, icon: <Clock />, color: "text-yellow-500" },
    { label: "Yêu cầu Affiliate", value: affiliateRequests.filter(r => r.status === 'pending').length, icon: <UserPlus />, color: "text-blue-500" },
    { label: "Tổng chuyển đổi", value: conversions.length, icon: <TrendingUp />, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Affiliate</h1>
          <p className="text-muted-foreground">Phê duyệt hồ sơ, hoa hồng và các khoản thanh toán.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="bg-card/50 border-white/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-10 w-10 rounded-xl bg-background/50 flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="conversions" className="w-full">
        <TabsList className="rounded-xl h-11 p-1 bg-muted/50 w-full md:w-auto">
          <TabsTrigger value="conversions" className="rounded-lg">Đơn hàng hoa hồng</TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg">Đăng ký mới</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg">Rút tiền</TabsTrigger>
        </TabsList>

        <TabsContent value="conversions" className="pt-4">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Mã Ref", "Đơn hàng", "Hoa hồng", "Trạng thái", "Thao tác"]}
                items={conversions}
                renderRow={(conv: AffiliateConversion) => (
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
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500" onClick={() => handleStatusUpdate(conv.id, 'approved')}>
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleStatusUpdate(conv.id, 'rejected')}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="pt-4">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Tên người dùng", "Email", "Trạng thái", "Thao tác"]}
                items={affiliateRequests}
                renderRow={(req: AffiliateRequest) => (
                  <tr key={req.id} className="border-b border-white/5">
                    <td className="p-4 text-xs">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{req.userName}</td>
                    <td className="p-4">{req.email}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'approved' ? 'default' : 'secondary'}>{req.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="rounded-full" onClick={() => handleApproveAffiliate(req.id)}>Phê duyệt</Button>
                          <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => updateAffiliateRequest(req.id, 'rejected')}>Từ chối</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="pt-4">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Người rút", "Số tiền", "Thông tin thanh toán", "Trạng thái", "Thao tác"]}
                items={payoutRequests}
                renderRow={(p: PayoutRequest) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="p-4 text-xs">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{p.userName}</td>
                    <td className="p-4 font-black text-primary">{formatVND(p.amount)}</td>
                    <td className="p-4 text-xs text-muted-foreground">{p.accountInfo}</td>
                    <td className="p-4">
                      <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>{p.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'pending' && (
                        <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => updatePayoutStatus(p.id, 'completed')}>
                          Xác nhận đã chuyển <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TableLayout({ headers, items, renderRow }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-white/5 text-left font-medium">
          <tr>
            {headers.map((h: string) => <th key={h} className="p-4">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map(renderRow) : (
            <tr>
              <td colSpan={headers.length} className="p-12 text-center text-muted-foreground italic">Chưa có dữ liệu.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
