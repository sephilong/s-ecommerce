
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Banner } from "@/lib/store-data";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";

export function HeroCarousel({ banners }: { banners: Banner[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full relative group"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {banners.filter(b => b.isActive).map((banner) => (
          <CarouselItem key={banner.id}>
            <div className="relative h-[500px] md:h-[600px] w-full flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover opacity-60"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
              
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl space-y-6 animate-in slide-in-from-left duration-700">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold">
                    {banner.type === 'product' ? 'Sản phẩm nổi bật' : 'Chương trình ưu đãi'}
                  </div>
                  <h1 className="text-4xl md:text-7xl font-bold font-headline leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button asChild size="lg" className="rounded-full px-8 gap-2 group">
                      <Link href={banner.link}>
                        Khám phá ngay
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden group-hover:block transition-opacity">
        <CarouselPrevious className="left-8" />
        <CarouselNext className="right-8" />
      </div>
    </Carousel>
  );
}
