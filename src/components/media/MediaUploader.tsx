
"use client";

import { useState, useRef } from "react";
import { useMediaStore } from "@/store/mediaStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, ImageIcon, X, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaUploaderProps {
  category: 'product' | 'banner' | 'avatar' | 'review';
  onUploadSuccess?: (url: string) => void;
  defaultValue?: string;
  className?: string;
}

export function MediaUploader({ category, onUploadSuccess, defaultValue, className }: MediaUploaderProps) {
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
      toast({ title: "Tải lên thành công", description: `Đã xử lý và tối ưu hóa ${file.name}` });
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
          "relative h-48 w-full border-2 border-dashed rounded-[2rem] transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer",
          isUploading ? "bg-white/5 border-primary/20" : "bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10",
          preview ? "border-solid" : ""
        )}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
               <Button size="icon" variant="destructive" className="rounded-full" onClick={removeMedia}>
                  <X className="w-4 h-4" />
               </Button>
            </div>
            <div className="absolute top-2 left-2">
               <Badge className="bg-green-500 text-white border-none text-[8px] font-black italic uppercase px-2"><CheckCircle2 className="w-2 h-2 mr-1" /> Optimized</Badge>
            </div>
          </>
        ) : (
          <div className="text-center space-y-3 p-6">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
            </div>
            <div>
               <p className="text-sm font-bold">Thả ảnh hoặc nhấn để chọn</p>
               <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Dung lượng tối đa: {category === 'product' ? '10MB' : '5MB'}</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 space-y-4">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] italic">Đang tối ưu hóa & CDN Upload...</p>
             <Progress value={uploadProgress} className="h-1 w-48 bg-white/10" />
             <p className="text-xs font-mono text-white/50">{uploadProgress}%</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
         <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
         <p className="text-[10px] text-indigo-400/80 italic leading-relaxed">
            Hệ thống tự động chuyển đổi sang định dạng **WebP** và tạo nhiều kích thước (thumbnail, medium, large) để tối ưu hóa tốc độ tải trang qua CDN.
         </p>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
}

function Badge({ children, className }: any) {
  return <div className={cn("px-2 py-0.5 rounded-full flex items-center", className)}>{children}</div>;
}
