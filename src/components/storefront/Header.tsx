import Link from "next/link";
import { ShoppingCart, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tenant } from "@/lib/store-data";

export function Header({ tenant }: { tenant: Tenant }) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-headline gradient-text">
              {tenant.name}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#" className="hover:text-primary transition-colors">Trang chủ</Link>
            <Link href="#" className="hover:text-primary transition-colors">Sản phẩm</Link>
            <Link href="#" className="hover:text-primary transition-colors">Khuyến mãi</Link>
            <Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-bold">
              0
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
