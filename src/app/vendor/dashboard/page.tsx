
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export default function VendorDashboard() {
  const { vendors } = useVendorStore();
  const vendor = vendors[0]; // Lấy vendor demo

  const stats = [
    { label: "Doanh thu tháng này", value: formatVND(12500000), icon: <DollarSign />, trend: "+12.5%", color: "text-green-500" },
    { label: "Đơn hàng mới", value: "48", icon: <ShoppingCart />, trend: "+5 đơn", color: "text-blue-500" },
    { label: "Sản phẩm đang bán", value: "156", icon: <Package />, trend: "+2 SP", color: "text-primary" },
    { label: "Đánh giá trung bình", value: "4.8", icon: <TrendingUp />, trend: "95% tích cực", color: "text-orange-500" },
  ];

  const chartData = [
    { name: 'T2', sales: 4500000 },
    { name: 'T3', sales: 5200000 },
    { name: 'T4', sales: 3800000 },
    { name: 'T5', sales: 6500000 },
    { name: 'T6', sales: 4800000 },
    { name: 'T7', sales: 9500000 },
    { name: 'CN', sales: 12000000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#151515] border-white/5 rounded-3xl overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-6 space-y-4">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-black italic tracking-tighter mt-1">{stat.value}</h3>
                  <span className="text-[10px] font-bold text-green-500 mb-1">{stat.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Hiệu suất Doanh thu</CardTitle>
              <p className="text-xs text-muted-foreground">Thống kê 7 ngày gần nhất</p>
            </div>
            <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">Chi tiết &rarr;</button>
          </CardHeader>
          <CardContent className="p-0 h-[400px] w-full pt-8 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-bold text-lg flex items-center gap-2 italic"><Clock className="w-5 h-5 text-primary" /> Việc cần làm</h3>
              <div className="space-y-4">
                <TodoItem count={5} label="Chờ xác nhận" color="bg-orange-500/20 text-orange-500" />
                <TodoItem count={12} label="Chờ lấy hàng" color="bg-blue-500/20 text-blue-500" />
                <TodoItem count={2} label="Sản phẩm bị từ chối" color="bg-red-500/20 text-red-500" />
                <TodoItem count={8} label="Sắp hết hàng" color="bg-yellow-500/20 text-yellow-500" />
              </div>
           </Card>

           <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold">Mẹo tăng trưởng</h4>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Các sản phẩm trong danh mục "Điện tử" đang có lượng truy cập tăng 40% trong tuần này. Hãy bổ sung tồn kho ngay!
                </p>
                <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                  Xem phân tích <ChevronRight className="w-3 h-3" />
                </button>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function TodoItem({ count, label, color }: any) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
      <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">{label}</span>
      <span className={`px-3 py-1 rounded-full font-bold text-xs ${color}`}>{count}</span>
    </div>
  );
}
