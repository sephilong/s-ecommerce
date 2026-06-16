
import { getTenantConfig } from "@/lib/tenant";
import { headers } from "next/headers";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatVND } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Truck, 
  ShieldCheck, 
  RefreshCcw, 
  Store, 
  Star, 
  MessageSquare, 
  ArrowRight, 
  Info,
  Package,
  Heart,
  ArrowRightLeft,
  Share2
} from "lucide-react";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product/ProductCard";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const headerList = await headers();
  const host = headerList.get("host");
  const subdomain = host?.split('.')[0] || "demo";
  const tenant = await getTenantConfig(subdomain);
  
  const product = tenant.products.find(p => p.slug === slug);
  if (!product) notFound();

  // Mock Gallery
  const images = [
    product.image,
    "https://picsum.photos/seed/p2/800/800",
    "https://picsum.photos/seed/p3/800/800",
    "https://picsum.photos/seed/p4/800/800",
  ];

  // Mock Related Products
  const relatedProducts = tenant.products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-12 space-y-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/5 bg-card shadow-2xl group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute top-4 right-4 flex flex-col gap-2">
               <Button size="icon" variant="secondary" className="rounded-full shadow-xl"><Share2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-primary/50 transition-all bg-card">
                 <Image src={img} alt="Thumb" fill className="object-cover opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-widest text-[10px] px-3 py-1">
                  {product.category}
                </Badge>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> 4.9 (1.2k Đánh giá)
                </span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black font-headline leading-tight italic tracking-tighter uppercase">
              {product.name}
            </h1>

            <div className="flex items-center gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-primary italic tracking-tighter leading-none">
                  {formatVND(product.price)}
                </span>
                {product.compareAtPrice && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-muted-foreground line-through decoration-primary/30">
                      {formatVND(product.compareAtPrice)}
                    </span>
                    <Badge className="bg-red-500 text-white border-none text-[10px] font-black italic">
                      -{Math.round((1 - product.price/product.compareAtPrice)*100)}%
                    </Badge>
                  </div>
                )}
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col">
                 <p className="text-[10px] uppercase font-black text-muted-foreground">Tình trạng</p>
                 <p className="text-sm font-bold text-green-500 flex items-center gap-1 mt-1">
                   <Package className="w-3 h-3" /> Còn hàng (Sẵn có)
                 </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             {/* Variant Selector Mock */}
             <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chọn màu sắc</Label>
                <div className="flex gap-3">
                   {['#9757EA', '#3B82F6', '#111'].map(color => (
                     <div key={color} className="h-10 w-10 rounded-full border-2 border-white/10 hover:border-primary transition-all cursor-pointer p-1">
                        <div className="h-full w-full rounded-full" style={{ backgroundColor: color }} />
                     </div>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-2xl flex items-center gap-3">
                   <Info className="w-5 h-5 text-orange-500" />
                   <p className="text-xs font-bold text-orange-500 uppercase tracking-tighter italic">Cảnh báo: Chỉ còn 8 sản phẩm trong kho!</p>
                </div>
                
                <div className="flex gap-4">
                   <AddToCartButton product={product} size="lg" className="flex-1 h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 italic uppercase tracking-tighter" />
                   <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10 hover:bg-red-500/10 hover:text-red-500 transition-all">
                      <Heart className="w-6 h-6" />
                   </Button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <BenefitItem icon={<Truck />} text="Giao hỏa tốc" sub="2-4 ngày" />
            <BenefitItem icon={<ShieldCheck />} text="Bảo hành 12th" sub="Chính hãng" />
            <BenefitItem icon={<RefreshCcw />} text="7 ngày đổi trả" sub="Dễ dàng" />
          </div>
        </div>
      </div>

      {/* Details & Reviews Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <div className="lg:col-span-8">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-transparent border-b border-white/5 w-full justify-start rounded-none h-14 p-0 gap-8">
                 <TabsTrigger value="description" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 text-xs font-black uppercase tracking-[0.2em] italic">Mô tả sản phẩm</TabsTrigger>
                 <TabsTrigger value="spec" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 text-xs font-black uppercase tracking-[0.2em] italic">Thông số kỹ thuật</TabsTrigger>
                 <TabsTrigger value="reviews" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 text-xs font-black uppercase tracking-[0.2em] italic">Đánh giá (120)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="py-10 prose prose-invert max-w-none space-y-6">
                 <p className="text-lg leading-relaxed text-muted-foreground">{product.description}</p>
                 <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/5 my-8">
                    <Image src={product.image} alt="Detail" fill className="object-cover" />
                 </div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">Đặc điểm nổi bật</h3>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    <li className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-sm font-bold">Thiết kế đột phá, dẫn đầu xu hướng 2025</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-sm font-bold">Hiệu năng mạnh mẽ cho mọi tác vụ</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-sm font-bold">Thời lượng pin bền bỉ ấn tượng</span>
                    </li>
                    <li className="bg-white/5 p-4 rounded-2xl flex items-center gap-3 border border-white/5">
                       <div className="h-2 w-2 rounded-full bg-primary" />
                       <span className="text-sm font-bold">Chế độ bảo hành Premium toàn quốc</span>
                    </li>
                 </ul>
              </TabsContent>

              <TabsContent value="spec" className="py-10">
                 <div className="bg-card/40 rounded-3xl border border-white/5 overflow-hidden">
                    <SpecRow label="Thương hiệu" value="S-Com Hub" />
                    <SpecRow label="Dòng sản phẩm" value="Elite Series" />
                    <SpecRow label="Năm ra mắt" value="2025" />
                    <SpecRow label="Trọng lượng" value="1.2 kg" />
                    <SpecRow label="Chất liệu" value="Hợp kim nhôm nguyên khối" />
                    <SpecRow label="Xuất xứ" value="Việt Nam / Chính hãng" />
                 </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-10 space-y-12">
                 <div className="flex flex-col md:flex-row gap-8 items-center bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                    <div className="text-center md:border-r border-white/10 md:pr-12">
                       <h4 className="text-6xl font-black italic tracking-tighter text-primary">4.9</h4>
                       <div className="flex justify-center gap-1 my-2">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                       </div>
                       <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">1,240 Đánh giá</p>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                       {[5, 4, 3, 2, 1].map(star => (
                         <div key={star} className="flex items-center gap-3 group">
                            <span className="text-xs font-bold w-4">{star}</span>
                            <Star className="w-3 h-3 fill-muted-foreground text-muted-foreground group-hover:fill-yellow-500 transition-colors" />
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-primary rounded-full" style={{ width: star === 5 ? '85%' : star === 4 ? '12%' : '1%' }} />
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="md:pl-8">
                       <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 italic">Đánh giá sản phẩm</Button>
                    </div>
                 </div>

                 <div className="space-y-8">
                    {[1, 2].map(i => (
                      <div key={i} className="space-y-4 pb-8 border-b border-white/5">
                         <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                               <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary italic">K</div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-sm">Khách hàng ẩn danh</span>
                                     <Badge className="bg-green-500/10 text-green-500 text-[8px] border-none px-1.5 font-black italic">ĐÃ MUA HÀNG</Badge>
                                  </div>
                                  <div className="text-[10px] text-muted-foreground uppercase mt-0.5">12/05/2025 • Màu sắc: Tím Midnight</div>
                               </div>
                            </div>
                            <div className="flex gap-0.5">
                               {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-yellow-500 text-yellow-500" />)}
                            </div>
                         </div>
                         <p className="text-sm leading-relaxed text-foreground/90 italic">"Sản phẩm quá tuyệt vời, đóng gói cẩn thận và giao hàng siêu tốc. Mình rất hài lòng với chất lượng phục vụ của shop!"</p>
                         <div className="flex gap-2">
                            {[1, 2].map(j => (
                              <div key={j} className="h-16 w-16 rounded-xl overflow-hidden border border-white/5">
                                 <Image src={`https://picsum.photos/seed/rev${j}/200/200`} alt="Review" width={64} height={64} className="object-cover" />
                              </div>
                            ))}
                         </div>
                      </div>
                    ))}
                 </div>
              </TabsContent>
            </Tabs>
         </div>

         {/* Sidebar: Shop Card */}
         <div className="lg:col-span-4 space-y-8">
            <div className="bg-card/40 border border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                     <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1">
                        <Store className="w-7 h-7 text-primary" />
                     </div>
                     <div>
                        <h4 className="font-black italic text-lg tracking-tighter uppercase leading-none">S-COM HUB STORE</h4>
                        <p className="text-[10px] text-muted-foreground font-bold mt-1">Hà Nội • Online 2h trước</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                     <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground">Xếp hạng</p>
                        <p className="font-black italic">4.9/5.0</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[10px] uppercase font-black text-muted-foreground">Sản phẩm</p>
                        <p className="font-black italic">156+</p>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     <Button variant="outline" className="rounded-full h-11 border-white/10 hover:bg-white/5 font-bold italic uppercase text-xs">
                        <MessageSquare className="w-3.5 h-3.5 mr-2" /> Chat với người bán
                     </Button>
                     <Button className="rounded-full h-11 font-bold italic uppercase text-xs">
                        <Store className="w-3.5 h-3.5 mr-2" /> Xem gian hàng
                     </Button>
                  </div>
               </div>
            </div>

            <div className="p-6 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
               <h5 className="font-black italic text-xs uppercase tracking-[0.2em] text-indigo-400">Cam kết an tâm</h5>
               <div className="space-y-4">
                  <PolicyItem title="Trả hàng 7 ngày" desc="Nếu có lỗi từ nhà sản xuất." />
                  <PolicyItem title="Kiểm tra hàng" desc="Kiểm tra trước khi thanh toán." />
                  <PolicyItem title="Bảo mật 100%" desc="Giao dịch an toàn & bảo mật." />
               </div>
            </div>
         </div>
      </div>

      {/* Related Products Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Sản phẩm liên quan</h2>
            <p className="text-muted-foreground text-sm">Có thể bạn cũng thích những sản phẩm này.</p>
          </div>
          <Button variant="link" className="text-primary font-bold italic uppercase text-xs tracking-widest gap-2">
            Xem tất cả <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BenefitItem({ icon, text, sub }: { icon: React.ReactNode, text: string, sub: string }) {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-all">
      <div className="w-8 h-8 text-primary mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">{text}</span>
      <span className="text-[9px] text-muted-foreground mt-1 font-bold italic">{sub}</span>
    </div>
  );
}

function SpecRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

function PolicyItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-3">
       <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Check className="w-3 h-3 text-indigo-400" />
       </div>
       <div>
          <p className="text-xs font-bold text-foreground/90">{title}</p>
          <p className="text-[10px] text-muted-foreground leading-tight">{desc}</p>
       </div>
    </div>
  );
}
