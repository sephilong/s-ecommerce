
"use client";

import { useBuilderStore, SectionType, SectionConfig } from "@/store/builderStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Settings2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Save, 
  Eye,
  Type,
  Palette,
  Layers,
  ChevronLeft,
  Search,
  Sparkles,
  Layout,
  MousePointer2
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { useVendorStore } from "@/store/vendorStore";
import { useUserStore } from "@/store/userStore";
import Image from "next/image";
import { formatVND } from "@/lib/currency";

export default function StorefrontBuilderPage() {
  const { sections, theme, activeSectionId, addSection, removeSection, setActiveSection, updateSection, updateTheme } = useBuilderStore();
  const { profile } = useUserStore();
  const { getVendorByUserId } = useVendorStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const vendor = profile ? getVendorByUserId(profile.email) : null;
  const activeSection = sections.find(s => s.id === activeSectionId);

  const handlePublish = () => {
    toast({ title: "Đã xuất bản!", description: "Giao diện mới của bạn đã được cập nhật thành công." });
  };

  return (
    <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
      {/* Left Sidebar: Section List & Toolbar */}
      <aside className="w-80 border-r border-white/5 bg-[#0f0f0f] flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/vendor/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-bold uppercase tracking-widest">Editor</span>
          </Link>
          <Badge variant="outline" className="text-[10px] uppercase border-primary/30 text-primary bg-primary/5">Beta</Badge>
        </div>

        <Tabs defaultValue="sections" className="flex-1 flex flex-col">
          <TabsList className="bg-transparent border-b border-white/5 h-12 p-0 rounded-none w-full justify-start px-4 gap-4">
            <TabsTrigger value="sections" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 font-bold text-xs uppercase">Bố cục</TabsTrigger>
            <TabsTrigger value="theme" className="data-[state=active]:bg-transparent data-[state=active]:text-primary border-b-2 border-transparent data-[state=active]:border-primary rounded-none h-full px-0 font-bold text-xs uppercase">Chủ đề</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sections" className="flex-1 overflow-y-auto p-4 space-y-6 m-0 custom-scrollbar">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Cấu trúc trang</h3>
              <div className="space-y-2">
                {sections.map((s, idx) => (
                  <div 
                    key={s.id} 
                    onClick={() => setActiveSection(s.id)}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${activeSectionId === s.id ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-black/40 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </div>
                      <span className="text-sm font-bold capitalize">{s.type.replace('_', ' ')}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                      onClick={(e) => { e.stopPropagation(); removeSection(s.id); }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Thêm thành phần</h3>
              <div className="grid grid-cols-2 gap-2">
                <AddSectionButton icon={<Layout />} label="Hero" onClick={() => addSection('hero')} />
                <AddSectionButton icon={<Plus />} label="Banner" onClick={() => addSection('banner')} />
                <AddSectionButton icon={<Search />} label="Sản phẩm" onClick={() => addSection('product_grid')} />
                <AddSectionButton icon={<Sparkles />} label="Flash Sale" onClick={() => addSection('flash_sale')} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="theme" className="flex-1 overflow-y-auto p-6 space-y-8 m-0">
             <div className="space-y-4">
                <Label className="text-xs uppercase font-black text-muted-foreground">Màu thương hiệu</Label>
                <div className="grid grid-cols-5 gap-3">
                   {['266 79% 63%', '200 95% 45%', '142 76% 36%', '0 84% 60%', '45 93% 47%'].map(c => (
                     <button 
                       key={c}
                       onClick={() => updateTheme({ primaryColor: c })}
                       className={`h-8 w-8 rounded-full border-2 ${theme.primaryColor === c ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent'}`}
                       style={{ backgroundColor: `hsl(${c})` }}
                     />
                   ))}
                </div>
             </div>
             <div className="space-y-4">
                <Label className="text-xs uppercase font-black text-muted-foreground">Bo góc thành phần</Label>
                <div className="grid grid-cols-3 gap-2">
                   {['0px', '12px', '24px'].map(r => (
                     <Button 
                       key={r}
                       variant={theme.borderRadius === r ? 'default' : 'outline'}
                       size="sm"
                       onClick={() => updateTheme({ borderRadius: r })}
                       className="rounded-xl h-10"
                     >
                       {r === '0px' ? 'Vuông' : r === '12px' ? 'Vừa' : 'Tròn'}
                     </Button>
                   ))}
                </div>
             </div>
          </TabsContent>
        </Tabs>
      </aside>

      {/* Center Viewport: Preview */}
      <main className="flex-1 flex flex-col relative bg-[#111]">
        {/* Top bar for devices and actions */}
        <header className="h-14 border-b border-white/5 bg-[#0f0f0f] flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
            <DeviceButton active={viewMode === 'desktop'} onClick={() => setViewMode('desktop')} icon={<Monitor />} />
            <DeviceButton active={viewMode === 'tablet'} onClick={() => setViewMode('tablet')} icon={<Tablet />} />
            <DeviceButton active={viewMode === 'mobile'} onClick={() => setViewMode('mobile')} icon={<Smartphone />} />
          </div>

          <div className="flex items-center gap-3">
             <Button variant="ghost" className="rounded-full gap-2 text-xs font-bold" asChild>
                <Link href={`/shop/${vendor?.storeSlug || 'demo'}`} target="_blank"><Eye className="w-4 h-4" /> Xem trước</Link>
             </Button>
             <Button className="rounded-full px-8 h-9 font-bold shadow-xl shadow-primary/20 gap-2" onClick={handlePublish}>
                <Save className="w-4 h-4" /> Xuất bản ngay
             </Button>
          </div>
        </header>

        {/* The Preview Iframe/Container */}
        <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
           <div className={`bg-background shadow-2xl transition-all duration-500 overflow-y-auto custom-scrollbar border border-white/10 ${
             viewMode === 'desktop' ? 'w-full h-full rounded-none' : 
             viewMode === 'tablet' ? 'w-[768px] h-[90%] rounded-[2rem]' : 
             'w-[375px] h-[80%] rounded-[3rem]'
           }`}>
             <div className="min-h-full pb-20">
               {/* Header Preview */}
               <div className="h-16 border-b border-white/5 px-6 flex items-center justify-between bg-card/30 backdrop-blur-md sticky top-0 z-50">
                  <span className="font-bold text-xl font-headline italic tracking-tighter" style={{ color: `hsl(${theme.primaryColor})` }}>
                    {vendor?.storeName || 'Cửa hàng của bạn'}
                  </span>
                  <div className="flex gap-4">
                    <div className="h-4 w-12 bg-white/10 rounded-full" />
                    <div className="h-4 w-12 bg-white/10 rounded-full" />
                  </div>
               </div>

               {/* Render Sections */}
               {sections.map((section) => (
                 <div 
                   key={section.id} 
                   onClick={() => setActiveSection(section.id)}
                   className={`relative group/section cursor-pointer transition-all ${activeSectionId === section.id ? 'ring-2 ring-primary ring-inset' : 'hover:ring-1 hover:ring-white/20'}`}
                 >
                   <SectionRenderer section={section} theme={theme} vendor={vendor} />
                   
                   {/* Selection Overlay Buttons */}
                   {activeSectionId === section.id && (
                     <div className="absolute top-2 right-2 flex gap-1 z-30 animate-in fade-in zoom-in">
                       <Button size="icon" className="h-8 w-8 rounded-full bg-primary shadow-lg"><Settings2 className="w-4 h-4" /></Button>
                       <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-lg" onClick={() => removeSection(section.id)}><Trash2 className="w-4 h-4" /></Button>
                     </div>
                   )}
                 </div>
               ))}

               {sections.length === 0 && (
                 <div className="py-40 text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mx-auto border border-dashed border-white/10">
                       <Plus className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground italic">Trang chưa có thành phần nào. Hãy kéo thả từ thanh bên trái.</p>
                 </div>
               )}
             </div>
           </div>
        </div>
      </main>

      {/* Right Sidebar: Properties Panel */}
      <aside className="w-80 border-l border-white/5 bg-[#0f0f0f] shrink-0">
         {activeSection ? (
           <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
             <div className="p-6 border-b border-white/5">
                <h2 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Settings2 className="w-4 h-4" /> Thuộc tính: {activeSection.type}
                </h2>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Content Editor */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2">Nội dung hiển thị</h3>
                   {Object.keys(activeSection.content).map(key => (
                     <div key={key} className="space-y-2">
                        <Label className="text-xs capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                        <Input 
                          value={activeSection.content[key]} 
                          onChange={(e) => {
                            const newContent = { ...activeSection.content, [key]: e.target.value };
                            updateSection(activeSection.id, { content: newContent });
                          }}
                          className="h-10 rounded-xl bg-background/50 border-white/10"
                        />
                     </div>
                   ))}
                </div>

                {/* Style Editor */}
                <div className="space-y-6">
                   <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-white/5 pb-2">Định dạng & Bố cục</h3>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-xs">Lề trên</Label>
                         <Input 
                           placeholder="80px" 
                           value={activeSection.styles.paddingTop} 
                           onChange={(e) => updateSection(activeSection.id, { styles: { ...activeSection.styles, paddingTop: e.target.value } })}
                           className="h-9 rounded-lg"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-xs">Lề dưới</Label>
                         <Input 
                           placeholder="80px" 
                           value={activeSection.styles.paddingBottom} 
                           onChange={(e) => updateSection(activeSection.id, { styles: { ...activeSection.styles, paddingBottom: e.target.value } })}
                           className="h-9 rounded-lg"
                         />
                      </div>
                   </div>
                </div>
             </div>
           </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
              <div className="h-16 w-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                 <MousePointer2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <p className="font-bold text-sm">Chưa có mục nào được chọn</p>
                 <p className="text-xs">Hãy nhấn vào một thành phần ở giữa màn hình để bắt đầu tùy chỉnh chi tiết.</p>
              </div>
           </div>
         )}
      </aside>
    </div>
  );
}

function SectionRenderer({ section, theme, vendor }: { section: SectionConfig, theme: any, vendor: any }) {
  const products = vendor?.products || [];

  switch (section.type) {
    case 'hero':
      return (
        <section 
          className="relative overflow-hidden flex items-center justify-center text-center" 
          style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}
        >
          <div className="absolute inset-0 z-0">
             <Image src={section.content.imageUrl || 'https://picsum.photos/seed/hero/1200/600'} alt="Hero" fill className="object-cover opacity-50" />
             <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="container px-4 relative z-10 space-y-6 max-w-3xl">
             <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">{section.content.title}</h1>
             <p className="text-lg text-muted-foreground leading-relaxed">{section.content.subtitle}</p>
             <Button className="rounded-full px-12 h-14 font-black italic shadow-2xl" style={{ backgroundColor: `hsl(${theme.primaryColor})`, borderRadius: theme.borderRadius }}>
               {section.content.buttonText}
             </Button>
          </div>
        </section>
      );

    case 'product_grid':
      return (
        <section className="container px-4" style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8">{section.content.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(products.length > 0 ? products.slice(0, section.content.limit || 4) : [1,2,3,4]).map((p: any, i: number) => (
              <div key={i} className="bg-card/50 border border-white/5 p-4 space-y-4" style={{ borderRadius: theme.borderRadius }}>
                 <div className="aspect-square bg-white/5 rounded-xl overflow-hidden relative">
                    {p.image && <Image src={p.image} alt="p" fill className="object-cover" />}
                 </div>
                 <div className="space-y-1">
                    <p className="font-bold text-sm line-clamp-1">{p.name || `Sản phẩm mẫu ${i+1}`}</p>
                    <p className="font-black text-primary" style={{ color: `hsl(${theme.primaryColor})` }}>{p.price ? formatVND(p.price) : '990.000₫'}</p>
                 </div>
              </div>
            ))}
          </div>
        </section>
      );

    case 'banner':
       return (
         <div className="container px-4" style={{ paddingTop: section.styles.paddingTop, paddingBottom: section.styles.paddingBottom }}>
            <div className="relative aspect-[21/9] rounded-3xl overflow-hidden group/bn">
               <Image src={section.content.imageUrl} alt="Banner" fill className="object-cover group-hover/bn:scale-105 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-12">
                  <h3 className="text-3xl font-black italic text-white mb-2">{section.content.title}</h3>
                  <Button variant="secondary" className="rounded-full">Khám phá ngay</Button>
               </div>
            </div>
         </div>
       );

    default:
      return <div className="p-12 text-center border-dashed border border-white/10 m-4 rounded-3xl opacity-50">Thành phần "{section.type}" đang được phát triển...</div>;
  }
}

function AddSectionButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all group"
    >
      <div className="text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary">{label}</span>
    </button>
  );
}

function DeviceButton({ active, icon, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all ${active ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
    >
      {icon}
    </button>
  );
}

function Badge({ children, className, variant }: any) {
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[8px] font-bold ${className}`}>{children}</span>;
}
