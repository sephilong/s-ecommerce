
"use client";

import { useState, useEffect } from "react";
import { useAffiliateStore, AffiliateLink } from "@/store/affiliateStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Link as LinkIcon, 
  Copy, 
  Plus, 
  QrCode,
  DollarSign,
  MousePointer2,
  CheckCircle2
} from "lucide-react";
import { getTenantConfig } from "@/lib/tenant";

export default function AffiliateDashboardPage() {
  const { links, stats, addLink, conversions } = useAffiliateStore();
  const { profile } = useUserStore();
  const [productUrl, setProductUrl] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");

  useEffect(() => {
    // Generate a default affiliate code if not exists
    if (profile && !affiliateCode) {
      setAffiliateCode(`REF-${profile.lastName?.toUpperCase() || 'USER'}-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [profile]);

  const handleCreateLink = () => {
    if (!productUrl) return;
    
    // Simple logic to extract product info from URL if it's internal
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Đã sao chép", description: "Link giới thiệu đã được lưu vào bộ nhớ tạm." });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Chương trình Affiliate</h1>
          <p className="text-muted-foreground">Kiếm tiền bằng cách chia sẻ sản phẩm yêu thích.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Mã định danh:</span>
          <code className="font-bold text-primary">{affiliateCode || "Đang tạo..."}</code>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Số dư hiện tại" value={formatVND(stats.balance)} icon={<Wallet />} trend="+15% tháng này" />
        <StatCard title="Tổng hoa hồng" value={formatVND(stats.totalEarnings)} icon={<DollarSign />} color="text-green-500" />
        <StatCard title="Lượt Click" value={stats.totalClicks.toString()} icon={<MousePointer2 />} />
        <StatCard title="Chuyển đổi" value={stats.totalConversions.toString()} icon={<CheckCircle2 />} />
      </div>

      {/* Link Generator */}
      <Card className="bg-card/50 border-white/5 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-primary" /> Tạo Link giới thiệu
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input 
              placeholder="Dán link sản phẩm tại đây (ví dụ: /products/ao-thun...)" 
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              className="rounded-xl h-12 bg-background/50"
            />
            <Button onClick={handleCreateLink} className="rounded-xl h-12 px-8 font-bold gap-2">
              <Plus className="w-4 h-4" /> Tạo Link
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            * Hệ thống sẽ tự động gắn mã <strong>?ref={affiliateCode}</strong> vào link của bạn.
          </p>
        </CardContent>
      </Card>

      {/* Active Links */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-headline">Link của bạn</h2>
        <div className="grid grid-cols-1 gap-4">
          {links.length > 0 ? links.map((link) => (
            <Card key={link.id} className="bg-card/30 border-white/5 hover:border-primary/30 transition-all overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-bold text-primary">{link.productName}</h4>
                    <div className="text-xs text-muted-foreground font-mono bg-background/50 p-2 rounded-lg border border-white/5 flex items-center justify-between">
                      <span className="truncate">{`https://scomhub.vn/products/${link.productId}?ref=${link.code}`}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(`https://scomhub.vn/products/${link.productId}?ref=${link.code}`)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-8 shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Clicks</p>
                      <p className="text-xl font-bold">{link.clicks}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Hoa hồng</p>
                      <p className="text-xl font-bold text-green-500">{formatVND(link.earnings)}</p>
                    </div>
                    <div className="flex items-center">
                      <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                        <QrCode className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl opacity-50 italic">
              Bạn chưa tạo link giới thiệu nào.
            </div>
          )}
        </div>
      </div>

      {/* Recent Conversions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-headline">Lịch sử hoa hồng</h2>
        <Card className="bg-card/20 border-white/5 overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr>
                  <th className="p-4">Ngày</th>
                  <th className="p-4">Đơn hàng</th>
                  <th className="p-4">Giá trị đơn</th>
                  <th className="p-4">Hoa hồng</th>
                  <th className="p-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((conv) => (
                  <tr key={conv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-xs text-muted-foreground">{new Date(conv.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-4 font-bold">{conv.orderId}</td>
                    <td className="p-4">{formatVND(conv.amount)}</td>
                    <td className="p-4 font-bold text-primary">{formatVND(conv.commission)}</td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        conv.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                        conv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {conv.status === 'approved' ? 'Thành công' : conv.status === 'pending' ? 'Chờ duyệt' : 'Đã hủy'}
                      </span>
                    </td>
                  </tr>
                ))}
                {conversions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground opacity-50">Chưa có dữ liệu chuyển đổi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
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
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </Card>
  );
}
