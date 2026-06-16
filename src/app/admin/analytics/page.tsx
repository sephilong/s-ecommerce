
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
  Activity
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

export default function AdminAnalyticsPage() {
  const revenueData = [
    { name: 'Jan', value: 45000000 },
    { name: 'Feb', value: 52000000 },
    { name: 'Mar', value: 48000000 },
    { name: 'Apr', value: 61000000 },
    { name: 'May', value: 75000000 },
    { name: 'Jun', value: 68000000 },
  ];

  const categoryData = [
    { name: 'Điện tử', value: 45, color: '#9757EA' },
    { name: 'Thời trang', value: 30, color: '#3B82F6' },
    { name: 'Gia dụng', value: 15, color: '#10B981' },
    { name: 'Phụ kiện', value: 10, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <BarChart3 className="w-7 h-7" />
            </div>
            INSIGHTS & ANALYTICS
          </h1>
          <p className="text-muted-foreground font-medium pl-16">
            Dữ liệu tăng trưởng và hiệu suất toàn nền tảng.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Calendar className="w-4 h-4" /> 30 ngày qua</Button>
          <Button className="rounded-xl h-11 px-8 font-bold gap-2 shadow-xl shadow-primary/20"><Download className="w-4 h-4" /> Xuất báo cáo</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="GMV Toàn sàn" value="2.450.000.000₫" trend="+12.5%" icon={<DollarSign />} />
        <MetricCard title="Tổng Đơn hàng" value="8,120" trend="+8.2%" icon={<ShoppingBag />} color="text-blue-500" />
        <MetricCard title="Lượt truy cập" value="125.4k" trend="+24%" icon={<MousePointer2 />} color="text-orange-500" />
        <MetricCard title="Tỉ lệ Chuyển đổi" value="3.85%" trend="+0.4%" icon={<Activity />} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/40 border-white/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Biểu đồ Doanh thu Nền tảng</CardTitle>
              <CardDescription>Theo dõi dòng tiền hàng tháng (Gross Revenue)</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full border-primary/30 text-primary">Live Data</Badge>
          </CardHeader>
          <CardContent className="p-0 h-[400px] w-full pt-8 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRev)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/40 border-white/5 rounded-[2.5rem] p-8 flex flex-col">
          <CardHeader className="px-0 pt-0">
             <CardTitle className="text-lg italic flex items-center gap-2 underline decoration-primary decoration-4 underline-offset-4">Top Category Share</CardTitle>
          </CardHeader>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
             {categoryData.map((item, i) => (
               <div key={i} className="flex justify-between items-center text-xs font-bold">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                     <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span>{item.value}%</span>
               </div>
             ))}
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
