
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Copy,
  CheckCircle2,
  XCircle,
  User,
  Store,
  Filter,
  ExternalLink
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_TENANTS } from "@/lib/store-data";
import { useVendorStore } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminProductsPage() {
  const { vendorProducts, approveProduct, rejectProduct } = useVendorStore();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Kết hợp sản phẩm hệ thống và sản phẩm vendor
    const systemProducts = MOCK_TENANTS[0].products.map(p => ({ ...p, vendorId: 'system', status: 'approved' }));
    setProducts([...systemProducts, ...vendorProducts]);
  }, [vendorProducts]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "pending" && p.status === "pending") ||
                      (activeTab === "vendor" && p.vendorId !== "system");
    return matchesSearch && matchesTab;
  });

  const handleApprove = (id: string) => {
    approveProduct(id);
    toast({ title: "Đã phê duyệt sản phẩm", description: "Sản phẩm hiện đã có thể hiển thị trên Storefront." });
  };

  const handleReject = (id: string) => {
    rejectProduct(id);
    toast({ title: "Đã từ chối sản phẩm", description: "Sản phẩm này sẽ không được hiển thị.", variant: "destructive" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Hệ thống Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý kho hàng hệ thống và kiểm duyệt sản phẩm từ đối tác.</p>
        </div>
        <Button className="rounded-full h-11 px-8 font-bold gap-2">
          <Plus className="w-4 h-4" /> Thêm SP Hệ thống
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start">
           <TabsTrigger value="all" className="rounded-xl px-8 h-full">Tất cả sản phẩm</TabsTrigger>
           <TabsTrigger value="pending" className="rounded-xl px-8 h-full relative">
              Chờ kiểm duyệt
              {vendorProducts.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-2 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {vendorProducts.filter(p => p.status === 'pending').length}
                </span>
              )}
           </TabsTrigger>
           <TabsTrigger value="vendor" className="rounded-xl px-8 h-full">Sản phẩm đối tác (Vendor)</TabsTrigger>
        </TabsList>

        <Card className="border-white/5 bg-card/50 mt-6 rounded-[2rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên sản phẩm, mã SKU..." 
                className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc nâng cao</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-white/5">
                  <tr className="text-left font-medium">
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Người bán</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Phân loại</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Giá bán</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                    <th className="p-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 relative rounded-xl overflow-hidden border border-white/10">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="font-bold text-base">{product.name}</div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          {product.vendorId === 'system' ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 rounded-full"><User className="w-3 h-3" /> Hệ thống</Badge>
                          ) : (
                            <Badge variant="outline" className="border-white/10 gap-1 rounded-full"><Store className="w-3 h-3" /> Vendor #{product.vendorId}</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-6 text-muted-foreground">{product.category}</td>
                      <td className="p-6 font-black">{formatVND(product.price)}</td>
                      <td className="p-6">
                        <Badge variant={product.status === 'approved' ? 'default' : product.status === 'rejected' ? 'destructive' : 'secondary'} className="rounded-full">
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                            <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 py-2">Xử lý sản phẩm</DropdownMenuLabel>
                            
                            {product.status === 'pending' && (
                              <>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white" onClick={() => handleApprove(product.id)}>
                                  <CheckCircle2 className="w-4 h-4" /> Phê duyệt đăng
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleReject(product.id)}>
                                  <XCircle className="w-4 h-4" /> Từ chối đăng
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5 my-2" />
                              </>
                            )}

                            <DropdownMenuItem className="gap-3 rounded-xl p-3" onClick={() => window.open(`/products/${product.slug}`, '_blank')}>
                              <ExternalLink className="w-4 h-4" /> Xem Storefront
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-xl p-3">
                              <Edit className="w-4 h-4" /> Chỉnh sửa chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-xl p-3">
                              <Copy className="w-4 h-4" /> Nhân bản sản phẩm
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5 my-2" />
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive">
                              <Trash className="w-4 h-4" /> Xóa vĩnh viễn
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={6} className="p-20 text-center text-muted-foreground italic font-medium">Không tìm thấy sản phẩm nào khớp với yêu cầu.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
