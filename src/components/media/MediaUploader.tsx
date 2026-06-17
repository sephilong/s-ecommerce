
"use client";

import { useState, useRef } from "react";
import { useMediaStore } from "@/store/mediaStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, CheckCircle2, Loader2, AlertCircle, FileVideo, ImageIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaUploaderProps {
  category: 'product' | 'banner' | 'avatar' | 'review';
  onUploadSuccess?: (url: string) => void;
  defaultValue?: string;
  className?: string;
  acceptVideo?: boolean;
}

export function MediaUploader({ category, onUploadSuccess, defaultValue, className, acceptVideo }: MediaUploaderProps) {
  const { uploadPipeline, isUploading, uploadProgress } = useMediaStore();
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadPipeline(file, category);
      setPreview(url);
      if (onUploadSuccess) onUploadSuccess(url);
      toast({ title: "Tải lên thành công", description: `Đã tối ưu hóa và đẩy lên CDN: ${file.name}` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi Media", description: error.message });
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onUploadSuccess) onUploadSuccess("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={cn(
          "relative h-56 w-full border-2 border-dashed rounded-[2.5rem] transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer",
          isUploading ? "bg-white/5 border-primary/20" : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10",
          preview ? "border-solid bg-background" : ""
        )}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
               <Button size="icon" variant="destructive" className="rounded-full h-10 w-10 shadow-xl" onClick={removeMedia}>
                  <X className="w-5 h-5" />
               </Button>
            </div>
            <Badge className="absolute top-4 left-4 bg-green-500 text-white border-none text-[8px] font-black italic uppercase px-3 shadow-lg">
              <CheckCircle2 className="w-2.5 h-2.5 mr-1.5" /> CDN OPTIMIZED
            </Badge>
          </>
        ) : (
          <div className="text-center space-y-4 p-8">
            <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary mx-auto">
              {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
            </div>
            <div className="space-y-1">
               <p className="font-bold text-sm">Nhấn để tải lên {acceptVideo ? 'Media' : 'Ảnh'}</p>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                 Max: {category === 'product' ? '10MB' : '5MB'} • WebP/JPG/PNG
               </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-12 space-y-6">
             <div className="space-y-2 text-center">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Media Pipeline Active</p>
                <h4 className="text-sm font-bold text-white">Đang tối ưu hóa & nén ảnh...</h4>
             </div>
             <div className="w-full space-y-2">
                <Progress value={uploadProgress} className="h-1.5 w-full bg-white/10" />
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                   <span>Processing</span>
                   <span>{uploadProgress}%</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
         <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
         <div className="space-y-1">
            <p className="text-[10px] text-white/90 font-bold uppercase tracking-wider">Cloud CDN Auto-optimization</p>
            <p className="text-[9px] text-indigo-300/80 leading-relaxed italic">
              Ảnh của bạn sẽ tự động được chuyển sang định dạng **WebP**, tạo ra 3 phiên bản kích thước và phân phối qua hệ thống Edge Network để đảm bảo tốc độ tải trang nhanh nhất toàn cầu.
            </p>
         </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept={acceptVideo ? "image/*,video/*" : "image/*"}
      />
    </div>
  );
}
