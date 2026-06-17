
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3, 
  Image as ImageIcon,
  Store,
  Tag,
  Ticket,
  Star,
  UserCheck,
  Rocket,
  Palette,
  Globe,
  TrendingUp,
  Newspaper,
  Bot,
  Zap,
  Share2,
  SearchCode,
  HardDrive
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuGroups = [
    {
      label: "Cơ sở hạ tầng",
      items: [
        { name: "Dashboard Tổng", icon: <LayoutDashboard />, href: "/admin" },
        { name: "Quản lý Merchants", icon: <Store />, href: "/admin/vendors" },
        { name: "Reseller Storefronts", icon: <Rocket />, href: "/admin/resellers" },
        { name: "Cấu hình Toàn sàn", icon: <Settings />, href: "/admin/settings" },
      ]
    },
    {
      label: "Công nghệ & Marketing",
      items: [
        { name: "AI Chatbot Engine", icon: <Bot />, href: "/admin/chatbot" },
        { name: "Google & SEO", icon: <SearchCode />, href: "/admin/settings?tab=google" },
        { name: "Social Commerce", icon: <Share2 />, href: "/admin/settings?tab=social" },
        { name: "Chiến dịch sàn", icon: <Tag />, href: "/admin/promotions" },
        { name: "Hệ thống Affiliate", icon: <UserCheck />, href: "/admin/affiliate" },
      ]
    },
    {
      label: "Catalog & Content",
      items: [
        { name: "Sản phẩm hệ thống", icon: <Package />, href: "/admin/products" },
        { name: "Banner & Slides", icon: <ImageIcon />, href: "/admin/banners" },
        { name: "Quản lý Blog", icon: <Newspaper />, href: "/admin/blog" },
        { name: "Media & Cloud", icon: <HardDrive />, href: "/admin/media" },
        { name: "Đơn hàng toàn sàn", icon: <ShoppingCart />, href: "/admin/orders" },
      ]
    },
    {
      label: "Dữ liệu & UI",
      items: [
        { name: "CRM (Khách hàng)", icon: <Users />, href: "/admin/customers" },
        { name: "Báo cáo & Phân tích", icon: <TrendingUp />, href: "/admin/analytics" },
        { name: "Theme Marketplace", icon: <Palette />, href: "/admin/themes" },
      ]
    }
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0f0f0f]">
      <SidebarHeader className="p-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black italic shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">S</div>
          <div className="group-data-[collapsible=icon]:hidden">
            <span className="font-black text-lg block leading-none italic tracking-tighter uppercase">PLATFORM</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Control Center</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="p-4 space-y-6">
        {menuGroups.map((group, idx) => (
          <SidebarGroup key={idx}>
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase text-primary/60 tracking-[0.2em] mb-3">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.name}
                    className={cn(
                      "h-11 rounded-xl px-4 transition-all",
                      pathname === item.href 
                        ? "bg-primary/10 text-primary border-r-4 border-primary font-bold italic" 
                        : "text-muted-foreground hover:bg-white/5"
                    )}
                  >
                    <Link href={item.href}>
                      <span className="w-5 h-5">{item.icon}</span>
                      <span className="text-xs uppercase tracking-wider">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-6 border-t border-white/5 space-y-4">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-data-[collapsible=icon]:hidden">
           <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">System Status</span>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           </div>
           <p className="text-[10px] font-bold text-white/80 italic">Nodes: 12 Active</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton asChild className="h-11 rounded-xl px-4 text-muted-foreground hover:bg-white/5">
                <Link href="/">
                   <Globe className="w-5 h-5" />
                   <span className="text-xs uppercase font-bold group-data-[collapsible=icon]:hidden">Go to Storefront</span>
                </Link>
             </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
