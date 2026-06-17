'use server';
/**
 * @fileOverview Hệ thống AI Chatbot nâng cấp với khả năng RAG và Intent Detection.
 *
 * - chatbotCustomerSupport - Xử lý hội thoại AI dựa trên ngữ cảnh store và sản phẩm.
 * - detectIntent - Nhận diện ý định người dùng (hỏi giá, kho, đổi trả...).
 * - buildSystemPrompt - Xây dựng kịch bản tư vấn chuyên nghiệp.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MOCK_TENANTS } from '@/lib/store-data';
import { formatVND } from '@/lib/currency';

// --- Zod Schemas ---

const ChatbotCustomerSupportInputSchema = z.object({
  message: z.string().describe('Câu hỏi của khách hàng.'),
  conversationId: z.string().optional().describe('ID cuộc hội thoại để duy trì ngữ cảnh.'),
  tenantId: z.string().describe('ID của store.'),
  config: z.object({
    chatbotName: z.string().optional(),
    returnPolicy: z.string().optional(),
    shippingPolicy: z.string().optional(),
  }).optional(),
});
export type ChatbotCustomerSupportInput = z.infer<typeof ChatbotCustomerSupportInputSchema>;

const ChatbotCustomerSupportOutputSchema = z.object({
  response: z.string().describe('Câu trả lời từ AI.'),
  conversationId: z.string().describe('ID cuộc hội thoại.'),
  intent: z.string().optional().describe('Ý định được nhận diện.'),
  suggestedProducts: z.array(z.string()).optional().describe('Danh sách ID sản phẩm gợi ý.'),
});
export type ChatbotCustomerSupportOutput = z.infer<typeof ChatbotCustomerSupportOutputSchema>;

// --- Helper Functions ---

/**
 * Phát hiện ý định người dùng để AI tập trung phản hồi chính xác hơn.
 */
function detectIntent(message: string): string {
  const lower = message.toLowerCase();
  if (/giá|bao nhiêu|tiền|cost|đắt|rẻ/.test(lower)) return 'price_inquiry';
  if (/còn hàng|có hàng|hết hàng|stock|mua được không/.test(lower)) return 'stock_check';
  if (/đổi trả|hoàn tiền|refund|return|bảo hành/.test(lower)) return 'policy_inquiry';
  if (/ship|giao hàng|vận chuyển|phí/.test(lower)) return 'shipping_inquiry';
  if (/mua|đặt hàng|order|giỏ hàng/.test(lower)) return 'purchase_intent';
  if (/tư vấn|gợi ý|recommend/.test(lower)) return 'recommendation_request';
  return 'general_inquiry';
}

/**
 * Giả lập RAG: Tìm kiếm sản phẩm liên quan từ Mock Database.
 */
async function findRelevantProducts(query: string, tenantId: string, limit: number = 3) {
  const tenant = MOCK_TENANTS.find(t => t.id === tenantId) || MOCK_TENANTS[0];
  const lowerQuery = query.toLowerCase();
  
  return tenant.products
    .filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.category.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
    )
    .sort((a, b) => (b.inStock ? 1 : 0) - (a.inStock ? 1 : 0)) // Ưu tiên hàng còn trong kho
    .slice(0, limit);
}

const conversationHistory = new Map<string, Array<{ role: 'user' | 'model', content: string }>>();

async function getHistory(id: string) {
  return conversationHistory.get(id) || [];
}

async function saveTurn(id: string, user: string, ai: string) {
  const history = conversationHistory.get(id) || [];
  history.push({ role: 'user', content: user });
  history.push({ role: 'model', content: ai });
  conversationHistory.set(id, history.slice(-10)); // Giữ 10 lượt gần nhất
}

function buildSystemPrompt(tenant: any, config: any, intent: string): string {
  return `
Bạn là "${config?.chatbotName || 'S-Com AI'}", trợ lý tư vấn mua sắm thông minh của cửa hàng "${tenant.name}".

THÔNG TIN CỬA HÀNG:
- Tên: ${tenant.name}
- Mô tả: ${tenant.description}
- Chính sách đổi trả: ${config?.returnPolicy || 'Hỗ trợ đổi trả trong 7 ngày nếu có lỗi từ nhà sản xuất.'}
- Chính sách vận chuyển: ${config?.shippingPolicy || 'Miễn phí vận chuyển cho đơn hàng trên 500k.'}

NHIỆM VỤ:
1. Tư vấn sản phẩm phù hợp. Ý định hiện tại của khách là: ${intent}.
2. Giải đáp thắc mắc về giá và kho hàng dựa trên dữ liệu thật được cung cấp.
3. Hướng dẫn khách thêm vào giỏ hàng hoặc xem chi tiết.
4. Luôn trả lời bằng tiếng Việt thân thiện, chuyên nghiệp, sử dụng icon phù hợp.

QUY TẮC:
- KHÔNG tự bịa đặt thông tin sản phẩm hoặc giá cả.
- Luôn cung cấp LINK sản phẩm nếu có gợi ý.
- Nếu không tìm thấy sản phẩm phù hợp, hãy gợi ý các danh mục tương tự của cửa hàng.
- Mỗi câu trả lời cần ngắn gọn, súc tích (dưới 3 đoạn văn).

ĐỊNH DẠNG PHẢN HỒI:
- Sử dụng Markdown để in đậm tên sản phẩm hoặc giá.
- Liệt kê sản phẩm theo dạng danh sách gạch đầu dòng.
`.trim();
}

// --- Main Flow ---

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
    const { message, conversationId: inputId, tenantId, config } = input;
    const conversationId = inputId || `chat_${Date.now()}`;
    const tenant = MOCK_TENANTS.find(t => t.id === tenantId) || MOCK_TENANTS[0];

    const intent = detectIntent(message);
    const history = await getHistory(conversationId);
    const relevantProducts = await findRelevantProducts(message, tenantId);

    // Xây dựng ngữ cảnh RAG
    let productKnowledge = "";
    if (relevantProducts.length > 0) {
      productKnowledge = "\n\n[DỮ LIỆU SẢN PHẨM KHẢ DỤNG TỪ KHO]:\n" + relevantProducts.map(p => 
        `- ${p.name}: Giá ${formatVND(p.price)} | Tình trạng: ${p.inStock ? 'CÒN HÀNG' : 'HẾT HÀNG'} | Link: /products/${p.slug}`
      ).join('\n');
    } else {
      productKnowledge = "\n\n[LƯU Ý]: Không tìm thấy sản phẩm khớp trực tiếp, hãy tư vấn dựa trên danh mục chung của shop.";
    }

    const systemPrompt = buildSystemPrompt(tenant, config, intent);
    
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      system: systemPrompt,
      prompt: [
        ...history.map(h => ({ role: h.role as any, content: [{ text: h.content }] })),
        { role: 'user' as any, content: [{ text: message + productKnowledge }] }
      ],
    });

    const responseText = text || "Xin lỗi, tôi chưa rõ ý bạn. Bạn có thể hỏi cụ thể hơn về sản phẩm được không ạ?";
    await saveTurn(conversationId, message, responseText);

    return {
      response: responseText.trim(),
      conversationId: conversationId,
      intent: intent,
      suggestedProducts: relevantProducts.map(p => p.id)
    };
  }
);
