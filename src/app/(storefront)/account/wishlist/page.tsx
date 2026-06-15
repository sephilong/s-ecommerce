
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline">Sản phẩm yêu thích</h1>
        <p className="text-muted-foreground">Lưu trữ các sản phẩm bạn quan tâm để mua sau.</p>
      </div>

      <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-white/10 space-y-4">
        <Heart className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
        <p className="text-muted-foreground">Danh sách yêu thích của bạn đang trống.</p>
        <Button asChild className="rounded-full">
          <Link href="/products">Khám phá ngay</Link>
        </Button>
      </div>
    </div>
  );
}
