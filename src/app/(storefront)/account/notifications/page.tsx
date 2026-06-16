
"use client";

import { useNotificationStore } from "@/store/notificationStore";
import { useUserStore } from "@/store/userStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Package, Info, Check, Trash2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function UserNotificationsPage() {
  const { profile } = useUserStore();
  const { notifications, markAsRead, clearNotifications } = useNotificationStore();
  
  if (!profile) return null;

  const myNotifs = notifications.filter(n => n.userId === profile.email);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-headline">Thông báo của tôi</h1>
          <p className="text-muted-foreground">Cập nhật tin tức mới nhất về đơn hàng và ưu đãi.</p>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 gap-2" onClick={() => clearNotifications(profile.email)}>
          <Trash2 className="w-4 h-4" /> Xóa tất cả
        </Button>
      </div>

      <div className="space-y-4">
        {myNotifs.length > 0 ? (
          myNotifs.map((n) => (
            <Card 
              key={n.id} 
              className={cn(
                "bg-card/50 border-white/5 overflow-hidden transition-all hover:border-primary/30",
                n.status === 'unread' ? 'ring-1 ring-primary/20' : 'opacity-80'
              )}
            >
              <CardContent className="p-6 flex gap-6">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {n.type === 'order' ? <Package /> : <Zap />}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className={cn("text-lg", n.status === 'unread' ? 'font-bold' : 'font-medium')}>
                      {n.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.message}
                  </p>
                  <div className="pt-4 flex gap-4">
                    {n.link && (
                      <Button asChild size="sm" className="rounded-full h-8 px-6 text-[10px] font-bold">
                        <Link href={n.link}>XEM CHI TIẾT</Link>
                      </Button>
                    )}
                    {n.status === 'unread' && (
                      <Button variant="ghost" size="sm" className="h-8 rounded-full text-[10px] font-bold gap-1" onClick={() => markAsRead(n.id)}>
                        <Check className="w-3 h-3" /> ĐÁNH DẤU ĐÃ ĐỌC
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-32 bg-muted/20 rounded-3xl border border-dashed border-white/10 space-y-4">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto opacity-20" />
            <p className="text-muted-foreground italic">Bạn không có thông báo nào vào lúc này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
