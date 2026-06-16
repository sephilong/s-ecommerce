
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
  MessageSquare
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function AdminBlogPage() {
  const { posts, addPost, updatePost, deletePost } = useBlogStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    image: "https://picsum.photos/seed/blog/800/400",
    category: "Tin tức",
    author: "Admin",
    status: "published"
  });

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
    setFormData({ title: "", excerpt: "", content: "", category: "Tin tức", author: "Admin", status: "published", image: "https://picsum.photos/seed/blog/800/400" });
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData(post);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Newspaper className="w-7 h-7" />
            </div>
            CONTENT HUB
          </h1>
          <p className="text-muted-foreground font-medium pl-16">Quản lý bài viết, tin tức và nội dung tiếp thị.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full h-11 px-8 font-black italic uppercase shadow-xl shadow-primary/20 gap-2">
              <Plus className="w-4 h-4" /> Viết bài mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem]">
            <form onSubmit={handleSave} className="space-y-6 py-6 px-2">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline italic uppercase">THIẾT LẬP NỘI DUNG</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tiêu đề bài viết</Label>
                  <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nhập tiêu đề..." required className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Chuyên mục</Label>
                  <Select value={formData.category} onValueChange={(v: any) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tin tức">Tin tức</SelectItem>
                      <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                      <SelectItem value="Khuyến mãi">Khuyến mãi</SelectItem>
                      <SelectItem value="Đánh giá">Đánh giá</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả ngắn (Excerpt)</Label>
                <Textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} placeholder="Tóm tắt bài viết..." className="rounded-xl h-24" />
              </div>

              <div className="space-y-2">
                <Label>Nội dung chi tiết (Markdown supported)</Label>
                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Viết nội dung tại đây..." className="min-h-[300px] rounded-xl font-mono text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                   <Label>URL Ảnh nền</Label>
                   <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                   <Label>Trạng thái</Label>
                   <Select value={formData.status} onValueChange={(v: any) => setFormData({...formData, status: v})}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Công khai</SelectItem>
                      <SelectItem value="draft">Bản nháp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" className="w-full h-14 rounded-2xl font-black italic uppercase tracking-tighter shadow-xl shadow-primary/30">
                  {editingPost ? 'Lưu thay đổi' : 'Đăng bài ngay'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-white/5 bg-card/40 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-white/5">
                <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                  <th className="p-6">Bài viết</th>
                  <th className="p-6 text-center">Tương tác</th>
                  <th className="p-6 text-center">Trạng thái</th>
                  <th className="p-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 relative rounded-xl overflow-hidden border border-white/10 shrink-0">
                             <Image src={post.image} alt={post.title} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                             <div className="font-bold text-base truncate max-w-md group-hover:text-primary transition-colors">{post.title}</div>
                             <div className="text-[10px] text-muted-foreground uppercase font-black italic tracking-widest mt-1">
                               {post.category} • {post.author} • {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs font-bold text-primary">
                          <MessageSquare className="w-3 h-3" /> {post.likes}
                       </div>
                    </td>
                    <td className="p-6 text-center">
                       <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase italic">
                          {post.status === 'published' ? 'Public' : 'Draft'}
                       </Badge>
                    </td>
                    <td className="p-6 text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-[#0f0f0f] border-white/10">
                             <DropdownMenuLabel className="text-[10px] uppercase font-black text-muted-foreground px-4 py-3 tracking-widest">Tác vụ Content</DropdownMenuLabel>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 focus:bg-primary focus:text-white cursor-pointer" onClick={() => startEdit(post)}>
                                <FileEdit className="w-4 h-4" /> Chỉnh sửa bài
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 cursor-pointer" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                                <ExternalLink className="w-4 h-4 text-muted-foreground" /> Xem trên web
                             </DropdownMenuItem>
                             <DropdownMenuItem className="gap-3 rounded-xl p-3 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer" onClick={() => deletePost(post.id)}>
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
