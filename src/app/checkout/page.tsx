
/**
 * FILE VÔ HIỆU HÓA ĐỂ TRÁNH XUNG ĐỘT ĐỊNH TUYẾN.
 * Quy trình thanh toán chính thức nằm tại: /checkout-vendor
 */
import { redirect } from 'next/navigation';

export default function CheckoutLegacyRedirect() {
  redirect('/checkout-vendor');
}
