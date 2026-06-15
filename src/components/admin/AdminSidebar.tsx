
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
  ChevronRight,
  Store
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, href: "/admin" },
    { name: "Sản phẩm", icon: <Package />, href: "/admin/products" },
    { name: "Đơn hàng", icon: <ShoppingCart />, href: "/admin/orders" },
    { name: "Khách hàng", icon: <Users />, href: "/admin/customers" },
    { name: "Báo cáo", icon: <BarChart3 />, href: "/admin/analytics" },
    { name: "Cài đặt", icon: <Settings />, href: "/admin/settings" },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5">
      <SidebarHeader className="p-4 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">S</div>
        <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">S-Com Admin</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Quản lý</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <Store />
                  <span>Xem cửa hàng</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
