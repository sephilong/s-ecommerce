
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-32 text-center space-y-8">
      <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary animate-in zoom-in-50 duration-500">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Đặt hàng thành công!</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Cảm ơn bạn đã tin tưởng mua sắm tại S-Com Hub. Mã đơn hàng của bạn là <span className="text-primary font-bold">#SCHUB-12345</span>.
          Chúng tôi sẽ sớm gửi email xác nhận và thông tin vận chuyển đến bạn.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 pt-8">
        <Button asChild size="lg" className="rounded-full px-8 gap-2">
          <Link href="/products">Tiếp tục mua sắm <ArrowRight className="w-4 h-4" /></Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link href="/account/orders">Xem đơn hàng</Link>
        </Button>
      </div>
    </div>
  );
}
