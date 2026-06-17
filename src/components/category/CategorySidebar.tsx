
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition, useMemo } from 'react';
import { SearchFacets, ActiveFilters } from '@/lib/filter-utils';
import { X, Check, Star } from 'lucide-react';
import { CategoryTree } from './CategoryTree';
import { PriceRangeFilter } from './PriceRangeFilter';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  facets: SearchFacets;
  selectedFilters: ActiveFilters;
}

export function CategorySidebar({ facets, selectedFilters }: CategorySidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [priceRange, setPriceRange] = useState([
    selectedFilters.priceMin ?? facets.priceRange.min,
    selectedFilters.priceMax ?? facets.priceRange.max,
  ]);

  const updateFilter = useCallback((key: string, value: string | string[] | null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');

    if (value === null) {
      params.delete(key);
    } else if (Array.isArray(value)) {
      params.delete(key);
      value.forEach(v => params.append(key, v));
    } else {
      params.set(key, value);
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [router, pathname, searchParams]);

  const toggleArrayFilter = (key: string, value: string, current: string[]) => {
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    updateFilter(key, next.length > 0 ? next : null);
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedFilters.brandIds.length) count += selectedFilters.brandIds.length;
    if (selectedFilters.categoryIds.length) count += selectedFilters.categoryIds.length;
    if (selectedFilters.priceMin || selectedFilters.priceMax) count += 1;
    if (selectedFilters.rating) count += 1;
    if (selectedFilters.inStock) count += 1;
    if (selectedFilters.onSale) count += 1;
    Object.values(selectedFilters.attributes).forEach(vals => count += vals.length);
    return count;
  }, [selectedFilters]);

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6" aria-label="Bộ lọc sản phẩm">
      <div className="flex items-center justify-between">
        <h2 className="font-black italic text-lg uppercase tracking-tighter">Bộ lọc</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Xóa tất cả ({activeFilterCount})
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "brands"]} className="w-full">
        {/* Danh mục */}
        <AccordionItem value="categories" className="border-white/5">
          <AccordionTrigger className="hover:no-underline py-4">
             <span className="text-[10px] font-black uppercase tracking-widest">Danh mục</span>
          </AccordionTrigger>
          <AccordionContent>
            <CategoryTree
              categories={facets.categories}
              selectedIds={selectedFilters.categoryIds}
              onToggle={(id) => toggleArrayFilter('category', id, selectedFilters.categoryIds)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Thương hiệu */}
        <AccordionItem value="brands" className="border-white/5">
           <AccordionTrigger className="hover:no-underline py-4">
             <span className="text-[10px] font-black uppercase tracking-widest">Thương hiệu</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {facets.brands.map(brand => (
              <label key={brand.value} className="flex items-center gap-3 cursor-pointer group">
                <Checkbox 
                  checked={selectedFilters.brandIds.includes(brand.value)}
                  onCheckedChange={() => toggleArrayFilter('brand', brand.value, selectedFilters.brandIds)}
                  className="rounded border-white/10"
                />
                <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{brand.label}</span>
                <span className="text-[10px] text-muted-foreground/50 ml-auto">({brand.count})</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Mức giá */}
        <AccordionItem value="price" className="border-white/5">
          <AccordionTrigger className="hover:no-underline py-4">
             <span className="text-[10px] font-black uppercase tracking-widest">Mức giá</span>
          </AccordionTrigger>
          <AccordionContent>
            <PriceRangeFilter
              min={facets.priceRange.min}
              max={facets.priceRange.max}
              value={priceRange}
              histogram={facets.priceHistogram}
              onChange={setPriceRange}
              onCommit={() => {
                updateFilter('priceMin', String(priceRange[0]));
                updateFilter('priceMax', String(priceRange[1]));
              }}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Đánh giá */}
        <AccordionItem value="ratings" className="border-white/5">
          <AccordionTrigger className="hover:no-underline py-4">
             <span className="text-[10px] font-black uppercase tracking-widest">Đánh giá</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-1">
            {[4, 3, 2].map(stars => (
              <button
                key={stars}
                onClick={() => updateFilter('rating', selectedFilters.rating === stars ? null : String(stars))}
                className={cn(
                  "flex items-center gap-2 w-full px-2 py-2 rounded-xl transition-all text-sm",
                  selectedFilters.rating === stars ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-muted-foreground'
                )}
              >
                <div className="flex gap-0.5">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className={cn("w-3 h-3", i < stars ? "fill-yellow-500 text-yellow-500" : "text-white/10")} />
                   ))}
                </div>
                <span>trở lên</span>
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Tình trạng */}
        <AccordionItem value="status" className="border-white/5">
          <AccordionTrigger className="hover:no-underline py-4">
             <span className="text-[10px] font-black uppercase tracking-widest">Tình trạng</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={selectedFilters.inStock}
                onCheckedChange={(v) => updateFilter('inStock', v ? 'true' : null)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-white">Còn hàng</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox 
                checked={selectedFilters.onSale}
                onCheckedChange={(v) => updateFilter('onSale', v ? 'true' : null)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-white">Đang giảm giá</span>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {isPending && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </aside>
  );
}
