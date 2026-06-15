
import Link from "next/link";
import { User, ShoppingBag, Heart, Gift, LogOut } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Hồ sơ cá nhân", icon: <User className="w-4 h-4" />, href: "/account" },
    { name: "Đơn hàng của tôi", icon: <ShoppingBag className="w-4 h-4" />, href: "/account/orders" },
    { name: "Sản phẩm yêu thích", icon: <Heart className="w-4 h-4" />, href: "/account/wishlist" },
    { name: "Chương trình Affiliate", icon: <Gift className="w-4 h-4" />, href: "/account/affiliate" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Account Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-headline mb-6">Tài khoản</h2>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors text-sm font-medium"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-medium mt-4">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </aside>

        {/* Account Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
