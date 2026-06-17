
'use client';

import { Facebook, MessageCircle, Link as LinkIcon, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface ShareProps {
  url: string;
  title: string;
}

export function SocialShareButtons({ url, title }: ShareProps) {
  const encodedUrl = encodeURIComponent(url);

  const handleFbShare = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      (window as any).FB.ui({
        method: 'share',
        href: url,
      });
    } else {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Đã copy link!", description: "Bạn có thể dán link để chia sẻ." });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center" aria-label="Chia sẻ sản phẩm">
      {/* Facebook Like Button Placeholder - XFBML will render this */}
      <div
        className="fb-like"
        data-href={url}
        data-width=""
        data-layout="button_count"
        data-action="like"
        data-size="small"
        data-share="false"
      />

      <Button
        variant="outline"
        size="sm"
        onClick={handleFbShare}
        className="rounded-full bg-[#1877F2] text-white border-none hover:bg-[#1877F2]/90 h-9 px-4 gap-2 text-xs font-bold"
      >
        <Facebook className="w-3.5 h-3.5 fill-current" /> Chia sẻ
      </Button>

      <Button
        variant="outline"
        size="sm"
        asChild
        className="rounded-full bg-[#0190F3] text-white border-none hover:bg-[#0190F3]/90 h-9 px-4 gap-2 text-xs font-bold"
      >
        <a href={`https://zalo.me/share?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
          <Share2 className="w-3.5 h-3.5" /> Zalo
        </a>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className="rounded-full h-9 px-4 gap-2 text-xs font-bold bg-white/5 border border-white/10 hover:bg-white/10"
      >
        <LinkIcon className="w-3.5 h-3.5" /> Copy link
      </Button>
    </div>
  );
}
