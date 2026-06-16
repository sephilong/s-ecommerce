
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * FILE NÀY ĐÃ ĐƯỢC CHUYỂN HƯỚNG SANG /checkout-vendor 
 * ĐỂ LOẠI BỎ LỖI "TWO PARALLEL PAGES" CỦA NEXT.JS
 */
export default function CheckoutRootRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/checkout-vendor");
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center italic text-muted-foreground animate-pulse">
      Đang chuyển hướng tới trang thanh toán an toàn...
    </div>
  );
}
