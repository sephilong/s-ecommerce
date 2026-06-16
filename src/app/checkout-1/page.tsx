
import { redirect } from 'next/navigation';

/**
 * TRANG NÀY ĐÃ ĐƯỢC DI CHUYỂN VÀ ĐỔI TÊN THÀNH /checkout-vendor 
 * ĐỂ TRÁNH XUNG ĐỘT ROUTE.
 */
export default function CheckoutRedirectPage() {
  redirect('/checkout-vendor');
}
