
'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileFilterSheet({ activeCount, children }: { activeCount: number, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f]/90 backdrop-blur-xl border-t border-white/5 p-4 flex gap-4 lg:hidden z-[100] shadow-2xl">
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className="flex-1 rounded-2xl h-14 font-black italic uppercase tracking-tighter gap-3 border-white/10"
        >
          <Filter className="w-5 h-5 text-primary" />
          BỘ LỌC {activeCount > 0 && <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center not-italic ml-1 shadow-lg shadow-primary/40">{activeCount}</span>}
        </Button>
        <Button className="flex-1 rounded-2xl h-14 font-black italic uppercase tracking-tighter gap-3">
           <SlidersHorizontal className="w-5 h-5" />
           SẮP XẾP
        </Button>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] rounded-t-[2.5rem] z-[201] max-h-[92vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-white/10">
            <div className="flex items-center justify-between p-6 border-b border-white/5 shrink-0">
              <Dialog.Title className="font-black italic text-xl uppercase tracking-tighter">BỘ LỌC SẢN PHẨM</Dialog.Title>
              <Dialog.Close asChild>
                <button className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" aria-label="Đóng">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar pb-32">
              {children}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f] to-transparent pt-12">
              <Dialog.Close asChild>
                <Button className="w-full h-16 rounded-2xl font-black italic uppercase tracking-tighter text-lg shadow-2xl shadow-primary/30">
                  XEM KẾT QUẢ
                </Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
