
"use client";

import { useState, useMemo } from "react";
import { useAffiliateStore, AffiliateLink, AffiliateConversion, AffiliateTransaction, AffiliateRequest } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  QrCode, 
  History, 
  Wallet, 
  ArrowUpRight, 
  Settings, 
  Rocket, 
  Search, 
  Plus, 
  Copy, 
  Trash2, 
  Share2, 
  Download,
  Users,
  TrendingUp,
  MousePointer2,
  DollarSign,
  CheckCircle2,
  Image as ImageIcon,
  Trophy,
  Loader2,
  ChevronRight,
  ExternalLink,
  Mail,
  MessageCircle,
  Facebook,
  Info,
  PlayCircle,
  HelpCircle,
  Clock
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import Image from "next/image";
import { MOCK_TENANTS } from "@/lib/store-data";
import React from "react";

export default function AffiliateDashboard() {
  const { profile, requestAffiliate: markUserPending } = useUserStore();
  const { links, stats, conversions, transactions, payoutRequests, addLink, deleteLink, requestPayout, submitAffiliateRequest } = useAffiliateStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);

  const isAffiliate = profile?.affiliateStatus === 'active';
  const isPending = profile?.affiliateStatus === 'pending';

  const handleJoin = () => {
    if (!profile) return;
    setLoading(true);
    
    const newRequest: AffiliateRequest = {
      id: `req-${Date.now()}`,
      userId: "current-user",
      userName: `${profile.firstName} ${profile.lastName}`,
      email: "user@example.com",
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    submitAffiliateRequest(newRequest);
    markUserPending();
    
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Đã gửi yêu cầu thành công!", description: "Admin sẽ xem xét và phê duyệt trong vòng 24h." });
    }, 1000);
  };

  if (!isAffiliate) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        <div className="text-center space-y-8">
          <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <Rocket className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">KIẾM TIỀN CÙNG S-COM HUB</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {isPending 
                ? "Yêu cầu của bạn đang chờ phê duyệt. Chúng tôi sẽ thông báo cho bạn ngay khi bạn có thể bắt đầu kiếm tiền."
                : "Tham gia mạng lưới đối tác chuyên nghiệp để nhận hoa hồng lên tới 20% từ mỗi đơn hàng thành công."}
            </p>
          </div>
          {!isPending ? (
            <Button onClick={handleJoin} size="lg" className="rounded-full h-14 px-12 text-lg font-bold shadow-xl shadow-primary/20">
              {loading ? <Loader2 className="animate-spin mr-2" /> : "Đăng ký làm Đối tác ngay"}
            </Button>
          ) : (
            <div className="p-6 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold inline-flex items-center gap-2">
              <Clock className="w-5 h-5" /> Trạng thái: Đang chờ Admin phê duyệt
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BenefitCard icon={<DollarSign />} title="Hoa hồng hấp dẫn" desc="Nhận đến 15-20% giá trị đơn hàng, cao nhất thị trường." />
          <BenefitCard icon={<Users />} title="Hệ thống đa tầng" desc="Kiếm thêm từ việc giới thiệu các đối tác mới vào mạng lưới." />
          <BenefitCard icon={<TrendingUp />} title="Công cụ chuyên nghiệp" desc="Link Builder, Mã QR và Dashboard thống kê thời gian thực." />
        </div>

        <Card className="bg-card/30 border-white/5 rounded-[2.5rem] p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <HelpCircle className="text-primary w-6 h-6" /> Quy trình 3 bước đơn giản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
             <StepItem num="01" title="Đăng ký" desc="Gửi yêu cầu tham gia và chờ Admin phê duyệt trong 24h." />
             <StepItem num="02" title="Chia sẻ" desc="Chọn sản phẩm, tạo link và chia sẻ lên mạng xã hội hoặc QR code." />
             <StepItem num="03" title="Nhận tiền" desc="Khi khách hàng mua qua link, hoa hồng sẽ tự động chảy về ví của bạn." />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-card/30 border border-white/5 rounded-3xl p-4 sticky top-24 space-y-2">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard />} label="Bảng điều khiển" />
          <NavButton active={activeTab === 'links'} onClick={() => setActiveTab('links')} icon={<LinkIcon />} label="Link của tôi" />
          <NavButton active={activeTab === 'conversions'} onClick={() => setActiveTab('conversions')} icon={<History />} label="Lịch sử hoa hồng" />
          <NavButton active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} icon={<Wallet />} label="Ví & Rút tiền" />
          <NavButton active={activeTab === 'marketing'} onClick={() => setActiveTab('marketing')} icon={<ImageIcon />} label="Tài liệu quảng bá" />
          <NavButton active={activeTab === 'guide'} onClick={() => setActiveTab('guide')} icon={<PlayCircle />} label="Hướng dẫn sử dụng" />
          <div className="pt-4 mt-4 border-t border-white/5">
            <NavButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings />} label="Cài đặt shop" />
          </div>
        </div>
      </aside>

      <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
        {activeTab === 'dashboard' && <DashboardView stats={stats} conversions={conversions} />}
        {activeTab === 'links' && <LinksView links={links} onAdd={addLink} onDelete={deleteLink} />}
        {activeTab === 'conversions' && <ConversionsView conversions={conversions} />}
        {activeTab === 'wallet' && <WalletView stats={stats} transactions={transactions} payoutRequests={payoutRequests} onRequestPayout={requestPayout} />}
        {activeTab === 'marketing' && <MarketingAssetsView />}
        {activeTab === 'guide' && <GuideView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
}

function GuideView() {
  return (
    <div className="space-y-8">
       <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline italic">HƯỚNG DẪN KIẾM TIỀN</h2>
        <p className="text-muted-foreground">Bắt đầu hành trình gia tăng thu nhập thụ động cùng S-Com Hub.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-card/50 border-white/5 p-8">
          <div className="flex gap-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <LinkIcon className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">1. Cách tạo Link giới thiệu</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vào mục <strong>"Link của tôi"</strong>, dán đường dẫn sản phẩm bất kỳ từ cửa hàng vào ô <strong>"Link Builder"</strong>. 
                Hệ thống sẽ tự động thêm mã giới thiệu cá nhân của bạn vào cuối link. Bất kỳ ai click vào link này và mua hàng trong 30 ngày, bạn đều được tính hoa hồng.
              </p>
              <div className="bg-background/50 p-4 rounded-xl border border-dashed border-white/10 text-xs font-mono">
                Ví dụ: https://scomhub.vn/products/iphone-15?ref=CODE_CUA_BAN
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card/50 border-white/5 p-8">
          <div className="flex gap-6">
            <div className="h-12 w-12 rounded-2xl bg-orange-500/20 text-orange-500 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">2. Tận dụng Mã QR</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Với mỗi link đã tạo, bạn có thể nhấn vào biểu tượng <strong>QR Code</strong>. Hãy tải mã này về và in ra hoặc chèn vào các video TikTok, bài viết Facebook để khách hàng quét mã mua hàng nhanh chóng.
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-card/50 border-white/5 p-8">
          <div className="flex gap-6">
            <div className="h-12 w-12 rounded-2xl bg-green-500/20 text-green-500 flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">3. Rút tiền về ngân hàng</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Hoa hồng sẽ ở trạng thái <strong>"Chờ duyệt"</strong> cho đến khi đơn hàng hoàn thành (thường là 7 ngày sau khi nhận hàng). 
                Khi số dư đạt mức tối thiểu (50.000đ), bạn có thể gửi yêu cầu rút tiền tại mục <strong>"Ví & Rút tiền"</strong>.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function SettingsView() {
  const { profile } = useUserStore();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold font-headline italic">CÀI ĐẶT CỬA HÀNG</h2>
        <p className="text-muted-foreground">Cấu hình thông tin cá nhân và tài khoản nhận hoa hồng.</p>
      </div>
      <Card className="bg-card/50 border-white/5 p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Tên hiển thị đối tác</Label>
            <Input defaultValue={`${profile?.firstName} ${profile?.lastName}`} />
          </div>
          <div className="space-y-2">
            <Label>Mã giới thiệu (Cố định)</Label>
            <Input defaultValue={profile?.affiliateCode} disabled className="bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tài khoản ngân hàng nhận tiền</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Tên ngân hàng" defaultValue="Vietcombank" />
            <Input placeholder="Số tài khoản" defaultValue="0123456789" />
            <Input placeholder="Tên chủ tài khoản" defaultValue="NGUYEN VAN A" />
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button className="rounded-full px-8 font-bold">Cập nhật thông tin</Button>
        </div>
      </Card>
    </div>
  );
}

function DashboardView({ stats, conversions }: any) {
  const chartData = [
    { name: 'T2', clicks: 45, earn: 250000 },
    { name: 'T3', clicks: 52, earn: 600000 },
    { name: 'T4', clicks: 38, earn: 400000 },
    { name: 'T5', clicks: 65, earn: 1200000 },
    { name: 'T6', clicks: 48, earn: 500000 },
    { name: 'T7', clicks: 95, earn: 2100000 },
    { name: 'CN', clicks: 120, earn: 2800000 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Lượt click hôm nay" value="120" icon={<MousePointer2 />} />
        <StatCard title="Tổng đơn hàng" value={stats.totalConversions} icon={<CheckCircle2 />} />
        <StatCard title="Hoa hồng chờ" value={formatVND(stats.pendingCommission)} icon={<History />} />
        <StatCard title="Số dư khả dụng" value={formatVND(stats.balance)} icon={<DollarSign />} color="text-green-500" />
      </div>

      <Card className="bg-card/50 border-white/5 overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Hiệu suất thu nhập</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="rounded-full">Clicks</Badge>
              <Badge variant="default" className="rounded-full">Hoa hồng</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="earn" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorEarn)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-headline italic">Hoa hồng vừa ghi nhận</h3>
        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-white/5 text-left">
                  <tr>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Sản phẩm</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Giá trị đơn</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Hoa hồng</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.slice(0, 5).map((conv: AffiliateConversion) => (
                    <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4 font-medium">{conv.productName}</td>
                      <td className="p-4">{formatVND(conv.amount)}</td>
                      <td className="p-4 font-bold text-primary">{formatVND(conv.commission)}</td>
                      <td className="p-4">
                        <Badge className="rounded-full" variant={conv.status === 'approved' ? 'default' : 'secondary'}>{conv.status}</Badge>
                      </td>
                    </tr>
                  ))}
                  {conversions.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-muted-foreground italic">Chưa có chuyển đổi nào.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LinksView({ links, onAdd, onDelete }: any) {
  const [productUrl, setProductUrl] = useState("");
  const products = MOCK_TENANTS[0].products;

  const handleCreate = () => {
    if (!productUrl) return;
    const isInternal = productUrl.includes("/products/");
    const slug = isInternal ? productUrl.split("/products/")[1]?.split("?")[0] : "";
    const product = products.find(p => p.slug === slug);
    
    const newLink: AffiliateLink = {
      id: `link-${Date.now()}`,
      productId: slug || "general",
      productName: product?.name || "Trang chủ",
      code: "MY-REF-" + Math.random().toString(36).substring(7).toUpperCase(),
      originalUrl: productUrl,
      shortUrl: `https://s.schub.vn/${Math.random().toString(36).substring(7)}`,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: 0,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    onAdd(newLink);
    setProductUrl("");
    toast({ title: "Thành công", description: "Đã tạo link giới thiệu mới!" });
  };

  return (
    <div className="space-y-8">
      <Card className="bg-card/50 border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
        <CardHeader>
          <CardTitle>Link Builder (Tạo Link Giới Thiệu)</CardTitle>
          <CardDescription>Dán link sản phẩm bất kỳ từ cửa hàng để gắn mã kiếm tiền của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input 
              placeholder="VD: /products/ao-thun-nam-cao-cap..." 
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="rounded-xl h-12 bg-background/50"
            />
            <Button onClick={handleCreate} className="rounded-xl h-12 px-8 font-bold gap-2">
              <Plus className="w-4 h-4" /> Tạo Link Ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold font-headline flex items-center gap-2">
          Danh sách Link <Badge variant="secondary" className="rounded-full">{links.length}</Badge>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links.map((link: AffiliateLink) => (
            <Card key={link.id} className="bg-card/30 border-white/5 hover:border-primary/30 transition-all p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-primary truncate max-w-[200px]">{link.productName}</h4>
                  <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">{link.shortUrl}</p>
                </div>
                <div className="flex gap-2">
                  <QRDialog url={`${window.location.origin}/products/${link.productId}?ref=${link.code}`} />
                  <ShareDialog url={`${window.location.origin}/products/${link.productId}?ref=${link.code}`} />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onDelete(link.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Lượt Click</p>
                  <p className="font-bold">{link.clicks}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Đơn hàng</p>
                  <p className="font-bold">{link.conversions}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground">Hoa hồng</p>
                  <p className="font-bold text-primary">{formatVND(link.commission)}</p>
                </div>
              </div>
            </Card>
          ))}
          {links.length === 0 && (
            <div className="col-span-full py-12 text-center bg-muted/10 rounded-3xl border border-dashed border-white/10 italic text-muted-foreground">
              Bạn chưa tạo link giới thiệu nào. Hãy sử dụng Link Builder phía trên.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ConversionsView({ conversions }: any) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold font-headline italic">Lịch sử Chuyển đổi</h3>
        <Button variant="outline" size="sm" className="rounded-full gap-2">
          <Download className="w-4 h-4" /> Xuất CSV
        </Button>
      </div>
      <Card className="bg-card/50 border-white/5">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Ngày đặt</th>
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Đơn hàng</th>
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Sản phẩm</th>
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Giá trị</th>
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Hoa hồng</th>
                  <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conv: AffiliateConversion) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-mono font-bold">#{conv.orderId}</td>
                    <td className="p-4">{conv.productName}</td>
                    <td className="p-4">{formatVND(conv.amount)}</td>
                    <td className="p-4 font-black text-primary">{formatVND(conv.commission)}</td>
                    <td className="p-4">
                      <Badge variant={conv.status === 'approved' ? 'default' : conv.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                        {conv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {conversions.length === 0 && (
                  <tr><td colSpan={6} className="p-12 text-center text-muted-foreground italic">Chưa có dữ liệu chuyển đổi.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WalletView({ stats, transactions, payoutRequests, onRequestPayout }: any) {
  const [withdrawAmount, setWithdrawAmount] = useState(stats.balance);
  
  const handleWithdraw = () => {
    if (withdrawAmount < 50000) {
      toast({ title: "Lỗi", description: "Số tiền tối thiểu là 50.000đ", variant: "destructive" });
      return;
    }
    if (withdrawAmount > stats.balance) {
      toast({ title: "Lỗi", description: "Số dư khả dụng không đủ", variant: "destructive" });
      return;
    }
    
    onRequestPayout({
      id: `po-${Date.now()}`,
      userId: "current-user",
      userName: "Affiliate User",
      amount: withdrawAmount,
      bankName: "Vietcombank",
      accountNumber: "9999888777",
      accountName: "NGUYEN VAN A",
      status: 'pending',
      createdAt: new Date().toISOString()
    });
    
    toast({ title: "Thành công", description: "Yêu cầu rút tiền đã được gửi!" });
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white shadow-xl shadow-primary/20 p-6 space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest opacity-80">Số dư khả dụng</p>
          <h2 className="text-4xl font-black italic tracking-tighter">{formatVND(stats.balance)}</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full rounded-full font-bold">Rút tiền ngay <ArrowUpRight className="ml-2 w-4 h-4" /></Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Yêu cầu rút tiền</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Số tiền rút (VNĐ)</Label>
                  <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(parseInt(e.target.value))} />
                  <p className="text-[10px] text-muted-foreground italic">Số dư khả dụng: {formatVND(stats.balance)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ngân hàng</Label>
                    <Input defaultValue="Vietcombank" />
                  </div>
                  <div className="space-y-2">
                    <Label>Số tài khoản</Label>
                    <Input defaultValue="9999888777" />
                  </div>
                </div>
                <Button className="w-full h-12 rounded-xl font-bold" onClick={handleWithdraw}>Gửi yêu cầu</Button>
              </div>
            </DialogContent>
          </Dialog>
        </Card>
        
        <Card className="bg-card/50 border-white/5 p-6 flex flex-col justify-between">
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Hoa hồng chờ duyệt</p>
          <div>
            <h3 className="text-2xl font-bold">{formatVND(stats.pendingCommission)}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Sẽ khả dụng sau khi đơn hàng hoàn thành.</p>
          </div>
        </Card>

        <Card className="bg-card/50 border-white/5 p-6 flex flex-col justify-between">
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Tổng thu nhập trọn đời</p>
          <div>
            <h3 className="text-2xl font-bold text-primary">{formatVND(stats.totalEarnings)}</h3>
            <div className="h-1 w-full bg-white/5 rounded-full mt-2">
              <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="transactions" className="rounded-lg">Lịch sử giao dịch</TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg">Yêu cầu rút tiền</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="pt-4">
          <Card className="bg-card/50 border-white/5">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-white/5 text-left">
                  <tr>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Ngày</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Loại</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Nội dung</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground text-right">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx: AffiliateTransaction) => (
                    <tr key={tx.id} className="border-b border-white/5">
                      <td className="p-4 text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="rounded-full capitalize">{tx.type}</Badge>
                      </td>
                      <td className="p-4">{tx.description}</td>
                      <td className={`p-4 font-bold text-right ${tx.type === 'withdraw' ? 'text-red-400' : 'text-green-400'}`}>
                        {tx.type === 'withdraw' ? '-' : '+'}{formatVND(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-muted-foreground italic">Chưa có giao dịch nào.</td></tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payouts" className="pt-4">
          <Card className="bg-card/50 border-white/5">
             <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-white/5 text-left">
                  <tr>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Ngày</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Số tiền</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Ngân hàng</th>
                    <th className="p-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRequests.map((po: any) => (
                    <tr key={po.id} className="border-b border-white/5">
                      <td className="p-4 text-xs text-muted-foreground">{new Date(po.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="p-4 font-bold">{formatVND(po.amount)}</td>
                      <td className="p-4 text-xs">{po.bankName} - {po.accountNumber}</td>
                      <td className="p-4">
                        <Badge variant={po.status === 'paid' ? 'default' : 'secondary'} className="rounded-full">{po.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MarketingAssetsView() {
  const assets = [
    { type: 'Banner', size: '1200x600', url: 'https://picsum.photos/seed/aff1/1200/600', title: 'Siêu phẩm iPhone 15 Pro' },
    { type: 'Post', size: '1080x1080', url: 'https://picsum.photos/seed/aff2/1080/1080', title: 'Deal Sốc Gia Dụng' },
    { type: 'Story', size: '1080x1920', url: 'https://picsum.photos/seed/aff3/1080/1920', title: 'Phụ kiện Gaming' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold font-headline italic">Tài liệu Marketing</h3>
        <Badge variant="outline" className="rounded-full">Cập nhật: 12/05/2025</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {assets.map((asset, i) => (
          <Card key={i} className="bg-card/50 border-white/5 overflow-hidden group">
            <div className="relative aspect-video md:aspect-square overflow-hidden">
              <Image src={asset.url} alt={asset.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10"><Download className="w-4 h-4" /></Button>
                <Button size="icon" variant="secondary" className="rounded-full h-10 w-10"><Copy className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="p-4 space-y-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary">
                <span>{asset.type}</span>
                <span className="text-muted-foreground">{asset.size}</span>
              </div>
              <h4 className="font-bold text-sm truncate">{asset.title}</h4>
            </div>
          </Card>
        ))}
      </div>
      
      <Card className="bg-primary/5 border border-primary/20 p-8 rounded-3xl space-y-4">
        <h4 className="font-bold flex items-center gap-2"><MessageCircle className="w-5 h-5 text-primary" /> Caption gợi ý</h4>
        <div className="bg-background/50 p-4 rounded-2xl text-sm italic relative">
          "Sắm ngay siêu phẩm công nghệ tại S-Com Hub với mức giá không thể hời hơn! ⚡️ Giảm ngay 30% khi thanh toán qua MoMo. Đừng bỏ lỡ! #SComHub #TechDeal #Sale"
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8" onClick={() => {
            navigator.clipboard.writeText("Caption content...");
            toast({ title: "Đã sao chép caption" });
          }}><Copy className="w-3 h-3" /></Button>
        </div>
      </Card>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-primary/10 hover:text-primary text-muted-foreground'
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, color = "text-primary" }: any) {
  return (
    <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{title}</p>
        <h3 className={`text-xl font-bold mt-1 ${color}`}>{value}</h3>
      </CardContent>
    </Card>
  );
}

function BenefitCard({ icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-3xl bg-card/30 border border-white/5 text-center space-y-3">
      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">{icon}</div>
      <h4 className="font-bold">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="relative z-10 text-center space-y-4">
      <div className="text-6xl font-black text-white/5 italic absolute -top-8 left-1/2 -translate-x-1/2 select-none">{num}</div>
      <h4 className="font-bold text-lg relative">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}

function QRDialog({ url }: { url: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><QrCode className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs text-center p-8">
        <DialogHeader><DialogTitle className="text-center">Mã QR Sản phẩm</DialogTitle></DialogHeader>
        <div className="bg-white p-4 rounded-2xl inline-block mx-auto mt-4 border shadow-inner">
          <div className="h-48 w-48 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
            <QrCode className="w-16 h-16 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 italic">Quét mã để truy cập nhanh link giới thiệu của bạn.</p>
        <Button className="w-full mt-6 rounded-full font-bold" onClick={() => toast({ title: "Đã tải xuống" })}>Tải mã QR (PNG)</Button>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({ url }: { url: string }) {
  const platforms = [
    { name: "Facebook", icon: <Facebook className="text-[#1877F2]" />, color: "hover:bg-[#1877F2]/10" },
    { name: "Zalo", icon: <MessageCircle className="text-[#0068FF]" />, color: "hover:bg-[#0068FF]/10" },
    { name: "Messenger", icon: <MessageCircle className="text-[#00B2FF]" />, color: "hover:bg-[#00B2FF]/10" },
    { name: "Email", icon: <Mail className="text-gray-500" />, color: "hover:bg-gray-100" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Share2 className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Chia sẻ link giới thiệu</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-6">
          {platforms.map((s) => (
            <Button key={s.name} variant="outline" className={`h-14 rounded-2xl flex items-center justify-start gap-3 ${s.color}`}>
              {s.icon} <span className="font-bold">{s.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border border-white/5">
          <Input value={url} readOnly className="border-none bg-transparent shadow-none text-xs font-mono" />
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => {
            navigator.clipboard.writeText(url);
            toast({ title: "Đã copy link" });
          }}><Copy className="w-4 h-4" /></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
