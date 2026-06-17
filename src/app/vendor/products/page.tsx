
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
  FileSpreadsheet,
  ExternalLink,
  Sparkles
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
import { useSearchParams } from "next/navigation";
import { MediaUploader } from "@/components/media/MediaUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const COMMON_ATTRIBUTES = [
  { name: "Màu sắc", values: ["Đen", "Trắng", "Đỏ", "Xanh dương", "Xanh lá", "Vàng", "Xám", "Bạc", "Titan"] },
  { name: "Kích thước", values: ["S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "43"] },
  { name: "Dung lượng", values: ["64GB", "128GB", "256GB", "512GB", "1TB"] },
  { name: "Chất liệu", values: ["Cotton", "Polyester", "Da thật", "Nhôm", "Kính"] },
];

export default function VendorProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center">Đang tải kho hàng...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const { profile } = useUserStore();
  const { getVendorByUserId, vendorProducts, addVendorProduct, deleteVendorProduct, updateVendorProduct } = useVendorStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
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
      status: 'pending',
      hasVariants: false,
      attributes: [],
      variants: []
    };

    addVendorProduct(newProduct);
    setIsAddOpen(false);
    setUploadedUrl("");
    toast({ title: "Đã đăng sản phẩm!", description: "Sản phẩm của bạn đang chờ Admin phê duyệt." });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateVendorProduct(editingProduct);
    setEditingProduct(null);
    toast({ title: "Thành công", description: "Đã cập nhật thông tin sản phẩm và các biến thể." });
  };

  // Variant Management Helpers
  const addAttribute = (name: string = "") => {
    const currentAttrs = editingProduct.attributes || [];
    setEditingProduct({
      ...editingProduct,
      hasVariants: true,
      attributes: [...currentAttrs, { name, values: [""] }]
    });
  };

  const updateAttribute = (idx: number, name: string) => {
    const newAttrs = [...editingProduct.attributes];
    newAttrs[idx].name = name;
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const removeAttribute = (idx: number) => {
    const newAttrs = editingProduct.attributes.filter((_: any, i: number) => i !== idx);
    setEditingProduct({
      ...editingProduct,
      attributes: newAttrs,
      hasVariants: newAttrs.length > 0
    });
  };

  const addAttrValue = (attrIdx: number, val: string = "") => {
    const newAttrs = [...editingProduct.attributes];
    if (newAttrs[attrIdx].values.includes(val)) return;
    if (newAttrs[attrIdx].values.length === 1 && newAttrs[attrIdx].values[0] === "") {
        newAttrs[attrIdx].values = [val];
    } else {
        newAttrs[attrIdx].values.push(val);
    }
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const updateAttrValue = (attrIdx: number, valIdx: number, val: string) => {
    const newAttrs = [...editingProduct.attributes];
    newAttrs[attrIdx].values[valIdx] = val;
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const addVariant = () => {
    const currentVariants = editingProduct.variants || [];
    setEditingProduct({
      ...editingProduct,
      variants: [...currentVariants, {
        id: `v-${Date.now()}`,
        sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
        combination: {},
        price: editingProduct.price,
        stock: 10
      }]
    });
  };

  const updateVariantField = (idx: number, field: string, value: any) => {
    const newVariants = [...editingProduct.variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const removeVariant = (idx: number) => {
    const newVariants = editingProduct.variants.filter((_: any, i: number) => i !== idx);
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
            <DialogContent className="max-w-2xl rounded-[2.5rem] bg-[#0f0f0f] border-white/10">
              <form onSubmit={handleAddProduct}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline italic">THIẾT LẬP SẢN PHẨM</DialogTitle>
                  <DialogDescription>Cung cấp thông tin và hình ảnh chất lượng cao để tăng tỉ lệ chuyển đổi.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6 overflow-y-auto max-h-[70vh] px-2 custom-scrollbar">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary">Hình ảnh sản phẩm (Media pipeline)</Label>
                    <MediaUploader category="product" onUploadSuccess={setUploadedUrl} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên sản phẩm</Label>
                      <Input name="name" placeholder="iPhone 15 Pro Max..." required className="h-11 rounded-xl bg-background/50 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select name="category" defaultValue="Điện tử">
                        <SelectTrigger className="h-11 rounded-xl bg-background/50 border-white/10"><SelectValue /></SelectTrigger>
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
                      <Input name="price" type="number" placeholder="25000000" required className="h-11 rounded-xl bg-background/50 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Số lượng kho</Label>
                      <Input name="stock" type="number" defaultValue="10" className="h-11 rounded-xl bg-background/50 border-white/10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả chi tiết</Label>
                    <Textarea name="description" placeholder="Thông tin chi tiết, cấu hình..." className="min-h-[100px] rounded-xl bg-background/50 border-white/10" />
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
                      <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6">
                          <div 
                            className="flex items-center gap-4 cursor-pointer group/link"
                            onClick={() => setEditingProduct(p)}
                          >
                            <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/10 relative shrink-0 shadow-inner group-hover/link:border-primary/50 transition-colors">
                              <Image src={p.image} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="font-bold text-base truncate max-w-[200px] group-hover/link:text-primary transition-colors">{p.name}</div>
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
                           <DropdownMenu modal={false}>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                                 <MoreHorizontal className="w-4 h-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#0f0f0f] border-white/5 z-50">
                                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-3 py-2">Quản trị Sản phẩm</DropdownMenuLabel>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" onSelect={() => setEditingProduct(p)}>
                                   <Edit2 className="w-4 h-4" /> Chỉnh sửa chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => window.open(`/products/${p.slug}`, '_blank')}>
                                   <ExternalLink className="w-4 h-4" /> Xem trên Store
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onSelect={() => deleteVendorProduct(p.id)}>
                                   <Trash2 className="w-4 h-4" /> Xóa sản phẩm
                                </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
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

      {/* Advanced Edit Dialog with Variants */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-4xl rounded-[2.5rem] bg-[#0f0f0f] border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
           <form onSubmit={handleUpdateProduct}>
              <DialogHeader>
                 <DialogTitle className="font-headline italic uppercase text-2xl">QUẢN LÝ SẢN PHẨM & BIẾN THỂ</DialogTitle>
                 <DialogDescription>Tùy chỉnh thông tin chi tiết, thuộc tính và danh sách SKU cho sản phẩm.</DialogDescription>
              </DialogHeader>

              {editingProduct && (
                <Tabs defaultValue="info" className="w-full mt-6">
                  <TabsList className="bg-white/5 rounded-xl p-1 mb-8">
                    <TabsTrigger value="info" className="rounded-lg px-8">Thông tin chính</TabsTrigger>
                    <TabsTrigger value="variants" className="rounded-lg px-8">Biến thể (Size/Color)</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <Label>Tên sản phẩm</Label>
                           <Input value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="rounded-xl h-11 bg-background/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                           <Label>Danh mục</Label>
                           <Select value={editingProduct.category} onValueChange={v => setEditingProduct({...editingProduct, category: v})}>
                              <SelectTrigger className="h-11 rounded-xl bg-background/50 border-white/10"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="Điện tử">Điện tử</SelectItem>
                                 <SelectItem value="Thời trang">Thời trang</SelectItem>
                                 <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                                 <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Giá gốc hệ thống (VNĐ)</Label>
                           <Input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} className="rounded-xl h-11 bg-background/50 border-white/10" />
                        </div>
                        <div className="space-y-2">
                           <Label>Ảnh đại diện (URL)</Label>
                           <Input value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="rounded-xl h-11 bg-background/50 border-white/10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Mô tả chi tiết</Label>
                        <Textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="min-h-[150px] rounded-xl bg-background/50 border-white/10" />
                    </div>
                  </TabsContent>

                  <TabsContent value="variants" className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10">
                      <div className="space-y-1">
                        <Label className="text-base italic">Kích hoạt Biến thể</Label>
                        <p className="text-xs text-muted-foreground">Sản phẩm này có nhiều lựa chọn khác nhau (như Size, Màu sắc...)</p>
                      </div>
                      <Switch 
                        checked={editingProduct.hasVariants} 
                        onCheckedChange={(val) => setEditingProduct({...editingProduct, hasVariants: val, attributes: val ? (editingProduct.attributes || []) : []})} 
                      />
                    </div>

                    {editingProduct.hasVariants && (
                      <div className="space-y-10">
                        {/* 1. Attributes */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <h4 className="text-sm font-black italic uppercase tracking-widest text-primary">1. Cấu hình Nhóm thuộc tính</h4>
                            <div className="flex gap-2">
                               {COMMON_ATTRIBUTES.map(attr => (
                                 <Button key={attr.name} type="button" variant="outline" size="sm" onClick={() => addAttribute(attr.name)} className="rounded-full h-8 text-[10px] uppercase font-bold border-white/10 bg-white/5 hover:bg-primary/20">
                                   + {attr.name}
                                 </Button>
                               ))}
                               <Button type="button" variant="ghost" size="sm" onClick={() => addAttribute()} className="rounded-full h-8 text-[10px] uppercase font-bold text-muted-foreground">
                                 Tùy chỉnh
                               </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                            {editingProduct.attributes?.map((attr: any, aIdx: number) => {
                              const suggestions = COMMON_ATTRIBUTES.find(ca => ca.name === attr.name)?.values || [];
                              return (
                                <Card key={aIdx} className="bg-white/5 border-white/10 p-6 rounded-2xl relative overflow-hidden">
                                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                  <div className="flex gap-6 mb-4">
                                    <div className="flex-1 space-y-2">
                                      <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tên nhóm thuộc tính</Label>
                                      <Input value={attr.name} onChange={(e) => {
                                        const newAttrs = [...editingProduct.attributes];
                                        newAttrs[aIdx].name = e.target.value;
                                        setEditingProduct({...editingProduct, attributes: newAttrs});
                                      }} placeholder="Ví dụ: Kích thước, Màu sắc..." className="h-10 rounded-xl" />
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(aIdx)} className="mt-6 text-destructive hover:bg-destructive/10 h-10 w-10"><Trash2 className="w-5 h-5" /></Button>
                                  </div>
                                  <div className="space-y-3">
                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Các giá trị lựa chọn</Label>
                                    <div className="flex flex-wrap gap-2">
                                      {attr.values.map((v: string, vIdx: number) => (
                                        <div key={vIdx} className="relative group/val">
                                          <Input 
                                            value={v} 
                                            onChange={(e) => updateAttrValue(aIdx, vIdx, e.target.value)}
                                            className="w-28 h-9 rounded-lg text-xs pr-8"
                                          />
                                          <button 
                                            type="button" 
                                            onClick={() => {
                                              const newAttrs = [...editingProduct.attributes];
                                              newAttrs[aIdx].values = newAttrs[aIdx].values.filter((_: any, i: number) => i !== vIdx);
                                              setEditingProduct({...editingProduct, attributes: newAttrs});
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive opacity-0 group-hover/val:opacity-100 transition-opacity"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                      <Button type="button" variant="outline" size="sm" onClick={() => addAttrValue(aIdx)} className="h-9 rounded-lg px-4 gap-2 border-dashed border-white/20"><Plus className="w-3 h-3" /> Thêm giá trị</Button>
                                    </div>

                                    {suggestions.length > 0 && (
                                      <div className="pt-2">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Gợi ý cho {attr.name}:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {suggestions.map(s => (
                                            <button 
                                              key={s} 
                                              type="button"
                                              onClick={() => addAttrValue(aIdx, s)}
                                              disabled={attr.values.includes(s)}
                                              className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-medium hover:bg-primary/20 hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                              {s}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Variants List */}
                        <div className="space-y-4">
                           <div className="flex justify-between items-center">
                              <h4 className="text-sm font-black italic uppercase tracking-widest text-primary">2. Danh sách SKUs cụ thể</h4>
                              <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-full gap-2 border-primary/20 text-primary">
                                <Settings2 className="w-3.5 h-3.5" /> Thêm SKU mới
                              </Button>
                           </div>
                           
                           <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                              <table className="w-full text-xs">
                                 <thead className="bg-white/5 border-b border-white/10">
                                    <tr className="text-left">
                                       <th className="p-4 font-black uppercase text-[9px] tracking-widest text-muted-foreground">Mã SKU</th>
                                       <th className="p-4 font-black uppercase text-[9px] tracking-widest text-muted-foreground">Giá Biến thể</th>
                                       <th className="p-4 font-black uppercase text-[9px] tracking-widest text-muted-foreground">Tồn kho</th>
                                       <th className="p-4"></th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5">
                                    {editingProduct.variants?.map((v: any, vIdx: number) => (
                                      <tr key={vIdx} className="hover:bg-white/5 transition-colors">
                                         <td className="p-4">
                                            <Input 
                                              value={v.sku} 
                                              onChange={(e) => updateVariantField(vIdx, 'sku', e.target.value)}
                                              className="h-9 rounded-lg font-mono text-[10px]"
                                            />
                                         </td>
                                         <td className="p-4">
                                            <Input 
                                              type="number"
                                              value={v.price} 
                                              onChange={(e) => updateVariantField(vIdx, 'price', parseInt(e.target.value))}
                                              className="h-9 rounded-lg font-bold text-primary"
                                            />
                                         </td>
                                         <td className="p-4">
                                            <Input 
                                              type="number"
                                              value={v.stock} 
                                              onChange={(e) => updateVariantField(vIdx, 'stock', parseInt(e.target.value))}
                                              className="h-9 rounded-lg"
                                            />
                                         </td>
                                         <td className="p-4 text-right">
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(vIdx)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                                         </td>
                                      </tr>
                                    ))}
                                    {(!editingProduct.variants || editingProduct.variants.length === 0) && (
                                      <tr><td colSpan={4} className="p-10 text-center italic text-muted-foreground opacity-40">Chưa có tổ hợp biến thể nào.</td></tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}

              <DialogFooter className="mt-12 border-t border-white/10 pt-8">
                 <Button type="submit" className="w-full h-16 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl shadow-primary/30 text-lg">
                    Lưu thông tin sản phẩm
                 </Button>
              </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
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
