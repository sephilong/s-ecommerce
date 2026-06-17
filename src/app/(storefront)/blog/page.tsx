
import { Metadata } from "next";
import { BlogListPageContent } from "./BlogListPageContent";

export const metadata: Metadata = {
  title: 'Blog & Tin tức | S-Com Hub',
  description: 'Cập nhật tin tức công nghệ, xu hướng TMĐT và hướng dẫn kinh doanh hiệu quả từ chuyên gia S-Com Hub.',
  openGraph: {
    title: 'Blog & Tin tức | S-Com Hub',
    description: 'Cập nhật tin tức công nghệ, xu hướng TMĐT và hướng dẫn kinh doanh hiệu quả.',
    type: 'website',
  }
};

export default function BlogListPage() {
  return <BlogListPageContent />;
}
