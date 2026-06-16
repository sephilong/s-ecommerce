
import { getTenantConfig } from "@/lib/tenant";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, RefreshCcw, Store, Star, MessageSquare } from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  
  const product = tenant.products.find(p => p.slug === slug);
  if (!product) notFound();

  // Giả lập thông tin Vendor cho sản phẩm
  const mockVendor = {
    id: "v-1",
    name: "S-Com Official Store",
    rating: 4.9,
    followers: "12.5k",
    joined: "2 năm trước"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-card shadow-2xl">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px]">
                {product.category}
              </Badge>
              <span className="text-xs text-muted-foreground">• Đã bán 1.2k</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline leading-tight italic tracking-tighter">
              {product.name}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black text-primary italic">
                {formatVND(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through decoration-primary/30">
                  {formatVND(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="pt-8 border-t border-white/5 space-y-6">
            <AddToCartButton product={product} size="lg" className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20 italic" />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <BenefitItem icon={<Truck />} text="Giao hỏa tốc" />
              <BenefitItem icon={<ShieldCheck />} text="Bảo hành 12th" />
              <BenefitItem icon={<RefreshCcw />} text="7 ngày đổi trả" />
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Section */}
      <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 md:p-10 mb-16 shadow-xl relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
         <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-6">
               <div className="h-20 w-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                  <Store className="w-10 h-10 text-primary" />
               </div>
               <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold font-headline italic">{mockVendor.name}</h3>
                    <Badge className="bg-primary/20 text-primary text-[10px] border-none">Official</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-500 font-bold"><Star className="w-3 h-3 fill-yellow-500" /> {mockVendor.rating}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground font-medium">{mockVendor.followers} Người theo dõi</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground font-medium">Tham gia {mockVendor.joined}</span>
                  </div>
               </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
               <Button variant="outline" className="flex-1 md:w-40 rounded-full h-12 gap-2 border-white/10 hover:bg-white/5 font-bold">
                  <MessageSquare className="w-4 h-4" /> Chat ngay
               </Button>
               <Button asChild className="flex-1 md:w-40 rounded-full h-12 gap-2 shadow-lg shadow-primary/20 font-bold">
                  <Link href={`/shop/${mockVendor.id}`}><Store className="w-4 h-4" /> Xem shop</Link>
               </Button>
            </div>
         </div>
      </div>

      {/* Technical Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold font-headline italic border-b border-white/5 pb-4">MÔ TẢ CHI TIẾT</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-loose">
               <p>Sản phẩm {product.name} là sự kết hợp hoàn hảo giữa công nghệ hiện đại và thiết kế sang trọng. Được chế tác từ những vật liệu cao cấp nhất, sản phẩm mang lại trải nghiệm người dùng vượt trội.</p>
               <ul className="space-y-4 my-6">
                  <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Hiệu năng mạnh mẽ với vi xử lý thế hệ mới nhất.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Thiết kế mỏng nhẹ, tinh tế trong từng đường nét.</li>
                  <li className="flex gap-3"><span className="text-primary font-bold">✓</span> Pin dung lượng cao, hỗ trợ sạc nhanh siêu tốc.</li>
               </ul>
               <p>Cam kết hàng chính hãng 100%, bảo hành toàn quốc thông qua hệ thống của S-Com Hub.</p>
            </div>
         </div>
         <div className="space-y-8">
            <h2 className="text-2xl font-bold font-headline italic border-b border-white/5 pb-4">THÔNG SỐ</h2>
            <div className="bg-white/5 rounded-3xl p-6 space-y-4">
               <SpecRow label="Thương hiệu" value="S-Com Elite" />
               <SpecRow label="Bảo hành" value="12 Tháng" />
               <SpecRow label="Tình trạng" value="Mới 100%" />
               <SpecRow label="Xuất xứ" value="Việt Nam" />
            </div>
         </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
      <div className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest">{text}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function SpecItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
