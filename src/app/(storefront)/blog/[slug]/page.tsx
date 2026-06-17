
import { BlogDetailClient } from "./BlogDetailClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { getTenantConfig } from "@/lib/tenant";

// Helper to get posts outside of hook for Server Component
async function getPost(slug: string) {
  const posts = [
    {
      id: 'post-1',
      title: 'S-Com Hub: Tương lai của TMĐT đa nền tảng',
      slug: 'tuong-lai-tmdt-da-nen-tang',
      excerpt: 'Tìm hiểu cách S-Com Hub đang thay đổi bộ mặt bán lẻ trực tuyến tại Việt Nam.',
      content: 'Chúng tôi tự hào giới thiệu một nền tảng không chỉ là nơi bán hàng, mà là một hệ sinh thái toàn diện, kết nối trực tiếp nhà sản xuất, đại lý và khách hàng cuối. Với công nghệ AI tích hợp, S-Com Hub giúp tối ưu hóa hành trình mua sắm và gia tăng doanh thu cho mọi đối tác tham gia.',
      image: 'https://picsum.photos/seed/blog1/800/400',
      category: 'Tin tức',
      author: 'Admin',
      likes: 124,
      status: 'published',
      createdAt: new Date().toISOString()
    },
    {
      id: 'post-2',
      title: 'Mẹo tối ưu gian hàng cho Merchant mới',
      slug: 'meo-toi-uu-gian-hang',
      excerpt: 'Những bước đơn giản để tăng tỉ lệ chuyển đổi lên 200% cho shop của bạn.',
      content: 'Đầu tiên, hãy tập trung vào hình ảnh sản phẩm chất lượng cao. Tiếp theo, sử dụng các công cụ khuyến mãi như Flash Sale và Voucher để thu hút khách hàng trong các khung giờ vàng...',
      image: 'https://picsum.photos/seed/blog2/800/400',
      category: 'Hướng dẫn',
      author: 'S-Com Team',
      likes: 85,
      status: 'published',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  return posts.find(p => p.slug === slug);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: 'Bài viết không tồn tại' };

  const url = `https://scomhub.vn/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: url,
      title: `${post.title} | S-Com Hub`,
      description: post.excerpt,
      images: [{ url: post.image, width: 1200, height: 630 }],
      locale: 'vi_VN',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
    other: {
      'zalo:og:url': url
    }
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
  const tenant = await getTenantConfig("demo");

  if (!post) return notFound();

  const baseUrl = `https://${tenant.customDomain ?? tenant.subdomain + '.scomhub.vn'}`;
  const url = `${baseUrl}/blog/${post.slug}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Trang chủ', url: `${baseUrl}/` },
        { name: 'Blog', url: `${baseUrl}/blog` },
        { name: post.title, url },
      ])} />
      <BlogDetailClient post={post} url={url} />
    </>
  );
}
