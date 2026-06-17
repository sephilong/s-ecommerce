
/**
 * FILE NÀY ĐÃ ĐƯỢC VÔ HIỆU HÓA ĐỂ TRÁNH XUNG ĐỘT ĐỊNH TUYẾN.
 * Quy trình thanh toán chính thức nằm tại: /checkout-vendor
 * 
 * Vui lòng xóa file này và cả thư mục src/app/checkout/ nếu lỗi vẫn xuất hiện.
 */
import { redirect } from 'next/navigation';

export default function CheckoutLegacyRedirect() {
  redirect('/checkout-vendor');
}
