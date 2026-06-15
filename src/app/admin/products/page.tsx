
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MOCK_TENANTS } from "@/lib/store-data";
import { formatVND } from "@/lib/currency";
import Image from "next/image";

export default function AdminProductsPage() {
  const products = MOCK_TENANTS[0].products;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground">Quản lý kho hàng và thông tin sản phẩm của bạn.</p>
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
              <Input placeholder="Tìm mã SP, tên sản phẩm..." className="pl-8 h-9" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Lọc
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-white/5">
                <tr className="text-left font-medium">
                  <th className="p-4 w-16">Hình</th>
                  <th className="p-4">Tên sản phẩm</th>
                  <th className="p-4">Phân loại</th>
                  <th className="p-4">Giá bán</th>
                  <th className="p-4">Tồn kho</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="h-10 w-10 relative rounded-lg overflow-hidden border border-white/10">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4 font-bold">{formatVND(product.price)}</td>
                    <td className="p-4">24</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.inStock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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
