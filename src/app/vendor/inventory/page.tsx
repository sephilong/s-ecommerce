
'use client';

import { useState } from 'react';
import { useInventoryStore, Warehouse, InventoryOperation } from '@/store/inventoryStore';
import { useVendorStore } from '@/store/vendorStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Box, 
  Warehouse as WarehouseIcon, 
  ArrowRightLeft, 
  Plus, 
  History, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  Package, 
  Search,
  Settings2,
  FileText,
  MapPin,
  Phone,
  ArrowUpRight,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function InventoryDashboard() {
  const { warehouses, stockLevels, operations, adjustStock, transferStock, getLowStockItems } = useInventoryStore();
  const { vendorProducts } = useVendorStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const lowStockItems = getLowStockItems();

  // Form states Adjustment
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustReason, setAdjustReason] = useState('inventory_count');

  // Form states Transfer
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferProd, setTransferProduct] = useState('');
  const [transferQty, setTransferQty] = useState(0);

  const handleAdjust = () => {
    if (!selectedProduct || !selectedWarehouse) return;
    adjustStock(selectedWarehouse, selectedProduct, adjustQty, adjustReason);
    toast({ title: 'Đã cập nhật tồn kho', description: 'Biến động đã được ghi lại trong nhật ký.' });
    setSelectedProduct('');
  };

  const handleTransfer = () => {
    if (!transferFrom || !transferTo || !transferProd || transferQty <= 0) {
      toast({ variant: "destructive", title: "Thiếu thông tin", description: "Vui lòng nhập đầy đủ các trường điều chuyển." });
      return;
    }
    if (transferFrom === transferTo) {
      toast({ variant: "destructive", title: "Lỗi", description: "Kho nguồn và kho đích không được trùng nhau." });
      return;
    }
    transferStock(transferFrom, transferTo, transferProd, transferQty);
    toast({ title: "Thành công", description: "Lệnh điều chuyển kho đã được thực hiện." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase">QUẢN LÝ KHO HÀNG</h1>
          <p className="text-muted-foreground">Theo dõi tồn kho đa chi nhánh và điều chuyển hàng hóa chuyên nghiệp.</p>
        </div>
        <div className="flex gap-3">
           <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="rounded-full h-11 px-6 font-bold gap-2 border-primary/20 text-primary">
                  <ArrowRightLeft className="w-4 h-4" /> Chuyển kho
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                 <DialogHeader><DialogTitle className="font-headline italic">ĐIỀU CHUYỂN HÀNG HÓA</DialogTitle></DialogHeader>
                 <div className="space-y-4 py-4">
                    <div className="space-y-2">
                       <Label>Sản phẩm điều chuyển</Label>
                       <Select value={transferProd} onValueChange={setTransferProduct}>
                          <SelectTrigger className="rounded-xl"><SelectValue placeholder="Chọn sản phẩm..." /></SelectTrigger>
                          <SelectContent>
                             {vendorProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Từ kho</Label>
                          <Select value={transferFrom} onValueChange={setTransferFrom}>
                             <SelectTrigger className="rounded-xl"><SelectValue placeholder="Từ..." /></SelectTrigger>
                             <SelectContent>
                                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                             </SelectContent>
                          </Select>
                       </div>
                       <div className="space-y-2">
                          <Label>Đến kho</Label>
                          <Select value={transferTo} onValueChange={setTransferTo}>
                             <SelectTrigger className="rounded-xl"><SelectValue placeholder="Đến..." /></SelectTrigger>
                             <SelectContent>
                                {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label>Số lượng chuyển</Label>
                       <Input type="number" value={transferQty} onChange={e => setTransferQty(parseInt(e.target.value))} className="rounded-xl" />
                    </div>
                 </div>
                 <DialogFooter>
                    <Button className="w-full h-12 rounded-xl font-bold" onClick={handleTransfer}>Xác nhận điều chuyển</Button>
                 </DialogFooter>
              </DialogContent>
           </Dialog>

           <Dialog>
              <DialogTrigger asChild>
                <Button className="rounded-full h-11 px-8 font-bold gap-2 shadow-xl shadow-primary/20">
                  <Plus className="w-4 h-4" /> Điều chỉnh tồn kho
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                 <DialogHeader><DialogTitle className="font-headline italic">ĐIỀU CHỈNH THỦ CÔNG</DialogTitle></DialogHeader>
                 <div className="space-y-6 py-6">
                    <div className="space-y-2">
                       <Label>Chọn Sản phẩm</Label>
                       <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                          <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Chọn hàng hóa..." /></SelectTrigger>
                          <SelectContent>
                             {vendorProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label>Chọn Kho hàng</Label>
                       <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                          <SelectTrigger className="rounded-xl h-11"><SelectValue placeholder="Chọn kho..." /></SelectTrigger>
                          <SelectContent>
                             {warehouses.map(w => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <Label>Số lượng (+/-)</Label>
                          <Input type="number" value={adjustQty} onChange={e => setAdjustQty(parseInt(e.target.value))} className="rounded-xl h-11" />
                       </div>
                       <div className="space-y-2">
                          <Label>Lý do</Label>
                          <Select value={adjustReason} onValueChange={setAdjustReason}>
                             <SelectTrigger className="rounded-xl h-11"><SelectValue /></SelectTrigger>
                             <SelectContent>
                                <SelectItem value="inventory_count">Kiểm kê định kỳ</SelectItem>
                                <SelectItem value="damage">Hàng hỏng/lỗi</SelectItem>
                                <SelectItem value="return">Khách trả hàng</SelectItem>
                                <SelectItem value="import">Nhập bổ sung</SelectItem>
                             </SelectContent>
                          </Select>
                       </div>
                    </div>
                 </div>
                 <DialogFooter>
                    <Button className="w-full h-12 rounded-xl font-bold" onClick={handleAdjust}>Cập nhật ngay</Button>
                 </DialogFooter>
              </DialogContent>
           </Dialog>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/30 rounded-2xl p-4 flex items-center justify-between border-dashed">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                 <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                 <p className="font-bold text-red-500 uppercase text-xs tracking-widest">Cảnh báo tồn kho!</p>
                 <p className="text-sm text-red-500/80">Có {lowStockItems.length} sản phẩm đang ở mức báo động (Dưới ngưỡng an toàn).</p>
              </div>
           </div>
           <Button size="sm" variant="outline" className="rounded-full border-red-500/30 text-red-500 hover:bg-red-500/10" onClick={() => setActiveTab('overview')}>Xem danh sách</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <InventoryStat label="Tổng Tồn kho" value={stockLevels.reduce((a, b) => a + b.quantity, 0)} icon={<Box />} />
         <InventoryStat label="Kho bãi" value={warehouses.length} icon={<WarehouseIcon />} color="text-blue-500" />
         <InventoryStat label="Đang tạm giữ" value={stockLevels.reduce((a, b) => a + b.reserved, 0)} icon={<Clock />} color="text-orange-500" />
         <InventoryStat label="Sắp hết hàng" value={lowStockItems.length} icon={<TrendingDown />} color="text-red-500" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start">
           <TabsTrigger value="overview" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white gap-2"><Package className="w-4 h-4" /> Tồn kho chi tiết</TabsTrigger>
           <TabsTrigger value="warehouses" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white gap-2"><WarehouseIcon className="w-4 h-4" /> Quản lý Kho</TabsTrigger>
           <TabsTrigger value="history" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white gap-2"><History className="w-4 h-4" /> Nhật ký vận hành</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-6">
           <Card className="bg-[#111] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Tìm mã SKU, tên sản phẩm..." 
                      className="pl-10 h-11 rounded-xl bg-background/50 border-white/10"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><FileText className="w-4 h-4" /> Xuất báo cáo tồn</Button>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-muted/20 border-b border-white/5">
                          <tr className="text-left font-black">
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Sản phẩm</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Kho hàng</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Sẵn sàng</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Tạm giữ</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Trạng thái</th>
                             <th className="p-6"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {vendorProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product) => (
                             <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6">
                                   <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-lg overflow-hidden relative border border-white/10">
                                         <Image src={product.image} alt={product.name} fill className="object-cover" />
                                      </div>
                                      <div>
                                         <p className="font-bold text-sm">{product.name}</p>
                                         <p className="text-[10px] text-muted-foreground uppercase">{product.category}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="p-6">
                                   <div className="space-y-1">
                                      {warehouses.map(wh => {
                                         const stock = stockLevels.find(s => s.productId === product.id && s.warehouseId === wh.id);
                                         if (!stock) return null;
                                         return (
                                            <div key={wh.id} className="flex justify-between items-center gap-8 text-[10px]">
                                               <span className="text-muted-foreground">{wh.name}:</span>
                                               <span className="font-mono font-bold text-white">{stock.quantity}</span>
                                            </div>
                                         );
                                      })}
                                   </div>
                                </td>
                                <td className="p-6 text-center">
                                   <span className="text-lg font-black italic text-primary">
                                      {stockLevels.filter(s => s.productId === product.id).reduce((a, b) => a + b.quantity, 0)}
                                   </span>
                                </td>
                                <td className="p-6 text-center text-muted-foreground font-bold">
                                   {stockLevels.filter(s => s.productId === product.id).reduce((a, b) => a + b.reserved, 0)}
                                </td>
                                <td className="p-6">
                                   {stockLevels.filter(s => s.productId === product.id).reduce((a, b) => a + b.quantity, 0) <= 10 ? (
                                      <Badge className="bg-red-500/10 text-red-500 border-none rounded-full px-3 py-0.5 text-[9px] uppercase font-black italic">Low Stock</Badge>
                                   ) : (
                                      <Badge className="bg-green-500/10 text-green-500 border-none rounded-full px-3 py-0.5 text-[9px] uppercase font-black italic">Healthy</Badge>
                                   )}
                                </td>
                                <td className="p-6 text-right">
                                   <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                      <ArrowUpRight className="w-4 h-4" />
                                   </Button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="warehouses" className="pt-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {warehouses.map(wh => (
                 <Card key={wh.id} className="bg-[#111] border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/40 transition-all">
                    <CardHeader className="bg-muted/20 border-b border-white/5 p-8 relative">
                       <div className="absolute top-4 right-4">
                          {wh.isMain && <Badge className="bg-primary text-white border-none italic font-black uppercase text-[8px]">Trụ sở chính</Badge>}
                       </div>
                       <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                          <WarehouseIcon className="w-6 h-6" />
                       </div>
                       <CardTitle className="text-xl italic font-headline">{wh.name}</CardTitle>
                       <CardDescription className="text-xs">{wh.isActive ? 'Đang hoạt động' : 'Tạm dừng'}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                             <MapPin className="w-4 h-4 text-primary" />
                             <span>{wh.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                             <Phone className="w-4 h-4 text-primary" />
                             <span>{wh.contact}</span>
                          </div>
                       </div>
                       <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-center">
                          <div>
                             <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Mã sản phẩm</p>
                             <p className="text-lg font-black italic">{stockLevels.filter(s => s.warehouseId === wh.id).length}</p>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Tổng tồn</p>
                             <p className="text-lg font-black italic text-primary">{stockLevels.filter(s => s.warehouseId === wh.id).reduce((a, b) => a + b.quantity, 0)}</p>
                          </div>
                       </div>
                       <Button variant="outline" className="w-full rounded-xl gap-2 mt-4"><Settings2 className="w-4 h-4" /> Cấu hình kho</Button>
                    </CardContent>
                 </Card>
              ))}
              <button className="h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:bg-white/5 hover:border-primary/50 transition-all group">
                 <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                    <Plus className="w-6 h-6" />
                 </div>
                 <p className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-all">Thêm chi nhánh/kho mới</p>
              </button>
           </div>
        </TabsContent>

        <TabsContent value="history" className="pt-6">
           <Card className="bg-[#111] border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="bg-muted/20 border-b border-white/5">
                          <tr className="text-left font-black">
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Mã lệnh</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground">Loại nghiệp vụ</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Kho hàng</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Nội dung / Sản phẩm</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground text-center">Số lượng</th>
                             <th className="p-6 text-[10px] uppercase tracking-widest text-muted-foreground text-right">Ngày thực hiện</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {operations.map((op) => (
                             <tr key={op.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 font-mono text-[10px] font-bold text-primary">#{op.id.split('-')[1]}</td>
                                <td className="p-6">
                                   <div className="flex items-center gap-2">
                                      {op.type === 'adjustment' ? <Settings2 className="w-3 h-3 text-orange-500" /> : <ArrowRightLeft className="w-3 h-3 text-blue-500" />}
                                      <span className="capitalize font-bold text-xs">{op.type}</span>
                                   </div>
                                </td>
                                <td className="p-6">
                                   <div className="text-xs font-medium">
                                      {warehouses.find(w => w.id === op.warehouseId)?.name}
                                      {op.targetWarehouseId && (
                                         <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                            → {warehouses.find(w => w.id === op.targetWarehouseId)?.name}
                                         </span>
                                      )}
                                   </div>
                                </td>
                                <td className="p-6">
                                   <p className="text-xs font-bold">{op.items[0]?.productName}</p>
                                   <p className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{op.reason}</p>
                                </td>
                                <td className="p-6 text-center">
                                   <span className={`font-black italic ${op.items[0]?.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                      {op.items[0]?.quantity > 0 ? '+' : ''}{op.items[0]?.quantity}
                                   </span>
                                </td>
                                <td className="p-6 text-right text-muted-foreground text-[10px] font-bold uppercase">
                                   {new Date(op.createdAt).toLocaleDateString('vi-VN')} <br /> {new Date(op.createdAt).toLocaleTimeString('vi-VN')}
                                </td>
                             </tr>
                          ))}
                          {operations.length === 0 && (
                             <tr><td colSpan={6} className="p-20 text-center text-muted-foreground italic">Chưa có nghiệp vụ kho nào được thực hiện.</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InventoryStat({ label, value, icon, color = 'text-primary' }: any) {
  return (
    <Card className="bg-[#111] border-white/5 rounded-3xl p-6 hover:border-primary/30 transition-all group overflow-hidden relative">
       <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
       <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
       <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
    </Card>
  );
}
