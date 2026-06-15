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

// --- Zod Schemas ---

const ChatbotCustomerSupportInputSchema = z.object({
  message: z.string().describe('The customer\'s query to the chatbot.'),
  conversationId: z.string().optional().describe('Optional ID for the ongoing conversation. If not provided, a new one will be generated.'),
  customerId: z.string().optional().describe('Optional ID of the customer interacting with the chatbot.'),
  tenantId: z.string().describe('The ID of the tenant (store) for which the chatbot is providing support.'),
});
export type ChatbotCustomerSupportInput = z.infer<typeof ChatbotCustomerSupportInputSchema>;

const ChatbotCustomerSupportOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s complete response to the customer.'),
  conversationId: z.string().describe('The ID of the conversation.'),
});
export type ChatbotCustomerSupportOutput = z.infer<typeof ChatbotCustomerSupportOutputSchema>;

// --- Mock/Placeholder Helper Functions (These would ideally be external services) ---

// Mock Tenant Configuration
interface TenantConfig {
  id: string;
  storeName: string;
  storeDescription?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: {
    street: string;
    district: string;
    province: string;
  };
  returnPolicy?: string;
  shippingPolicy?: string;
  aiModel?: string; // e.g., 'claude-sonnet-4-6' or 'gemini-1.5-flash'
  themeConfig: {
    colors: { primary: string }
  }
}

// Simple mock for fetching tenant config
async function getTenantConfig(tenantId: string): Promise<TenantConfig> {
  // In a real app, this would fetch from a database (e.g., Prisma)
  // For now, return a hardcoded example
  return {
    id: tenantId,
    storeName: 'S-Com Hub Demo Store',
    storeDescription: 'Nền tảng thương mại điện tử đa năng, đa vendor, hỗ trợ Việt Nam.',
    contactEmail: 'support@scomhub.vn',
    contactPhone: '0901234567',
    address: {
      street: '123 Le Loi',
      district: 'Quan 1',
      province: 'TP. Ho Chi Minh',
    },
    returnPolicy: 'Chính sách đổi trả: 7 ngày đổi trả miễn phí kể từ ngày nhận hàng, sản phẩm phải còn nguyên tem mác và chưa qua sử dụng.',
    shippingPolicy: 'Chính sách vận chuyển: Giao hàng toàn quốc trong vòng 2-5 ngày làm việc. Miễn phí vận chuyển cho đơn hàng trên 500.000 VND.',
    aiModel: 'gemini-1.5-flash', // Use the Genkit default model for this mock
    themeConfig: { colors: { primary: '#9757EA' }
    }
  };
}

// Mock Conversation History Management (using an in-memory map for simplicity)
const conversationHistory = new Map<string, Array<{ role: 'user' | 'assistant', content: string }>>();

async function getConversationHistory(
  conversationId: string,
  limit: number = 10
): Promise<Array<{ role: 'user' | 'assistant', content: string }>> {
  return conversationHistory.get(conversationId)?.slice(-limit) || [];
}

async function saveConversationTurn(
  conversationId: string,
  userMessage: string,
  aiResponse: string
): Promise<void> {
  if (!conversationHistory.has(conversationId)) {
    conversationHistory.set(conversationId, []);
  }
  const history = conversationHistory.get(conversationId)!;
  history.push({ role: 'user', content: userMessage });
  history.push({ role: 'assistant', content: aiResponse });
}

// Mock Product Context
interface ProductContext {
  productId: string;
  name: string;
  price: number;
  inStock: boolean;
  slug: string;
  imageUrl?: string;
  description?: string;
  compareAtPrice?: number;
}

// Mock RAG function to find relevant products
async function findRelevantProducts(
  query: string,
  tenantId: string,
  limit: number = 3
): Promise<ProductContext[]> {
  // In a real app, this would use a vector database (e.g., pgvector with OpenAIEmbeddings)
  // to find semantically similar products.
  // For now, simulate some product suggestions based on keywords.
  const lowerQuery = query.toLowerCase();
  const mockProducts: ProductContext[] = [
    {
      productId: 'prod_abc123',
      name: 'Áo thun nam cao cấp',
      price: 250000,
      inStock: true,
      slug: 'ao-thun-nam-cao-cap',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    },
    {
      productId: 'prod_def456',
      name: 'Quần jean slimfit',
      price: 450000,
      inStock: true,
      slug: 'quan-jean-slimfit',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    },
    {
      productId: 'prod_ghi789',
      name: 'Giày sneaker trắng',
      price: 700000,
      inStock: false, // Simulate out of stock
      slug: 'giay-sneaker-trang',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    },
    {
      productId: 'prod_jkl012',
      name: 'Túi xách da thật',
      price: 900000,
      inStock: true,
      slug: 'tui-xach-da-that',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    },
  ];

  const results: ProductContext[] = [];
  if (lowerQuery.includes('áo')) results.push(mockProducts[0]);
  if (lowerQuery.includes('quần')) results.push(mockProducts[1]);
  if (lowerQuery.includes('giày') || lowerQuery.includes('sneaker')) results.push(mockProducts[2]);
  if (lowerQuery.includes('túi')) results.push(mockProducts[3]);
  if (lowerQuery.includes('nước hoa')) { /* no results for this query */ } // Example of no results

  return results.slice(0, limit);
}

// Mock Utility Functions (from proposal)
function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatAddress(address: { street: string; district: string; province: string }): string {
  return `${address.street}, ${address.district}, ${address.province}`;
}

// Build System Prompt based on proposal's structure
function buildSystemPrompt(tenant: TenantConfig, storeContext: { returnPolicy?: string, shippingPolicy?: string }): string {
  return `
Bạn là trợ lý tư vấn mua sắm thông minh của cửa hàng "${tenant.storeName}".

THÔNG TIN CỬA HÀNG:
- Tên: ${tenant.storeName}
- Mô tả: ${tenant.storeDescription ?? ''}
- Liên hệ: ${tenant.contactPhone ?? ''} | ${tenant.contactEmail ?? ''}
- Địa chỉ: ${tenant.address ? formatAddress(tenant.address) : 'Online'}
- Chính sách đổi trả: ${storeContext.returnPolicy ?? 'Không có thông tin cụ thể.'}
- Chính sách vận chuyển: ${storeContext.shippingPolicy ?? 'Không có thông tin cụ thể.'}

NHIỆM VỤ CỦA BẠN:
1. Tư vấn sản phẩm phù hợp với nhu cầu khách hàng
2. Giải đáp mọi thắc mắc về sản phẩm, giá cả, chính sách
3. Gợi ý sản phẩm tương tự nếu sản phẩm mong muốn hết hàng
4. Hướng dẫn đặt hàng, thanh toán, vận chuyển
5. Khuyến khích khách hàng đặt hàng một cách tự nhiên, không áp đặt

QUY TẮC:
- Luôn trả lời bằng tiếng Việt, thân thiện và chuyên nghiệp
- Khi giới thiệu sản phẩm, luôn kèm giá và link xem chi tiết
- Nếu không chắc thông tin, hãy thành thật và hướng khách liên hệ hotline
- KHÔNG bịa đặt thông tin sản phẩm không có trong database
- Nếu hết hàng: gợi ý sản phẩm tương tự, hỏi khách có muốn được thông báo khi có hàng
- Tối đa 3 sản phẩm gợi ý mỗi lần, tránh overwhelm khách

FORMAT TRẢ LỜI:
- Dùng markdown nhẹ (bold, list) khi cần thiết
- Mỗi sản phẩm gợi ý: tên + giá + 1 dòng mô tả ngắn + link
- Kết thúc bằng câu hỏi mở để tiếp tục hội thoại
`.trim();
}

// --- Genkit Flow Implementation ---

export async function chatbotCustomerSupport(
  input: ChatbotCustomerSupportInput
): Promise<ChatbotCustomerSupportOutput> {
  return chatbotCustomerSupportFlow(input);
}

const chatbotCustomerSupportFlow = ai.defineFlow(
  {
    name: 'chatbotCustomerSupportFlow',
    inputSchema: ChatbotCustomerSupportInputSchema,
    outputSchema: ChatbotCustomerSupportOutputSchema,
  },
  async (input) => {
    const { message, conversationId: inputConversationId, tenantId, customerId } = input;

    // Use existing conversationId or generate a new one
    const conversationId = inputConversationId || `conv_${Date.now()}_${customerId || Math.random().toString(36).substring(7)}`;

    // 1. Fetch Tenant Configuration
    const tenantConfig = await getTenantConfig(tenantId);

    // 2. Load Conversation History
    // Limit history to keep context concise and manage token usage
    const history = await getConversationHistory(conversationId, 10); // Last 10 messages (5 turns)

    // 3. Perform RAG to find relevant products
    const relevantProducts = await findRelevantProducts(message, tenantId, 3); // Get up to 3 relevant products

    // 4. Build Context for the LLM
    const storeContext = {
      returnPolicy: tenantConfig.returnPolicy,
      shippingPolicy: tenantConfig.shippingPolicy,
    };
    const systemPrompt = buildSystemPrompt(tenantConfig, storeContext);

    // Add relevant products to the current user message for RAG
    let userMessageWithContext = message;
    if (relevantProducts.length > 0) {
      const productContextString = relevantProducts.map(p =>
        `[SP ID: ${p.productId}] Tên: ${p.name} - Giá: ${formatVND(p.price)} - Tình trạng: ${p.inStock ? 'Còn hàng' : 'Hết hàng'} - Link: /products/${p.slug}` +
        (p.compareAtPrice ? ` - Giá gốc: ${formatVND(p.compareAtPrice)} (Đang giảm giá)` : '') +
        (p.description ? ` - Mô tả ngắn: ${p.description.substring(0, Math.min(p.description.length, 100))}...` : '')
      ).join('\n');
      userMessageWithContext = `${message}\n\n[SẢN PHẨM LIÊN QUAN TỪ CƠ SỞ DỮ LIỆU CỬA HÀNG]:\n${productContextString}`;
    }

    // Construct messages array for the LLM
    const messages = history.map(msg => ({ role: msg.role, content: msg.content }));
    messages.push({ role: 'user', content: userMessageWithContext });

    // 5. Call LLM (using ai.generateStream for streaming capabilities)
    const llmModel = ai.model(tenantConfig.aiModel || 'gemini-1.5-flash'); // Fallback to default Genkit model

    let fullResponse = '';
    const { stream, response } = ai.generateStream({
      model: llmModel,
      system: systemPrompt,
      prompt: messages,
    });

    for await (const chunk of stream) {
      // In a real streaming scenario, this would be sent chunk by chunk to the client
      // For this flow, we collect it into a single response string
      fullResponse += chunk.text || '';
    }

    // Ensure the response is complete (await is important for non-streaming context or when final response is needed)
    await response;

    // 6. Save Conversation Turn
    await saveConversationTurn(conversationId, message, fullResponse);

    // 7. (Optional) Log for analytics - omitted for brevity in this Genkit flow example

    return {
      response: fullResponse.trim(),
      conversationId: conversationId,
    };
  }
);