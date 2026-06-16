
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  ArrowUpRight, 
  History, 
  DollarSign, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Download
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VendorFinancePage() {
  const { vendors } = useVendorStore();
  const vendor = vendors[0]; // Demo
  const [withdrawAmount, setWithdrawAmount] = useState(vendor?.balance || 0);

  const handleRequestPayout = () => {
    if (withdrawAmount < 200000) {
      toast({ variant: "destructive", title: "Lỗi", description: "Số tiền tối thiểu để rút là 200,000₫" });
      return;
    }
    toast({ title: "Đã gửi yêu cầu", description: "Tiền sẽ được chuyển về ngân hàng trong vòng 24-48h." });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Tài chính & Thanh toán</h1>
          <p className="text-muted-foreground">Theo dõi dòng tiền, doanh thu và quản lý ví của bạn.</p>
        </div>
        <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Download className="w-4 h-4" /> Tải đối soát tháng</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-primary text-white shadow-2xl shadow-primary/30 rounded-[2.5rem] p-10 relative overflow-hidden flex flex-col justify-between h-80 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Wallet className="w-8 h-8" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 italic">Số dư khả dụng</p>
            <h2 className="text-5xl font-black tracking-tighter italic leading-none">{formatVND(vendor?.balance || 0)}</h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="relative z-10 w-full h-14 rounded-2xl font-bold text-lg group/btn">
                Rút tiền ngay <ArrowUpRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle className="text-2xl font-headline italic">YÊU CẦU RÚT TIỀN</DialogTitle></DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label>Số tiền muốn rút (VNĐ)</Label>
                  <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(parseInt(e.target.value))} className="h-12 rounded-xl text-xl font-bold text-primary" />
                  <p className="text-[10px] text-muted-foreground italic">Phí giao dịch: Miễn phí nền tảng</p>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                   <p className="text-[10px] uppercase font-bold text-muted-foreground">Chuyển về tài khoản</p>
                   <div className="font-bold text-sm">{vendor?.bankName}</div>
                   <div className="font-mono text-xs opacity-60">{vendor?.accountNumber} - {vendor?.accountName}</div>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30" onClick={handleRequestPayout}>Xác nhận yêu cầu</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
           <FinanceCard label="Doanh thu trọn đời" value={formatVND(vendor?.totalRevenue || 0)} icon={<TrendingUp />} trend="+15% tháng này" />
           <FinanceCard label="Đơn hàng đang xử lý" value="12 đơn" icon={<Calendar />} color="text-orange-500" />
           <FinanceCard label="Phí nền tảng đã trả" value={formatVND(5000000)} icon={<DollarSign />} color="text-red-400" />
           <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-6 items-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Đối soát T+7</h4>
                <p className="text-[10px] text-muted-foreground leading-relaxed">Tiền hoa hồng sẽ tự động chảy vào ví sau 7 ngày kể từ khi khách nhận hàng thành công.</p>
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black font-headline italic flex items-center gap-3">
          <History className="w-6 h-6 text-primary" /> Lịch sử Giao dịch
        </h3>
        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead className="bg-muted/20 border-b border-white/5">
                      <tr className="text-left">
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Ngày</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Loại giao dịch</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Mô tả</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground text-right">Số tiền</th>
                        <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      <tr>
                         <td className="p-6 text-xs text-muted-foreground">12/05/2025</td>
                         <td className="p-6"><Badge variant="outline" className="rounded-full bg-green-500/5 text-green-500 border-green-500/20">Cộng doanh thu</Badge></td>
                         <td className="p-6 font-medium">Hoàn thành đơn hàng #SCHUB-9982</td>
                         <td className="p-6 font-black text-right text-green-400">+1,250,000₫</td>
                         <td className="p-6"><Badge className="rounded-full">Thành công</Badge></td>
                      </tr>
                      <tr>
                         <td className="p-6 text-xs text-muted-foreground">10/05/2025</td>
                         <td className="p-6"><Badge variant="outline" className="rounded-full bg-red-500/5 text-red-500 border-red-500/20">Rút tiền</Badge></td>
                         <td className="p-6 font-medium">Yêu cầu rút về Vietcombank</td>
                         <td className="p-6 font-black text-right text-red-400">-4,000,000₫</td>
                         <td className="p-6"><Badge variant="secondary" className="rounded-full">Chờ duyệt</Badge></td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FinanceCard({ label, value, icon, trend, color }: any) {
  return (
    <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-primary/30 transition-all group">
       <div className="flex justify-between items-start">
          <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${color || 'text-primary'}`}>
            {icon}
          </div>
          {trend && <Badge className="bg-green-500/10 text-green-500 border-none text-[10px]">{trend}</Badge>}
       </div>
       <div>
         <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
         <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
       </div>
    </Card>
  );
}
