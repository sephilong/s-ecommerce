
'use client';

import * as Slider from '@radix-ui/react-slider';
import { formatVND } from '@/lib/currency';
import { Input } from '@/components/ui/input';

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: number[];
  histogram?: { min: number; max: number; count: number }[];
  onChange: (val: number[]) => void;
  onCommit: () => void;
}

export function PriceRangeFilter({ min, max, value, histogram, onChange, onCommit }: PriceRangeFilterProps) {
  return (
    <div className="px-1 pt-4">
      {/* Price histogram bars */}
      {histogram && (
        <div className="flex items-end gap-1 h-12 mb-4" aria-hidden>
          {histogram.map((bucket, i) => {
            const maxCount = Math.max(...histogram.map(b => b.count));
            const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
            const isInRange = bucket.min >= value[0] && bucket.max <= value[1];
            return (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-500 ${isInRange ? 'bg-primary' : 'bg-white/5'}`}
                style={{ height: `${Math.max(height, 5)}%` }}
              />
            );
          })}
        </div>
      )}

      {/* Slider */}
      <Slider.Root
        min={min} 
        max={max} 
        step={100000}
        value={value}
        onValueChange={onChange}
        onValueCommit={onCommit}
        className="relative flex items-center select-none h-5 w-full cursor-pointer"
        aria-label="Khoảng giá"
      >
        <Slider.Track className="bg-white/10 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-primary rounded-full h-full shadow-[0_0_10px_rgba(151,87,234,0.5)]" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-primary rounded-full hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-primary shadow-xl" aria-label="Giá tối thiểu" />
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-primary rounded-full hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-primary shadow-xl" aria-label="Giá tối đa" />
      </Slider.Root>

      {/* Price inputs */}
      <div className="flex items-center gap-3 mt-6">
        <div className="relative flex-1">
           <Input
            type="number"
            value={value[0]}
            onChange={e => onChange([Number(e.target.value), value[1]])}
            onBlur={onCommit}
            className="h-9 px-2 text-xs text-center rounded-xl bg-white/5 border-white/10"
          />
        </div>
        <span className="text-muted-foreground opacity-30">–</span>
        <div className="relative flex-1">
          <Input
            type="number"
            value={value[1]}
            onChange={e => onChange([value[0], Number(e.target.value)])}
            onBlur={onCommit}
            className="h-9 px-2 text-xs text-center rounded-xl bg-white/5 border-white/10"
          />
        </div>
      </div>
      
      <div className="flex justify-between text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-2 px-1">
        <span className="italic">{formatVND(value[0])}</span>
        <span className="italic">{formatVND(value[1])}</span>
      </div>

      {/* Quick price presets */}
      <div className="flex flex-wrap gap-2 mt-6">
        {PRICE_PRESETS.map(preset => (
          <button
            key={preset.label}
            onClick={() => {
              onChange([preset.min, preset.max]);
              onCommit();
            }}
            className="text-[9px] font-bold border border-white/10 rounded-full px-3 py-1.5 hover:bg-primary hover:text-white hover:border-primary transition-all uppercase tracking-tighter"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const PRICE_PRESETS = [
  { label: 'Dưới 1tr', min: 0, max: 1000000 },
  { label: '1tr–5tr', min: 1000000, max: 5000000 },
  { label: '5tr–10tr', min: 5000000, max: 10000000 },
  { label: 'Trên 10tr', min: 10000000, max: 100000000 },
];
