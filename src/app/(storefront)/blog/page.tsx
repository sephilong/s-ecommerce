
"use client";

import { useBlogStore, BlogPost } from "@/store/blogStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export default function BlogListPage() {
  const { posts } = useBlogStore();
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-black font-headline italic tracking-tighter uppercase mb-4">Tin tức & Bài viết</h1>
        <p className="text-muted-foreground text-lg">Cập nhật những thông tin mới nhất về công nghệ và mẹo mua sắm tại S-Com Hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedPosts.map((post) => (
          <Card key={post.id} className="bg-card/40 border-white/5 overflow-hidden group hover:border-primary/50 transition-all rounded-[2rem]">
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <Badge className="absolute top-4 left-4 bg-primary/80 backdrop-blur-md border-none">{post.category}</Badge>
            </Link>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-4 text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {format(new Date(post.createdAt), 'dd MMMM, yyyy', { locale: vi })}</span>
                <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {post.author}</span>
              </div>
              <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed italic">
                {post.excerpt}
              </p>
              <div className="pt-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                  <Heart className="w-4 h-4 fill-current" /> {post.likes}
                </div>
                <Button asChild variant="ghost" className="rounded-full gap-2 text-xs font-bold hover:bg-primary/10 hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>Đọc tiếp <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {publishedPosts.length === 0 && (
        <div className="py-20 text-center opacity-30 italic">Chưa có bài viết nào được đăng tải.</div>
      )}
    </div>
  );
}
