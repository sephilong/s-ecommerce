
"use client";

import { useBlogStore } from "@/store/blogStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Calendar, 
  User, 
  ThumbsUp, 
  Facebook, 
  Share2,
  Bookmark,
  MessageCircle
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import React from "react";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { posts, toggleLike } = useBlogStore();
  
  const post = posts.find(p => p.slug === slug);

  if (!post) return <div className="p-20 text-center italic">Bài viết không tồn tại.</div>;

  const handleShareFacebook = () => {
    const url = window.location.href;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
  };

  const handleLike = () => {
    toggleLike(post.id);
    toast({ 
      title: "Cảm ơn bạn!", 
      description: "Bạn đã thích bài viết này.",
      className: "bg-primary text-white border-none"
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-700">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-8 rounded-full gap-2 text-muted-foreground hover:text-primary transition-all"
      >
        <ChevronLeft className="w-4 h-4" /> Quay lại
      </Button>

      <article className="space-y-12">
        <header className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline italic tracking-tighter leading-tight uppercase">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-[10px] font-black text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-primary" /> 
              {format(new Date(post.createdAt), 'dd MMMM, yyyy', { locale: vi })}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-primary" /> 
              {post.author}
            </span>
          </div>
        </header>

        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 bg-card">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover" 
            priority 
          />
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:italic prose-headings:uppercase prose-p:text-muted-foreground/90 prose-p:leading-relaxed">
          {post.content.split('\n').map((para, i) => (
            <p key={i} className="mb-4">{para}</p>
          ))}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 italic text-sm text-muted-foreground mt-12">
            Lưu ý: Đây là nội dung được biên soạn bởi đội ngũ S-Com Hub. Mọi hình thức sao chép vui lòng ghi rõ nguồn.
          </div>
        </div>

        <footer className="pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
             <Button 
              onClick={handleLike} 
              variant="outline" 
              className="rounded-full h-14 px-8 gap-3 border-primary/20 text-primary hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
             >
                <ThumbsUp className="w-5 h-5" /> 
                <span className="font-black italic uppercase tracking-tighter">Thích ({post.likes})</span>
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full h-14 w-14 text-muted-foreground hover:text-white hover:bg-white/5">
                <Bookmark className="w-6 h-6" />
             </Button>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest italic">Chia sẻ ngay:</span>
            <div className="flex gap-3">
              <Button 
                onClick={handleShareFacebook} 
                className="rounded-full h-12 px-6 gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 shadow-xl shadow-[#1877F2]/20 font-bold"
              >
                <Facebook className="w-4 h-4 fill-current" /> Facebook
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-12 w-12 border-white/10 hover:bg-white/5"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({ title: "Đã sao chép liên kết!" });
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </footer>
      </article>
      
      {/* Newsletter / CTA */}
      <section className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/10 text-center space-y-6">
         <MessageCircle className="w-12 h-12 text-primary mx-auto opacity-50" />
         <h3 className="text-3xl font-black italic uppercase tracking-tighter">Bạn thấy bài viết này hữu ích?</h3>
         <p className="text-muted-foreground max-w-md mx-auto">Đăng ký nhận bản tin để không bỏ lỡ các mẹo mua sắm và xu hướng công nghệ mới nhất.</p>
         <div className="flex max-w-sm mx-auto gap-2">
            <input placeholder="Email của bạn..." className="flex-1 bg-black/40 border border-white/10 rounded-full px-6 text-sm" />
            <Button className="rounded-full px-6 font-bold uppercase italic">Gửi</Button>
         </div>
      </section>
    </div>
  );
}
