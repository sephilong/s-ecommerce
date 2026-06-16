
"use client";

import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { useVendorStore, Vendor } from "@/store/vendorStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Store, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  User as UserIcon,
  CreditCard,
  Rocket,
  ArrowRight,
  Package,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  FileSpreadsheet,
  Upload
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatVND } from "@/lib/currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";

export default function VendorOnboardingPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, registerVendor, vendorProducts, addVendorProduct, deleteVendorProduct } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const vendor = profile ? getVendorByUserId(profile.email) : undefined;
  const myProducts = vendorProducts.filter(p => p.vendorId === vendor?.id);

  const [formData, setFormData] = useState<Partial<Vendor>>({
    storeName: "",
    storeDescription: "",
    businessType: "individual",
    idNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  });

  const handleRegister = () => {
    if (!profile) return;
    setLoading(true);
    
    const newVendor: Vendor = {
      ...formData,
      id: `v-${Date.now()}`,
      userId: profile.email,
      storeSlug: formData.storeName?.toLowerCase().replace(/\s+/g, '-'),
      status: 'pending',
      commissionRate: 10,
      totalRevenue: 0,
      balance: 0,
      pendingBalance: 0,
      createdAt: new Date().toISOString()
    } as Vendor;

    setTimeout(() => {
      registerVendor(newVendor);
      setLoading(false);
      toast({ title: "Đã gửi đơn đăng ký!", description: "Chúng tôi sẽ phê duyệt yêu cầu của bạn trong vòng 24-48h." });
    }, 1500);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const productName = fd.get('name') as string;
    
    const newProduct = {
      id: `v-prod-${Date.now()}`,
      vendorId: vendor.id,
      name: productName,
      price: parseInt(fd.get('price') as string),
      category: fd.get('category'),
      description: fd.get('description'),
      image: `https://picsum.photos/seed/${Date.now()}/600/600`,
      slug: productName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
      inStock: true,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    addVendorProduct(newProduct);
    setIsAddOpen(false);
    toast({ title: "Đã đăng sản phẩm!", description: "Sản phẩm đang chờ Admin phê duyệt." });
  };

  const handleImportExcel = () => {
    if (!vendor) return;
    setLoading(true);
    
    // Giả lập xử lý file Excel
    setTimeout(() => {
      const mockImported = [
        { id: `imp-1-${Date.now()}`, name: "Sản phẩm Excel 1", price: 150000, category: "Điện tử" },
        { id: `imp-2-${Date.now()}`, name: "Sản phẩm Excel 2", price: 250000, category: "Thời trang" },
        { id: `imp-3-${Date.now()}`, name: "Sản phẩm Excel 3", price: 350000, category: "Gia dụng" },
      ];

      mockImported.forEach(p => {
        addVendorProduct({
          ...p,
          vendorId: vendor.id,
          description: "Nhập tự động từ file Excel.",
          image: `https://picsum.photos/seed/${p.id}/600/600`,
          slug: p.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(7),
          inStock: true,
          createdAt: new Date().toISOString(),
          status: 'pending'
        });
      });

      setLoading(false);
      setIsImportOpen(false);
      toast({ title: "Nhập dữ liệu thành công", description: `Đã thêm ${mockImported.length} sản phẩm vào danh sách chờ duyệt.` });
    }, 2000);
  };

  if (vendor) {
    return (
      <div className="max-w-5xl mx-auto py-8 space-y-12 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black font-headline italic tracking-tighter uppercase">Quản lý gian hàng</h1>
            <p className="text-muted-foreground">Chào mừng quay trở lại, {vendor.storeName}.</p>
          </div>
          <Button asChild className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20">
            <Link href="/vendor/dashboard">Vào Kênh Người Bán Toàn Diện <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 bg-card/30 border-white/5 p-8 rounded-[2rem] h-fit">
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                {vendor.status === 'approved' ? <CheckCircle2 className="w-8 h-8" /> : <Clock className="w-8 h-8" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Trạng thái: {vendor.status === 'approved' ? 'Đang hoạt động' : 'Đang chờ duyệt'}</h3>
                <p className="text-sm text-muted-foreground">
                  {vendor.status === 'approved' 
                    ? "Gian hàng của bạn đã sẵn sàng đón khách hàng." 
                    : "Hồ sơ của bạn đang được Admin kiểm tra thông tin pháp lý."}
                </p>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Doanh thu:</span>
                    <span className="font-bold">{formatVND(vendor.totalRevenue)}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Chiết khấu sàn:</span>
                    <span className="font-bold text-primary">{vendor.commissionRate}%</span>
                 </div>
              </div>
              <Button asChild variant="outline" className="w-full rounded-xl gap-2">
                <Link href={`/shop/${vendor.storeSlug}`} target="_blank"><ExternalLink className="w-4 h-4" /> Xem shop thực tế</Link>
              </Button>
            </div>
          </Card>

          <Card className="lg:col-span-2 bg-card/30 border-white/5 rounded-[2rem] overflow-hidden">
             <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 border-b border-white/5 gap-4">
                <div>
                   <CardTitle className="text-xl italic">Sản phẩm của bạn</CardTitle>
                   <CardDescription>Đăng và quản lý kho hàng nhanh.</CardDescription>
                </div>
                {vendor.status === 'approved' && (
                  <div className="flex gap-2">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full h-10 px-6 gap-2 border-primary/30 text-primary hover:bg-primary/10">
                          <FileSpreadsheet className="w-4 h-4" /> Nhập từ Excel
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                         <DialogHeader>
                            <DialogTitle className="font-headline italic">NHẬP SẢN PHẨM HÀNG LOẠT</DialogTitle>
                            <DialogDescription>Tải lên file Excel mẫu chứa danh sách sản phẩm của bạn.</DialogDescription>
                         </DialogHeader>
                         <div className="py-12 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/5 space-y-4">
                            <Upload className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                            <div className="space-y-1">
                               <p className="font-bold">Nhấn để chọn hoặc kéo thả file</p>
                               <p className="text-xs text-muted-foreground">Hỗ trợ định dạng .xlsx, .csv (Max 5MB)</p>
                            </div>
                            <Button variant="link" className="text-xs text-primary underline">Tải file Excel mẫu tại đây</Button>
                         </div>
                         <DialogFooter>
                            <Button className="w-full rounded-xl h-12 font-bold" onClick={handleImportExcel} disabled={loading}>
                               {loading ? <Loader2 className="animate-spin mr-2" /> : "Bắt đầu tải lên"}
                            </Button>
                         </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                      <DialogTrigger asChild>
                        <Button className="rounded-full h-10 px-6 gap-2 shadow-lg shadow-primary/20">
                          <Plus className="w-4 h-4" /> Đăng SP mới
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xl">
                        <form onSubmit={handleAddProduct}>
                          <DialogHeader><DialogTitle>THÊM SẢN PHẨM MỚI</DialogTitle></DialogHeader>
                          <div className="space-y-4 py-4">
                             <div className="space-y-2">
                                <Label>Tên sản phẩm</Label>
                                <Input name="name" required placeholder="Tên sản phẩm..." />
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Danh mục</Label>
                                  <Select name="category" defaultValue="Điện tử">
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Điện tử">Điện tử</SelectItem>
                                      <SelectItem value="Thời trang">Thời trang</SelectItem>
                                      <SelectItem value="Gia dụng">Gia dụng</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label>Giá bán (VNĐ)</Label>
                                  <Input name="price" type="number" required placeholder="500000" />
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label>Mô tả ngắn</Label>
                                <Textarea name="description" placeholder="Thông tin sản phẩm..." />
                             </div>
                          </div>
                          <DialogFooter>
                             <Button type="submit" className="w-full rounded-xl h-12 font-bold">Gửi duyệt ngay</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
             </CardHeader>
             <CardContent className="p-0">
                {myProducts.length > 0 ? (
                  <div className="divide-y divide-white/5">
                     {myProducts.slice(0, 5).map((p) => (
                       <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-lg relative overflow-hidden border border-white/10">
                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                             </div>
                             <div>
                                <p className="text-sm font-bold truncate max-w-[150px] md:max-w-[250px]">{p.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{p.category} • {formatVND(p.price)}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <Badge variant={p.status === 'approved' ? 'default' : 'secondary'} className="rounded-full text-[8px] h-5">
                                {p.status === 'approved' ? 'Đang bán' : 'Chờ duyệt'}
                             </Badge>
                             <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteVendorProduct(p.id)}>
                                <Trash2 className="w-4 h-4" />
                             </Button>
                          </div>
                       </div>
                     ))}
                     {myProducts.length > 5 && (
                       <div className="p-4 text-center">
                          <Link href="/vendor/products" className="text-xs text-primary font-bold hover:underline">Xem tất cả {myProducts.length} sản phẩm &rarr;</Link>
                       </div>
                     )}
                  </div>
                ) : (
                  <div className="p-12 text-center space-y-4">
                     <Package className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                     <p className="text-sm text-muted-foreground italic">Bạn chưa có sản phẩm nào được đăng bán.</p>
                  </div>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest">
          Marketplace Opportunity
        </div>
        <h1 className="text-5xl md:text-6xl font-black font-headline italic tracking-tighter leading-none">TRỞ THÀNH NHÀ BÁN HÀNG</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
          Kết nối với hàng triệu khách hàng và bứt phá doanh thu cùng hệ sinh thái Marketplace chuyên nghiệp của S-Com Hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-card/40 border border-white/5 rounded-3xl p-6 space-y-8 sticky top-24">
              <h3 className="font-bold text-lg border-b border-white/5 pb-4">Quyền lợi Vendor</h3>
              <BenefitItem title="Tự chủ kinh doanh" desc="Tự đăng sản phẩm, quản lý kho và giá bán." />
              <BenefitItem title="Traffic khổng lồ" desc="Tiếp cận lượng người dùng sẵn có của nền tảng." />
              <BenefitItem title="Hoa hồng thấp" desc="Chỉ từ 5-10% phí nền tảng, thanh toán T+7." />
              <BenefitItem title="Hệ thống chuyên nghiệp" desc="Công cụ quản trị, phân tích đơn hàng chi tiết." />
           </div>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-card/50 border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-headline">HỒ SƠ ĐĂNG KÝ</h2>
                <div className="flex gap-2">
                  {[1, 2, 3].map(s => (
                    <div key={s} className={`h-1.5 w-8 rounded-full ${step >= s ? 'bg-primary' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Thông tin gian hàng</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên cửa hàng (Store Name)</Label>
                        <Input 
                          placeholder="VD: Mobile World, Shop ABC..." 
                          value={formData.storeName}
                          onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                          className="h-12 rounded-xl bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mô tả ngắn</Label>
                        <Textarea 
                          placeholder="Giới thiệu về các mặt hàng bạn kinh doanh..." 
                          className="rounded-xl min-h-[100px] bg-background/50"
                          value={formData.storeDescription}
                          onChange={(e) => setFormData({...formData, storeDescription: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setStep(2)} className="w-full h-14 rounded-2xl font-bold text-lg group">
                    Tiếp tục bước 2 <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Thông tin Pháp lý</Label>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setFormData({...formData, businessType: 'individual'})}
                          className={`p-6 rounded-2xl border text-left transition-all ${formData.businessType === 'individual' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/5 bg-white/5 opacity-60'}`}
                        >
                          <UserIcon className={`w-6 h-6 mb-3 ${formData.businessType === 'individual' ? 'text-primary' : ''}`} />
                          <p className="font-bold">Cá nhân</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Dành cho hộ kinh doanh cá thể hoặc cá nhân.</p>
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, businessType: 'company'})}
                          className={`p-6 rounded-2xl border text-left transition-all ${formData.businessType === 'company' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/5 bg-white/5 opacity-60'}`}
                        >
                          <Building2 className={`w-6 h-6 mb-3 ${formData.businessType === 'company' ? 'text-primary' : ''}`} />
                          <p className="font-bold">Doanh nghiệp</p>
                          <p className="text-[10px] text-muted-foreground mt-1">Dành cho các công ty, tổ chức có MST.</p>
                        </button>
                      </div>
                      <div className="space-y-2">
                        <Label>Số CCCD / Mã số thuế (MST)</Label>
                        <Input 
                          placeholder="Nhập số định danh..." 
                          value={formData.idNumber}
                          onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                          className="h-12 rounded-xl bg-background/50"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep(1)} className="h-14 rounded-2xl px-8">Quay lại</Button>
                    <Button onClick={() => setStep(3)} className="flex-1 h-14 rounded-2xl font-bold text-lg">Tiếp tục bước 3</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase font-bold text-muted-foreground">Tài khoản nhận tiền (Payout)</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tên ngân hàng</Label>
                        <Input 
                          placeholder="VD: Vietcombank, Techcombank..." 
                          value={formData.bankName}
                          onChange={(e) => setFormData({...formData, bankName: e.target.value})}
                          className="h-12 rounded-xl bg-background/50"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Số tài khoản</Label>
                          <Input 
                            placeholder="01234567..." 
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            className="h-12 rounded-xl bg-background/50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tên chủ tài khoản</Label>
                          <Input 
                            placeholder="VIET IN HOA..." 
                            value={formData.accountName}
                            onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                            className="h-12 rounded-xl bg-background/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                      Bằng cách nhấn đăng ký, bạn đồng ý với các <strong>Điều khoản Nhà bán hàng</strong> của S-Com Hub. 
                      Hệ thống sẽ thực hiện đối soát và chi trả doanh thu vào thứ 2 hàng tuần cho các đơn hàng hoàn thành trên 7 ngày (T+7).
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="ghost" onClick={() => setStep(2)} className="h-14 rounded-2xl px-8">Quay lại</Button>
                    <Button 
                      onClick={handleRegister} 
                      disabled={loading}
                      className="flex-1 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/30"
                    >
                      {loading ? <Loader2 className="animate-spin mr-2" /> : "Hoàn tất đăng ký"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
      <div>
        <h5 className="font-bold text-sm">{title}</h5>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
