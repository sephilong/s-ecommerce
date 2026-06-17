
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, Folder, ArrowRight, Loader2, X } from 'lucide-react';
import { formatVND } from '@/lib/currency';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce'; // Giả định hook này tồn tại hoặc tạo mới
import Image from 'next/image';

export function SearchAutocomplete({ tenantId = 'platform-1' }: { tenantId?: string }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 250);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResult(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    fetch(`/api/search/autocomplete?q=${encodeURIComponent(debouncedQuery)}&tenantId=${tenantId}`)
      .then(r => r.json())
      .then(data => {
        setResult(data.data);
        setIsOpen(true);
      })
      .finally(() => setIsLoading(false));
  }, [debouncedQuery, tenantId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || !result) return;
    const totalItems = (result.categories?.length || 0) + (result.products?.length || 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, totalItems - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex === -1) {
          router.push(`/search?q=${encodeURIComponent(query)}`);
        } else {
          const allItems = [...(result.categories || []), ...(result.products || [])];
          const item = allItems[selectedIndex];
          if (item) {
            router.push(item.slug ? (`/products/${item.slug}`) : `/search?category=${item.name}`);
          }
        }
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  }, [isOpen, result, selectedIndex, query, router]);

  return (
    <div ref={containerRef} className="relative w-full max-w-xl group" role="search">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
        <Input
          type="search"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelectedIndex(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Bạn đang tìm sản phẩm gì?..."
          className="w-full pl-11 pr-12 h-12 rounded-2xl bg-white/5 border-white/10 focus:bg-white/10 focus:ring-primary/20 transition-all text-sm font-medium"
          autoComplete="off"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
          {query && (
            <button onClick={() => setQuery('')} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {isOpen && result && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-[#111] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {/* Categories */}
            {result.categories?.length > 0 && (
              <section className="p-2">
                <div className="px-4 py-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Danh mục phù hợp</div>
                {result.categories.map((cat: any, i: number) => (
                  <button
                    key={cat.id}
                    onClick={() => { router.push(`/search?category=${cat.name}`); setIsOpen(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all ${selectedIndex === i ? 'bg-primary text-white shadow-lg shadow-primary/20 italic' : 'hover:bg-white/5'}`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${selectedIndex === i ? 'bg-white/20' : 'bg-white/5'}`}>
                      <Folder className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">{cat.name}</span>
                    <span className="ml-auto text-[10px] opacity-50">{cat.productCount} sản phẩm</span>
                  </button>
                ))}
              </section>
            )}

            {/* Products */}
            {result.products?.length > 0 && (
              <section className="p-2 border-t border-white/5">
                <div className="px-4 py-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Sản phẩm gợi ý</div>
                {result.products.map((product: any, i: number) => {
                  const idx = (result.categories?.length || 0) + i;
                  return (
                    <button
                      key={product.id}
                      onClick={() => { router.push(`/products/${product.slug}`); setIsOpen(false); }}
                      className={`flex items-center gap-4 w-full px-4 py-3 rounded-2xl transition-all ${selectedIndex === idx ? 'bg-primary text-white shadow-lg shadow-primary/20 italic' : 'hover:bg-white/5'}`}
                    >
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-bold text-sm truncate">{product.name}</div>
                        <div className={`text-xs font-black italic ${selectedIndex === idx ? 'text-white' : 'text-primary'}`}>{formatVND(product.price)}</div>
                      </div>
                      {!product.inStock && (
                        <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-500 px-2 py-0.5 rounded-md">Hết hàng</span>
                      )}
                    </button>
                  );
                })}
              </section>
            )}

            {/* Empty State */}
            {result.products?.length === 0 && result.categories?.length === 0 && (
              <div className="p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-dashed border-white/10">
                  <Search className="w-6 h-6 text-muted-foreground opacity-20" />
                </div>
                <p className="text-sm text-muted-foreground italic">Không tìm thấy kết quả phù hợp cho "{query}"</p>
              </div>
            )}
          </div>

          <button
            onClick={() => { router.push(`/search?q=${encodeURIComponent(query)}`); setIsOpen(false); }}
            className="w-full p-4 bg-primary/5 hover:bg-primary/10 border-t border-white/5 text-xs font-black uppercase tracking-widest italic text-primary flex items-center justify-center gap-2 transition-all"
          >
            Xem tất cả kết quả tìm kiếm <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
