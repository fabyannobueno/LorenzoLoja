import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/lib/publicApi";

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { data: banners, isLoading } = useQuery({
    queryKey: ["public-banners"],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !banners?.length) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, banners]);

  if (isLoading) {
    return (
      <div id="inicio" className="w-full aspect-[4/3] md:aspect-[21/9] lg:aspect-[3/1] md:max-h-[620px] bg-gray-100">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <div id="inicio" className="w-full h-[200px] md:h-[340px] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center gap-3 text-blue-300">
        <ImageOff className="h-10 w-10" />
        <p className="text-sm">Nenhum banner cadastrado</p>
      </div>
    );
  }

  return (
    <div id="inicio" className="relative w-full bg-gray-900">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {banners.map((slide, index) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0">
              <a href={slide.link_url ?? "#loja"} className="block w-full cursor-pointer">
                <div className="w-full h-[200px] sm:h-auto sm:aspect-[4/3] md:aspect-[21/9] lg:aspect-[3/1] md:max-h-[620px] overflow-hidden">
                  <img
                    src={slide.image_url}
                    alt={slide.title ?? "Banner"}
                    className="block w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between px-3 md:px-6 pointer-events-none z-20">
            <Button variant="ghost" size="icon" className="pointer-events-auto bg-white/80 hover:bg-white text-primary rounded-full shadow-lg h-10 w-10 md:h-12 md:w-12" onClick={scrollPrev}>
              <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
            <Button variant="ghost" size="icon" className="pointer-events-auto bg-white/80 hover:bg-white text-primary rounded-full shadow-lg h-10 w-10 md:h-12 md:w-12" onClick={scrollNext}>
              <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`h-3 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-primary w-8" : "bg-white/70 hover:bg-white w-3"}`}
                onClick={() => scrollTo(index)}
              >
                <span className="sr-only">Slide {index + 1}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
