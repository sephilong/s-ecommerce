
/**
 * Tệp này đã bị vô hiệu hóa để tránh xung đột với src/app/(storefront)/checkout/page.tsx.
 * Next.js không cho phép hai trang song song giải quyết cùng một đường dẫn.
 * Toàn bộ logic thanh toán hiện nằm trong nhóm (storefront) để thừa hưởng Layout chung.
 */

export const dynamic = 'force-dynamic';

// Không export default component ở đây để Next.js không nhận diện đây là một trang
export function Placeholder() {
  return null;
}
