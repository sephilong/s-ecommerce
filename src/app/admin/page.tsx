
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Store,
  Activity,
  UserPlus,
  BarChart3
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
  Bar
} from 'recharts';
import { formatVND } from "@/lib/currency";

export default function AdminDashboard() {
  const platformStats = [
    { title: "GMV Toàn sàn", value: "2.450.000.000₫", icon: <Activity className="text-primary" />, trend: "+18%", color: "text-primary" },
    { title: "Doanh thu (Hoa hồng)", value: "245.000.000₫", icon: <DollarSign className="text-green-500" />, trend: "+12.5%", color: "text-green-500" },
    { title: "Tổng Merchant", value: "156", icon: <Store className="text-blue-500" />, trend: "+5 mới", color: "text-blue-500" },
    { title: "Đơn hàng hệ thống", value: "1,240", icon: <ShoppingBag className="text-orange-500" />, trend: "+24% so với tháng trước", color: "text-orange-500" },
  ];

  const chartData = [
    { name: 'T1', gmv: 1200000000, revenue: 12000000 },
    { name: 'T2', gmv: 1500000000, revenue: 15000000 },
    { name: 'T3', gmv: 1100000000, revenue: 11000000 },
    { name: 'T4', gmv: 1800000000, revenue: 18000000 },
    { name: 'T5', gmv: 2450000000, revenue: 24500000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">Platform Control Tower</h1>
        <p className="text-muted-foreground">Tổng quan hiệu suất kinh doanh toàn nền tảng S-Com Hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {stat.icon}
                </div>
                <Badge variant="outline" className="rounded-full border-primary/20 text-[10px] text-primary">{stat.trend}</Badge>
              </div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.title}</p>
              <h3 className={`text-2xl font-black italic tracking-tighter mt-1 ${stat.color}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Tổng giá trị giao dịch (GMV)</CardTitle>
              <CardDescription>Xu hướng tăng trưởng 5 tháng gần nhất</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[400px] w-full pt-8 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGMV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${val/1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="gmv" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorGMV)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="bg-card/40 border-white/5 rounded-[2rem] p-8 space-y-6">
              <h3 className="font-bold text-lg italic flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-4">Top Merchant Performance</h3>
              <div className="space-y-4">
                <MerchantRank rank={1} name="Tech World" sales="450M" />
                <MerchantRank rank={2} name="Fashion Hub" sales="320M" />
                <MerchantRank rank={3} name="Home Gadget" sales="210M" />
                <MerchantRank rank={4} name="Organic Food" sales="180M" />
              </div>
           </Card>

           <Card className="bg-primary/10 border border-primary/20 rounded-[2rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Platform Health</h4>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span>Server Uptime</span>
                      <span className="text-green-500">99.9%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full"><div className="h-full bg-green-500 w-[99.9%] rounded-full" /></div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span>Transaction Rate</span>
                      <span>85 req/s</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full"><div className="h-full bg-primary w-[65%] rounded-full" /></div>
                </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function MerchantRank({ rank, name, sales }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
       <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/20 text-primary font-black flex items-center justify-center italic text-xs">{rank}</div>
          <span className="text-sm font-bold">{name}</span>
       </div>
       <span className="text-xs font-black text-primary italic">{sales}</span>
    </div>
  );
}

function Badge({ children, className, variant }: any) {
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${className}`}>{children}</span>;
}
