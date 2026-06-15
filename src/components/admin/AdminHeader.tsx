
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-card/30 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:flex relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm hệ thống..." className="pl-8 h-9 bg-background/50" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>
        <div className="h-8 w-px bg-white/10 mx-2"></div>
        <Button variant="ghost" className="gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">AD</div>
          <span className="hidden sm:inline-block text-sm font-medium">Administrator</span>
        </Button>
      </div>
    </header>
  );
}
