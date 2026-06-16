
"use client";

import { useAffiliateStore, AffiliateConversion, AffiliateRequest, PayoutRequest, AffiliateLink, AffiliateProgram } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Settings2,
  Tag,
  ShieldCheck,
  Link as LinkIcon,
  Info,
  HelpCircle,
  Briefcase,
  Layers,
  ChevronRight,
  Save,
  Plus
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip,
  Cell
} from 'recharts';
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    updateConfig,
    programs,
    updatePrograms
  } = useAffiliateStore();
  const { setAffiliateActive } = useUserStore();
  
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);
  const [isProgramOpen, setIsProductOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<AffiliateProgram | null>(null);

  const handleApproveAffiliate = (id: string) => {
    updateAffiliateRequest(id, 'approved');
    const code = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    setAffiliateActive(code);
    toast({ title: "Đã phê duyệt", description: "Người dùng đã trở thành Affiliate chuyên nghiệp." });
  };

  const handleSaveConfig = () => {
    updateConfig(localConfig);
    setIsConfigOpen(false);
    toast({ title: "Thành công", description: "Đã lưu cấu hình hệ thống Affiliate." });
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newProgram: AffiliateProgram = {
      id: editingProgram?.id || `prog-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      conditions: formData.get('conditions') as string,
      eligibleProducts: formData.get('eligibleProducts') as any,
      targetIds: [],
      isActive: true
    };

    const newPrograms = editingProgram 
      ? programs.map(p => p.id === editingProgram.id ? newProgram : p)
      : [...programs, newProgram];
    
    updatePrograms(newPrograms);
    setIsProductOpen(false);
    setEditingProgram(null);
    toast({ title: "Đã lưu", description: "Chương trình hợp tác đã được cập nhật." });
  };

  // Performance data calculation
  const performanceData = useMemo(() => [
    { name: 'Đơn hàng', value: conversions.length, color: 'hsl(var(--primary))' },
    { name: 'Chờ duyệt', value: conversions.filter(c => c.status === 'pending').length, color: '#FBBF24' },
    { name: 'Đã duyệt', value: conversions.filter(c => c.status === 'approved').length, color: '#10B981' },
  ], [conversions]);

  const adminStats = [
    { label: "Tổng hoa hồng đã duyệt", value: formatVND(stats.totalEarnings), icon: <DollarSign />, color: "text-primary" },
    { label: "Yêu cầu rút tiền", value: payoutRequests.filter(p => p.status === 'pending').length, icon: <Wallet />, color: "text-blue-500" },
    { label: "Lượt Click Toàn sàn", value: stats.totalClicks, icon: <TrendingUp />, color: "text-green-500" },
    { label: "Đối tác Hoạt động", value: affiliateRequests.filter(r => r.status === 'approved').length, icon: <Users />, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight font-headline italic flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary" /> QUẢN TRỊ AFFILIATE
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Hệ thống hợp tác kinh doanh đa tầng chuyên nghiệp.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full gap-2 bg-card border-white/10">
                <Settings2 className="w-4 h-4" /> Cấu hình Tỉ lệ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Cài đặt Hoa hồng & Rút tiền</DialogTitle>
                <DialogDescription>Thiết lập các quy tắc tài chính cơ bản cho toàn bộ hệ thống.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">Hồng mặc định (%) <HelpBox text="Tỷ lệ % hoa hồng cơ bản nếu sản phẩm không có cấu hình riêng." /></Label>
                    <Input type="number" value={localConfig.globalRate} onChange={(e) => setLocalConfig({...localConfig, globalRate: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">Rút tối thiểu <HelpBox text="Số dư khả dụng tối thiểu để Affiliate có thể gửi yêu cầu rút tiền." /></Label>
                    <Input type="number" value={localConfig.minPayout} onChange={(e) => setLocalConfig({...localConfig, minPayout: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">Thời gian Cookie (Ngày) <HelpBox text="Thời gian hệ thống ghi nhớ mã giới thiệu sau khi khách hàng click vào link." /></Label>
                  <Input type="number" value={localConfig.cookieDays} onChange={(e) => setLocalConfig({...localConfig, cookieDays: parseInt(e.target.value)})} />
                </div>
              </div>
              <DialogFooter><Button onClick={handleSaveConfig} className="w-full rounded-full">Lưu thiết lập</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isProgramOpen} onOpenChange={setIsProductOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Tạo Chương trình
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSaveProgram}>
                <DialogHeader>
                  <DialogTitle>{editingProgram ? 'Sửa Chương trình' : 'Tạo Chương trình Hợp tác'}</DialogTitle>
                  <DialogDescription>Xác định đối tượng, điều kiện và quyền lợi của đối tác.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Tên chương trình</Label>
                    <Input name="name" defaultValue={editingProgram?.name} placeholder="VD: Đối tác KOC công nghệ..." required />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả (Dành cho Affiliate)</Label>
                    <Textarea name="description" defaultValue={editingProgram?.description} placeholder="Mô tả về cơ hội kiếm tiền..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Điều kiện tham gia (Ai được hợp tác?)</Label>
                    <Textarea name="conditions" defaultValue={editingProgram?.conditions} placeholder="VD: Có kênh TikTok trên 5k followers..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Phạm vi sản phẩm áp dụng</Label>
                    <Select name="eligibleProducts" defaultValue={editingProgram?.eligibleProducts || 'all'}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toàn bộ sản phẩm</SelectItem>
                        <SelectItem value="categories">Theo Danh mục</SelectItem>
                        <SelectItem value="specific">Sản phẩm chọn lọc</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full rounded-full">Lưu Chương trình</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((s, i) => (
          <Card key={i} className="bg-card/50 border-white/5 group hover:border-primary/30 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
              <div className={`h-12 w-12 rounded-2xl bg-background/50 border border-white/5 flex items-center justify-center ${s.color} group-hover:scale-110 transition-transform`}>
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

      <Tabs defaultValue="programs" className="w-full">
        <TabsList className="rounded-xl h-12 p-1 bg-muted/50 border border-white/5">
          <TabsTrigger value="programs" className="rounded-lg gap-2 px-4"><Briefcase className="w-4 h-4" /> Chương trình</TabsTrigger>
          <TabsTrigger value="requests" className="rounded-lg gap-2 px-4"><UserPlus className="w-4 h-4" /> Duyệt Đối tác</TabsTrigger>
          <TabsTrigger value="conversions" className="rounded-lg gap-2 px-4"><Tag className="w-4 h-4" /> Đơn hàng</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg gap-2 px-4"><Wallet className="w-4 h-4" /> Rút tiền</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog) => (
              <Card key={prog.id} className="bg-card/50 border-white/5 overflow-hidden group hover:border-primary/50 transition-all">
                <CardHeader className="pb-3 border-b border-white/5 bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{prog.name}</CardTitle>
                        <Badge variant="outline" className="text-[10px] uppercase bg-background mt-1">
                          {prog.eligibleProducts === 'all' ? 'Toàn sàn' : 'Chọn lọc'}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={prog.isActive ? 'default' : 'secondary'} className="rounded-full">
                      {prog.isActive ? 'Bật' : 'Tắt'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> Điều kiện tham gia
                    </Label>
                    <p className="text-xs text-foreground/80 line-clamp-2 italic">"{prog.conditions}"</p>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] text-muted-foreground">Phạm vi: {prog.eligibleProducts}</span>
                    <Button variant="ghost" size="sm" className="h-8 rounded-full text-xs font-bold gap-1" onClick={() => { setEditingProgram(prog); setIsProductOpen(true); }}>
                      Chỉnh sửa <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-6">
            <h4 className="font-bold flex items-center gap-2 mb-2"><HelpCircle className="w-5 h-5 text-primary" /> Tip vận hành chuyên nghiệp</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Nên tạo nhiều chương trình (VD: VIP, KOL, Đại lý) với các mức hoa hồng khác nhau.</li>
              <li>Sử dụng "Điều kiện tham gia" để sàng lọc đối tác chất lượng, tránh spam link.</li>
              <li>Chương trình "Toàn sàn" nên để hoa hồng thấp (VD 5-10%), chương trình "Specific" cho hàng mới nên để cao (VD 15-20%).</li>
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày đăng ký", "Tên đối tác", "Email", "Trạng thái", "Thao tác"]}
                items={affiliateRequests}
                renderRow={(req: AffiliateRequest) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{req.userName}</td>
                    <td className="p-4 text-xs">{req.email}</td>
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

        <TabsContent value="conversions" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between py-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm mã đơn, mã ref..." className="pl-10 h-10 rounded-full bg-background/50 border-white/10" />
              </div>
              <Button variant="outline" size="sm" className="rounded-full gap-2 h-9">
                <Download className="w-4 h-4" /> Xuất dữ liệu
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Mã Ref", "Sản phẩm", "Hoa hồng", "Trạng thái", "Thao tác"]}
                items={conversions}
                renderRow={(conv: AffiliateConversion) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-mono font-bold text-primary">{conv.affiliateCode}</td>
                    <td className="p-4 text-xs truncate max-w-[150px]">{conv.productName}</td>
                    <td className="p-4 font-black text-sm">{formatVND(conv.commission)}</td>
                    <td className="p-4">
                      <Badge variant={conv.status === 'approved' || conv.status === 'paid' ? 'default' : conv.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                        {conv.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {conv.status === 'pending' && (
                          <>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => updateConversionStatus(conv.id, 'approved')}>
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => updateConversionStatus(conv.id, 'rejected')}>
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

        <TabsContent value="payouts" className="pt-4">
          <Card className="border-white/5 bg-card/50 rounded-3xl overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày yêu cầu", "Đối tác", "Số tiền", "Ngân hàng", "Trạng thái", ""]}
                items={payoutRequests}
                renderRow={(p: PayoutRequest) => (
                  <tr key={p.id} className="border-b border-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{p.userName}</td>
                    <td className="p-4 font-black text-primary">{formatVND(p.amount)}</td>
                    <td className="p-4">
                      <div className="text-xs font-bold">{p.bankName}</div>
                      <div className="text-[10px] text-muted-foreground">{p.accountNumber}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={p.status === 'paid' ? 'default' : 'secondary'} className="rounded-full">{p.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      {p.status === 'pending' && (
                        <Button size="sm" className="rounded-full h-8 gap-2" onClick={() => updatePayoutStatus(p.id, 'paid')}>
                          Xác nhận chi trả <ArrowUpRight className="w-3 h-3" />
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

function HelpBox({ text }: { text: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild><HelpCircle className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" /></DialogTrigger>
      <DialogContent className="max-w-xs text-sm p-6">
        <p className="leading-relaxed">{text}</p>
      </DialogContent>
    </Dialog>
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
