
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SectionType = 
  | 'hero' 
  | 'banner' 
  | 'product_grid' 
  | 'category_grid' 
  | 'flash_sale' 
  | 'video' 
  | 'newsletter' 
  | 'contact';

export interface SectionConfig {
  id: string;
  type: SectionType;
  content: any;
  styles: {
    paddingTop?: string;
    paddingBottom?: string;
    backgroundColor?: string;
    textColor?: string;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  fontFamily: string;
  borderRadius: string;
  mode: 'light' | 'dark';
}

interface BuilderState {
  sections: SectionConfig[];
  theme: ThemeConfig;
  activeSectionId: string | null;
  
  // Actions
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, updates: Partial<SectionConfig>) => void;
  reorderSections: (newSections: SectionConfig[]) => void;
  setActiveSection: (id: string | null) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetBuilder: () => void;
}

const DEFAULT_SECTIONS: SectionConfig[] = [
  {
    id: 'hero-1',
    type: 'hero',
    content: {
      title: 'Chào mừng tới cửa hàng của chúng tôi',
      subtitle: 'Khám phá những bộ sưu tập công nghệ mới nhất 2025',
      buttonText: 'Mua Ngay',
      imageUrl: 'https://picsum.photos/seed/builder-hero/1200/600'
    },
    styles: { paddingTop: '80px', paddingBottom: '80px' }
  },
  {
    id: 'prod-grid-1',
    type: 'product_grid',
    content: {
      title: 'Sản phẩm nổi bật',
      limit: 4
    },
    styles: { paddingTop: '60px', paddingBottom: '60px' }
  }
];

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      sections: DEFAULT_SECTIONS,
      theme: {
        primaryColor: '266 79% 63%',
        fontFamily: 'Inter',
        borderRadius: '12px',
        mode: 'dark'
      },
      activeSectionId: null,

      addSection: (type) => set((state) => {
        const newSection: SectionConfig = {
          id: `${type}-${Date.now()}`,
          type,
          content: {},
          styles: { paddingTop: '40px', paddingBottom: '40px' }
        };
        // Cung cấp content mặc định dựa trên loại
        if (type === 'hero') {
          newSection.content = { title: 'Tiêu đề mới', subtitle: 'Mô tả ngắn gọn', buttonText: 'Xem thêm' };
        } else if (type === 'banner') {
          newSection.content = { imageUrl: 'https://picsum.photos/seed/banner/800/400', title: 'Khuyến mãi hè' };
        }
        
        return { sections: [...state.sections, newSection] };
      }),

      removeSection: (id) => set((state) => ({
        sections: state.sections.filter(s => s.id !== id),
        activeSectionId: state.activeSectionId === id ? null : state.activeSectionId
      })),

      updateSection: (id, updates) => set((state) => ({
        sections: state.sections.map(s => s.id === id ? { ...s, ...updates } : s)
      })),

      reorderSections: (newSections) => set({ sections: newSections }),
      
      setActiveSection: (id) => set({ activeSectionId: id }),

      updateTheme: (updates) => set((state) => ({
        theme: { ...state.theme, ...updates }
      })),

      resetBuilder: () => set({ sections: DEFAULT_SECTIONS, activeSectionId: null })
    }),
    {
      name: 'scomhub-builder-storage',
    }
  )
);
