
"use client";

import { useEffect, useState } from "react";
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/lib/store-data";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Filter, SlidersHorizontal, LayoutGrid, List } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tenantName, setTenantName] = useState("");

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["Điện tử", "Phụ kiện", "Gia dụng", "Thời trang"];

  useEffect(() => {
    const fetchData = async () => {
      const tenant = await getTenantConfig("demo");
      setProducts(tenant.products);
      setFilteredProducts(tenant.products);
      setTenantName(tenant.name);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    setFilteredProducts(result);
  }, [selectedCategories, sortBy, products]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (loading) return <div className="container mx-auto p-20 text-center">Đang tải sản phẩm...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Danh mục
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={cat} 
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <Label htmlFor={cat} className="text-sm cursor-pointer">{cat}</Label>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="bg-white/5" />

          <div>
            <h3 className="text-lg font-bold mb-4">Khoảng giá</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">Dưới 1 triệu</Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">1tr - 5tr</Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">Trên 5tr</Button>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold font-headline mb-1">Tất cả sản phẩm</h1>
              <p className="text-sm text-muted-foreground">Hiển thị {filteredProducts.length} sản phẩm</p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] rounded-full bg-card/50">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 opacity-50">
              <p>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
