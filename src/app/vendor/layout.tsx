
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
  Star,
  Palette,
  Users,
  Box,
  FileText,
  Warehouse,
  Zap,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useVendorStore } from "@/store/vendorStore";
import { NotificationBell } from "@/components/notification/NotificationBell";
import { cn } from "@/lib/utils";

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useUserStore();
  const { getVendorByUserId } = useVendorStore();

  const vendor = profile ? getVendorByUserId(profile.email) : null;
  const isBuilder = pathname.includes('/builder');

  const menuItems = [
    { group: "Quản trị", items: [
      { name: "Tổng quan", icon: <LayoutDashboard />, href: "/vendor/dashboard" },
      { name: "Sản phẩm", icon: <Package />, href: "/vendor/products" },
      { name: "Kho hàng", icon: <Warehouse />, href: "/vendor/inventory" },
      { name: "Đơn hàng", icon: <ShoppingCart />, href: "/vendor/orders" },
    ]},
    { group: "Phát triển Store", items: [
      { name: "Builder (Website)", icon: <Palette />, href: "/vendor/builder" },
      { name: "AI Chatbot", icon: <Bot />, href: "/vendor/chatbot" },
      { name: "Tài chính & Ví", icon: <Wallet />, href: "/vendor/finance" },
      { name: "Khuyến mãi", icon: <Star />, href: "/admin/promotions" }, 
    ]},
    { group: "Hệ thống", items: [
      { name: "CRM (Khách hàng)", icon: <Users />, href: "/vendor/customers" },
      { name: "Cấu hình Shop", icon: <Settings />, href: "/vendor/settings" },
    ]}
  ];

  if (isBuilder) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#070707] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0f0f0f] hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
              <span className="font-black text-xl italic">S</span>
            </div>
            <div>
              <span className="font-black text-lg block leading-none tracking-tighter italic">MERCHANT</span>
              <span className="text-[10px] text-primary uppercase tracking-widest font-black">S-Com Hub</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((group, i) => (
            <div key={i} className="space-y-2">
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] px-4 mb-4">{group.group}</p>
               <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-xs uppercase tracking-wider",
                      pathname === item.href 
                        ? "bg-primary text-white shadow-xl shadow-primary/20 italic" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <span className="w-5 h-5">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
               </div>
            </div>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           <Link href="/account" className="flex items-center gap-3 px-4 py-2 rounded-2xl hover:bg-white/5 transition-colors text-xs font-bold text-muted-foreground">
              <ChevronLeft className="w-4 h-4" />
              Quay lại Tài khoản
           </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b border-white/5 bg-[#0f0f0f]/80 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 z-50">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-black font-headline italic tracking-tighter">
                {vendor?.storeName || 'Merchant Admin'} ⚡️
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <Button variant="outline" size="sm" className="rounded-full bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all gap-2 h-11 px-6 font-bold shadow-lg shadow-primary/10" asChild>
                <Link href="/vendor/products?add=true">
                  <Plus className="w-4 h-4" /> 
                  <span className="hidden sm:inline italic">ĐĂNG SẢN PHẨM</span>
                </Link>
             </Button>

             <div className="h-10 w-px bg-white/5 mx-2 hidden sm:block" />

             {profile && <NotificationBell userId={profile.email} />}
             
             <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary to-accent p-0.5 shadow-lg">
                <div className="h-full w-full rounded-[0.9rem] bg-[#0f0f0f] flex items-center justify-center font-black text-sm italic">
                  {vendor?.storeName.substring(0, 1).toUpperCase() || 'M'}
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#1a1033_0%,_transparent_40%)]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
