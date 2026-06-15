
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Search, MoreHorizontal, Eye, ExternalLink, Trash2, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_TENANTS } from "@/lib/store-data";
import Image from "next/image";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState(MOCK_TENANTS[0].banners);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Banner</h1>
          <p className="text-muted-foreground">Cấu hình các slide quảng cáo và sản phẩm nổi bật trên trang chủ.</p>
        </div>
        <Button className="gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Thêm Banner mới
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="border-white/5 bg-card/50 overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              <div className="relative w-full md:w-80 h-48 md:h-auto shrink-0 overflow-hidden">
                <Image 
                  src={banner.imageUrl} 
                  alt={banner.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={banner.type === 'product' ? 'default' : 'secondary'} className="rounded-full">
                      {banner.type === 'product' ? 'Sản phẩm' : 'Khuyến mãi'}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${banner.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs text-muted-foreground">{banner.isActive ? 'Đang hoạt động' : 'Tạm ẩn'}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{banner.subtitle}</p>
                  
                  <div className="flex items-center gap-2 text-xs font-mono bg-muted/50 p-2 rounded border border-white/5">
                    <ExternalLink className="w-3 h-3 text-primary" />
                    <span className="truncate">{banner.link}</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Xóa
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10">
          <p className="text-muted-foreground">Chưa có banner nào được thiết lập.</p>
        </div>
      )}
    </div>
  );
}
