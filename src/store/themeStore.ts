
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeConfig {
  primaryColor: string;
  borderRadius: string;
  mode: 'light' | 'dark';
  fontFamily: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  author: string;
  config: ThemeConfig;
  isPremium: boolean;
}

interface ThemeState {
  themes: Theme[];
  platformThemeId: string;
  
  // Actions
  addTheme: (theme: Theme) => void;
  deleteTheme: (id: string) => void;
  setPlatformTheme: (id: string) => void;
}

const DEFAULT_THEMES: Theme[] = [
  {
    id: 'midnight-tech',
    name: 'Midnight Tech',
    description: 'Giao diện tối thượng cho đồ công nghệ, phong cách hiện đại với màu tím neon.',
    thumbnail: 'https://picsum.photos/seed/midnight/600/400',
    author: 'S-Com Elite',
    isPremium: true,
    config: { primaryColor: '266 79% 63%', borderRadius: '12px', mode: 'dark', fontFamily: 'Inter' }
  },
  {
    id: 'eco-garden',
    name: 'Eco Garden',
    description: 'Tươi mát và gần gũi với thiên nhiên, phù hợp cho các sản phẩm hữu cơ, cây cảnh.',
    thumbnail: 'https://picsum.photos/seed/eco/600/400',
    author: 'S-Com Design',
    isPremium: false,
    config: { primaryColor: '142 76% 36%', borderRadius: '24px', mode: 'light', fontFamily: 'Inter' }
  },
  {
    id: 'luxury-watch',
    name: 'Luxury Watch',
    description: 'Sang trọng, đẳng cấp với tông màu vàng đồng và nền đen sâu.',
    thumbnail: 'https://picsum.photos/seed/watch/600/400',
    author: 'S-Com Premium',
    isPremium: true,
    config: { primaryColor: '45 93% 47%', borderRadius: '0px', mode: 'dark', fontFamily: 'Inter' }
  },
  {
    id: 'organic-food',
    name: 'Organic Food',
    description: 'Màu sắc ấm áp, tạo cảm giác ngon miệng cho các cửa hàng thực phẩm.',
    thumbnail: 'https://picsum.photos/seed/food/600/400',
    author: 'S-Com Kitchen',
    isPremium: false,
    config: { primaryColor: '25 95% 53%', borderRadius: '16px', mode: 'light', fontFamily: 'Inter' }
  },
  {
    id: 'kids-world',
    name: 'Kids World',
    description: 'Vui nhộn, rực rỡ sắc màu dành riêng cho mẹ và bé.',
    thumbnail: 'https://picsum.photos/seed/kids/600/400',
    author: 'S-Com Kids',
    isPremium: false,
    config: { primaryColor: '199 89% 48%', borderRadius: '32px', mode: 'light', fontFamily: 'Inter' }
  },
  {
    id: 'fitness-pro',
    name: 'Fitness Pro',
    description: 'Mạnh mẽ, đầy năng lượng cho các shop dụng cụ thể thao.',
    thumbnail: 'https://picsum.photos/seed/fitness/600/400',
    author: 'S-Com Sport',
    isPremium: true,
    config: { primaryColor: '0 84% 60%', borderRadius: '8px', mode: 'dark', fontFamily: 'Inter' }
  },
  {
    id: 'minimalist-white',
    name: 'Minimalist White',
    description: 'Sự tinh tế đến từ sự tối giản, tập trung tối đa vào hình ảnh sản phẩm.',
    thumbnail: 'https://picsum.photos/seed/minimal/600/400',
    author: 'S-Com Studio',
    isPremium: false,
    config: { primaryColor: '0 0% 20%', borderRadius: '4px', mode: 'light', fontFamily: 'Inter' }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: 'Dành cho cộng đồng Gaming với hiệu ứng ánh sáng neon cực mạnh.',
    thumbnail: 'https://picsum.photos/seed/cyber/600/400',
    author: 'S-Com Gaming',
    isPremium: true,
    config: { primaryColor: '322 100% 50%', borderRadius: '0px', mode: 'dark', fontFamily: 'Inter' }
  },
  {
    id: 'vintage-leather',
    name: 'Vintage Leather',
    description: 'Hoài cổ và ấm áp với tông màu da và gỗ trầm.',
    thumbnail: 'https://picsum.photos/seed/vintage/600/400',
    author: 'S-Com Artisan',
    isPremium: false,
    config: { primaryColor: '28 50% 45%', borderRadius: '12px', mode: 'light', fontFamily: 'Inter' }
  },
  {
    id: 'modern-fashion',
    name: 'Modern Fashion',
    description: 'Thanh lịch và thời thượng, bắt kịp xu hướng thời trang quốc tế.',
    thumbnail: 'https://picsum.photos/seed/fashion/600/400',
    author: 'S-Com Vogue',
    isPremium: true,
    config: { primaryColor: '266 79% 63%', borderRadius: '20px', mode: 'light', fontFamily: 'Inter' }
  }
];

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themes: DEFAULT_THEMES,
      platformThemeId: 'midnight-tech',
      addTheme: (theme) => set((state) => ({ themes: [theme, ...state.themes] })),
      deleteTheme: (id) => set((state) => ({ themes: state.themes.filter(t => t.id !== id) })),
      setPlatformTheme: (id) => set({ platformThemeId: id })
    }),
    { name: 'scomhub-theme-storage' }
  )
);
