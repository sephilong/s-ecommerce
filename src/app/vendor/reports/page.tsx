
"use client";

import { useState, useMemo } from "react";
import { useOrderStore } from "@/store/orderStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  ArrowUpRight, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShoppingBag,
  History,
  CheckCircle2,
  Clock,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Cell 
} from "recharts";
import { toast } from "@/hooks/use-toast";

export default function VendorReportsPage() {
  const { orders } = useOrderStore();
  const [period, setPeriod] = useState("30");

  const vendorOrders = useMemo(() => orders, [orders]); // Filter by vendor in real app
  
  const totalRevenue = vendorOrders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = vendorOrders.length;
  const successfulOrders = vendorOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length;

  const chartData = [
    { name: 'Điện tử', value: 45000000, fill: '#9757EA' },
    { name: 'Thời trang', value: 25000000, fill: '#3B82F6' },
    { name: 'Gia dụng', value: 15000000, fill: '#10B981' },
    { name: 'Phụ kiện', value: 10000000, fill: '#F59E0B' },
  ];

  const handleExport = (format: string) => {
    toast({
      title: `Đang kết xuất báo cáo ${format}`,
      description: "Dữ liệu đang được chuẩn bị và sẽ tải xuống trong giây lát.",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Báo cáo & Kết xuất</h1>
          <p className="text-muted-foreground">Phân tích chuyên sâu hiệu suất bán hàng của gian hàng.</p>
        </div>
        <div className="flex gap-2">
           <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="rounded-xl h-11 border-white/10 w-40 bg-[#111]">
                 <Calendar className="w-4 h-4 mr-2" />
                 <SelectValue />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="7">7 ngày qua</SelectItem>
                 <SelectItem value="30">30 ngày qua</SelectItem>
                 <SelectItem value="90">Quý này</SelectItem>
              </SelectContent>
           </Select>
           <Button className="rounded-xl h-11 px-6 font-bold shadow-xl shadow-primary/20 gap-2">
              <Download className="w-4 h-4" /> Xuất Excel
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <ReportMiniStat label="Doanh thu ròng" value={formatVND(totalRevenue)} icon={<TrendingUp />} trend="+12%" />
         <ReportMiniStat label="Đơn hàng thành công" value={successfulOrders} icon={<CheckCircle2 />} color="text-green-500" />
         <ReportMiniStat label="Giá trị TB đơn" value={formatVND(totalOrders > 0 ? totalRevenue / totalOrders : 0)} icon={<BarChart3 />} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="lg:col-span-2 bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 border-b border-white/5 flex justify-between items-center">
               <div>
                  <CardTitle className="text-xl font-headline italic">Cơ cấu ngành hàng</CardTitle>
                  <CardDescription>Doanh thu phân bổ theo danh mục sản phẩm</CardDescription>
               </div>
               <PieChart className="w-6 h-6 text-primary opacity-20" />
            </CardHeader>
            <CardContent className="p-8 h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 10}} tickFormatter={(v) => `${v/1000000}M`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8">
               <h3 className="text-lg font-bold italic mb-6 uppercase tracking-tighter flex items-center gap-2">
                 <FileText className="w-5 h-5 text-primary" /> Kết xuất nhanh
               </h3>
               <div className="space-y-3">
                  <ExportActionItem label="Báo cáo Doanh thu (.xlsx)" onClick={() => handleExport("Excel")} />
                  <ExportActionItem label="Danh sách Khách hàng (.csv)" onClick={() => handleExport("CSV")} />
                  <ExportActionItem label="Báo cáo Tồn kho (.pdf)" onClick={() => handleExport("PDF")} />
                  <ExportActionItem label="Đối soát hoa hồng (.xlsx)" onClick={() => handleExport("Excel")} />
               </div>
            </Card>

            <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8">
               <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">Hiệu quả Marketing</p>
                  <div className="flex justify-between items-end">
                     <h4 className="text-3xl font-black italic">15.2%</h4>
                     <Badge className="bg-green-500/10 text-green-500 border-none font-black italic">ROAS: 4.5x</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Tỉ lệ doanh thu đến từ các chiến dịch khuyến mãi và mã giảm giá của shop.</p>
               </div>
            </Card>
         </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-black font-headline italic flex items-center gap-3">
          <History className="w-6 h-6 text-primary" /> Lịch sử Kết xuất dữ liệu
        </h3>
        <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
           <CardContent className="p-0">
              <table className="w-full text-sm">
                 <thead className="bg-muted/20 border-b border-white/5">
                    <tr className="text-left font-black">
                       <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Thời gian</th>
                       <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Tên báo cáo</th>
                       <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Định dạng</th>
                       <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                       <th className="p-6 text-right"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <tr>
                       <td className="p-6 text-xs text-muted-foreground">12/05/2025 14:30</td>
                       <td className="p-6 font-bold">Báo cáo doanh thu tháng 05/2025</td>
                       <td className="p-6"><Badge variant="outline" className="rounded-full">EXCEL</Badge></td>
                       <td className="p-6"><Badge className="bg-green-500/10 text-green-500 border-none rounded-full px-3 py-0.5 text-[9px] uppercase font-black italic">Hoàn thành</Badge></td>
                       <td className="p-6 text-right">
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-white/5"><Printer className="w-4 h-4" /></Button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ReportMiniStat({ label, value, icon, trend, color = "text-primary" }: any) {
  return (
    <Card className="bg-[#111] border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all group overflow-hidden relative">
       <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/5 transition-colors" />
       <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <div className="flex justify-between items-end">
          <div>
             <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
             <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
          </div>
          {trend && <span className="text-[10px] font-bold text-green-500 mb-1">{trend}</span>}
       </div>
    </Card>
  );
}

function ExportActionItem({ label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group"
    >
       <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition-colors">{label}</span>
       <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
}
