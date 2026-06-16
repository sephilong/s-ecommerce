
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
  Bookmark
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { posts, toggleLike } = useBlogStore();
  
  const post = posts.find(p => p.slug === slug);

  if (!post) return <div className="p-20 text-center italic">Bài viết không tồn tại.</div>;

  const handleShareFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
  };

  const handleLike = () => {
    toggleLike(post.id);
    toast({ title: "Đã thích bài viết!", description: "Cảm ơn phản hồi của bạn." });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-700">
      <Button 
        variant="ghost" 
        onClick={() => router.back()} 
        className="mb-8 rounded-full gap-2 text-muted-foreground hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4" /> Quay lại
      </Button>

      <article className="space-y-10">
        <div className="space-y-6 text-center">
          <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1 uppercase tracking-widest text-[10px] font-black">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black font-headline italic tracking-tighter leading-tight uppercase">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {format(new Date(post.createdAt), 'dd MMMM, yyyy', { locale: vi })}</span>
            <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {post.author}</span>
          </div>
        </div>

        <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority />
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:italic prose-headings:uppercase prose-p:text-muted-foreground prose-p:leading-relaxed italic">
          {post.content}
          <p className="mt-8">Đây là nội dung mẫu cho hệ thống bài viết của S-Com Hub. Toàn bộ nội dung sẽ được Admin cập nhật chi tiết qua hệ thống quản trị.</p>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <Button 
              onClick={handleLike} 
              variant="outline" 
              className="rounded-full h-12 px-6 gap-2 border-primary/20 text-primary hover:bg-primary/10"
             >
                <ThumbsUp className="w-4 h-4" /> Thích ({post.likes})
             </Button>
             <Button variant="ghost" size="icon" className="rounded-full h-12 w-12 text-muted-foreground hover:text-white">
                <Bookmark className="w-5 h-5" />
             </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Chia sẻ:</span>
            <Button 
              onClick={handleShareFacebook} 
              className="rounded-full h-12 px-6 gap-2 bg-[#1877F2] hover:bg-[#1877F2]/90 shadow-xl shadow-[#1877F2]/20"
            >
              <Facebook className="w-4 h-4 fill-current" /> Facebook
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-12 w-12 border-white/10"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({ title: "Đã sao chép liên kết!" });
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}
