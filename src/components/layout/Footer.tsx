
"use client";

import Link from "next/link";
import { Tenant } from "@/lib/store-data";
import { useVendorStore } from "@/store/vendorStore";

export function Footer({ tenant }: { tenant: Tenant }) {
  const { currentVendor } = useVendorStore();

  const name = currentVendor ? currentVendor.storeName : tenant.name;
  const description = currentVendor ? currentVendor.storeDescription : tenant.description;

  return (
    <footer className="border-t border-white/5 pt-20 pb-10 bg-card/20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="text-2xl font-bold font-headline gradient-text italic tracking-tighter uppercase">{name}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Cửa hàng</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/products" className="hover:text-primary transition-colors">Tất cả sản phẩm</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Chính sách đại lý</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Hỗ trợ</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Quy định đổi trả</Link></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Liên hệ</h4>
          {currentVendor ? (
            <>
              <p className="text-sm text-muted-foreground">Chủ sở hữu: {currentVendor.accountName}</p>
              <p className="text-sm text-muted-foreground">Pháp lý: {currentVendor.businessType === 'company' ? 'Doanh nghiệp' : 'Cá nhân'}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">Email: contact@scomhub.vn</p>
              <p className="text-sm text-muted-foreground">Hotline: 1900 1234</p>
            </>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-20 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
        <p>© 2025 {name} - Powered by S-Com Hub Platform.</p>
      </div>
    </footer>
  );
}
