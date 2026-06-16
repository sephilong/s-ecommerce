
"use client";

import { useBlogStore, BlogPost } from "@/store/blogStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Newspaper,
  FileEdit,
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useMemo } from "react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import React from "react";

export default function AdminBlogPage() {
  const { posts, addPost, updatePost, deletePost } = useBlogStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    image: "https://picsum.photos/seed/blog/800/400",
    category: "Tin tức",
    author: "Admin",
    status: "published"
  });

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [posts, searchTerm]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingPost) {
      updatePost(editingPost.id, formData);
      toast({ title: "Đã cập nhật bài viết!" });
    } else {
      const slug = formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      const newPost: BlogPost = {
        ...formData,
        id: `post-${Date.now()}`,
        slug: `${slug}-${Math.random().toString(36).substring(7)}`,
        likes: 0,
        createdAt: new Date().toISOString(),
      } as BlogPost;
      addPost(newPost);
      toast({ title: "Đã đăng bài viết mới!" });
    }
    setIsAddOpen(false);
    setEditingPost(null);
    setFormData({ 
      title: "", 
      excerpt: "", 
      content: "", 
      category: "Tin tức", 
      author: "Admin", 
      status: "published", 
      image: "https://picsum.photos/seed/blog/800/400" 
    });
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Newspaper className="w-7 h-7" />
            </div>
            CONTENT HUB
          </h1>
          <p className="text-muted-foreground font-medium pl-16 italic">Quản lý bài viết, tin tức và nội dung tiếp thị hệ thống.</p>
        </div>
        
        <div className="flex gap-3">
           <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if(!open) setEditingPost(null); }}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 px-8 font-black italic uppercase shadow-xl shadow-primary/20 gap-2">
                <Plus className="w-5 h-5" /> Viết bài mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-[#0f0f0f] border-white/10">
              <form onSubmit={handleSave} className="space-y-8 py-6 px-2">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-headline italic uppercase tracking-tighter">THIẾT LẬP NỘI DUNG</DialogTitle>
                  <DialogDescription>Tạo bài viết thu hút khách hàng và tối ưu hóa SEO cho website.</DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tiêu đề bài viết</Label>
                      <Input 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})} 
                        placeholder="Nhập tiêu đề thu hút..." 
                        required 
                        className="h-12 rounded-xl bg-white/5" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chuyên mục</Label>
                      <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tin tức">Tin tức</SelectItem>
                          <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                          <SelectItem value="Khuyến mãi">Khuyến mãi</SelectItem>
                          <SelectItem value="Đánh giá">Đánh giá</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ảnh bìa (URL)</Label>
                       <Input 
                        value={formData.image} 
                        onChange={e => setFormData({...formData, image: e.target.value})} 
                        className="h-12 rounded-xl bg-white/5" 
                        placeholder="https://images.unsplash.com/..." 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Trạng thái xuất bản</Label>
                       <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                        <SelectTrigger className="h-12 rounded-xl bg-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Công khai (Live)</SelectItem>
                          <SelectItem value="draft">Bản nháp (Draft)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mô tả ngắn (Trích dẫn hiển thị ở danh sách)</Label>
                  <Textarea 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                    placeholder="Viết một đoạn ngắn tóm tắt nội dung bài viết..." 
                    className="rounded-2xl h-24 bg-white/5" 
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nội dung bài viết (Hỗ trợ định dạng văn bản)</Label>
                  <Textarea 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    placeholder="Kể câu chuyện của bạn hoặc chia sẻ kiến thức tại đây..." 
                    className="min-h-[400px] rounded-2xl font-mono text-sm p-6 bg-white/5 border-white/10" 
                  />
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full h-16 rounded-2xl font-black italic uppercase tracking-tighter shadow-2xl shadow-primary/30 text-lg">
                    {editingPost ? 'Cập nhật bài viết' : 'Xuất bản bài viết ngay'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
             <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Tìm theo tiêu đề..." 
                  className="pl-10 h-11 rounded-xl bg-background/50 border-white/10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-11 border-white/10 gap-2"><Filter className="w-4 h-4" /> Lọc</Button>
                <div className="h-11 w-px bg-white/5 mx-2" />
                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground px-2">
                   <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {posts.filter(p => p.status === 'published').length} Live</div>
                   <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-orange-500" /> {posts.filter(p => p.status === 'draft').length} Draft</div>
                </div>
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/20 border-b border-white/5">
                <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  <th className="p-6">Thông tin bài viết</th>
                  <th className="p-6 text-center">Tương tác</th>
                  <th className="p-6 text-center">Trạng thái</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="h-16 w-16 relative rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-background">
                             <Image src={post.image} alt={post.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                             <div className="font-bold text-base truncate max-w-md group-hover:text-primary transition-colors italic tracking-tight">{post.title}</div>
                             <div className="text-[10px] text-muted-foreground uppercase font-black italic tracking-widest mt-1.5 flex items-center gap-2">
                               <Badge variant="outline" className="text-[8px] bg-white/5">{post.category}</Badge>
                               <span>•</span>
                               <span>Bởi {post.author}</span>
                               <span>•</span>
                               <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full text-xs font-black text-primary italic border border-primary/20">
                          <MessageSquare className="w-3.5 h-3.5" /> {post.likes}
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase italic">
                          {post.status === 'published' ? 'Live' : 'Draft'}
                       </Badge>
                    </td>
                    <td className="p-6 text-right">
                       <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 h-10 w-10"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 bg-[#0f0f0f] border-white/10 z-[100] shadow-2xl">
                             <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest italic">Tác vụ Content</DropdownMenuLabel>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" onSelect={() => startEdit(post)}>
                                <FileEdit className="w-4 h-4" /> Chỉnh sửa nội dung
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer focus:bg-white/5" asChild>
                                <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center">
                                   <Eye className="w-4 h-4 text-muted-foreground" /> Xem thực tế trên web
                                </Link>
                             </DropdownMenuItem>
                             <DropdownMenuSeparator className="bg-white/5" />
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onSelect={() => deletePost(post.id)}>
                                <Trash2 className="w-4 h-4" /> Xóa vĩnh viễn
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                       </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
