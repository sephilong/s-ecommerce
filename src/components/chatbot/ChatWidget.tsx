"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ShoppingBag, HelpCircle, Package, ArrowRight } from "lucide-react";
import { chatbotCustomerSupport } from "@/ai/flows/ai-chatbot-customer-support";
import { Tenant } from "@/lib/store-data";
import { useChatbotStore } from "@/store/chatbotStore";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_REPLIES = [
  { label: "Sản phẩm mới nhất", icon: <Sparkles className="w-3 h-3" /> },
  { label: "Chính sách đổi trả", icon: <HelpCircle className="w-3 h-3" /> },
  { label: "Tư vấn quà tặng", icon: <ShoppingBag className="w-3 h-3" /> },
];

export function ChatWidget({ tenant }: { tenant: Tenant }) {
  const { config } = useChatbotStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [showPing, setShowPing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: config.greetingMessage }]);
    }
  }, [config.greetingMessage, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input.trim();
    if (!textToSend || isLoading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: textToSend }]);
    setIsLoading(true);

    try {
      const result = await chatbotCustomerSupport({
        message: textToSend,
        tenantId: tenant.id,
        conversationId: conversationId,
        config: {
          chatbotName: config.chatbotName,
          returnPolicy: config.returnPolicy,
          shippingPolicy: config.shippingPolicy
        }
      });

      setConversationId(result.conversationId);
      setMessages(prev => [...prev, { role: "assistant", content: result.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Dạ, hiện tại kết nối của tôi đang gặp chút gián đoạn. Bạn vui lòng thử lại sau vài giây nhé! 🙏" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!config.isEnabled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-body">
      {!isOpen ? (
        <button 
          onClick={() => { setIsOpen(true); setShowPing(false); }}
          className="relative h-14 w-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {showPing && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      ) : (
        <Card className="w-[350px] md:w-[400px] h-[600px] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-white/10 bg-[#0f0f0f] animate-in slide-in-from-bottom-10 fade-in duration-500 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary p-5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-white uppercase tracking-widest italic">{config.chatbotName}</CardTitle>
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                   <span className="text-[10px] text-white/70 font-bold uppercase">Sẵn sàng tư vấn</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 hover:bg-white/10 text-white rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_#1a1033_0%,_transparent_60%)]">
            {messages.map((msg, i) => (
              <div key={i} className={cn("flex w-full animate-in fade-in slide-in-from-bottom-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? 'flex-row-reverse' : '')}>
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border border-white/5 shadow-inner", msg.role === 'user' ? 'bg-primary/20' : 'bg-white/5')}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                    msg.role === 'user' ? 'bg-primary text-white font-medium rounded-tr-none shadow-lg shadow-primary/20' : 'bg-white/5 text-foreground/90 rounded-tl-none border border-white/5'
                  )}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-3 items-center bg-white/5 p-3.5 rounded-2xl rounded-tl-none border border-white/5">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground italic font-medium">Đang xử lý dữ liệu kho...</span>
                </div>
              </div>
            )}
          </CardContent>

          {/* Quick Replies */}
          {!isLoading && (
            <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-white/5 bg-black/20">
              {QUICK_REPLIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                >
                  {q.icon} {q.label}
                </button>
              ))}
            </div>
          )}

          <CardFooter className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-md">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-3"
            >
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Bạn muốn mua gì ạ?..."
                className="flex-1 h-11 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="h-11 w-11 rounded-xl shadow-lg shadow-primary/30">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
