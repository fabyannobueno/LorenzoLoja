import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/publicApi";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid } from "lucide-react";

const GRAD_COLORS = [
  "from-blue-500/80",
  "from-yellow-500/80",
  "from-purple-500/80",
  "from-pink-500/80",
  "from-green-500/80",
  "from-orange-500/80",
];

interface Props {
  onSelectCategory?: (id: string | null, name: string) => void;
  selectedId?: string | null;
}

export function CategoryGrid({ onSelectCategory, selectedId }: Props) {
  const { data: cats, isLoading } = useQuery({
    queryKey: ["public-categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  function handleClick(e: React.MouseEvent, id: string, name: string) {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(selectedId === id ? null : id, name);
      setTimeout(() => {
        document.getElementById("loja")?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-[1400px]">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              O que você quer? 🤩
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!cats || cats.length === 0) return null;

  const cols = cats.length <= 2 ? "grid-cols-2" : cats.length === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4";

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
            O que você quer? 🤩
          </h2>
          <p className="text-gray-400 text-base">Escolha sua categoria favorita!</p>
        </div>

        <div className={`grid ${cols} gap-4 md:gap-6`}>
          {cats.map((cat, index) => {
            const grad = GRAD_COLORS[index % GRAD_COLORS.length];
            return (
              <a
                key={cat.id}
                href="#loja"
                onClick={(e) => handleClick(e, cat.id, cat.name)}
                className={`group block relative overflow-hidden rounded-3xl aspect-[4/3] bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${
                  selectedId === cat.id ? "ring-4 ring-primary ring-offset-2" : ""
                }`}
              >
                {cat.image_url ? (
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}>
                    <LayoutGrid className="h-16 w-16 text-white/60" />
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${grad} via-black/10 to-transparent`} />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 flex flex-col items-center justify-end gap-1">
                  <h3
                    className="text-white text-xl md:text-3xl text-center drop-shadow-lg"
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    {cat.name}
                  </h3>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30 mt-1 group-hover:bg-white/40 transition-colors">
                    Ver produtos →
                  </span>
                </div>
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/50 rounded-3xl transition-colors duration-300 pointer-events-none" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
