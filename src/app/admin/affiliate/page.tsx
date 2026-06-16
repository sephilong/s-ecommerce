
"use client";

import { useAffiliateStore, AffiliateConversion, AffiliateRequest, PayoutRequest, AffiliateLink, AffiliateTier } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  UserPlus,
  BarChart3,
  Settings2,
  Tag,
  ShieldCheck,
  Ban,
  Link as LinkIcon,
  PieChart,
  Save
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip,
  Cell,
  Legend
} from 'recharts';
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";

export default function AdminAffiliatePage() {
  const { 
    conversions, 
    updateConversionStatus, 
    affiliateRequests, 
    updateAffiliateRequest,
    payoutRequests,
    updatePayoutStatus,
    links,
    stats,
    config,
    updateConfig
  } = useAffiliateStore();
  const { setAffiliateActive } = useUserStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

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

  const handleSaveConfig = () => {
    updateConfig(localConfig);
    setIsConfigOpen(false);
    toast({ title: "Thành công", description: "Đã lưu cấu hình Affiliate mới." });
  };

  const handleExport = () => {
    toast({ title: "Đang xuất báo cáo", description: "Báo cáo Affiliate đang được tải xuống..." });
    // Simulate download
    setTimeout(() => {
      toast({ title: "Thành công", description: "Báo cáo đã sẵn sàng." });
    }, 1500);
  };

  // Performance data calculation
  const performanceData = useMemo(() => [
    { name: 'Đơn hàng', value: conversions.length, color: 'hsl(var(--primary))' },
    { name: 'Chờ duyệt', value: conversions.filter(c => c.status === 'pending').length, color: '#FBBF24' },
    { name: 'Đã duyệt', value: conversions.filter(c => c.status === 'approved').length, color: '#10B981' },
    { name: 'Đã hủy', value: conversions.filter(c => c.status === 'rejected').length, color: '#EF4444' },
  ], [conversions]);

  const adminStats = [
    { label: "Tổng hoa hồng đã duyệt", value: formatVND(stats.totalEarnings), icon: <DollarSign />, color: "text-primary" },
    { label: "Số dư đang giữ", value: formatVND(stats.pendingCommission), icon: <Clock />, color: "text-yellow-500" },
    { label: "Yêu cầu rút tiền", value: payoutRequests.filter(p => p.status === 'pending').length, icon: <Wallet />, color: "text-blue-500" },
    { label: "Lượt Click Toàn sàn", value: stats.totalClicks, icon: <TrendingUp />, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline italic">Quản trị Hệ thống Affiliate</h1>
          <p className="text-muted-foreground">Phê duyệt đối tác, kiểm soát hoa hồng và chi trả thu nhập.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export Report
          </Button>
          
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2 shadow-lg shadow-primary/20">
                <Settings2 className="w-4 h-4" /> Affiliate Config
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cấu hình Hệ thống Affiliate</DialogTitle>
                <DialogDescription>Thiết lập tỷ lệ hoa hồng và quy tắc vận hành mạng lưới.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Hoa hồng mặc định (%)</Label>
                    <Input 
                      type="number" 
                      value={localConfig.globalRate} 
                      onChange={(e) => setLocalConfig({...localConfig, globalRate: parseInt(e.target.value)})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rút tiền tối thiểu (VNĐ)</Label>
                    <Input 
                      type="number" 
                      value={localConfig.minPayout} 
                      onChange={(e) => setLocalConfig({...localConfig, minPayout: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold">Quản lý Cấp bậc (Tiers)</Label>
                  <div className="space-y-3">
                    {localConfig.tiers.map((tier, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-white/5">
                        <div className={`h-8 w-8 rounded-lg ${tier.color} shrink-0`} />
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tên Cấp bậc</Label>
                            <Input value={tier.name} disabled className="h-8 rounded-lg bg-background/50" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tỷ lệ hoa hồng (%)</Label>
                            <Input 
                              type="number" 
                              value={tier.rate} 
                              onChange={(e) => {
                                const newTiers = [...localConfig.tiers];
                                newTiers[idx].rate = parseInt(e.target.value);
                                setLocalConfig({...localConfig, tiers: newTiers});
                              }}
                              className="h-8 rounded-lg bg-background/50" 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Thời gian lưu Cookie (Ngày)</Label>
                  <Input 
                    type="number" 
                    value={localConfig.cookieDays} 
                    onChange={(e) => setLocalConfig({...localConfig, cookieDays: parseInt(e.target.value)})} 
                  />
                  <p className="text-[10px] text-muted-foreground italic">Khách hàng mua hàng trong vòng X ngày kể từ khi click sẽ được tính cho Affiliate.</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveConfig} className="w-full h-12 rounded-full font-bold gap-2">
                  <Save className="w-4 h-4" /> Lưu cấu hình
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((s, i) => (
          <Card key={i} className="bg-card/50 border-white/5 hover:border-primary/30 transition-all group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-background/50 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{s.label}</p>
                <p className="text-xl font-black italic">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-white/5 bg-card/50 shadow-2xl">
          <CardHeader><CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Phân tích chuyển đổi</CardTitle></CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: '#1a1033', border: 'none', borderRadius: '12px' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-white/5 bg-card/50 shadow-2xl overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-white/5"><CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Tỷ lệ Hoa hồng Hiện tại</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-6">
            {config.tiers.map((tier, i) => (
              <CommissionTier key={i} label={`${tier.name} (${tier.minSales}+ đơn)`} rate={`${tier.rate}%`} color={tier.color} />
            ))}
            <div className="pt-4 border-t border-white/5">
              <Button variant="link" className="w-full text-primary font-bold text-xs" onClick={() => setIsConfigOpen(true)}>
                Thay đổi chính sách hoa hồng &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversions" className="w-full">
        <TabsList className="rounded-xl h-12 p-1 bg-muted/50 w-full md:w-auto">
          <TabsTrigger value="conversions" className="rounded-lg h-10 gap-2"><Tag className="w-4 h-4" /> Đơn hàng</TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg h-10 gap-2"><UserPlus className="w-4 h-4" /> Đăng ký mới</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg h-10 gap-2"><Wallet className="w-4 h-4" /> Rút tiền</TabsTrigger>
          <TabsTrigger value="links" className="rounded-lg h-10 gap-2"><LinkIcon className="w-4 h-4" /> Hệ thống Link</TabsTrigger>
        </TabsList>

        <TabsContent value="conversions" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm mã đơn, mã ref..." className="pl-10 h-10 rounded-full bg-background/50 border-white/10" />
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full">Lọc trạng thái</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Mã Ref", "Sản phẩm", "Giá trị", "Hoa hồng", "Trạng thái", "Thao tác"]}
                items={conversions}
                renderRow={(conv: AffiliateConversion) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-mono font-bold text-primary">{conv.affiliateCode}</td>
                    <td className="p-4 max-w-[200px] truncate">{conv.productName}</td>
                    <td className="p-4 font-medium">{formatVND(conv.amount)}</td>
                    <td className="p-4 font-black">{formatVND(conv.commission)}</td>
                    <td className="p-4">
                      <Badge variant={conv.status === 'approved' || conv.status === 'paid' ? 'default' : conv.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                        {conv.status}
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
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày đăng ký", "Tên đối tác", "Email", "Trạng thái", "Thao tác"]}
                items={affiliateRequests}
                renderRow={(req: AffiliateRequest) => (
                  <tr key={req.id} className="border-b border-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{req.userName}</td>
                    <td className="p-4">{req.email}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'approved' ? 'default' : 'secondary'} className="rounded-full">{req.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="rounded-full h-8 px-4" onClick={() => handleApproveAffiliate(req.id)}>Phê duyệt</Button>
                          <Button size="sm" variant="ghost" className="rounded-full h-8 text-destructive" onClick={() => updateAffiliateRequest(req.id, 'rejected')}>Từ chối</Button>
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
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày yêu cầu", "Đối tác", "Số tiền rút", "Thông tin tài khoản", "Trạng thái", "Thao tác"]}
                items={payoutRequests}
                renderRow={(p: PayoutRequest) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{p.userName}</td>
                    <td className="p-4 font-black text-primary">{formatVND(p.amount)}</td>
                    <td className="p-4">
                      <div className="text-xs font-bold">{p.bankName}</div>
                      <div className="text-[10px] text-muted-foreground">{p.accountNumber} - {p.accountName}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className="rounded-full">{p.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'pending' && (
                        <Button size="sm" className="rounded-full h-8 gap-2" onClick={() => updatePayoutStatus(p.id, 'paid')}>
                          Xác nhận chuyển khoản <ArrowUpRight className="w-3 h-3" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Tên Sản phẩm", "Mã Ref", "Lượt Click", "Đơn hàng", "Hoa hồng phát sinh", "Trạng thái"]}
                items={links}
                renderRow={(link: AffiliateLink) => (
                  <tr key={link.id} className="border-b border-white/5">
                    <td className="p-4 font-bold">{link.productName}</td>
                    <td className="p-4 font-mono text-xs text-primary">{link.code}</td>
                    <td className="p-4 text-center">{link.clicks}</td>
                    <td className="p-4 text-center">{link.conversions}</td>
                    <td className="p-4 font-bold text-primary">{formatVND(link.commission)}</td>
                    <td className="p-4">
                      <Badge className="bg-green-500/10 text-green-500 rounded-full">Hoạt động</Badge>
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

function CommissionTier({ label, rate, color }: { label: string, rate: string, color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-white/5 group hover:bg-primary/5 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${color} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Badge className="rounded-lg bg-background border-white/10 group-hover:border-primary/30">{rate}</Badge>
    </div>
  );
}

function TableLayout({ headers, items, renderRow }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b border-white/5 text-left font-medium">
          <tr>
            {headers.map((h: string) => <th key={h} className="p-4 text-[10px] uppercase tracking-widest text-muted-foreground">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? items.map(renderRow) : (
            <tr>
              <td colSpan={headers.length} className="p-12 text-center text-muted-foreground italic">Chưa có dữ liệu trong hệ thống.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
