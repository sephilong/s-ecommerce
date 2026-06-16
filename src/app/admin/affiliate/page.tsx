
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
  Plus,
  Check,
  Mail,
  BarChart3,
  Lightbulb,
  MousePointer2,
  ArrowRight
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
  AreaChart,
  Area
} from 'recharts';
import { toast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_TENANTS } from "@/lib/store-data";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<AffiliateProgram | null>(null);

  // Form State for Program
  const [eligibleType, setEligibleProducts] = useState<'all' | 'categories' | 'specific'>('all');
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["Điện tử", "Phụ kiện", "Gia dụng", "Thời trang"];
  const allProducts = MOCK_TENANTS[0].products;

  // Mock data for charts
  const performanceData = [
    { name: '01/05', revenue: 4500000, clicks: 120, conv: 12 },
    { name: '05/05', revenue: 7200000, clicks: 180, conv: 18 },
    { name: '10/05', revenue: 5800000, clicks: 150, conv: 15 },
    { name: '15/05', revenue: 9800000, clicks: 240, conv: 25 },
    { name: '20/05', revenue: 12500000, clicks: 320, conv: 35 },
    { name: '25/05', revenue: 8500000, clicks: 210, conv: 22 },
    { name: '30/05', revenue: 15000000, clicks: 450, conv: 48 },
  ];

  useEffect(() => {
    if (editingProgram) {
      setEligibleProducts(editingProgram.eligibleProducts);
      setSelectedTargetIds(editingProgram.targetIds || []);
    } else {
      setEligibleProducts('all');
      setSelectedTargetIds([]);
    }
  }, [editingProgram]);

  const handleApproveAffiliate = (id: string) => {
    updateAffiliateRequest(id, 'approved');
    const code = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    setAffiliateActive(code);
    toast({ title: "Đã phê duyệt đối tác!", description: `Mã ${code} đã được cấp cho người dùng.` });
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
      eligibleProducts: eligibleType,
      targetIds: selectedTargetIds,
      isActive: true
    };
    const newPrograms = editingProgram 
      ? programs.map(p => p.id === editingProgram.id ? newProgram : p)
      : [...programs, newProgram];
    updatePrograms(newPrograms);
    setIsProgramOpen(false);
    setEditingProgram(null);
    toast({ title: "Đã lưu", description: "Chương trình hợp tác đã được cập nhật." });
  };

  const toggleTargetId = (id: string) => {
    setSelectedTargetIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    if (eligibleType === 'categories') return categories.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    return allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [eligibleType, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight font-headline italic flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Briefcase className="w-7 h-7" />
            </div>
            AFFILIATE HUB
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Hệ thống quản trị mạng lưới đối tác và hiệu suất kinh doanh.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full gap-2 border-white/10 h-11 px-6 font-bold" onClick={() => setIsConfigOpen(true)}>
            <Settings2 className="w-4 h-4" /> Cấu hình
          </Button>
          <Button className="rounded-full gap-2 shadow-xl shadow-primary/20 h-11 px-6 font-bold" onClick={() => { setEditingProgram(null); setIsProgramOpen(true); }}>
            <Plus className="w-4 h-4" /> Tạo Chương trình
          </Button>
        </div>
      </div>

      {/* Main Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary Chart */}
        <Card className="lg:col-span-2 bg-card/40 border-white/5 backdrop-blur-sm overflow-hidden rounded-[2rem]">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-xl font-headline italic">Hiệu suất Tăng trưởng</CardTitle>
              <CardDescription>Doanh thu và chuyển đổi từ nguồn Affiliate</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-primary/20 text-primary border-none">30 ngày qua</Badge>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] w-full p-0 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                <ChartTooltip 
                  contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right: Operational Tips */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border border-primary/20 rounded-[2rem] h-full overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-2">
                <Lightbulb className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">Tips Quản trị Affiliate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TipItem 
                title="Tối ưu Tỷ lệ Chuyển đổi" 
                desc="Cung cấp tài liệu marketing (ảnh đẹp, caption sẵn) trong mục 'Tài liệu' để đối tác dễ chia sẻ." 
              />
              <TipItem 
                title="Sử dụng Tier linh hoạt" 
                desc="Tăng hoa hồng cho cấp Gold (15-20%) để khích lệ các đối tác top đầu đẩy mạnh doanh số." 
              />
              <TipItem 
                title="Duyệt đơn thần tốc" 
                desc="Xử lý yêu cầu rút tiền trong vòng 24h giúp xây dựng uy tín và lòng tin với mạng lưới đối tác." 
              />
              <TipItem 
                title="Flash Sale cho Affiliate" 
                desc="Tạo mã coupon độc quyền cho từng đối tác lớn để họ làm nội dung review thu hút hơn." 
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatSummaryCard label="Tổng Clicks" value="1,240" icon={<MousePointer2 />} trend="+15% so với tuần trước" />
        <StatSummaryCard label="Chuyển đổi" value="84" icon={<TrendingUp />} trend="+8% so với tuần trước" />
        <StatSummaryCard label="Hoa hồng chờ" value={formatVND(stats.pendingCommission)} icon={<Clock />} color="text-orange-500" />
        <StatSummaryCard label="Đối tác mới" value={affiliateRequests.filter(r => r.status === 'pending').length} icon={<UserPlus />} color="text-blue-500" />
      </div>

      {/* Operational Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="rounded-2xl h-14 p-1.5 bg-muted/30 border border-white/5 w-full md:w-auto overflow-x-auto justify-start">
          <TabsTrigger value="requests" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white h-full">
            <UserPlus className="w-4 h-4" /> Duyệt Đối tác
          </TabsTrigger>
          <TabsTrigger value="conversions" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white h-full">
            <Tag className="w-4 h-4" /> Đơn hàng
          </TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white h-full">
            <Wallet className="w-4 h-4" /> Rút tiền
          </TabsTrigger>
          <TabsTrigger value="programs" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white h-full">
            <Briefcase className="w-4 h-4" /> Chương trình
          </TabsTrigger>
          <TabsTrigger value="reports" className="rounded-xl gap-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white h-full">
            <BarChart3 className="w-4 h-4" /> Báo cáo chi tiết
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="pt-6">
          <Card className="border-white/5 bg-card/50 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày đăng ký", "Họ tên", "Email", "Trạng thái", "Thao tác"]}
                items={affiliateRequests}
                renderRow={(req: AffiliateRequest) => (
                  <tr key={req.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{req.userName}</td>
                    <td className="p-4 text-xs text-muted-foreground">{req.email}</td>
                    <td className="p-4">
                      <Badge variant={req.status === 'approved' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'} className="rounded-full">
                        {req.status === 'pending' ? 'Chờ duyệt' : req.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" className="rounded-full px-4 font-bold" onClick={() => handleApproveAffiliate(req.id)}>Phê duyệt</Button>
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

        {/* Other Tab Contents (Simplified for brevity, following the same pattern) */}
        <TabsContent value="conversions" className="pt-6">
          <Card className="border-white/5 bg-card/50 rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 flex flex-row items-center justify-between p-6">
              <CardTitle className="text-lg">Lịch sử Chuyển đổi</CardTitle>
              <Button variant="outline" size="sm" className="rounded-full gap-2 h-9 px-4">
                <Download className="w-4 h-4" /> Xuất báo cáo CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày", "Mã Ref", "Sản phẩm", "Hoa hồng", "Trạng thái", "Thao tác"]}
                items={conversions}
                renderRow={(conv: AffiliateConversion) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-mono font-bold text-primary">{conv.affiliateCode}</td>
                    <td className="p-4 text-xs font-medium truncate max-w-[180px]">{conv.productName}</td>
                    <td className="p-4 font-black">{formatVND(conv.commission)}</td>
                    <td className="p-4"><Badge className="rounded-full">{conv.status}</Badge></td>
                    <td className="p-4 text-right">
                      {conv.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" className="text-green-500 hover:bg-green-500/10" onClick={() => updateConversionStatus(conv.id, 'approved')}><CheckCircle2 className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => updateConversionStatus(conv.id, 'rejected')}><XCircle className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="pt-6">
          <Card className="border-white/5 bg-card/50 rounded-[2rem] overflow-hidden shadow-2xl">
             <CardContent className="p-0">
              <TableLayout 
                headers={["Ngày yêu cầu", "Đối tác", "Số tiền", "Ngân hàng", "Trạng thái", ""]}
                items={payoutRequests}
                renderRow={(p: PayoutRequest) => (
                  <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{p.userName}</td>
                    <td className="p-4 font-black text-primary">{formatVND(p.amount)}</td>
                    <td className="p-4">
                      <div className="text-xs font-bold">{p.bankName}</div>
                      <div className="text-[10px] text-muted-foreground">{p.accountNumber}</div>
                    </td>
                    <td className="p-4"><Badge className="rounded-full">{p.status}</Badge></td>
                    <td className="p-4 text-right">
                      {p.status === 'pending' && (
                        <Button size="sm" className="rounded-full font-bold gap-2" onClick={() => updatePayoutStatus(p.id, 'paid')}>
                          Xác nhận Chi trả <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                )}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((prog) => (
              <Card key={prog.id} className="bg-card/40 border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/50 transition-all">
                <CardHeader className="bg-muted/20 border-b border-white/5 pb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{prog.name}</CardTitle>
                        <Badge variant="outline" className="text-[10px] uppercase bg-background mt-1">
                          {prog.eligibleProducts === 'all' ? 'Toàn sàn' : 'Chọn lọc'}
                        </Badge>
                      </div>
                    </div>
                    <Badge className="rounded-full">{prog.isActive ? 'Hoạt động' : 'Tạm dừng'}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> Quy định tham gia
                    </Label>
                    <p className="text-xs text-foreground/80 line-clamp-2 italic leading-relaxed">"{prog.conditions}"</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-[10px] text-muted-foreground font-bold">Áp dụng cho {prog.targetIds?.length || 'tất cả'} mục</span>
                    <Button variant="ghost" size="sm" className="h-9 rounded-full text-xs font-bold gap-2 hover:bg-primary/10 hover:text-primary" onClick={() => { setEditingProgram(prog); setIsProgramOpen(true); }}>
                      Chỉnh sửa <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/40 border-white/5 rounded-[2rem]">
              <CardHeader><CardTitle className="text-lg">Top Đối tác doanh thu</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Nguyễn Văn A', sales: '45.000.000đ', conv: '12%', color: 'bg-primary' },
                  { name: 'Trần Thị B', sales: '32.000.000đ', conv: '8%', color: 'bg-blue-500' },
                  { name: 'Lê Văn C', sales: '28.500.000đ', conv: '15%', color: 'bg-green-500' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center font-bold text-sm">{i+1}</div>
                      <div>
                        <p className="font-bold text-sm">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">CR: {p.conv}</p>
                      </div>
                    </div>
                    <p className="font-black text-sm text-primary">{p.sales}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/40 border-white/5 rounded-[2rem]">
              <CardHeader><CardTitle className="text-lg">Sản phẩm Affiliate tốt nhất</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'iPhone 15 Pro Max', total: '120 đơn', share: '45%' },
                  { name: 'AirPods Pro Gen 2', total: '85 đơn', share: '30%' },
                  { name: 'MacBook M3 Air', total: '42 đơn', share: '25%' },
                ].map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{p.name}</span>
                      <span className="font-bold text-primary">{p.total}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: p.share }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals & Dialogs (Config & Program) */}
      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent className="max-w-xl rounded-[2.5rem] p-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline italic">Cấu hình Hệ thống</DialogTitle>
            <DialogDescription>Thiết lập quy tắc tài chính và ghi nhận cho mạng lưới đối tác.</DialogDescription>
          </DialogHeader>
          <div className="space-y-8 py-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="font-bold text-sm flex items-center gap-2">Hoa hồng mặc định (%) <HelpBox text="Tỷ lệ % hoa hồng cơ bản nếu sản phẩm không có cấu hình riêng." /></Label>
                <Input type="number" className="h-12 rounded-xl" value={localConfig.globalRate} onChange={(e) => setLocalConfig({...localConfig, globalRate: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-sm flex items-center gap-2">Rút tối thiểu (VNĐ) <HelpBox text="Số dư khả dụng tối thiểu để đối tác gửi yêu cầu rút tiền." /></Label>
                <Input type="number" className="h-12 rounded-xl" value={localConfig.minPayout} onChange={(e) => setLocalConfig({...localConfig, minPayout: parseInt(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="font-bold text-sm flex items-center gap-2">Thời gian Cookie (Ngày) <HelpBox text="Thời gian hệ thống ghi nhớ mã giới thiệu sau khi khách hàng click link." /></Label>
              <Input type="number" className="h-12 rounded-xl" value={localConfig.cookieDays} onChange={(e) => setLocalConfig({...localConfig, cookieDays: parseInt(e.target.value)})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveConfig} className="w-full rounded-full h-14 font-bold text-lg shadow-xl shadow-primary/20">Lưu tất cả thiết lập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isProgramOpen} onOpenChange={setIsProgramOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-10">
          <form onSubmit={handleSaveProgram}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline italic">{editingProgram ? 'Sửa Chương trình' : 'Tạo Chương trình Hợp tác'}</DialogTitle>
              <DialogDescription>Xác định đối tượng, điều kiện và quyền lợi của đối tác.</DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <Label className="font-bold text-sm">Tên chương trình chiến dịch</Label>
                <Input name="name" defaultValue={editingProgram?.name} className="h-12 rounded-xl" placeholder="VD: Đối tác KOC Review sản phẩm..." required />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-sm">Mô tả quyền lợi chi tiết</Label>
                <Textarea name="description" defaultValue={editingProgram?.description} className="rounded-xl min-h-[100px]" placeholder="Mô tả cơ hội kiếm tiền..." />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-sm">Điều kiện phê duyệt tham gia</Label>
                <Textarea name="conditions" defaultValue={editingProgram?.conditions} className="rounded-xl" placeholder="VD: Có kênh TikTok trên 1k followers..." />
              </div>
              <div className="space-y-3">
                <Label className="font-bold text-sm">Phạm vi sản phẩm áp dụng</Label>
                <Select value={eligibleType} onValueChange={(val: any) => setEligibleProducts(val)}>
                  <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toàn bộ cửa hàng</SelectItem>
                    <SelectItem value="categories">Theo Danh mục</SelectItem>
                    <SelectItem value="specific">Sản phẩm cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {eligibleType !== 'all' && (
                <div className="space-y-4 p-6 rounded-2xl bg-primary/5 border border-primary/10">
                  <div className="flex justify-between items-center">
                    <Label className="font-bold">Lựa chọn áp dụng</Label>
                    <Badge variant="secondary" className="bg-primary text-white">{selectedTargetIds.length} đã chọn</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Tìm kiếm nhanh..." className="pl-11 h-10 rounded-full bg-background" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                  <ScrollArea className="h-48 border rounded-xl p-2 bg-background/50">
                    <div className="space-y-1">
                      {filteredItems.map((item: any) => {
                        const id = typeof item === 'string' ? item : item.id;
                        const name = typeof item === 'string' ? item : item.name;
                        const isSelected = selectedTargetIds.includes(id);
                        return (
                          <div key={id} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted/50'}`} onClick={() => toggleTargetId(id)}>
                            <span className="text-sm font-semibold">{name}</span>
                            {isSelected && <Check className="w-4 h-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full rounded-full h-14 font-bold text-lg shadow-xl shadow-primary/20">Lưu Chương trình</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatSummaryCard({ label, value, icon, color = "text-primary", trend }: any) {
  return (
    <Card className="bg-card/40 border-white/5 rounded-3xl group hover:border-primary/30 transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
      <CardContent className="p-6 space-y-4 relative z-10">
        <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
          <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
          {trend && <p className="text-[10px] text-green-500 font-bold mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {trend}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function TipItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/tip">
      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0 group-hover/tip:scale-150 transition-transform" />
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function HelpBox({ text }: { text: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild><HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-pointer hover:text-primary transition-colors" /></DialogTrigger>
      <DialogContent className="max-w-xs text-sm p-8 rounded-3xl">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Info className="w-6 h-6" /></div>
          <p className="leading-relaxed font-medium text-muted-foreground">{text}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TableLayout({ headers, items, renderRow }: any) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/20 border-b border-white/5 text-left font-medium">
          <tr>
            {headers.map((h: string) => <th key={h} className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.length > 0 ? items.map(renderRow) : (
            <tr>
              <td colSpan={headers.length} className="p-20 text-center text-muted-foreground italic font-medium">
                <div className="flex flex-col items-center gap-4 opacity-50">
                  <Search className="w-12 h-12" />
                  Chưa có dữ liệu cần xử lý trong mục này.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
