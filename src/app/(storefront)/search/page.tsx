
'use client';

import { useEffect, useState, useMemo, Suspense } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader2, PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategorySidebar } from "@/components/category/CategorySidebar";
import { MobileFilterSheet } from "@/components/category/MobileFilterSheet";
import { parseFiltersFromSearchParams } from "@/lib/filter-utils";
import { formatVND } from "@/lib/currency";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-20 text-center animate-pulse">Đang tìm kiếm...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || "";
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const activeFilters = useMemo(() => parseFiltersFromSearchParams(searchParams), [searchParams]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());
      params.set('facets', 'true');
      
      const r = await fetch(`/api/search?${params.toString()}`);
      const data = await r.json();
      setResults(data.data);
      setLoading(false);
    };
    fetchResults();
  }, [searchParams]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 sticky top-24 h-fit">
          {results?.facets && (
            <CategorySidebar facets={results.facets} selectedFilters={activeFilters} />
          )}
        </aside>

        <main className="flex-1">
          <div className="mb-12 space-y-6">
            <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase leading-none">
              {query ? `Kết quả cho: "${query}"` : "Tìm kiếm sản phẩm"}
            </h1>
            <p className="text-sm text-muted-foreground font-medium italic">
              Tìm thấy <span className="text-primary font-bold">{results?.total || 0}</span> sản phẩm phù hợp với yêu cầu của bạn.
            </p>
          </div>

          {loading ? (
            <div className="py-32 text-center space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Đang truy xuất dữ liệu từ máy chủ...</p>
            </div>
          ) : results?.hits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.hits.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-white/5 rounded-[3rem] border border-dashed border-white/10 space-y-8">
              <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                 <PackageSearch className="w-12 h-12 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Rất tiếc, không có kết quả</h2>
                 <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                   Chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa của bạn. Vui lòng thử tìm kiếm với từ khóa khác hoặc bỏ bớt bộ lọc.
                 </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {results?.facets && (
        <MobileFilterSheet activeCount={0}>
           <CategorySidebar facets={results.facets} selectedFilters={activeFilters} />
        </MobileFilterSheet>
      )}
    </div>
  );
}
