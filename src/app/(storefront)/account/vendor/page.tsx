
"use client";

import { useState, useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useVendorStore, Vendor } from "@/store/vendorStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function VendorOnboardingPage() {
  const { profile } = useUserStore();
  const { getVendorByUserId, registerVendor } = useVendorStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const vendor = profile ? getVendorByUserId(profile.email) : undefined; // Giả định dùng email làm userId

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
      createdAt: new Date().toISOString()
    } as Vendor;

    setTimeout(() => {
      registerVendor(newVendor);
      setLoading(false);
      toast({ title: "Đã gửi đơn đăng ký!", description: "Chúng tôi sẽ phê duyệt yêu cầu của bạn trong vòng 24-48h." });
    }, 1500);
  };

  if (vendor) {
    return (
      <div className="max-w-4xl mx-auto py-12 space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            {vendor.status === 'approved' ? <CheckCircle2 className="w-10 h-10" /> : <Clock className="w-10 h-10" />}
          </div>
          <h1 className="text-3xl font-black font-headline italic tracking-tighter">TRẠNG THÁI CỬA HÀNG</h1>
          <p className="text-muted-foreground text-lg">
            {vendor.status === 'approved' 
              ? "Chúc mừng! Cửa hàng của bạn đã sẵn sàng hoạt động." 
              : "Yêu cầu đăng ký nhà bán hàng của bạn đang được hội đồng Admin xét duyệt."}
          </p>
        </div>

        <Card className="bg-card/30 border-white/5 p-8 rounded-[2rem]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <Store className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{vendor.storeName}</h3>
                <p className="text-xs text-muted-foreground">Mã nhà bán: {vendor.id}</p>
              </div>
            </div>
            <div className="flex gap-3">
              {vendor.status === 'approved' ? (
                <Button asChild className="rounded-full px-8 h-12 font-bold shadow-xl shadow-primary/20">
                  <Link href="/vendor/dashboard">Truy cập Kênh Người Bán <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
              ) : (
                <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-6 py-2 rounded-full font-bold">Đang chờ duyệt</Badge>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OnboardingStep icon={<ShieldCheck />} title="Xác minh" desc="Admin kiểm tra giấy tờ tùy thân và MST." status={vendor.status === 'approved' ? 'done' : 'current'} />
          <OnboardingStep icon={<Store />} title="Thiết lập" desc="Cấu hình Logo, Banner và mô tả shop." status={vendor.status === 'approved' ? 'done' : 'next'} />
          <OnboardingStep icon={<Rocket />} title="Bán hàng" desc="Đăng sản phẩm và tiếp cận khách hàng." status={vendor.status === 'approved' ? 'done' : 'next'} />
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
                      {loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
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

function OnboardingStep({ icon, title, desc, status }: any) {
  const isDone = status === 'done';
  const isCurrent = status === 'current';
  
  return (
    <div className={`p-6 rounded-3xl border transition-all ${isCurrent ? 'bg-primary/5 border-primary/30' : 'bg-white/5 border-white/5 opacity-60'}`}>
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${isDone ? 'bg-green-500/20 text-green-500' : isCurrent ? 'bg-primary/20 text-primary' : 'bg-white/10'}`}>
        {isDone ? <CheckCircle2 className="w-5 h-5" /> : icon}
      </div>
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-[10px] text-muted-foreground leading-relaxed">{desc}</p>
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
