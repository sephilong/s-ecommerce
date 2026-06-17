
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  category: 'product' | 'banner' | 'avatar' | 'review';
  uploadedAt: string;
  dimensions?: { width: number; height: number };
}

interface MediaState {
  files: MediaFile[];
  isUploading: boolean;
  uploadProgress: number;
  
  // Actions
  addFile: (file: MediaFile) => void;
  deleteFile: (id: string) => void;
  setUploading: (status: boolean) => void;
  setProgress: (progress: number) => void;
  
  // Simulated Pipeline logic (Sharp + S3/R2 simulation)
  uploadPipeline: (file: File, category: MediaFile['category']) => Promise<string>;
}

const MAX_SIZES = {
  product: 10 * 1024 * 1024,
  banner: 5 * 1024 * 1024,
  avatar: 2 * 1024 * 1024,
  review: 5 * 1024 * 1024
};

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const useMediaStore = create<MediaState>()(
  persist(
    (set, get) => ({
      files: [],
      isUploading: false,
      uploadProgress: 0,

      addFile: (file) => set((state) => ({ files: [file, ...state.files] })),
      deleteFile: (id) => set((state) => ({ files: state.files.filter(f => f.id !== id) })),
      setUploading: (isUploading) => set({ isUploading }),
      setProgress: (uploadProgress) => set({ uploadProgress }),

      uploadPipeline: async (file, category) => {
        const { setUploading, setProgress, addFile } = get();
        
        // 1. Validation
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error('Định dạng tệp không hỗ trợ. Chỉ nhận JPG, PNG, WebP.');
        }
        if (file.size > MAX_SIZES[category]) {
          throw new Error(`Kích thước quá lớn. Tối đa cho ${category} là ${MAX_SIZES[category] / (1024 * 1024)}MB.`);
        }

        setUploading(true);
        setProgress(0);

        // 2. Simulate "Sharp" Processing (Resizing, WebP conversion)
        // Step 2.1: Initial reading
        await new Promise(resolve => setTimeout(resolve, 300));
        setProgress(30);

        // Step 2.2: Resizing (Creating 200px, 600px, 1200px variants)
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(60);

        // Step 2.3: Converting to WebP and Uploading to Cloud Storage (R2/S3)
        await new Promise(resolve => setTimeout(resolve, 400));
        setProgress(90);

        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const newMedia: MediaFile = {
          id: `media-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          name: file.name.split('.')[0] + '.webp', // Simulated WebP conversion
          url: dataUrl,
          size: Math.round(file.size * 0.7), // Simulated WebP compression
          type: 'image/webp',
          category,
          uploadedAt: new Date().toISOString(),
          dimensions: { width: 1200, height: 1200 } // Simulated
        };

        addFile(newMedia);
        setUploading(false);
        setProgress(100);
        
        return dataUrl;
      }
    }),
    { name: 'scomhub-media-storage-v2' }
  )
);
