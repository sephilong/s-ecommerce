/**
 * TỆP NÀY ĐÃ BỊ VÔ HIỆU HÓA ĐỂ TRÁNH XUNG ĐỘT ĐỊNH TUYẾN
 * 
 * Next.js không cho phép hai tệp page.tsx cùng giải quyết một đường dẫn.
 * Trang thanh toán chính thức hiện nằm tại: src/app/(storefront)/checkout/page.tsx
 * 
 * Chúng tôi giữ tệp này ở trạng thái không xuất bản (no default export) để Next.js 
 * không coi đây là một trang hợp lệ, từ đó giải quyết lỗi "two parallel pages".
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Không có "export default" ở đây.
