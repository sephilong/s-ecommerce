
/**
 * FILE NÀY ĐÃ BỊ VÔ HIỆU HÓA ĐỂ TRÁNH LỖI "TWO PARALLEL PAGES".
 * TRANG THANH TOÁN CHÍNH HIỆN TẠI LÀ /checkout-vendor 
 */
import { redirect } from "next/navigation";

export default function RedirectToVendorCheckout() {
  redirect("/checkout-vendor");
  return null;
}
