
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  CheckCircle2, 
  XCircle,
  User,
  Store,
  Filter,
  ExternalLink,
  FileSpreadsheet,
  Upload,
  Download,
  Loader2,
  Package,
  Trash2,
  Settings2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOCK_TENANTS } from "@/lib/store-data";
import { useVendorStore } from "@/store/vendorStore";
import { formatVND } from "@/lib/currency";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function AdminProductsPage() {
  const { vendorProducts, approveProduct, rejectProduct, addVendorProduct, updateVendorProduct, deleteVendorProduct } = useVendorStore();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    const systemProducts = MOCK_TENANTS[0].products.map(p => ({ ...p, vendorId: 'system', status: 'approved' }));
    setProducts([...systemProducts, ...vendorProducts]);
  }, [vendorProducts]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "pending" && p.status === "pending") ||
                      (activeTab === "vendor" && p.vendorId !== "system");
    return matchesSearch && matchesTab;
  });

  const handleApprove = (id: string) => {
    approveProduct(id);
    toast({ title: "Đã phê duyệt sản phẩm", description: "Sản phẩm hiện đã có thể hiển thị trên Storefront." });
  };

  const handleReject = () => {
    if (rejectingId && rejectReason.trim()) {
      rejectProduct(rejectingId, rejectReason);
      toast({ title: "Đã từ chối", description: "Lý do đã được gửi tới Vendor.", variant: "destructive" });
      setRejectingId(null);
      setRejectReason("");
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateVendorProduct(editingProduct);
    setEditingProduct(null);
    toast({ title: "Thành công", description: "Đã cập nhật thông tin sản phẩm và các biến thể." });
  };

  const handleDownloadTemplate = () => {
    toast({ 
      title: "Thông báo", 
      description: "Đang chuẩn bị file mẫu..." 
    });
  };

  const handleImportExcel = () => {
    setLoading(true);
    setTimeout(() => {
      const mockImported = [
        { id: `sys-imp-${Date.now()}-1`, name: "Sản phẩm Hệ thống mới 1", price: 1500000, category: "Điện tử" },
        { id: `sys-imp-${Date.now()}-2`, name: "Sản phẩm Hệ thống mới 2", price: 2500000, category: "Thời trang" },
      ];

      mockImported.forEach(p => {
        addVendorProduct({
          ...p,
          vendorId: 'system',
          description: "Sản phẩm hệ thống được nhập hàng loạt từ Excel mẫu.",
          image: `https://picsum.photos/seed/${p.id}/600/600`,
          slug: p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
          inStock: true,
          createdAt: new Date().toISOString(),
          status: 'approved'
        });
      });

      setLoading(false);
      setIsImportOpen(false);
      toast({ 
        title: "Nhập dữ liệu thành công", 
        description: `Đã thêm ${mockImported.length} sản phẩm hệ thống vào kho hàng.` 
      });
    }, 2000);
  };

  // Variant Helpers
  const addAttribute = () => {
    const newAttrs = [...(editingProduct.attributes || []), { name: "", values: [""] }];
    setEditingProduct({ ...editingProduct, attributes: newAttrs, hasVariants: true });
  };

  const updateAttribute = (idx: number, name: string) => {
    const newAttrs = [...editingProduct.attributes];
    newAttrs[idx].name = name;
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const addAttrValue = (idx: number) => {
    const newAttrs = [...editingProduct.attributes];
    newAttrs[idx].values.push("");
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const updateAttrValue = (attrIdx: number, valIdx: number, value: string) => {
    const newAttrs = [...editingProduct.attributes];
    newAttrs[attrIdx].values[valIdx] = value;
    setEditingProduct({ ...editingProduct, attributes: newAttrs });
  };

  const removeAttribute = (idx: number) => {
    const newAttrs = editingProduct.attributes.filter((_: any, i: number) => i !== idx);
    setEditingProduct({ ...editingProduct, attributes: newAttrs, hasVariants: newAttrs.length > 0 });
  };

  const addVariant = () => {
    const newVariants = [...(editingProduct.variants || []), {
      id: `v-${Date.now()}`,
      sku: `SKU-${Date.now().toString().slice(-4)}`,
      combination: {},
      price: editingProduct.price,
      stock: 10
    }];
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const updateVariant = (idx: number, field: string, value: any) => {
    const newVariants = [...editingProduct.variants];
    newVariants[idx] = { ...newVariants[idx], [field]: value };
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  const removeVariant = (idx: number) => {
    const newVariants = editingProduct.variants.filter((_: any, i: number) => i !== idx);
    setEditingProduct({ ...editingProduct, variants: newVariants });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Hệ thống Sản phẩm</h1>
          <p className="text-muted-foreground">Kiểm soát chất lượng hàng hóa trên toàn bộ nền tảng.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full h-11 px-6 font-bold gap-2 border-primary/30 text-primary hover:bg-primary/10 transition-all">
                <FileSpreadsheet className="w-4 h-4" /> Nhập hàng loạt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#0f0f0f] border-white/10 rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="font-headline italic uppercase">NHẬP SẢN PHẨM HỆ THỐNG</DialogTitle>
                <DialogDescription>Sử dụng file Excel mẫu để cập nhật danh mục sản phẩm gốc của nền tảng.</DialogDescription>
              </DialogHeader>
              <div className="py-10 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/5 space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-primary opacity-60" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold">Thả file dữ liệu tại đây</p>
                  <p className="text-xs text-muted-foreground">Chấp nhận .xlsx, .csv (Max 10MB)</p>
                </div>
                <Button 
                  variant="link" 
                  className="text-xs text-primary underline flex items-center gap-1 mx-auto"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-3 h-3" /> Tải file mẫu cho Admin (.xlsx)
                </Button>
              </div>
              <DialogFooter>
                <Button className="w-full rounded-xl h-12 font-bold shadow-xl shadow-primary/20" onClick={handleImportExcel} disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin mr-2" /> Đang xử lý...</> : "Xác nhận nhập dữ liệu"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button className="rounded-full h-11 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Thêm SP Hệ thống
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/30 border border-white/5 p-1 rounded-2xl h-14 w-full md:w-auto justify-start">
           <TabsTrigger value="all" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white">Tất cả sản phẩm</TabsTrigger>
           <TabsTrigger value="pending" className="rounded-xl px-8 h-full relative data-[state=active]:bg-primary data-[state=active]:text-white">
              Chờ kiểm duyệt
              {vendorProducts.filter(p => p.status === 'pending').length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {vendorProducts.filter(p => p.status === 'pending').length}
                </span>
              )}
           </TabsTrigger>
           <TabsTrigger value="vendor" className="rounded-xl px-8 h-full data-[state=active]:bg-primary data-[state=active]:text-white">Sản phẩm đối tác</TabsTrigger>
        </TabsList>

        <Card className="border-white/5 bg-card/50 mt-6 rounded-[2rem] overflow-hidden shadow-2xl">
          <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên sản phẩm, mã SKU..." 
                className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc kết quả</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/20 border-b border-white/5">
                  <tr className="text-left font-medium">
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Sản phẩm</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Người bán</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Giá bán</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest font-black text-muted-foreground">Trạng thái</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProducts.map((product) => (
                    <tr key={`${product.vendorId}-${product.id}`} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <div 
                          className="flex items-center gap-4 cursor-pointer group/link"
                          onClick={() => setEditingProduct(product)}
                        >
                          <div className="h-12 w-12 relative rounded-xl overflow-hidden border border-white/10 bg-background shrink-0 shadow-inner group-hover/link:border-primary/50 transition-colors">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-base group-hover/link:text-primary transition-colors truncate max-w-[300px]">{product.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {product.vendorId === 'system' ? (
                          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1 rounded-full"><User className="w-3 h-3" /> Hệ thống</Badge>
                        ) : (
                          <Badge variant="outline" className="border-white/10 gap-1 rounded-full"><Store className="w-3 h-3" /> Vendor #{product.vendorId.substring(0, 4)}</Badge>
                        )}
                      </td>
                      <td className="p-6 font-black">{formatVND(product.price)}</td>
                      <td className="p-6">
                        <Badge variant={product.status === 'approved' ? 'default' : product.status === 'rejected' ? 'destructive' : 'secondary'} className="rounded-full">
                          {product.status}
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
                            {product.status === 'pending' && (
                              <>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" onSelect={() => handleApprove(product.id)}>
                                  <CheckCircle2 className="w-4 h-4" /> Phê duyệt đăng
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onSelect={() => setRejectingId(product.id)}>
                                  <XCircle className="w-4 h-4" /> Từ chối đăng
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                              </>
                            )}
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => window.open(`/products/${product.slug}`, '_blank')}>
                              <ExternalLink className="w-4 h-4" /> Xem trên Storefront
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onSelect={() => setEditingProduct(product)}>
                              <Edit className="w-4 h-4" /> Chỉnh sửa nhanh
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/5" />
                            <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onSelect={() => deleteVendorProduct(product.id)}>
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
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={!!rejectingId} onOpenChange={(open) => !open && setRejectingId(null)}>
        <DialogContent className="rounded-3xl bg-[#0f0f0f] border-white/10">
           <DialogHeader>
              <DialogTitle className="font-headline italic uppercase">LÝ DO TỪ CHỐI SẢN PHẨM</DialogTitle>
              <DialogDescription>Cung cấp lý do để Merchant điều chỉnh lại sản phẩm.</DialogDescription>
           </DialogHeader>
           <div className="py-4">
              <Textarea 
                placeholder="Hình ảnh mờ, sai danh mục, giá bất thường..." 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[120px] rounded-2xl bg-muted/50 border-white/5"
              />
           </div>
           <DialogFooter className="gap-2">
              <Button variant="ghost" className="rounded-xl" onClick={() => setRejectingId(null)}>Hủy bỏ</Button>
              <Button variant="destructive" className="rounded-xl font-bold" onClick={handleReject}>Gửi phản hồi</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog with Variants */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-4xl rounded-[2rem] bg-[#0f0f0f] border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleUpdate}>
            <DialogHeader>
              <DialogTitle className="font-headline italic uppercase text-2xl">CHI TIẾT SẢN PHẨM</DialogTitle>
              <DialogDescription>Quản lý thông tin và các biến thể sản phẩm chuyên nghiệp.</DialogDescription>
            </DialogHeader>
            
            {editingProduct && (
              <Tabs defaultValue="basic" className="w-full mt-6">
                <TabsList className="bg-white/5 rounded-xl p-1 mb-6">
                  <TabsTrigger value="basic" className="rounded-lg px-6">Thông tin cơ bản</TabsTrigger>
                  <TabsTrigger value="variants" className="rounded-lg px-6">Biến thể & SKU</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Tên sản phẩm</Label>
                      <Input 
                        value={editingProduct.name} 
                        onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Danh mục</Label>
                      <Select 
                        value={editingProduct.category} 
                        onValueChange={v => setEditingProduct({...editingProduct, category: v})}
                      >
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Điện tử">Điện tử</SelectItem>
                          <SelectItem value="Thời trang">Thời trang</SelectItem>
                          <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                          <SelectItem value="Phụ kiện">Phụ kiện</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Giá bán niêm yết (VNĐ)</Label>
                      <Input 
                        type="number" 
                        value={editingProduct.price} 
                        onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})}
                        className="rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Ảnh đại diện (URL)</Label>
                      <Input 
                        value={editingProduct.image} 
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                        className="rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả sản phẩm</Label>
                    <Textarea 
                      value={editingProduct.description} 
                      onChange={e => setEditingProduct({...editingProduct, description: e.target.value})}
                      className="min-h-[150px] rounded-xl"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sử dụng biến thể</Label>
                      <p className="text-xs text-muted-foreground italic">Dành cho sản phẩm có nhiều Size, Màu sắc...</p>
                    </div>
                    <Switch 
                      checked={editingProduct.hasVariants} 
                      onCheckedChange={(val) => setEditingProduct({...editingProduct, hasVariants: val, attributes: val ? (editingProduct.attributes || []) : []})} 
                    />
                  </div>

                  {editingProduct.hasVariants && (
                    <div className="space-y-8">
                      {/* Attributes Management */}
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">1. Nhóm thuộc tính</h4>
                          <Button type="button" variant="outline" size="sm" onClick={addAttribute} className="rounded-full gap-2">
                            <Plus className="w-3 h-3" /> Thêm nhóm
                          </Button>
                        </div>
                        <div className="space-y-4">
                          {editingProduct.attributes?.map((attr: any, aIdx: number) => (
                            <Card key={aIdx} className="bg-white/5 border-white/10 p-4 rounded-2xl">
                              <div className="flex gap-4 mb-4">
                                <div className="flex-1 space-y-2">
                                  <Label className="text-[10px] uppercase font-bold">Tên nhóm (VD: Màu sắc)</Label>
                                  <Input value={attr.name} onChange={(e) => updateAttribute(aIdx, e.target.value)} placeholder="Nhập tên..." className="h-9 rounded-lg" />
                                </div>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeAttribute(aIdx)} className="mt-6 text-destructive hover:bg-destructive/10">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold">Giá trị (VD: Đỏ, Xanh)</Label>
                                <div className="flex flex-wrap gap-2">
                                  {attr.values.map((val: string, vIdx: number) => (
                                    <Input 
                                      key={vIdx} 
                                      value={val} 
                                      onChange={(e) => updateAttrValue(aIdx, vIdx, e.target.value)}
                                      className="w-24 h-8 text-xs rounded-lg"
                                    />
                                  ))}
                                  <Button type="button" variant="outline" size="icon" onClick={() => addAttrValue(aIdx)} className="h-8 w-8 rounded-lg"><Plus className="w-3 h-3" /></Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </section>

                      {/* Variants List */}
                      <section className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black uppercase tracking-widest text-primary italic">2. Danh sách Biến thể (SKU)</h4>
                          <Button type="button" variant="outline" size="sm" onClick={addVariant} className="rounded-full gap-2">
                            <Plus className="w-3 h-3" /> Thêm thủ công
                          </Button>
                        </div>
                        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-white/5 border-b border-white/10">
                              <tr className="text-left font-bold uppercase text-[9px] tracking-widest text-muted-foreground">
                                <th className="p-4">SKU / Định danh</th>
                                <th className="p-4">Giá bán</th>
                                <th className="p-4">Tồn kho</th>
                                <th className="p-4"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {editingProduct.variants?.map((variant: any, vIdx: number) => (
                                <tr key={vIdx} className="hover:bg-white/5 transition-colors">
                                  <td className="p-4">
                                    <Input 
                                      value={variant.sku} 
                                      onChange={(e) => updateVariant(vIdx, 'sku', e.target.value)}
                                      className="h-8 rounded-lg font-mono text-[10px]"
                                    />
                                  </td>
                                  <td className="p-4">
                                    <Input 
                                      type="number"
                                      value={variant.price} 
                                      onChange={(e) => updateVariant(vIdx, 'price', parseInt(e.target.value))}
                                      className="h-8 rounded-lg font-bold"
                                    />
                                  </td>
                                  <td className="p-4">
                                    <Input 
                                      type="number"
                                      value={variant.stock} 
                                      onChange={(e) => updateVariant(vIdx, 'stock', parseInt(e.target.value))}
                                      className="h-8 rounded-lg"
                                    />
                                  </td>
                                  <td className="p-4 text-right">
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(vIdx)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                              {(!editingProduct.variants || editingProduct.variants.length === 0) && (
                                <tr><td colSpan={4} className="p-8 text-center italic text-muted-foreground opacity-50">Chưa có biến thể nào được tạo.</td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            <DialogFooter className="mt-12 border-t border-white/10 pt-6">
               <Button type="submit" className="w-full h-14 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl shadow-primary/20 text-lg">
                 Lưu cấu hình sản phẩm
               </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: any }) {
  const configs: any = {
    approved: { label: "Hoạt động", class: "bg-green-500/10 text-green-500 border-none" },
    pending: { label: "Chờ duyệt", class: "bg-orange-500/10 text-orange-500 border-none" },
    rejected: { label: "Từ chối", class: "bg-red-500/10 text-red-500 border-none" },
  };
  const config = configs[status] || configs.pending;
  return <Badge className={`rounded-full px-3 py-0.5 text-[10px] uppercase font-black italic ${config.class}`}>{config.label}</Badge>;
}
