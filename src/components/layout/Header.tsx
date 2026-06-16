
"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, Menu, Zap, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/lib/store-data";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useConfigStore } from "@/store/configStore";
import { usePromotionStore } from "@/store/promotionStore";
import { useVendorStore } from "@/store/vendorStore";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Header({ tenant }: { tenant: Tenant }) {
  const cartCount = useCartStore((state) => state.totalItems());
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const { storeName } = useConfigStore();
  const { promotions } = usePromotionStore();
  const { currentVendor } = useVendorStore();
  const pathname = usePathname();

  const [flashSale, setFlashSale] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const activeFlashSale = promotions.find(p => p.type === 'flash_sale' && p.isActive);
    if (activeFlashSale && activeFlashSale.config.endTime) {
      setFlashSale(activeFlashSale);
      const timer = setInterval(() => {
        const end = new Date(activeFlashSale.config.endTime).getTime();
        const now = new Date().getTime();
        const diff = end - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("00:00:00");
          return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [promotions]);

  // Logic: Ưu tiên tên Vendor nếu đang ở trang shop (bất kể URL nào có chứa /shop/)
  const isShopPage = pathname.includes('/shop/');
  const displayName = (isShopPage && currentVendor) ? currentVendor.storeName : (storeName || tenant.name);

  return (
    <div className="flex flex-col w-full sticky top-0 z-50">
      {/* Promo Top Bar */}
      {flashSale && !currentVendor && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 py-1.5 px-4 text-center">
          <Link href="/flash-sale" className="flex items-center justify-center gap-4 text-[11px] md:text-sm font-bold text-white group">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
              FLASH SALE ĐANG DIỄN RA!
            </span>
            <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-lg border border-white/20">
              Kết thúc sau: <span className="font-mono text-yellow-300">{timeLeft}</span>
            </div>
            <span className="hidden md:inline group-hover:underline">Mua ngay thôi! &rarr;</span>
          </Link>
        </div>
      )}

      <header className="w-full glass-panel border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              {(isShopPage && currentVendor) && (
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Store className="w-4 h-4" />
                </div>
              )}
              <span className="text-xl font-bold font-headline gradient-text italic tracking-tighter">
                {displayName}
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
              {(!isShopPage) && <Link href="/flash-sale" className="hover:text-primary transition-colors text-accent">Flash Sale</Link>}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/search">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-bold animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}
