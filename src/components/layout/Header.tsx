
"use client";

import Link from "next/link";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/lib/store-data";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useConfigStore } from "@/store/configStore";

export function Header({ tenant }: { tenant: Tenant }) {
  const cartCount = useCartStore((state) => state.totalItems());
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const { storeName } = useConfigStore();

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-headline gradient-text">
              {storeName || tenant.name}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <Link href="/products" className="hover:text-primary transition-colors">Sản phẩm</Link>
            <Link href="/flash-sale" className="hover:text-primary transition-colors text-accent">Flash Sale</Link>
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
  );
}
