
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { getTenantConfig } from "@/lib/tenant";
import { ProductCard } from "@/components/product/ProductCard";
import { Product } from "@/lib/store-data";
import { useSearchParams } from "next/navigation";
import { parseFiltersFromSearchParams, generateFacets, SearchFacets, ActiveFilters } from "@/lib/filter-utils";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { MobileFilterSheet } from "@/components/category/MobileFilterSheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SlidersHorizontal, LayoutGrid, List, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-20 text-center font-black italic animate-pulse text-primary uppercase">Đang tải danh mục...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const tenant = await getTenantConfig("demo");
      setProducts(tenant.products);
      setLoading(false);
    };
    fetchData();
  }, []);

  const activeFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);
  const facets = useMemo(() => generateFacets(products), [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (activeFilters.categoryIds.length > 0) {
      result = result.filter(p => activeFilters.categoryIds.includes(p.category));
    }

    // Brand Filter (Mock logic)
    if (activeFilters.brandIds.length > 0) {
       // Trong thực tế sẽ lọc theo brandId trong data product
    }

    // Price Filter
    if (activeFilters.priceMin !== undefined) result = result.filter(p => p.price >= activeFilters.priceMin!);
    if (activeFilters.priceMax !== undefined) result = result.filter(p => p.price <= activeFilters.priceMax!);

    // Rating Filter (Mock)
    if (activeFilters.rating !== undefined) {
      // result = result.filter(p => p.rating >= activeFilters.rating!);
    }

    // Availability
    if (activeFilters.inStock) result = result.filter(p => p.inStock);

    // Sorting
    result.sort((a, b) => {
      if (activeFilters.sort === "price-low") return a.price - b.price;
      if (activeFilters.sort === "price-high") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [products, activeFilters]);

  if (loading) return <div className="container mx-auto p-20 text-center font-black italic animate-pulse text-primary uppercase">Khởi tạo dữ liệu...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit">
          <CategorySidebar facets={facets} selectedFilters={activeFilters} />
        </aside>

        {/* Mobile Filter */}
        <MobileFilterSheet activeCount={0}>
           <CategorySidebar facets={facets} selectedFilters={activeFilters} />
        </MobileFilterSheet>

        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black font-headline italic uppercase tracking-tighter">Sản phẩm</h1>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest italic">Tìm thấy {filteredProducts.length} kết quả phù hợp</p>
            </div>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Select value={activeFilters.sort}>
                <SelectTrigger className="w-full sm:w-[220px] rounded-2xl h-11 bg-white/5 border-white/10 font-bold text-xs italic uppercase">
                  <SlidersHorizontal className="w-4 h-4 mr-2 text-primary" />
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl p-2">
                  <SelectItem value="newest" className="rounded-xl">Mới nhất (Ưu tiên)</SelectItem>
                  <SelectItem value="price-low" className="rounded-xl">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high" className="rounded-xl">Giá: Cao đến Thấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-6">
              <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                 <SearchIcon className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                 <p className="font-black italic uppercase tracking-widest text-lg">Không tìm thấy sản phẩm</p>
                 <p className="text-muted-foreground text-sm italic">Vui lòng thử bỏ bớt bộ lọc để thấy nhiều kết quả hơn.</p>
              </div>
              <Button variant="outline" className="rounded-full px-8 font-bold" onClick={() => window.location.href = pathname}>Xóa bộ lọc</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
