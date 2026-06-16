
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Store,
  Activity,
  BarChart3,
  Rocket
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
import { formatVND } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/orderStore";
import { useAnalyticsStore } from "@/store/analyticsStore";
import { useVendorStore } from "@/store/vendorStore";
import { useMemo } from "react";

export default function AdminDashboard() {
  const { orders } = useOrderStore();
  const { events } = useAnalyticsStore();
  const { vendors } = useVendorStore();

  // Tính toán dữ liệu thực tế
  const totalGMV = useMemo(() => orders.reduce((acc, o) => acc + o.total, 0), [orders]);
  const totalRevenue = useMemo(() => totalGMV * 0.1, [totalGMV]); // Giả định phí sàn 10%
  const totalVisits = events.filter(e => e.type === 'page_view').length;

  const platformStats = [
    { title: "GMV Toàn sàn", value: formatVND(totalGMV), icon: <Activity className="text-primary" />, trend: "+18%", color: "text-primary" },
    { title: "Revenue (Commission)", value: formatVND(totalRevenue), icon: <DollarSign className="text-green-500" />, trend: "+12.5%", color: "text-green-500" },
    { title: "Tổng Merchant", value: vendors.length.toString(), icon: <Store className="text-blue-500" />, trend: "+5 mới", color: "text-blue-500" },
    { title: "Đơn hàng hệ thống", value: orders.length.toString(), icon: <ShoppingBag className="text-orange-500" />, trend: "+24%", color: "text-orange-500" },
  ];

  const chartData = [
    { name: 'T1', gmv: totalGMV * 0.4 },
    { name: 'T2', gmv: totalGMV * 0.6 },
    { name: 'T3', gmv: totalGMV * 0.5 },
    { name: 'T4', gmv: totalGMV * 0.8 },
    { name: 'T5', gmv: totalGMV },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase leading-none">Platform Control Tower</h1>
          <p className="text-muted-foreground font-medium mt-2">Tổng quan hiệu suất kinh doanh toàn nền tảng S-Com Hub.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="h-10 w-px bg-white/10 hidden md:block" />
           <div className="flex flex-col text-right">
              <span className="text-[10px] font-black uppercase text-muted-foreground">Lượt truy cập (Live)</span>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> {totalVisits} ONLINE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats.map((stat, i) => (
          <Card key={i} className="bg-card/40 border-white/5 rounded-[1.5rem] overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {stat.icon}
                </div>
                <Badge variant="outline" className="rounded-full border-primary/20 text-[10px] text-primary font-black italic">{stat.trend}</Badge>
              </div>
              <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.title}</p>
              <h3 className={`text-2xl font-black italic tracking-tighter mt-1 ${stat.color}`}>{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Tổng giá trị giao dịch (GMV)</CardTitle>
              <CardDescription>Xu hướng tăng trưởng giao dịch toàn sàn</CardDescription>
            </div>
            <div className="flex gap-2">
               <Badge variant="secondary" className="rounded-full px-3 py-1 font-bold">YTD 2025</Badge>
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
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} tickFormatter={(val) => `${(val/1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1033', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="gmv" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorGMV)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="bg-card/40 border-white/5 rounded-[2rem] p-8 space-y-6 shadow-xl">
              <h3 className="font-bold text-lg italic flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-4 uppercase tracking-tighter">
                <Rocket className="w-5 h-5 text-primary" /> Top Merchants
              </h3>
              <div className="space-y-4">
                {vendors.slice(0, 5).map((v, i) => (
                  <MerchantRank key={v.id} rank={i+1} name={v.storeName} sales={`${(v.totalRevenue / 1000000).toFixed(1)}M`} />
                ))}
              </div>
           </Card>

           <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-6">
                <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-primary flex items-center gap-2"><Activity className="w-4 h-4" /> Platform Health</h4>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">API Latency</p>
                      <p className="text-lg font-black italic">24ms</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Throughput</p>
                      <p className="text-lg font-black italic">850/s</p>
                   </div>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-primary w-[88%] rounded-full shadow-[0_0_10px_rgba(151,87,234,0.5)]" />
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
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors group/rank">
       <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary font-black flex items-center justify-center italic text-[10px] group-hover/rank:scale-110 transition-transform">{rank}</div>
          <span className="text-sm font-bold truncate max-w-[120px]">{name}</span>
       </div>
       <span className="text-xs font-black text-primary italic">{sales}</span>
    </div>
  );
}
