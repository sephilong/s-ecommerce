/**
 * TỆP NÀY ĐÃ BỊ VÔ HIỆU HÓA ĐỂ TRÁNH XUNG ĐỘT ĐỊNH TUYẾN (ROUTE CONFLICT)
 * 
 * Lỗi: "You cannot have two parallel pages that resolve to the same path. Please check /(storefront)/checkout and /checkout."
 * 
 * Giải pháp: 
 * Trang thanh toán chính thức đã được chuyển vào nhóm giao diện cửa hàng: 
 * ĐỊA CHỈ: src/app/(storefront)/checkout/page.tsx
 * 
 * Tệp này hiện tại không xuất bản bất kỳ Page Component nào để Next.js bỏ qua nó khi xây dựng hệ thống định tuyến.
 */

export const dynamic = 'force-dynamic';

export default function InertPage() {
  return null;
}
