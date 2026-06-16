
"use client";

import { Bell, Package, CheckCircle2, AlertCircle, TrendingUp, Info, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificationStore, Notification } from "@/store/notificationStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function NotificationBell({ userId, className }: { userId: string, className?: string }) {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const myNotifs = notifications.filter(n => n.userId === userId);
  const unreadCount = myNotifs.filter(n => n.status === 'unread').length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <Package className="text-blue-500" />;
      case 'payout': return <TrendingUp className="text-green-500" />;
      case 'alert': return <AlertCircle className="text-orange-500" />;
      case 'marketing': return <Info className="text-purple-500" />;
      default: return <CheckCircle2 className="text-primary" />;
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("relative rounded-full h-10 w-10", className)}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 md:w-[400px] p-0 border-white/10 bg-[#0f0f0f] rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <DropdownMenuLabel className="font-headline italic text-lg p-0">Thông báo</DropdownMenuLabel>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-7 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary" onClick={() => markAllAsRead(userId)}>Đánh dấu đọc hết</Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => clearNotifications(userId)}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          {myNotifs.length > 0 ? (
            <div className="divide-y divide-white/5">
              {myNotifs.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer group",
                    n.status === 'unread' ? 'bg-primary/5' : ''
                  )}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <p className={cn("text-sm leading-tight", n.status === 'unread' ? 'font-bold' : 'font-medium text-muted-foreground')}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap italic">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                    {n.link && (
                      <Link href={n.link} className="text-[10px] text-primary font-bold uppercase tracking-widest mt-2 block hover:underline">Xem chi tiết &rarr;</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-dashed border-white/10">
                <Bell className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <p className="text-xs text-muted-foreground italic">Bạn hiện không có thông báo nào.</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t border-white/5 text-center">
          <Button asChild variant="link" className="text-xs font-bold text-muted-foreground hover:text-primary">
            <Link href="/account/notifications">Xem tất cả lịch sử</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
