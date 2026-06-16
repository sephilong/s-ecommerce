
"use client";

import { useVendorStore } from "@/store/vendorStore";
import { useInventoryStore } from "@/store/inventoryStore";
import { formatVND } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MousePointer2,
  Star,
  Activity,
  Warehouse
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function MerchantDashboard() {
  const { vendors, vendorOrders } = useVendorStore();
  const { getLowStockItems, stockLevels } = useInventoryStore();
  const vendor = vendors[0];
  
  const lowStockCount = getLowStockItems().length;
  const totalInventory = stockLevels.reduce((acc, curr) => acc + curr.quantity, 0);

  const stats = [
    { label: "Doanh thu (Tháng)", value: formatVND(125000000), icon: <DollarSign />, trend: "+15.2%", color: "text-green-500" },
    { label: "Đơn hàng mới", value: vendorOrders.length.toString(), icon: <ShoppingCart />, trend: "+8", color: "text-blue-500" },
    { label: "Tổng tồn kho", value: totalInventory.toString(), icon: <Package />, trend: "Đang ổn định", color: "text-primary" },
    { label: "Lượt ghé thăm", value: "1,450", icon: <MousePointer2 />, trend: "+245", color: "text-orange-500" },
  ];

  const chartData = [
    { name: '01/05', sales: 4500000 },
    { name: '05/05', sales: 7200000 },
    { name: '10/05', sales: 5800000 },
    { name: '15/05', sales: 9800000 },
    { name: '20/05', sales: 12500000 },
    { name: '25/05', sales: 8500000 },
    { name: '30/05', sales: 15000000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase leading-none">Cửa hàng của bạn</h1>
           <p className="text-muted-foreground text-sm">Quản trị và phát triển thương hiệu cùng S-Com Hub.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase text-muted-foreground">Gói hiện tại</p>
              <Badge className="bg-yellow-500 text-black font-black italic rounded-full px-4">PRO MERCHANT</Badge>
           </div>
           <Button asChild className="rounded-full px-8 shadow-xl shadow-primary/20 font-bold">
              <Link href="/vendor/builder">Cấu hình Storefront</Link>
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-[#111] border-white/5 rounded-3xl group hover:border-primary/30 transition-all overflow-hidden relative">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/5 transition-colors" />
            <CardContent className="p-6 space-y-4">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
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
        <Card className="lg:col-span-2 bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-8 border-b border-white/5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline italic">Hiệu suất Doanh thu</CardTitle>
              <CardDescription>Dữ liệu bán hàng 30 ngày gần nhất</CardDescription>
            </div>
            <div className="flex gap-2">
               <Badge variant="outline" className="rounded-full border-white/10 text-white/50 text-[10px]">Hôm nay</Badge>
               <Badge className="rounded-full text-[10px]">Tháng này</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[350px] w-full pt-8 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} dy={10} />
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
           <Card className="bg-[#111] border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                 <h3 className="font-bold text-base flex items-center gap-2 italic uppercase tracking-tighter"><Activity className="w-4 h-4 text-primary" /> Cần xử lý</h3>
                 <Badge className="bg-red-500/20 text-red-500 border-none text-[10px]">9+</Badge>
              </div>
              <div className="space-y-4">
                <TodoItem count={5} label="Chờ xác nhận đơn" icon={<Clock className="w-3.5 h-3.5" />} color="text-orange-500" />
                <TodoItem count={12} label="Chờ lấy hàng" icon={<Package className="w-3.5 h-3.5" />} color="text-blue-500" />
                <Link href="/vendor/inventory">
                   <TodoItem count={lowStockCount} label="Sắp hết hàng (Kho)" icon={<Warehouse className="w-3.5 h-3.5" />} color="text-red-500" />
                </Link>
                <TodoItem count={2} label="Yêu cầu hoàn tiền" icon={<DollarSign className="w-3.5 h-3.5" />} color="text-yellow-500" />
              </div>
           </Card>

           <Card className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-4">
                 <h4 className="font-bold text-sm italic uppercase flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Top Sản phẩm</h4>
                 <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                       <span className="text-muted-foreground truncate max-w-[140px]">iPhone 15 Pro Max</span>
                       <span className="font-black italic">84 đơn</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-muted-foreground truncate max-w-[140px]">AirPods Pro Gen 2</span>
                       <span className="font-black italic">62 đơn</span>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function TodoItem({ count, label, color, icon }: any) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
         <div className={`h-8 w-8 rounded-lg bg-black/40 flex items-center justify-center ${color}`}>{icon}</div>
         <span className="text-xs font-bold text-muted-foreground group-hover:text-white transition-colors">{label}</span>
      </div>
      <span className={`px-2 py-0.5 rounded-md font-black text-[10px] bg-white/10 ${color}`}>{count}</span>
    </div>
  );
}
