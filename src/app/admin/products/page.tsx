
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  ArrowUpDown, 
  Edit, 
  Trash, 
  Copy,
  EyeOff,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_TENANTS, Product } from "@/lib/store-data";
import { formatVND } from "@/lib/currency";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    setProducts(MOCK_TENANTS[0].products);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAction = (action: string, productName: string) => {
    toast({
      title: "Thông báo",
      description: `Đã thực hiện thao tác: ${action} trên sản phẩm ${productName}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý 20+ sản phẩm trong kho hàng của bạn.</p>
        </div>
        <Button className="gap-2 rounded-full">
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </Button>
      </div>

      <Card className="border-white/5 bg-card/50">
        <CardHeader className="p-4 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên sản phẩm..." 
                className="pl-8 h-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px] h-9">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="Điện tử">Điện tử</SelectItem>
                  <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                  <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                  <SelectItem value="Thời trang">Thời trang</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-2 h-9">
                <ArrowUpDown className="w-4 h-4" /> Sắp xếp
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto max-h-[600px]">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5 sticky top-0 z-10">
                <tr className="text-left font-medium">
                  <th className="p-4 w-16">Hình</th>
                  <th className="p-4">Tên sản phẩm</th>
                  <th className="p-4">Phân loại</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-10 relative rounded-lg overflow-hidden border border-white/10">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4 font-bold">{formatVND(product.price)}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Quản lý sản phẩm</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction("Chỉnh sửa", product.name)}>
                            <Edit className="w-4 h-4" /> Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction("Sao chép", product.name)}>
                            <Copy className="w-4 h-4" /> Nhân bản
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2" onClick={() => handleAction("Ẩn", product.name)}>
                            <EyeOff className="w-4 h-4" /> Tạm ẩn sản phẩm
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleAction("Xóa", product.name)}>
                            <Trash className="w-4 h-4" /> Xóa sản phẩm
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
