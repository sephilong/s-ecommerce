
"use client";

import { useCompareStore } from "@/store/compareStore";
import { Button } from "@/components/ui/button";
import { X, ArrowRightLeft, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CompareBar() {
  const { items, removeItem, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-4xl">
      <div className="bg-card/90 backdrop-blur-xl border border-primary/30 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between gap-6 animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden md:flex flex-col gap-1 pr-4 border-r border-white/10">
            <span className="text-xs font-black text-primary uppercase italic tracking-widest">SO SÁNH</span>
            <span className="text-[10px] text-muted-foreground font-bold">{items.length}/4 sản phẩm</span>
          </div>
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-1">
            {items.map((item) => (
              <div key={item.id} className="relative group shrink-0">
                <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <Image src={item.image} alt={item.name} width={56} height={56} className="object-cover" />
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {items.length < 4 && (
               <div className="h-14 w-14 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-muted-foreground bg-white/5">
                  <span className="text-xl">+</span>
               </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-full text-xs font-bold hover:bg-white/5" onClick={clearCompare}>
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Xóa hết
          </Button>
          <Button asChild size="lg" className="rounded-full px-8 font-black italic shadow-xl shadow-primary/20">
            <Link href="/compare">SO SÁNH NGAY <ArrowRightLeft className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
