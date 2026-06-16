
"use client";

import { useVendorStore, Vendor } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Filter
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
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Label } from "@/components/ui/label";

export default function AdminVendorsPage() {
  const { vendors, updateVendorStatus, updateVendorCommission } = useVendorStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCommission, setEditingCommission] = useState<{ id: string, rate: number } | null>(null);

  const filteredVendors = vendors.filter(v => 
    v.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.idNumber.includes(searchTerm)
  );

  const handleAction = (id: string, status: Vendor['status']) => {
    updateVendorStatus(id, status);
    toast({ title: "Cập nhật thành công", description: `Nhà bán hàng hiện đã chuyển sang trạng thái ${status}` });
  };

  const handleSaveCommission = () => {
    if (editingCommission) {
      updateVendorCommission(editingCommission.id, editingCommission.rate);
      setEditingCommission(null);
      toast({ title: "Đã cập nhật chiết khấu" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Store className="w-7 h-7" />
            </div>
            QUẢN TRỊ NHÀ BÁN HÀNG
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Phê duyệt, quản lý hoa hồng và theo dõi hiệu suất của các Vendor.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Tổng Nhà bán hàng" value={vendors.length} icon={<Store />} color="text-primary" />
        <StatCard title="Đang chờ duyệt" value={vendors.filter(v => v.status === 'pending').length} icon={<Clock />} color="text-orange-500" />
        <StatCard title="Đã phê duyệt" value={vendors.filter(v => v.status === 'approved').length} icon={<UserCheck />} color="text-green-500" />
        <StatCard title="Doanh thu Marketplace" value={formatVND(120000000)} icon={<Wallet />} color="text-blue-500" />
      </div>

      <Card className="border-white/5 bg-card/50 rounded-[2rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm tên shop, MST hoặc chủ sở hữu..." 
              className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="rounded-xl h-11 gap-2 border-white/10">
            <Filter className="w-4 h-4" /> Lọc danh sách
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-white/5">
                <tr className="text-left">
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Cửa hàng / Loại hình</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Pháp lý / MST</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Hoa hồng</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Tài chính</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                  <th className="p-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                          {v.businessType === 'company' ? <Building2 className="w-6 h-6 text-primary" /> : <Store className="w-6 h-6 text-primary" />}
                        </div>
                        <div>
                          <div className="font-black text-base">{v.storeName}</div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{v.businessType === 'company' ? 'Công ty' : 'Cá nhân'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="font-mono text-xs">{v.idNumber}</div>
                      <div className="text-[10px] text-muted-foreground">{v.accountName}</div>
                    </td>
                    <td className="p-6">
                      <button 
                        onClick={() => setEditingCommission({ id: v.id, rate: v.commissionRate })}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20 h-7 px-3">
                          {v.commissionRate}%
                        </Badge>
                        <Percent className="w-3 h-3 opacity-40" />
                      </button>
                    </td>
                    <td className="p-6">
                      <div className="font-bold">{formatVND(v.totalRevenue)}</div>
                      <div className="text-[10px] text-green-500">Ví: {formatVND(v.balance)}</div>
                    </td>
                    <td className="p-6">
                      <Badge variant={v.status === 'approved' ? 'default' : v.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                        {v.status === 'approved' ? 'Hoạt động' : v.status === 'pending' ? 'Chờ duyệt' : 'Đang khóa'}
                      </Badge>
                    </td>
                    <td className="p-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                          <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 py-2">Xử lý tài khoản</DropdownMenuLabel>
                          {v.status === 'pending' && (
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white" onClick={() => handleAction(v.id, 'approved')}>
                              <CheckCircle2 className="w-4 h-4" /> Phê duyệt shop
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="gap-3 rounded-xl p-3" onClick={() => window.open(`/shop/${v.storeSlug}`)}>
                            <ExternalLink className="w-4 h-4" /> Xem cửa hàng
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 rounded-xl p-3">
                            <ShieldCheck className="w-4 h-4" /> Kiểm tra pháp lý
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5 my-2" />
                          <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleAction(v.id, 'suspended')}>
                            <Ban className="w-4 h-4" /> Tạm đình chỉ
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

      {/* Commission Dialog */}
      <Dialog open={!!editingCommission} onOpenChange={(open) => !open && setEditingCommission(null)}>
        <DialogContent className="max-w-xs rounded-[2rem] p-8">
          <DialogHeader>
            <DialogTitle>Tỷ lệ chiết khấu</DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
             <div className="space-y-2">
                <Label>Mức hoa hồng nền tảng (%)</Label>
                <div className="relative">
                  <Input 
                    type="number" 
                    value={editingCommission?.rate} 
                    onChange={(e) => setEditingCommission(prev => prev ? { ...prev, rate: parseInt(e.target.value) } : null)}
                    className="h-12 rounded-xl pr-10"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground italic">Mức thu phí trên mỗi đơn hàng thành công của shop.</p>
             </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveCommission} className="w-full rounded-full h-12 font-bold shadow-xl shadow-primary/20">Cập nhật thiết lập</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="bg-card/40 border-white/5 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group">
      <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{title}</p>
        <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
      </div>
    </Card>
  );
}
