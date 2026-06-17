
'use client';

import { useEffect } from 'react';

export function FacebookComments({ url }: { url: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      (window as any).FB.XFBML.parse();
    }
  }, [url]);

  return (
    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest italic">Thảo luận khách hàng</h3>
      </div>
      <div
        className="fb-comments"
        data-href={url}
        data-width="100%"
        data-numposts="5"
        data-order-by="social"
        data-colorscheme="dark"
      />
    </div>
  );
}
