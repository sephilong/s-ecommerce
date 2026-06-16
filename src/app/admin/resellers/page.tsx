
"use client";

import { MOCK_TENANTS } from "@/lib/store-data";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Ban,
  Rocket,
  Plus,
  Globe,
  DollarSign,
  Activity,
  ArrowUpRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function AdminResellersPage() {
  const resellers = MOCK_TENANTS.filter(t => t.type === 'reseller');

  const handleAction = (action: string, shopName: string) => {
    toast({
      title: "Hành động Reseller",
      description: `Đã thực hiện: ${action} cho cửa hàng ${shopName}`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Rocket className="w-7 h-7" />
            </div>
            RESELLER HUB
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Quản lý mạng lưới Storefront và các đại lý con.
          </p>
        </div>
        <Button className="rounded-xl h-11 px-8 font-black italic shadow-xl shadow-primary/20 gap-2">
           <Plus className="w-4 h-4" /> TẠO STORE MỚI
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PlatformMiniStat label="Cửa hàng Đại lý" value={resellers.length} icon={<Store />} />
        <PlatformMiniStat label="Doanh thu Storefront" value="256M" icon={<DollarSign />} color="text-green-500" />
        <PlatformMiniStat label="Yêu cầu Nâng cấp" value="3" icon={<Clock />} color="text-orange-500" />
        <PlatformMiniStat label="Uptime Status" value="99.9%" icon={<Activity />} color="text-blue-500" />
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Tìm tên shop, subdomain hoặc chủ sở hữu..." 
              className="pl-12 h-14 rounded-2xl bg-background/50 border-white/10 text-base font-medium" 
            />
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-xl h-12 gap-2 border-white/10 text-muted-foreground"><Globe className="w-4 h-4" /> SSL Status</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Storefront Name</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Domain / URL</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Owner Identity</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Status</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Created At</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {resellers.map((shop) => (
                  <tr key={shop.id} className="hover:bg-white/5 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 group-hover:border-primary/50 transition-colors">
                           <Store className="w-6 h-6 text-primary" />
                        </div>
                        <div className="font-black text-lg italic tracking-tight">{shop.name}</div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 group/link cursor-pointer">
                        <span className="text-primary font-bold">{shop.subdomain}.scomhub.vn</span>
                        <ExternalLink className="w-3.5 h-3.5 text-primary opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="p-6">
                      <p className="text-xs font-bold text-muted-foreground">USER-ID: <span className="text-foreground">{shop.ownerId?.substring(0, 12)}...</span></p>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-green-500/10 text-green-500 border-none rounded-full px-3 py-0.5 text-[9px] font-black uppercase italic">
                        Hoạt động
                      </Badge>
                    </td>
                    <td className="p-6 text-muted-foreground text-xs font-medium italic">12/05/2025</td>
                    <td className="p-6 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 hover:bg-white/10">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] p-2 bg-[#0f0f0f] border-white/5 shadow-2xl">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Store Management</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer group" asChild>
                            <Link href={`/shop/${shop.subdomain}`} target="_blank" className="flex items-center">
                              <ArrowUpRight className="w-4 h-4 text-muted-foreground group-focus:text-white" /> Truy cập Storefront
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-white/5 cursor-pointer" onSelect={() => handleAction("Check DNS", shop.name)}>
                            <Globe className="w-4 h-4 text-muted-foreground" /> Kiểm tra DNS & SSL
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5 my-2" />
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-white/5 cursor-pointer" onSelect={() => handleAction("Audit", shop.name)}>
                            <ShieldCheck className="w-4 h-4 text-muted-foreground" /> Kiểm tra bảo mật
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onSelect={() => handleAction("Suspended", shop.name)}>
                            <Ban className="w-4 h-4" /> Khóa vĩnh viễn shop
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

function PlatformMiniStat({ label, value, icon, color = "text-primary" }: any) {
  return (
    <div className="bg-card/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/30 transition-all group">
       <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <div>
          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
          <h3 className="text-xl font-black italic tracking-tighter mt-0.5">{value}</h3>
       </div>
    </div>
  );
}
