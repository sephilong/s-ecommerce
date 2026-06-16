
"use client";

import { useCompareStore } from "@/store/compareStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { X, ArrowLeft, Star, ShoppingCart, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/hooks/use-toast";

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = (product: any) => {
    addItem(product);
    toast({ title: "Đã thêm vào giỏ", description: product.name });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-8">
        <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
          <ArrowLeft className="w-10 h-10 text-muted-foreground opacity-20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Danh sách so sánh trống</h1>
          <p className="text-muted-foreground">Hãy thêm ít nhất 2 sản phẩm để bắt đầu so sánh.</p>
        </div>
        <Button asChild className="rounded-full px-8"><Link href="/products">Quay lại mua sắm</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <Link href="/products" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
            <ArrowLeft className="w-3 h-3" /> QUAY LẠI CỬA HÀNG
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">SO SÁNH SẢN PHẨM</h1>
        </div>
        <Button variant="outline" className="rounded-full font-bold border-white/10" onClick={clearCompare}>Xóa tất cả</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-0 border border-white/10 rounded-[2.5rem] overflow-hidden bg-card/30">
        {/* Label Column */}
        <div className="hidden md:block col-span-1 bg-muted/20 border-r border-white/10">
           <div className="h-64 border-b border-white/10" />
           <CompareLabel label="Giá bán" />
           <CompareLabel label="Danh mục" />
           <CompareLabel label="Đánh giá" />
           <CompareLabel label="Tình trạng" />
           <CompareLabel label="Bảo hành" />
           <CompareLabel label="Mô tả" />
        </div>

        {/* Product Columns */}
        {items.map((item) => (
          <div key={item.id} className="col-span-1 border-r border-white/10 last:border-r-0 group relative bg-[#111]/50">
             <button 
              onClick={() => removeItem(item.id)}
              className="absolute top-4 right-4 z-10 p-2 bg-background/50 hover:bg-destructive text-white rounded-full transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
             
             <div className="h-64 p-6 flex flex-col items-center justify-center space-y-4 border-b border-white/10">
                <div className="relative h-32 w-32 rounded-2xl overflow-hidden shadow-2xl">
                   <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <h3 className="text-sm font-bold text-center line-clamp-2 hover:text-primary transition-colors">
                   <Link href={`/products/${item.slug}`}>{item.name}</Link>
                </h3>
                <Button size="sm" className="rounded-full h-8 px-4 font-bold text-[10px]" onClick={() => handleAddToCart(item)}>
                  <ShoppingCart className="w-3 h-3 mr-1.5" /> THÊM GIỎ
                </Button>
             </div>

             <CompareValue value={formatVND(item.price)} highlight />
             <CompareValue value={item.category} />
             <CompareValue value={
               <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.9 (1.2k)
               </div>
             } />
             <CompareValue value={item.inStock ? <span className="text-green-500 flex items-center gap-1"><Check className="w-3 h-3" /> Còn hàng</span> : "Hết hàng"} />
             <CompareValue value="12 Tháng" />
             <div className="p-6 text-xs text-muted-foreground leading-relaxed italic">
                {item.description.substring(0, 100)}...
             </div>
          </div>
        ))}

        {/* Fillers for Grid Consistency */}
        {[...Array(Math.max(0, 4 - items.length))].map((_, i) => (
          <div key={i} className="hidden md:flex col-span-1 border-r border-white/10 last:border-r-0 items-center justify-center p-12 text-center opacity-10">
             <div className="space-y-4">
                <div className="h-20 w-20 rounded-full bg-white/10 mx-auto" />
                <div className="h-2 w-24 bg-white/10 rounded-full mx-auto" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompareLabel({ label }: { label: string }) {
  return (
    <div className="p-6 text-xs font-black uppercase tracking-widest text-muted-foreground border-b border-white/10 h-16 flex items-center">
      {label}
    </div>
  );
}

function CompareValue({ value, highlight }: { value: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`p-6 text-sm border-b border-white/10 h-16 flex items-center ${highlight ? 'font-black text-primary italic text-base' : 'font-medium'}`}>
      {value}
    </div>
  );
}
