
"use client";

import { useBlogStore } from "@/store/blogStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Heart, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import React from "react";

export function BlogListPageContent() {
  const { posts } = useBlogStore();
  const publishedPosts = posts.filter(p => p.status === 'published');

  return (
    <div className="container mx-auto px-4 py-16 space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-primary/10 text-primary border-none uppercase tracking-widest font-black italic px-4 py-1">
             <TrendingUp className="w-3 h-3 mr-2" /> Content Hub
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black font-headline italic tracking-tighter uppercase leading-none">
            Tin tức & <br /> Trải nghiệm
          </h1>
          <p className="text-muted-foreground text-lg italic leading-relaxed">
            Khám phá thế giới công nghệ, xu hướng bán lẻ hiện đại và những mẹo tối ưu gian hàng hiệu quả nhất từ S-Com Hub.
          </p>
        </div>
        <div className="flex gap-4 pb-2">
           {['Tất cả', 'Công nghệ', 'Kinh doanh', 'Mẹo vặt'].map(tag => (
             <Button key={tag} variant="ghost" className="rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all">
                {tag}
             </Button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {publishedPosts.map((post) => (
          <Card key={post.id} className="bg-card/40 border-white/5 overflow-hidden group hover:border-primary/50 transition-all rounded-[2.5rem] shadow-2xl">
            <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden">
              <Image 
                src={post.image} 
                alt={post.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Badge className="absolute top-6 left-6 bg-primary/80 backdrop-blur-md border-none px-4 py-1 shadow-xl font-black italic uppercase text-[10px]">
                {post.category}
              </Badge>
            </Link>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-4 text-[10px] uppercase font-black text-muted-foreground tracking-widest italic">
                <span className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> 
                  {format(new Date(post.createdAt), 'dd/MM/yyyy', { locale: vi })}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-primary" /> 
                  {post.author}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 uppercase italic tracking-tighter">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              
              <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed italic opacity-80">
                {post.excerpt}
              </p>
              
              <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-primary text-xs font-black italic uppercase">
                  <Heart className="w-4 h-4 fill-current" /> {post.likes} Lượt thích
                </div>
                <Button asChild variant="link" className="p-0 h-auto gap-2 text-xs font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    Xem chi tiết <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {publishedPosts.length === 0 && (
        <div className="py-40 text-center space-y-6 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
             <Calendar className="w-10 h-10 text-muted-foreground opacity-20" />
          </div>
          <p className="text-muted-foreground italic font-medium">Chưa có bài viết nào được đăng tải trong chuyên mục này.</p>
        </div>
      )}
    </div>
  );
}
