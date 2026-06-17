
'use client';

import { MessageCircle } from 'lucide-react';

export function ZaloChatWidget({ oaId }: { oaId?: string }) {
  if (!oaId) return null;

  return (
    <a
      href={`https://zalo.me/${oaId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-[90] flex items-center gap-3 bg-[#0190F3] text-white px-5 py-3 rounded-full shadow-2xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 group"
      aria-label="Chat với chúng tôi qua Zalo"
    >
      <div className="relative">
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
      </div>
      <span className="font-black italic text-xs uppercase tracking-tighter">Chat Zalo</span>
    </a>
  );
}
