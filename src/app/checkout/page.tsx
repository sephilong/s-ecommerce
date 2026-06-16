/**
 * TỆP NÀY ĐÃ BỊ VÔ HIỆU HÓA
 * Để tránh xung đột định tuyến với src/app/(storefront)/checkout/page.tsx
 * Next.js không cho phép hai trang cùng trỏ về một URL /checkout.
 */

export const dynamic = 'force-dynamic';

// Không export default bất kỳ component nào ở đây để gỡ bỏ định tuyến
export default function ConflictResolverPage() {
  return null;
}
