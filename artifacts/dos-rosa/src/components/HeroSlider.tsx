import React, { useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import bannerFreteGratis from "@assets/banner_frete_gratis.webp";
import bannerLojaRoupas from "@assets/banner_loja_roupas.webp";

const slides = [
  {
    image: bannerFreteGratis,
    alt: "Frete Grátis a partir de R$ 350",
    link: "#loja",
  },
  {
    image: bannerLojaRoupas,
    alt: "Conforto e estilo juntos em um só lugar",
    link: "#loja",
  },
];

export function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 4500);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div id="inicio" className="relative w-full bg-gray-900">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0">
              <a href={slide.link} className="block w-full cursor-pointer">
                <div className="w-full aspect-[1/1] sm:aspect-[4/3] md:aspect-[21/9] lg:aspect-[3/1] max-h-[620px] overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.alt}
                    className="block w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-between px-3 md:px-6 pointer-events-none z-20">
        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto bg-white/80 hover:bg-white text-primary rounded-full shadow-lg h-10 w-10 md:h-12 md:w-12"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
          <span className="sr-only">Anterior</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="pointer-events-auto bg-white/80 hover:bg-white text-primary rounded-full shadow-lg h-10 w-10 md:h-12 md:w-12"
          onClick={scrollNext}
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
          <span className="sr-only">Próximo</span>
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "bg-primary w-8"
                : "bg-white/70 hover:bg-white w-3"
            }`}
            onClick={() => scrollTo(index)}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
