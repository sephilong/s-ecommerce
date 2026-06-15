
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, TrendingUp, Users, Wallet } from "lucide-react";

export default function AffiliatePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Chương trình Affiliate</h1>
        <p className="text-muted-foreground">Chia sẻ sản phẩm và nhận hoa hồng từ mỗi đơn hàng thành công.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hoa hồng tích lũy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">0₫</div>
            <p className="text-xs text-muted-foreground mt-1">Cập nhật mỗi 24h</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lượt giới thiệu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Lượt click vào link</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-white/5">
        <CardHeader>
          <CardTitle>Mã giới thiệu của bạn</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-muted/30 border border-white/5 flex items-center justify-between">
            <code className="text-primary font-bold">SCOM-AFF-123456</code>
            <Button size="sm" variant="outline">Sao chép</Button>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0">1</div>
              <p>Chia sẻ liên kết sản phẩm hoặc mã giới thiệu cho bạn bè.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0">2</div>
              <p>Bạn bè thực hiện mua hàng và thanh toán thành công.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs shrink-0">3</div>
              <p>Nhận ngay hoa hồng 5-10% giá trị đơn hàng vào ví.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
