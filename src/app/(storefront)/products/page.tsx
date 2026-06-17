
import { Metadata } from "next";
import { ProductsPageContent } from "./ProductsPageContent";

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm | S-Com Hub',
  description: 'Khám phá bộ sưu tập sản phẩm công nghệ, thời trang và gia dụng chất lượng cao tại S-Com Hub.',
  openGraph: {
    title: 'Sản phẩm | S-Com Hub',
    description: 'Mua sắm các sản phẩm chính hãng với giá ưu đãi cực sốc.',
    type: 'website',
  }
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
