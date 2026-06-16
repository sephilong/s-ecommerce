
"use client";

import { useState, useEffect } from "react";
import { useAffiliateStore, AffiliateLink } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Wallet, 
  Link as LinkIcon, 
  Copy, 
  Plus, 
  QrCode,
  DollarSign,
  MousePointer2,
  CheckCircle2,
  Store,
  Settings,
  Rocket,
  Facebook,
  MessageCircle,
  Mail,
  Share2,
  ChevronRight,
  Send,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AffiliateDashboardPage() {
  const { links, stats, addLink, submitAffiliateRequest, requestPayout } = useAffiliateStore();
  const { profile, requestAffiliate } = useUserStore();
  const [productUrl, setProductUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Reseller state
  const [isReseller, setIsReseller] = useState(profile?.role === 'reseller');
  const [resellerConfig, setResellerConfig] = useState({
    storeName: "My Amazing Shop",
    subdomain: "myshop",
    primaryColor: "#9757EA"
  });

  const handleJoinAffiliate = () => {
    setLoading(true);
    setTimeout(() => {
      submitAffiliateRequest({
        id: `req-${Date.now()}`,
        userId: "current-user-id",
        userName: `${profile?.firstName} ${profile?.lastName}`,
        email: "user@example.com",
        status: "pending",
        createdAt: new Date().toISOString()
      });
      requestAffiliate();
      setLoading(false);
      toast({ title: "Đã gửi yêu cầu", description: "Admin sẽ phê duyệt hồ sơ của bạn trong 24h." });
    }, 1000);
  };

  const handleCreateLink = () => {
    if (!productUrl) return;
    const isInternal = productUrl.includes("/products/");
    const slug = isInternal ? productUrl.split("/products/")[1]?.split("?")[0] : "general";
    
    if (links.some(l => l.productId === slug)) {
      toast({ title: "Thông báo", description: "Bạn đã có link cho sản phẩm này." });
      return;
    }

    const newLink: AffiliateLink = {
      id: `link-${Date.now()}`,
      productId: slug,
      productName: isInternal ? `Sản phẩm: ${slug}` : "Trang chủ",
      code: profile?.affiliateCode || "REF-USER",
      clicks: 0,
      conversions: 0,
      earnings: 0,
    };
    addLink(newLink);
    toast({ title: "Thành công", description: "Đã tạo link giới thiệu mới!" });
    setProductUrl("");
  };

  const handleUpgradeReseller = () => {
    setIsReseller(true);
    toast({ title: "Chúc mừng!", description: "Bạn đã trở thành Reseller. Cửa hàng của bạn đang được khởi tạo." });
  };

  // State: Not registered
  if (profile?.affiliateStatus === 'none') {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-8 text-center">
        <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
          <Rocket className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Kiếm tiền cùng S-Com Hub</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Tham gia mạng lưới tiếp thị liên kết để nhận hoa hồng từ mỗi đơn hàng thành công.
          Đơn giản, hiệu quả và không cần vốn.
        </p>
        <div className="pt-8">
          <Button onClick={handleJoinAffiliate} size="lg" className="rounded-full h-14 px-12 text-lg font-bold">
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Đăng ký Affiliate ngay"}
          </Button>
        </div>
      </div>
    );
  }

  // State: Pending
  if (profile?.affiliateStatus === 'pending') {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mx-auto">
          <Send className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold font-headline">Yêu cầu đang chờ duyệt</h1>
        <p className="text-muted-foreground">Chúng tôi đang kiểm tra hồ sơ của bạn. Vui lòng quay lại sau.</p>
        <Button variant="outline" className="rounded-full" asChild><a href="/">Quay về trang chủ</a></Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Affiliate Dashboard</h1>
          <p className="text-muted-foreground">Chào mừng trở lại, {profile?.lastName}.</p>
        </div>
        <div className="flex gap-2">
          <PayoutDialog balance={stats.balance} onPayout={requestPayout} />
        </div>
      </div>

      <Tabs defaultValue="product" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-2xl h-14 p-1 bg-muted/50">
          <TabsTrigger value="product" className="rounded-xl h-12 gap-2">
            <LinkIcon className="w-4 h-4" /> Product Affiliate
          </TabsTrigger>
          <TabsTrigger value="reseller" className="rounded-xl h-12 gap-2">
            <Store className="w-4 h-4" /> Storefront Reseller
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="space-y-8 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Số dư ví" value={formatVND(stats.balance)} icon={<Wallet />} />
            <StatCard title="Tổng hoa hồng" value={formatVND(stats.totalEarnings)} icon={<DollarSign />} color="text-green-500" />
            <StatCard title="Lượt Click" value={stats.totalClicks.toString()} icon={<MousePointer2 />} />
            <StatCard title="Chuyển đổi" value={stats.totalConversions.toString()} icon={<CheckCircle2 />} />
          </div>

          <Card className="bg-card/50 border-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">Link Builder</CardTitle>
              <CardDescription>Dán link sản phẩm để tạo mã giới thiệu cá nhân.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <Input 
                  placeholder="Dán link sản phẩm (ví dụ: /products/ao-thun...)" 
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  className="rounded-xl h-12"
                />
                <Button onClick={handleCreateLink} className="rounded-xl h-12 px-8 font-bold">Tạo Link</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-xl font-bold font-headline">Link của bạn ({links.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {links.map((link) => (
                <Card key={link.id} className="bg-card/30 border-white/5 hover:border-primary/30 transition-all p-6 relative group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-primary">{link.productName}</h4>
                      <p className="text-xs text-muted-foreground font-mono">?ref={link.code}</p>
                    </div>
                    <div className="flex gap-2">
                      <QRDialog url={`https://demo.scomhub.vn/products/${link.productId}?ref=${link.code}`} />
                      <ShareDialog url={`https://demo.scomhub.vn/products/${link.productId}?ref=${link.code}`} title={link.productName} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground"><span className="text-foreground">{link.clicks}</span> Clicks</div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground"><span className="text-foreground">{link.conversions}</span> Conv</div>
                  </div>
                </Card>
              ))}
            </div>
            {links.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-white/10 italic text-muted-foreground">
                Bạn chưa tạo link giới thiệu nào.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="reseller" className="space-y-8 pt-6">
          {!isReseller ? (
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/20 overflow-hidden relative shadow-2xl">
              <div className="p-10 space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6">
                  <Rocket className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black font-headline italic tracking-tighter">TRỞ THÀNH STOREFRONT RESELLER</h2>
                <div className="space-y-4 text-lg">
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Sở hữu cửa hàng riêng với Subdomain tùy chỉnh</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Tùy biến Logo và màu sắc thương hiệu cá nhân</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Bán toàn bộ kho hàng 10,000+ sản phẩm</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Hoa hồng trực tiếp lên đến 15%</p>
                </div>
                <div className="pt-8">
                  <Button onClick={handleUpgradeReseller} size="lg" className="rounded-full h-16 px-12 text-xl font-black italic shadow-2xl shadow-primary/30 group">
                    MUA GÓI RESELLER - 990k/năm <Plus className="w-6 h-6 ml-2 group-hover:rotate-90 transition-transform" />
                  </Button>
                </div>
              </div>
              <Store className="absolute -bottom-10 -right-10 w-64 h-64 text-primary/5 -rotate-12" />
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-white/5 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" /> Cấu hình cửa hàng</CardTitle>
                    <CardDescription>Cửa hàng: <strong>{resellerConfig.subdomain}.scomhub.vn</strong></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tên cửa hàng</Label>
                        <Input value={resellerConfig.storeName} onChange={(e) => setResellerConfig({...resellerConfig, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Subdomain</Label>
                        <div className="flex items-center gap-2">
                          <Input value={resellerConfig.subdomain} onChange={(e) => setResellerConfig({...resellerConfig, subdomain: e.target.value})} />
                        </div>
                      </div>
                    </div>
                    <Button className="rounded-full px-8 font-bold">Lưu thay đổi</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PayoutDialog({ balance, onPayout }: any) {
  const [amount, setAmount] = useState(balance);
  const [method, setMethod] = useState("bank");

  const handleSubmit = () => {
    if (amount > balance || amount < 50000) {
      toast({ title: "Lỗi", description: "Số tiền không hợp lệ (Tối thiểu 50k)", variant: "destructive" });
      return;
    }
    onPayout({
      id: `po-${Date.now()}`,
      userId: "user-id",
      userName: "Affiliate Name",
      amount,
      method,
      accountInfo: "999988887777 - VCB",
      status: "pending",
      createdAt: new Date().toISOString()
    });
    toast({ title: "Đã gửi yêu cầu", description: "Chúng tôi sẽ xử lý yêu cầu rút tiền của bạn sớm." });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full gap-2 shadow-lg shadow-primary/20"><DollarSign className="w-4 h-4" /> Rút tiền</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Rút hoa hồng về ngân hàng</DialogTitle></DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Số dư khả dụng: <span className="text-primary font-bold">{formatVND(balance)}</span></Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Thông tin tài khoản</Label>
            <Input placeholder="STK - Tên ngân hàng - Chủ TK" />
          </div>
          <Button onClick={handleSubmit} className="w-full h-12 rounded-xl font-bold">Xác nhận rút tiền</Button>
        </div>
      </DialogContent>
    </Dialog>
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
        <div className="bg-white p-4 rounded-2xl inline-block mx-auto mt-4">
          <div className="h-48 w-48 bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
            <QrCode className="w-16 h-16 text-slate-400" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Quét mã để truy cập nhanh link giới thiệu của bạn.</p>
        <Button className="w-full mt-6 rounded-full" onClick={() => toast({ title: "Đã tải xuống" })}>Tải mã QR</Button>
      </DialogContent>
    </Dialog>
  );
}

function ShareDialog({ url, title }: { url: string, title: string }) {
  const shareLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5 text-[#1877F2]" />, color: "hover:bg-[#1877F2]/10" },
    { name: "Zalo", icon: <MessageCircle className="w-5 h-5 text-[#0068FF]" />, color: "hover:bg-[#0068FF]/10" },
    { name: "Email", icon: <Mail className="w-5 h-5 text-gray-500" />, color: "hover:bg-gray-100" },
    { name: "Website", icon: <Share2 className="w-5 h-5 text-primary" />, color: "hover:bg-primary/10" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Share2 className="w-4 h-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Chia sẻ link giới thiệu</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-6">
          {shareLinks.map((s) => (
            <Button key={s.name} variant="outline" className={`h-14 rounded-2xl flex items-center justify-start gap-3 ${s.color}`}>
              {s.icon} <span className="font-bold">{s.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl border">
          <Input value={url} readOnly className="border-none bg-transparent shadow-none text-xs" />
          <Button size="sm" variant="ghost" onClick={() => {
            navigator.clipboard.writeText(url);
            toast({ title: "Đã copy link" });
          }}><Copy className="w-4 h-4" /></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({ title, value, icon, color = "text-primary" }: any) {
  return (
    <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
      </CardContent>
    </Card>
  );
}
