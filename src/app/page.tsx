import { getTenantBySubdomain, formatVND } from "@/lib/store-data";
import { Header } from "@/components/storefront/Header";
import { ProductCard } from "@/components/storefront/ProductCard";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  const tenant = getTenantBySubdomain("demo");
  const heroImage = PlaceHolderImages[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Header tenant={tenant} />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover opacity-40"
              priority
              data-ai-hint="electronics banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
                <Star className="w-4 h-4 fill-primary" />
                <span>Thương hiệu uy tín hàng đầu</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-headline leading-tight">
                Nâng tầm <span className="gradient-text">Phong cách Sống</span> Công nghệ
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Khám phá bộ sưu tập những sản phẩm công nghệ mới nhất, thiết kế tinh tế và hiệu năng vượt trội tại {tenant.name}.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 gap-2 group">
                  Mua sắm ngay
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Tìm hiểu thêm
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bar */}
        <section className="border-y border-white/5 bg-card/30 py-8">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Giao hàng hỏa tốc</h3>
                <p className="text-sm text-muted-foreground">Nhận hàng trong vòng 2-5 ngày làm việc.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Bảo hành chính hãng</h3>
                <p className="text-sm text-muted-foreground">Cam kết 100% sản phẩm chính hãng cao cấp.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">Đổi trả dễ dàng</h3>
                <p className="text-sm text-muted-foreground">Chính sách đổi trả linh hoạt trong 7 ngày.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold font-headline">Sản phẩm Nổi bật</h2>
                <p className="text-muted-foreground">Những lựa chọn tốt nhất dành cho bạn.</p>
              </div>
              <Button variant="link" className="text-primary p-0 h-auto font-semibold gap-1">
                Xem tất cả sản phẩm
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tenant.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="container mx-auto px-4 py-10">
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center space-y-6">
            <div className="absolute inset-0 bg-primary/10 -z-10" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/20 -z-10" />
            
            <h2 className="text-3xl md:text-5xl font-bold font-headline max-w-2xl mx-auto">
              Trở thành <span className="text-primary">Merchant</span> trên nền tảng của chúng tôi
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Bắt đầu kinh doanh ngay hôm nay với công nghệ SaaS Storefront hiện đại nhất tại Việt Nam.
            </p>
            <div className="pt-4">
              <Button size="lg" className="rounded-full h-14 px-10 text-lg">
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 pt-20 pb-10 bg-card/20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="text-2xl font-bold font-headline gradient-text">S-Com Hub</div>
            <p className="text-sm text-muted-foreground">
              Giải pháp thương mại điện tử thế hệ mới dành cho doanh nghiệp Việt Nam.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Sản phẩm</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Điện thoại</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Máy tính bảng</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Laptop</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Phụ kiện</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Hỗ trợ</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Theo dõi</h4>
            <div className="flex gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">FB</div>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">IG</div>
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">TW</div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2025 S-Com Hub Platform. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">Điều khoản</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bảo mật</Link>
          </div>
        </div>
      </footer>

      <ChatWidget tenant={tenant} />
    </div>
  );
}
