'use server';
/**
 * @fileOverview A Genkit flow for an AI chatbot providing customer support.
 *
 * - chatbotCustomerSupport - A function that handles customer queries via an AI chatbot.
 * - ChatbotCustomerSupportInput - The input type for the chatbotCustomerSupport function.
 * - ChatbotCustomerSupportOutput - The return type for the chatbotCustomerSupport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MOCK_TENANTS } from '@/lib/store-data';

// --- Zod Schemas ---

const ChatbotCustomerSupportInputSchema = z.object({
  message: z.string().describe('The customer\'s query to the chatbot.'),
  conversationId: z.string().optional().describe('Optional ID for the ongoing conversation.'),
  customerId: z.string().optional().describe('Optional ID of the customer.'),
  tenantId: z.string().describe('The ID of the tenant (store).'),
});
export type ChatbotCustomerSupportInput = z.infer<typeof ChatbotCustomerSupportInputSchema>;

const ChatbotCustomerSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s complete response.'),
  conversationId: z.string().describe('The ID of the conversation.'),
});
export type ChatbotCustomerSupportOutput = z.infer<typeof ChatbotCustomerSupportOutputSchema>;

// --- Mock/Placeholder Helper Functions ---

// Cập nhật tìm kiếm sản phẩm thực tế từ Mock Data
async function findRelevantProducts(
  query: string,
  tenantId: string,
  limit: number = 3
) {
  const tenant = MOCK_TENANTS.find(t => t.id === tenantId) || MOCK_TENANTS[0];
  const lowerQuery = query.toLowerCase();
  
  // Tìm kiếm mờ trong danh sách sản phẩm thực tế
  return tenant.products
    .filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
    .slice(0, limit);
}

// Giả lập lịch sử (Trong thực tế nên dùng Redis hoặc DB)
const conversationHistory = new Map<string, Array<{ role: 'user' | 'assistant', content: string }>>();

async function getConversationHistory(conversationId: string, limit: number = 6) {
  return conversationHistory.get(conversationId)?.slice(-limit) || [];
}

async function saveConversationTurn(conversationId: string, userMessage: string, aiResponse: string) {
  if (!conversationHistory.has(conversationId)) {
    conversationHistory.set(conversationId, []);
  }
  const history = conversationHistory.get(conversationId)!;
  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: aiResponse });
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount);
}

function buildSystemPrompt(tenant: any): string {
  return `
Bạn là "S-Com AI", trợ lý tư vấn mua sắm chuyên nghiệp của cửa hàng "${tenant.name}".

THÔNG TIN CỬA HÀNG:
- Tên: ${tenant.name}
- Mô tả: ${tenant.description}
- Chính sách: Hỗ trợ bảo hành 12 tháng, đổi trả 7 ngày nếu lỗi. Miễn phí vận chuyển toàn quốc.

PHONG CÁCH LÀM VIỆC:
1. Luôn chào hỏi thân thiện, sử dụng tiếng Việt tự nhiên (Dùng các từ như: dạ, vâng, ạ, cảm ơn bạn).
2. Khi khách hỏi về sản phẩm, hãy dựa trên dữ liệu sản phẩm tôi cung cấp bên dưới để tư vấn.
3. Nếu khách hỏi về giá, hãy báo đúng giá và nhấn mạnh vào các chương trình khuyến mãi nếu có.
4. Luôn khuyến khích khách hàng thêm sản phẩm vào giỏ hàng hoặc xem chi tiết.
5. Nếu không thấy sản phẩm phù hợp, hãy gợi ý các danh mục tương tự.

QUY TẮC PHẢN HỒI:
- Trả lời ngắn gọn, súc tích, dễ đọc trên di động.
- Sử dụng emoji để tạo sự gần gũi (nhưng không lạm dụng).
- Nếu khách hỏi những thứ không liên quan đến mua sắm, hãy lịch sự lái câu chuyện về việc hỗ trợ mua hàng tại ${tenant.name}.
`.trim();
}

// --- Genkit Flow Implementation ---

export async function chatbotCustomerSupport(input: ChatbotCustomerSupportInput): Promise<ChatbotCustomerSupportOutput> {
  return chatbotCustomerSupportFlow(input);
}

const chatbotCustomerSupportFlow = ai.defineFlow(
  {
    name: 'chatbotCustomerSupportFlow',
    inputSchema: ChatbotCustomerSupportInputSchema,
    outputSchema: ChatbotCustomerSupportOutputSchema,
  },
  async (input) => {
    const { message, conversationId: inputConversationId, tenantId } = input;
    const conversationId = inputConversationId || `conv_${Date.now()}`;

    const tenant = MOCK_TENANTS.find(t => t.id === tenantId) || MOCK_TENANTS[0];
    const history = await getConversationHistory(conversationId);
    const relevantProducts = await findRelevantProducts(message, tenantId);

    // Xây dựng ngữ cảnh sản phẩm cho LLM
    let productContext = "";
    if (relevantProducts.length > 0) {
      productContext = "\n\n[DỮ LIỆU SẢN PHẨM KHẢ DỤNG]:\n" + relevantProducts.map(p => 
        `- ${p.name}: ${formatVND(p.price)} | Link: /products/${p.slug} | Trạng thái: ${p.inStock ? 'Còn hàng' : 'Hết hàng'}`
      ).join('\n');
    }

    const systemPrompt = buildSystemPrompt(tenant);
    const messages = [
      ...history.map(msg => ({ role: msg.role as any, content: [{ text: msg.content }] })),
      { role: 'user' as any, content: [{ text: message + productContext }] }
    ];

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: messages,
    });

    const fullResponse = text || "Tôi có thể giúp gì thêm cho bạn ạ?";
    await saveConversationTurn(conversationId, message, fullResponse);

    return {
      response: fullResponse.trim(),
      conversationId: conversationId,
    };
  }
);