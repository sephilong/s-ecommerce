
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  Calendar,
  Download,
  Filter,
  MousePointer2,
  PieChart as PieChartIcon,
  Activity,
  ArrowRight,
  TrendingDown,
  Timer
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { formatVND } from "@/lib/currency";
import { useOrderStore } from "@/store/orderStore";

export default function AdminAnalyticsPage() {
  const { events, getFunnelStats } = useAnalyticsStore();
  const { orders } = useOrderStore();
  const funnel = getFunnelStats();

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0);
  const aov = orders.length > 0 ? totalGMV / orders.length : 0;

  const revenueData = [
    { name: 'T2', value: 45000000 },
    { name: 'T3', value: 52000000 },
    { name: 'T4', value: 48000000 },
    { name: 'T5', value: 61000000 },
    { name: 'T6', value: 75000000 },
    { name: 'T7', value: 98000000 },
    { name: 'CN', value: 120000000 },
  ];

  const funnelData = [
    { name: 'Xem sản phẩm', value: funnel.views || 850, fill: '#9757EA' },
    { name: 'Thêm giỏ hàng', value: funnel.carts || 320, fill: '#3B82F6' },
    { name: 'Bắt đầu Checkout', value: funnel.checkouts || 120, fill: '#F59E0B' },
    { name: 'Mua hàng', value: funnel.purchases || 45, fill: '#10B981' },
  ];

  const channelData = [
    { name: 'Organic', value: 65, color: '#10B981' },
    { name: 'Affiliate', value: 25, color: '#9757EA' },
    { name: 'Paid Ads', value: 10, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <BarChart3 className="w-7 h-7" />
            </div>
            BUSINESS INSIGHTS
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Dữ liệu tăng trưởng và hiệu suất phễu chuyển đổi toàn nền tảng.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Calendar className="w-4 h-4" /> 7 ngày qua</Button>
          <Button className="rounded-xl h-11 px-8 font-bold gap-2 shadow-xl shadow-primary/20"><Download className="w-4 h-4" /> Xuất báo cáo</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="GMV Toàn sàn" value={formatVND(totalGMV)} trend="+18.5%" icon={<DollarSign />} />
        <MetricCard title="Giá trị TB đơn (AOV)" value={formatVND(aov)} trend="+5.2%" icon={<Timer />} color="text-blue-500" />
        <MetricCard title="Lượt truy cập" value={events.length} trend="+24%" icon={<MousePointer2 />} color="text-orange-500" />
        <MetricCard title="CR (Conversion Rate)" value={`${((funnel.purchases || 45) / (funnel.views || 850) * 100).toFixed(2)}%`} trend="+0.8%" icon={<Activity />} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Phễu chuyển đổi (Purchase Funnel)</CardTitle>
              <CardDescription>Hành trình khách hàng từ lúc xem đến lúc mua</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full border-primary/30 text-primary">Live</Badge>
          </CardHeader>
          <CardContent className="p-8 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} width={120} />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                   {funnelData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.fill} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5 rounded-[2.5rem] p-8 flex flex-col">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg italic uppercase tracking-tighter">Nguồn doanh thu</CardTitle>
             <CardDescription>Phân tích theo kênh Marketing</CardDescription>
          </CardHeader>
          <div className="flex-1 flex items-center justify-center">
             <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-6">
             {channelData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-3">
                     <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-muted-foreground uppercase">{item.name}</span>
                  </div>
                  <span className="font-black italic text-primary">{item.value}%</span>
               </div>
             ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold font-headline italic mb-6">Sản phẩm bán chạy nhất</h3>
            <div className="space-y-4">
               {[
                 { name: "iPhone 15 Pro Max", qty: 45, rev: "1.125M", trend: "up" },
                 { name: "MacBook Air M3", qty: 32, rev: "890k", trend: "up" },
                 { name: "AirPods Pro 2", qty: 28, rev: "154k", trend: "down" },
               ].map((p, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black italic text-primary">{i+1}</div>
                       <div>
                          <p className="font-bold text-sm">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{p.qty} đơn hàng</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-sm text-primary italic">{p.rev}</p>
                       {p.trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500 ml-auto" /> : <TrendingDown className="w-3 h-3 text-red-500 ml-auto" />}
                    </div>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="bg-[#111] border-white/5 rounded-[2rem] p-8">
            <h3 className="text-xl font-bold font-headline italic mb-6">Hiệu suất Coupon & Voucher</h3>
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Tổng lượt dùng</p>
                     <p className="text-2xl font-black italic mt-1">124</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                     <p className="text-[10px] uppercase font-bold text-muted-foreground">Doanh thu tạo ra</p>
                     <p className="text-2xl font-black italic mt-1 text-primary">85.4M</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <CouponPerformanceItem code="HELLO2025" usage={84} conversion="12.5%" />
                  <CouponPerformanceItem code="FASHION30" usage={40} conversion="8.2%" />
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon, color = "text-primary" }: any) {
  return (
    <Card className="bg-card/40 border-white/5 rounded-3xl p-6 group hover:border-primary/40 transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
      <div className="relative z-10 flex justify-between items-start mb-4">
         <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
            {icon}
         </div>
         <Badge className="bg-green-500/10 text-green-500 border-none font-black italic">{trend}</Badge>
      </div>
      <div className="relative z-10">
         <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{title}</p>
         <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
      </div>
    </Card>
  );
}

function CouponPerformanceItem({ code, usage, conversion }: any) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-white/5 last:border-0">
       <div className="flex items-center gap-3">
          <code className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-xs font-bold">{code}</code>
          <span className="text-[10px] text-muted-foreground">{usage} lần dùng</span>
       </div>
       <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">CR:</span>
          <span className="text-xs font-black italic">{conversion}</span>
       </div>
    </div>
  );
}
