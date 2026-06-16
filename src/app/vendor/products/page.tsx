
"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Package,
  Image as ImageIcon,
  AlertCircle,
  ArrowRight,
  Store,
  FileSpreadsheet,
  Upload,
  Download,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function VendorProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Đang tải kho hàng...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { profile } = useUserStore();
  const { getVendorByUserId, vendorProducts, addVendorProduct, deleteVendorProduct } = useVendorStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();

  const vendor = profile ? getVendorByUserId(profile.email) : null;
  const myProducts = vendorProducts.filter(p => p.vendorId === vendor?.id);

  // Logic: Tự động mở form nếu có param ?add=true từ Header
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) {
      toast({ title: "Lỗi", description: "Không tìm thấy thông tin nhà bán hàng.", variant: "destructive" });
      return;
    }

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productName = formData.get('name') as string;
    
    const newProduct = {
      id: `v-prod-${Date.now()}`,
      vendorId: vendor.id,
      name: productName,
      price: parseInt(formData.get('price') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      image: `https://picsum.photos/seed/${Date.now()}/600/600`,
      slug: productName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
      inStock: true,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    addVendorProduct(newProduct);
    setIsAddOpen(false);
    toast({ title: "Đã đăng sản phẩm!", description: "Sản phẩm của bạn đang chờ Admin phê duyệt nội dung." });
  };

  const handleDownloadTemplate = () => {
    toast({ 
      title: "Đang tải mẫu Excel", 
      description: "Mẫu sản phẩm Vendor đang được chuẩn bị..." 
    });
  };

  const handleImportExcel = () => {
    if (!vendor) return;
    setLoading(true);
    setTimeout(() => {
      const mockImported = [
        { id: `v-imp-1`, name: "Sản phẩm từ Excel 1", price: 500000, category: "Điện tử" },
        { id: `v-imp-2`, name: "Sản phẩm từ Excel 2", price: 800000, category: "Thời trang" },
      ];

      mockImported.forEach(p => {
        addVendorProduct({
          ...p,
          vendorId: vendor.id,
          description: "Nhập dữ liệu từ Excel.",
          image: `https://picsum.photos/seed/${p.id}/600/600`,
          slug: p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
          inStock: true,
          createdAt: new Date().toISOString(),
          status: 'pending'
        });
      });

      setLoading(false);
      setIsImportOpen(false);
      toast({ title: "Thành công", description: `Đã nhập ${mockImported.length} sản phẩm mới.` });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý Kho hàng</h1>
          <p className="text-muted-foreground">Tự do đăng bán và quản lý danh mục sản phẩm của bạn.</p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Nhập hàng loạt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline italic">NHẬP KHO HÀNG LOẠT</DialogTitle>
                <DialogDescription>Sử dụng mẫu Excel để cập nhật danh mục sản phẩm nhanh hơn.</DialogDescription>
              </DialogHeader>
              <div className="py-10 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/5 space-y-4">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto opacity-20" />
                <p className="text-sm font-bold">Thả file Excel tại đây</p>
                <Button 
                  variant="link" 
                  className="text-xs text-primary underline flex items-center gap-1 mx-auto"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-3 h-3" /> Tải file mẫu sản phẩm
                </Button>
              </div>
              <DialogFooter>
                <Button className="w-full rounded-xl h-12 font-bold" onClick={handleImportExcel} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin mr-2" /> : "Bắt đầu nhập kho"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20">
                <Plus className="w-5 h-5" /> Đăng sản phẩm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline italic">ĐĂNG SẢN PHẨM MỚI</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên sản phẩm</Label>
                      <Input name="name" placeholder="VD: iPhone 15 Pro Max..." required className="h-11 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select name="category" defaultValue="Điện tử">
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Điện tử">Điện tử</SelectItem>
                          <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                          <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                          <SelectItem value="Thời trang">Thời trang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Giá bán (VNĐ)</Label>
                      <Input name="price" type="number" placeholder="25000000" required className="h-11 rounded-xl" />
                    </div>
                     <div className="space-y-2">
                      <Label>Tồn kho ban đầu</Label>
                      <Input name="stock" type="number" defaultValue="10" className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả chi tiết</Label>
                    <Textarea name="description" placeholder="Thông tin chi tiết, cấu hình sản phẩm..." className="min-h-[120px] rounded-xl" />
                  </div>
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/5 space-y-2 cursor-pointer hover:bg-white/10 transition-colors">
                    <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto" />
                    <p className="text-sm font-bold">Tải lên hình ảnh sản phẩm</p>
                    <p className="text-[10px] text-muted-foreground italic">Hỗ trợ JPG, PNG, WEBP (Max 2MB)</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30">Gửi duyệt sản phẩm</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Giao diện Chào mừng (Empty State) khi chưa có sản phẩm */}
      {myProducts.length === 0 ? (
        <Card className="bg-primary/5 border-dashed border-primary/20 rounded-[2.5rem] p-12 text-center space-y-6 mt-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto relative z-10">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2 relative z-10">
            <h2 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Chào mừng người bán mới!</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
              Gian hàng của bạn hiện đang trống. Hãy bắt đầu hành trình bứt phá doanh thu bằng cách đăng sản phẩm đầu tiên ngay bây giờ.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} size="lg" className="rounded-full px-12 h-16 font-bold gap-3 shadow-2xl shadow-primary/40 relative z-10 text-lg">
            <Plus className="w-6 h-6" /> Đăng sản phẩm đầu tiên
          </Button>
        </Card>
      ) : (
        <>
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <StatCard label="Sản phẩm của tôi" value={myProducts.length} icon={<Package />} color="text-primary" />
            <StatCard label="Đang hiển thị" value={myProducts.filter(p => p.status === 'approved').length} icon={<CheckCircle2 />} color="text-green-500" />
            <StatCard label="Chờ duyệt" value={myProducts.filter(p => p.status === 'pending').length} icon={<Clock />} color="text-orange-500" />
            <StatCard label="Bị từ chối" value={myProducts.filter(p => p.status === 'rejected').length} icon={<XCircle />} color="text-red-500" />
          </div>

          {/* Product Table */}
          <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm kiếm trong kho hàng..." 
                  className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/20 border-b border-white/5">
                    <tr className="text-left">
                      <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Phân loại</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Giá bán</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Ngày đăng</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10">
                              <Image src={p.image} alt={p.name} width={48} height={48} className="object-cover h-full w-full" />
                            </div>
                            <div className="font-bold text-base group-hover:text-primary transition-colors">{p.name}</div>
                          </div>
                        </td>
                        <td className="p-6 text-muted-foreground">{p.category}</td>
                        <td className="p-6 font-black">{formatVND(p.price)}</td>
                        <td className="p-6">
                          <Badge variant={p.status === 'approved' ? 'default' : p.status === 'pending' ? 'secondary' : 'destructive'} className="rounded-full">
                            {p.status === 'approved' ? 'Đang bán' : p.status === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}
                          </Badge>
                          {p.status === 'rejected' && p.rejectReason && (
                            <p className="text-[9px] text-red-400 mt-1 italic font-medium">Lý do: {p.rejectReason}</p>
                          )}
                        </td>
                        <td className="p-6 text-muted-foreground text-xs">{new Date(p.createdAt).toLocaleDateString('vi-VN')}</td>
                        <td className="p-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary"><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => deleteVendorProduct(p.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          {myProducts.some(p => p.status === 'pending') && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-6 flex items-start gap-4">
               <AlertCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
               <div className="space-y-1">
                  <h4 className="font-bold text-orange-500">Sản phẩm đang chờ phê duyệt</h4>
                  <p className="text-sm text-muted-foreground">Admin sẽ kiểm tra nội dung và hình ảnh sản phẩm của bạn trong vòng 24h. Sau khi được duyệt, sản phẩm sẽ tự động xuất hiện trên gian hàng thực tế.</p>
               </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }: any) {
  return (
    <Card className="bg-[#151515] border-white/5 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all group">
      <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
        <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
      </div>
    </Card>
  );
}
