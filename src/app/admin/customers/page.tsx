
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MoreHorizontal, 
  UserCircle, 
  MessageSquare, 
  Ban,
  History,
  Download,
  Users as UsersIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminCustomersPage() {
  const customers = [
    { id: "1", name: "Nguyễn Văn A", email: "vana@gmail.com", phone: "0901234567", orders: 12, totalSpent: "15.000.000₫", status: "Active", joined: "12/01/2025" },
    { id: "2", name: "Trần Thị B", email: "thib@yahoo.com", phone: "0912345678", orders: 5, totalSpent: "3.200.000₫", status: "Active", joined: "05/02/2025" },
    { id: "3", name: "Lê Văn C", email: "vanc@outlook.com", phone: "0987654321", orders: 1, totalSpent: "500.000₫", status: "Inactive", joined: "20/02/2025" },
  ];

  const handleAction = (action: string, customerName: string) => {
    toast({
      title: "Hệ thống CRM",
      description: `Đã thực hiện: ${action} cho khách hàng ${customerName}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <UsersIcon className="w-7 h-7" />
            </div>
            CRM CENTRAL
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Quản lý tập trung dữ liệu khách hàng toàn hệ thống.
          </p>
        </div>
        <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2">
          <Download className="w-4 h-4" /> Xuất tập khách hàng
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-card/40 border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tổng khách hàng</p>
            <h3 className="text-3xl font-black italic mt-1">1,240</h3>
         </Card>
         <Card className="bg-card/40 border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Khách mới (30d)</p>
            <h3 className="text-3xl font-black italic mt-1 text-primary">+84</h3>
         </Card>
         <Card className="bg-card/40 border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Giá trị TB/Khách</p>
            <h3 className="text-3xl font-black italic mt-1">2.450.000₫</h3>
         </Card>
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Tìm tên, email hoặc SĐT..." className="pl-12 h-12 rounded-xl bg-background/50 border-white/10" />
            </div>
            <div className="flex gap-3">
               <Button variant="outline" className="rounded-xl h-12 gap-2 border-white/10"><Filter className="w-4 h-4" /> Lọc nâng cao</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Khách hàng</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Liên hệ</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mua sắm</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Ngày tham gia</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Status</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 border-2 border-white/5">
                          <AvatarFallback className="bg-primary/20 text-primary font-black italic">{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-base">{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col text-xs space-y-1">
                        <span className="flex items-center gap-1.5 text-muted-foreground"><Mail className="w-3.5 h-3.5" /> {customer.email}</span>
                        <span className="flex items-center gap-1.5 font-medium"><Phone className="w-3.5 h-3.5" /> {customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-6">
                       <div className="space-y-1">
                          <div className="font-black text-primary italic">{customer.totalSpent}</div>
                          <div className="text-[10px] text-muted-foreground uppercase font-bold">{customer.orders} đơn hàng</div>
                       </div>
                    </td>
                    <td className="p-6 text-muted-foreground text-xs font-medium">{customer.joined}</td>
                    <td className="p-6">
                      <Badge variant={customer.status === 'Active' ? 'default' : 'secondary'} className="rounded-full px-3 py-0.5 text-[9px] uppercase font-black italic">
                        {customer.status}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 border-white/5 bg-[#0f0f0f]">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Hành động CRM</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white" onClick={() => handleAction("Xem hồ sơ", customer.name)}>
                            <UserCircle className="w-4 h-4" /> Chi tiết tài khoản
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-white/5" onClick={() => handleAction("Xem lịch sử", customer.name)}>
                            <History className="w-4 h-4" /> Nhật ký mua hàng
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-white/5" onClick={() => handleAction("Gửi thông báo", customer.name)}>
                            <MessageSquare className="w-4 h-4" /> Gửi thông báo đẩy (Push)
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleAction("Khóa tài khoản", customer.name)}>
                            <Ban className="w-4 h-4" /> Đình chỉ vĩnh viễn
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
