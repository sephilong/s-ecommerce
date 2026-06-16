
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
  Palette
} from "lucide-react";

export default function AffiliateDashboardPage() {
  const { links, stats, addLink, conversions } = useAffiliateStore();
  const { profile } = useUserStore();
  const [productUrl, setProductUrl] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  
  // Reseller state
  const [isReseller, setIsReseller] = useState(false);
  const [resellerConfig, setResellerConfig] = useState({
    storeName: "My Amazing Shop",
    subdomain: "myshop",
    primaryColor: "#9757EA"
  });

  useEffect(() => {
    if (profile && !affiliateCode) {
      setAffiliateCode(`REF-${profile.lastName?.toUpperCase() || 'USER'}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [profile]);

  const handleCreateLink = () => {
    if (!productUrl) return;
    const isInternal = productUrl.includes("/products/");
    const slug = isInternal ? productUrl.split("/products/")[1]?.split("?")[0] : "general";
    const newLink: AffiliateLink = {
      id: `link-${Date.now()}`,
      productId: slug,
      productName: isInternal ? `Sản phẩm: ${slug}` : "Trang chủ / Danh mục",
      code: affiliateCode,
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Kiếm tiền cùng S-Com Hub</h1>
          <p className="text-muted-foreground">Chọn hình thức tiếp thị phù hợp với bạn.</p>
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
            <StatCard title="Số dư" value={formatVND(stats.balance)} icon={<Wallet />} />
            <StatCard title="Hoa hồng" value={formatVND(stats.totalEarnings)} icon={<DollarSign />} color="text-green-500" />
            <StatCard title="Click" value={stats.totalClicks.toString()} icon={<MousePointer2 />} />
            <StatCard title="Chuyển đổi" value={stats.totalConversions.toString()} icon={<CheckCircle2 />} />
          </div>

          <Card className="bg-card/50 border-white/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">Tạo Link giới thiệu</CardTitle>
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

          {/* List of links... */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold font-headline">Link của bạn</h2>
            {links.map((link) => (
              <Card key={link.id} className="bg-card/30 border-white/5 p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-primary">{link.productName}</h4>
                    <p className="text-xs text-muted-foreground">?ref={link.code}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(`https://demo.scomhub.vn/products/${link.productId}?ref=${link.code}`)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reseller" className="space-y-8 pt-6">
          {!isReseller ? (
            <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/20 overflow-hidden relative">
              <div className="p-10 space-y-6 relative z-10">
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white mb-6">
                  <Rocket className="w-8 h-8" />
                </div>
                <h2 className="text-4xl font-black font-headline italic tracking-tighter">TRỞ THÀNH STOREFRONT RESELLER</h2>
                <div className="space-y-4 text-lg">
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Sở hữu cửa hàng riêng với Subdomain tùy chỉnh</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Tùy biến Logo và màu sắc thương hiệu cá nhân</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Bán toàn bộ kho hàng 10,000+ sản phẩm của S-Com Hub</p>
                  <p className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> Hoa hồng trực tiếp lên đến 15% trên mỗi đơn hàng</p>
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
                    <CardDescription>Cửa hàng của bạn đang hoạt động tại: <strong>{resellerConfig.subdomain}.scomhub.vn</strong></CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Tên cửa hàng</Label>
                        <Input value={resellerConfig.storeName} onChange={(e) => setResellerConfig({...resellerConfig, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Subdomain (duy nhất)</Label>
                        <div className="flex items-center gap-2">
                          <Input value={resellerConfig.subdomain} onChange={(e) => setResellerConfig({...resellerConfig, subdomain: e.target.value})} />
                          <span className="text-sm text-muted-foreground">.scomhub.vn</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Màu sắc chủ đạo (Brand Color)</Label>
                      <div className="flex items-center gap-4">
                        <Input type="color" value={resellerConfig.primaryColor} onChange={(e) => setResellerConfig({...resellerConfig, primaryColor: e.target.value})} className="h-12 w-24 p-1 cursor-pointer" />
                        <span className="text-sm font-mono">{resellerConfig.primaryColor}</span>
                      </div>
                    </div>
                    <Button className="rounded-full px-8 font-bold">Lưu thay đổi</Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StatCard title="Doanh số Shop" value="12.400.000₫" icon={<TrendingUp />} />
                  <StatCard title="Hoa hồng nhận" value="1.860.000₫" icon={<DollarSign />} color="text-green-500" />
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-white/5 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold">Xem trước Storefront</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-primary border-4 border-primary shadow-xl">
                      <Store className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">{resellerConfig.storeName}</h4>
                      <p className="text-xs text-muted-foreground">Hiệu lực: 365 ngày còn lại</p>
                    </div>
                    <Button variant="outline" className="rounded-full w-full gap-2">
                      Truy cập Store <Rocket className="w-4 h-4" />
                    </Button>
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

function StatCard({ title, value, icon, trend, color = "text-primary" }: any) {
  return (
    <Card className="bg-card/50 border-white/5 relative overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          {trend && <span className="text-[10px] text-green-500 font-bold">{trend}</span>}
        </div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
      </CardContent>
    </Card>
  );
}

function TrendingUp() {
  return <DollarSign className="w-5 h-5" />;
}
