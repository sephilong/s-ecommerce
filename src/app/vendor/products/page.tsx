
"use client";

import { useState, useEffect, Suspense } from "react";
import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  AlertCircle,
  Store,
  FileSpreadsheet,
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
import { MediaUploader } from "@/components/media/MediaUploader";

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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");
  const searchParams = useSearchParams();

  const vendor = profile ? getVendorByUserId(profile.email) : null;
  const myProducts = vendorProducts.filter(p => p.vendorId === vendor?.id);

  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const productName = formData.get('name') as string;
    
    if (!uploadedUrl) {
      toast({ variant: "destructive", title: "Thiếu hình ảnh", description: "Vui lòng tải lên ảnh sản phẩm." });
      return;
    }

    const newProduct = {
      id: `v-prod-${Date.now()}`,
      vendorId: vendor.id,
      name: productName,
      price: parseInt(formData.get('price') as string),
      category: formData.get('category'),
      description: formData.get('description'),
      image: uploadedUrl,
      slug: productName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
      inStock: true,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    addVendorProduct(newProduct);
    setIsAddOpen(false);
    setUploadedUrl("");
    toast({ title: "Đã đăng sản phẩm!", description: "Sản phẩm của bạn đang chờ Admin phê duyệt." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý Kho hàng</h1>
          <p className="text-muted-foreground text-sm">Tự do đăng bán và tối ưu hóa hình ảnh sản phẩm qua CDN.</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full h-12 px-6 border-white/10 gap-2 hover:bg-white/5 transition-all">
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
          </Button>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 px-8 font-bold gap-2 shadow-xl shadow-primary/20">
                <Plus className="w-5 h-5" /> Đăng sản phẩm mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-[2.5rem]">
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline italic">THIẾT LẬP SẢN PHẨM</DialogTitle>
                  <DialogDescription>Cung cấp thông tin và hình ảnh chất lượng cao để tăng tỉ lệ chuyển đổi.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6 overflow-y-auto max-h-[70vh] px-2 custom-scrollbar">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-primary">Hình ảnh sản phẩm (Media pipeline)</Label>
                    <MediaUploader category="product" onUploadSuccess={setUploadedUrl} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên sản phẩm</Label>
                      <Input name="name" placeholder="iPhone 15 Pro Max..." required className="h-11 rounded-xl" />
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
                      <Label>Số lượng kho</Label>
                      <Input name="stock" type="number" defaultValue="10" className="h-11 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả chi tiết</Label>
                    <Textarea name="description" placeholder="Thông tin chi tiết, cấu hình..." className="min-h-[100px] rounded-xl" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-14 rounded-2xl font-black italic shadow-xl shadow-primary/30 uppercase tracking-tighter">Gửi đi phê duyệt</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {myProducts.length === 0 ? (
        <Card className="bg-primary/5 border-dashed border-primary/20 rounded-[2.5rem] p-12 text-center space-y-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Package className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-headline italic uppercase">Gian hàng trống</h2>
            <p className="text-muted-foreground max-w-md mx-auto">Hãy bắt đầu kinh doanh bằng cách đăng sản phẩm đầu tiên với hình ảnh chất lượng.</p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="rounded-full px-12 h-16 font-bold shadow-2xl">Đăng sản phẩm đầu tiên</Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <StatCard label="Tổng sản phẩm" value={myProducts.length} icon={<Package />} color="text-primary" />
            <StatCard label="Đang bán" value={myProducts.filter(p => p.status === 'approved').length} icon={<CheckCircle2 />} color="text-green-500" />
            <StatCard label="Chờ duyệt" value={myProducts.filter(p => p.status === 'pending').length} icon={<Clock />} color="text-orange-500" />
            <StatCard label="Từ chối" value={myProducts.filter(p => p.status === 'rejected').length} icon={<XCircle />} color="text-red-500" />
          </div>

          <Card className="bg-[#151515] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm sản phẩm..." 
                  className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc kho</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/20 border-b border-white/5">
                    <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                      <th className="p-6">Sản phẩm</th>
                      <th className="p-6">Phân loại</th>
                      <th className="p-6">Giá bán</th>
                      <th className="p-6 text-center">Trạng thái</th>
                      <th className="p-6 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {myProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10 relative shrink-0">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="font-bold text-base truncate max-w-[200px]">{p.name}</div>
                          </div>
                        </td>
                        <td className="p-6 text-muted-foreground italic">{p.category}</td>
                        <td className="p-6 font-black text-primary">{formatVND(p.price)}</td>
                        <td className="p-6 text-center">
                          <Badge variant={p.status === 'approved' ? 'default' : 'secondary'} className="rounded-full px-3 py-1 font-black italic uppercase text-[9px]">
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full"><Edit2 className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-destructive" onClick={() => deleteVendorProduct(p.id)}><Trash2 className="w-4 h-4" /></Button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
