
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'Tin tức' | 'Hướng dẫn' | 'Khuyến mãi' | 'Đánh giá';
  author: string;
  likes: number;
  status: 'published' | 'draft';
  createdAt: string;
}

interface BlogState {
  posts: BlogPost[];
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, updates: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  toggleLike: (id: string) => void;
}

const INITIAL_POSTS: BlogPost[] = [
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

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      posts: INITIAL_POSTS,
      addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
      updatePost: (id, updates) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deletePost: (id) => set((state) => ({
        posts: state.posts.filter(p => p.id !== id)
      })),
      toggleLike: (id) => set((state) => ({
        posts: state.posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
      }))
    }),
    { name: 'scomhub-blog-storage' }
  )
);
