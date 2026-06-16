
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wallet, 
  Settings, 
  BarChart3, 
  MessageSquare,
  Store,
  ChevronLeft,
  Bell,
  Plus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useVendorStore } from "@/store/vendorStore";
import { cn } from "@/lib/utils";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useUserStore();
  const { getVendorByUserId } = useVendorStore();

  const vendor = profile ? getVendorByUserId(profile.email) : null;

  const menuItems = [
    { name: "Tổng quan", icon: <LayoutDashboard />, href: "/vendor/dashboard" },
    { name: "Sản phẩm", icon: <Package />, href: "/vendor/products" },
    { name: "Đơn hàng", icon: <ShoppingCart />, href: "/vendor/orders" },
    { name: "Tài chính", icon: <Wallet />, href: "/vendor/finance" },
    { name: "Đánh giá", icon: <Star />, href: "/vendor/reviews" },
    { name: "Phân tích", icon: <BarChart3 />, href: "/vendor/analytics" },
    { name: "Cài đặt Shop", icon: <Settings />, href: "/vendor/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0f0f0f] hidden lg:flex flex-col">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="font-black text-xl italic">S</span>
            </div>
            <div>
              <span className="font-bold text-lg block leading-none">VENDORS</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Kênh Người Bán</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-medium text-sm",
                pathname === item.href 
                  ? "bg-primary text-white shadow-xl shadow-primary/10" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="w-5 h-5">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <Link href="/account" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Quay lại Tài khoản</span>
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#0f0f0f]/50 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="lg:hidden h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">S</div>
             <h2 className="text-xl font-bold font-headline hidden md:block">
                {vendor?.storeName || 'Nhà bán hàng'} 👋
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all gap-2 h-11 px-6 font-bold shadow-lg shadow-primary/10" asChild>
                <Link href="/vendor/products?add=true">
                  <Plus className="w-4 h-4" /> 
                  <span className="hidden sm:inline">Đăng sản phẩm mới</span>
                </Link>
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full bg-white/5 h-10 w-10 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
             </Button>
             <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {vendor?.storeName.substring(0, 2).toUpperCase() || 'VB'}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
