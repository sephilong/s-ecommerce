
"use client";

import { useMediaStore, MediaFile } from "@/store/mediaStore";
import { formatVND } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Trash2, 
  Download, 
  Filter, 
  HardDrive, 
  ImageIcon, 
  FileVideo, 
  ExternalLink,
  MoreHorizontal,
  LayoutGrid,
  List,
  Plus
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function AdminMediaLibrary() {
  const { files, deleteFile } = useMediaStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === "all" || f.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [files, searchTerm, filterCategory]);

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDelete = (id: string) => {
    deleteFile(id);
    toast({ title: "Đã xóa", description: "Tài sản đã được gỡ khỏi CDN." });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black font-headline italic tracking-tighter uppercase flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <ImageIcon className="w-7 h-7" />
            </div>
            MEDIA CLOUD
          </h1>
          <p className="text-muted-foreground font-medium pl-16">Quản trị tài nguyên hình ảnh và CDN toàn hệ thống.</p>
        </div>
        <Button className="rounded-xl h-11 px-8 font-black italic shadow-xl shadow-primary/20 gap-2">
           <Plus className="w-4 h-4" /> UPLOAD NEW
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StorageStat label="Tổng tệp tin" value={files.length} icon={<ImageIcon />} />
        <StorageStat label="Dung lượng đã dùng" value={formatSize(totalSize)} icon={<HardDrive />} color="text-blue-500" />
        <StorageStat label="Băng thông (Ước tính)" value="1.2 TB" icon={<Download />} color="text-green-500" />
        <StorageStat label="CDN Cache Hit" value="98.5%" icon={<LayoutGrid />} color="text-orange-500" />
      </div>

      <Card className="bg-[#111] border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <CardHeader className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-6">
           <div className="flex gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <Input 
                   placeholder="Tìm tên tệp..." 
                   className="pl-10 h-11 rounded-xl bg-background/50 border-white/10" 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
              <SelectCategory value={filterCategory} onChange={setFilterCategory} />
           </div>
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-9 w-9 rounded-lg"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
           </div>
        </CardHeader>
        <CardContent className="p-8">
           {viewMode === 'grid' ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="group space-y-3">
                     <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black shadow-inner">
                        <Image src={file.url} alt={file.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                           <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => window.open(file.url, '_blank')}>
                              <ExternalLink className="w-4 h-4" />
                           </Button>
                           <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => handleDelete(file.id)}>
                              <Trash2 className="w-4 h-4" />
                           </Button>
                        </div>
                        <Badge className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md border-none text-[8px] font-mono text-white/80">
                           {file.type.split('/')[1].toUpperCase()}
                        </Badge>
                     </div>
                     <div className="px-1">
                        <p className="text-[11px] font-bold truncate">{file.name}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{formatSize(file.size)}</p>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="overflow-x-auto">
                <table className="w-full text-sm">
                   <thead className="bg-muted/30 border-b border-white/5">
                      <tr className="text-left font-black uppercase text-[10px] tracking-widest text-muted-foreground">
                         <th className="p-4">Tên tệp</th>
                         <th className="p-4">Kích thước</th>
                         <th className="p-4 text-center">Danh mục</th>
                         <th className="p-4">Ngày tải lên</th>
                         <th className="p-4"></th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="hover:bg-white/5 transition-colors">
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <div className="h-10 w-10 rounded-lg relative overflow-hidden shrink-0 border border-white/10">
                                    <Image src={file.url} alt={file.name} fill className="object-cover" />
                                 </div>
                                 <span className="font-bold text-xs">{file.name}</span>
                              </div>
                           </td>
                           <td className="p-4 text-xs font-mono">{formatSize(file.size)}</td>
                           <td className="p-4 text-center">
                              <Badge variant="outline" className="rounded-full text-[9px] uppercase">{file.category}</Badge>
                           </td>
                           <td className="p-4 text-xs text-muted-foreground italic">{new Date(file.uploadedAt).toLocaleDateString('vi-VN')}</td>
                           <td className="p-4 text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           )}

           {filteredFiles.length === 0 && (
             <div className="py-40 text-center space-y-6">
                <div className="h-20 w-20 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto opacity-30">
                   <ImageIcon className="w-10 h-10" />
                </div>
                <p className="text-muted-foreground italic font-medium">Kho tài nguyên hiện đang trống.</p>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

function StorageStat({ label, value, icon, color = "text-primary" }: any) {
  return (
    <Card className="bg-[#111] border-white/5 rounded-3xl p-6 group hover:border-primary/40 transition-all overflow-hidden relative">
       <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full group-hover:bg-primary/5 transition-colors" />
       <div className={`h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
       </div>
       <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
       <h3 className="text-2xl font-black italic tracking-tighter mt-1">{value}</h3>
    </Card>
  );
}

function SelectCategory({ value, onChange }: any) {
   const cats = [
      { label: "Tất cả", value: "all" },
      { label: "Sản phẩm", value: "product" },
      { label: "Banners", value: "banner" },
      { label: "Avatars", value: "avatar" },
      { label: "Đánh giá", value: "review" },
   ];

   return (
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
         {cats.map(c => (
            <button
               key={c.value}
               onClick={() => onChange(c.value)}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${value === c.value ? 'bg-primary text-white shadow-lg italic' : 'text-muted-foreground hover:bg-white/5'}`}
            >
               {c.label}
            </button>
         ))}
      </div>
   );
}
