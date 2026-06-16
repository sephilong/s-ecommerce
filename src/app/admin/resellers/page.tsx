
"use client";

import { MOCK_TENANTS } from "@/lib/store-data";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Ban
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

export default function AdminResellersPage() {
  const resellers = MOCK_TENANTS.filter(t => t.type === 'reseller');

  const handleAction = (action: string, shopName: string) => {
    toast({
      title: "Hành động Reseller",
      description: `Đã thực hiện: ${action} cho cửa hàng ${shopName}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Quản lý Reseller Storefront</h1>
          <p className="text-muted-foreground">Theo dõi và phê duyệt các cửa hàng đại lý trong hệ thống.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tổng số Reseller</p>
              <p className="text-xl font-bold">{resellers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Doanh thu Storefront</p>
              <p className="text-xl font-bold">256.000.000₫</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Yêu cầu nâng cấp mới</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Tìm tên shop hoặc chủ sở hữu..." className="pl-8 h-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4">Cửa hàng</th>
                  <th className="p-4">Subdomain</th>
                  <th className="p-4">Chủ sở hữu</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Ngày tạo</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {resellers.map((shop) => (
                  <tr key={shop.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                          <Store className="w-4 h-4" />
                        </div>
                        <span className="font-bold">{shop.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-primary hover:underline cursor-pointer">
                        {shop.subdomain}.scomhub.vn <ExternalLink className="w-3 h-3" />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">User ID: {shop.ownerId}</p>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-full">
                        Hoạt động
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">12/05/2025</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Quản lý Storefront</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction("Xem shop", shop.name)}>
                            <ExternalLink className="w-4 h-4" /> Xem cửa hàng thực tế
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction("Kiểm tra bảo mật", shop.name)}>
                            <ShieldCheck className="w-4 h-4" /> Kiểm tra bảo mật
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleAction("Khóa shop", shop.name)}>
                            <Ban className="w-4 h-4" /> Khóa vĩnh viễn cửa hàng
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
