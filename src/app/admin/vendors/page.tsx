
"use client";

import { useVendorStore, Vendor } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Store, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  ExternalLink,
  ShieldCheck,
  Ban,
  UserCheck,
  Wallet,
  Percent,
  Building2,
  Filter,
  UserCog,
  ChevronRight,
  TrendingUp,
  Settings2,
  Lock,
  ArrowUpRight,
  Activity,
  Plus,
  Download,
  DollarSign
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function AdminMerchantManagement() {
  const { vendors, updateVendorStatus, updateVendorCommission } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || v.idNumber.includes(searchTerm);
      const matchesStatus = activeStatus === 'all' || v.status === activeStatus;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, searchTerm, activeStatus]);

  const handleAction = (id: string, status: Vendor['status']) => {
    updateVendorStatus(id, status);
    toast({ 
      title: "Cập nhật hệ thống", 
      description: `Trạng thái Merchant hiện là: ${status.toUpperCase()}`,
      variant: status === 'rejected' || status === 'suspended' ? 'destructive' : 'default'
    });
  };

  const impersonateMerchant = (merchant: Vendor) => {
    toast({ 
      title: "Impersonating...", 
      description: `Bạn đang đăng nhập với tư cách chủ shop: ${merchant.storeName}`,
      duration: 3000
    });
    // In real app: set token/session then redirect to /vendor/dashboard
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <UserCog className="w-7 h-7" />
            </div>
            MERCHANT CONTROL
          </h1>
          <p className="text-muted-foreground font-medium pl-16 italic">
            Quản trị mạng lưới Nhà bán hàng (Merchants) trên hệ sinh thái S-Com Hub.
          </p>
        </div>
        <div className="flex gap-2 bg-[#111] p-1 rounded-2xl border border-white/5">
           <FilterButton active={activeStatus === 'all'} onClick={() => setActiveStatus('all')} label="Tất cả" />
           <FilterButton active={activeStatus === 'pending'} onClick={() => setActiveStatus('pending')} label="Chờ duyệt" />
           <FilterButton active={activeStatus === 'approved'} onClick={() => setActiveStatus('approved')} label="Đang hoạt động" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <PlatformMiniStat label="Tổng Merchant" value={vendors.length} icon={<Store />} />
        <PlatformMiniStat label="Active (30d)" value={vendors.filter(v => v.status === 'approved').length} icon={<Activity />} color="text-green-500" />
        <PlatformMiniStat label="Yêu cầu mới" value={vendors.filter(v => v.status === 'pending').length} icon={<Clock />} color="text-orange-500" />
        <PlatformMiniStat label="Churn Rate" value="1.2%" icon={<TrendingUp className="rotate-180" />} color="text-red-500" />
      </div>

      <Card className="border-white/5 bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Tìm theo tên shop, email hoặc mã số định danh..." 
              className="pl-12 h-14 rounded-2xl bg-background/50 border-white/10 text-base" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <Button variant="ghost" className="rounded-xl h-12 gap-2 text-muted-foreground font-bold hover:bg-white/5">
                <Download className="w-4 h-4" /> Xuất danh sách
             </Button>
             <div className="h-8 w-px bg-white/10 hidden md:block" />
             <Button className="rounded-xl h-12 gap-2 font-black italic px-8 shadow-xl shadow-primary/20">
                <Plus className="w-4 h-4" /> THÊM MERCHANT
             </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Merchant Profile</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Plan / Billing</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">GMV / Revenue</th>
                  <th className="p-6 text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground">Status</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 group-hover:border-primary/50 transition-colors">
                           {v.storeLogo ? <img src={v.storeLogo} className="h-full w-full object-cover rounded-xl" /> : <Store className="w-7 h-7 text-primary" />}
                        </div>
                        <div>
                          <div className="font-black text-lg italic tracking-tight">{v.storeName}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1 font-bold uppercase tracking-wider">
                            <UserCheck className="w-3 h-3" /> {v.accountName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <Badge className="bg-yellow-500/10 text-yellow-500 border-none rounded-full px-3 py-0.5 text-[9px] font-black">PRO PLAN</Badge>
                        <p className="text-[10px] text-muted-foreground italic">Gia hạn: 12/06/2025</p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1">
                        <p className="font-black text-base italic">{formatVND(v.totalRevenue)}</p>
                        <div className="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                          <DollarSign className="w-3 h-3" /> Comm: {formatVND(v.totalRevenue * (v.commissionRate/100))}
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="p-6 text-right">
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-11 w-11 hover:bg-white/10 border border-transparent hover:border-white/5">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] p-2 bg-[#0f0f0f] border-white/5 shadow-2xl z-50">
                          <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Quản trị Merchant</DropdownMenuLabel>
                          
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer group" onSelect={() => impersonateMerchant(v)}>
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground group-focus:text-white" /> Đăng nhập quản trị shop
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-white/5 cursor-pointer" asChild>
                            <Link href={`/shop/${v.storeSlug}`} target="_blank" className="flex items-center gap-3">
                              <ExternalLink className="w-4 h-4 text-muted-foreground" /> Xem Storefront thực tế
                            </Link>
                          </DropdownMenuItem>
                          
                          <DropdownMenuSeparator className="bg-white/5 my-2" />
                          
                          {v.status === 'pending' ? (
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-green-500 focus:text-white cursor-pointer" onSelect={() => handleAction(v.id, 'approved')}>
                              <CheckCircle2 className="w-4 h-4" /> Phê duyệt hoạt động
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-red-500 focus:text-white cursor-pointer" onSelect={() => handleAction(v.id, 'suspended')}>
                              <Lock className="w-4 h-4" /> Khóa / Đình chỉ shop
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <XCircle className="w-4 h-4" /> Gỡ bỏ Merchant
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

function FilterButton({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-primary text-white shadow-lg italic' : 'text-muted-foreground hover:bg-white/5'}`}
    >
      {label}
    </button>
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

function StatusBadge({ status }: { status: Vendor['status'] }) {
  const configs: any = {
    approved: { label: "Hoạt động", class: "bg-green-500/10 text-green-500 border-none" },
    pending: { label: "Chờ duyệt", class: "bg-orange-500/10 text-orange-500 border-none" },
    suspended: { label: "Đã khóa", class: "bg-red-500/10 text-red-500 border-none" },
    rejected: { label: "Từ chối", class: "bg-gray-500/10 text-gray-500 border-none" },
  };
  const config = configs[status] || configs.pending;
  return <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase font-black italic ${config.class}`}>{config.label}</Badge>;
}
