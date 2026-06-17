import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatbotConfig {
  isEnabled: boolean;
  chatbotName: string;
  avatarUrl: string;
  greetingMessage: string;
  returnPolicy: string;
  shippingPolicy: string;
  aiModel: string;
}

interface ChatbotState {
  config: ChatbotConfig;
  updateConfig: (updates: Partial<ChatbotConfig>) => void;
}

export const useChatbotStore = create<ChatbotState>()(
  persist(
    (set) => ({
      config: {
        isEnabled: true,
        chatbotName: 'S-Com AI Assistant',
        avatarUrl: '',
        greetingMessage: 'Chào bạn! Tôi là trợ lý ảo của S-Com Hub. Tôi có thể giúp gì cho bạn hôm nay?',
        returnPolicy: 'Hỗ trợ đổi trả miễn phí trong 7 ngày nếu có lỗi từ nhà sản xuất.',
        shippingPolicy: 'Giao hàng hỏa tốc toàn quốc. Miễn phí cho đơn hàng từ 500.000đ.',
        aiModel: 'gemini-2.5-flash'
      },
      updateConfig: (updates) => set((state) => ({
        config: { ...state.config, ...updates }
      })),
    }),
    {
      name: 'scomhub-chatbot-storage',
    }
  )
);
