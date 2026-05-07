import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories, type PublicCategory } from "@/lib/publicApi";

function wixWebp(filename: string, w: number, h: number) {
  return `https://static.wixstatic.com/media/${filename}/v1/fill/w_${w},h_${h},al_c,q_85,enc_webp/file.webp`;
}

const FALLBACK_CATS = [
  { id: "1", name: "Camisetas", image_url: wixWebp("503d91_b0ca1de8b57743dca914798f62612351~mv2.jpg", 800, 600), color: "from-blue-500/80", emoji: "👕", sort_order: 0 },
  { id: "2", name: "Bonés", image_url: wixWebp("503d91_d041e52a2ff74e5bb3a1eab057f46607~mv2.jpg", 800, 600), color: "from-yellow-500/80", emoji: "🧢", sort_order: 1 },
  { id: "3", name: "Mochilas", image_url: wixWebp("503d91_0efc307f92c74803b0dfa876770d62d1~mv2.jpg", 800, 600), color: "from-purple-500/80", emoji: "🎒", sort_order: 2 },
  { id: "4", name: "Acessórios", image_url: wixWebp("503d91_6fe42c0b0ed243cfbfba7dff26f3d41e~mv2.jpg", 800, 600), color: "from-pink-500/80", emoji: "⭐", sort_order: 3 },
];

const GRAD_COLORS = ["from-blue-500/80", "from-yellow-500/80", "from-purple-500/80", "from-pink-500/80", "from-green-500/80", "from-orange-500/80"];
const EMOJIS = ["👕", "🧢", "🎒", "⭐", "👟", "🎤"];

interface Props {
  onSelectCategory?: (id: string | null, name: string) => void;
  selectedId?: string | null;
}

export function CategoryGrid({ onSelectCategory, selectedId }: Props) {
  const { data: apiCats } = useQuery({
    queryKey: ["public-categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const cats = apiCats && apiCats.length > 0
    ? apiCats.map((c, i) => ({ ...c, color: GRAD_COLORS[i % GRAD_COLORS.length], emoji: EMOJIS[i % EMOJIS.length] }))
    : FALLBACK_CATS;

  function handleClick(e: React.MouseEvent, cat: { id: string; name: string }) {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory(selectedId === cat.id ? null : cat.id, cat.name);
    }
  }

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
            O que você quer? 🤩
          </h2>
          <p className="text-gray-400 text-base">Escolha sua categoria favorita!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
          {cats.map((cat, index) => (
            <a
              key={cat.id}
              href="#loja"
              onClick={(e) => handleClick(e, cat)}
              className={`group block relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${selectedId === cat.id ? "ring-4 ring-primary ring-offset-2" : ""}`}
            >
              {cat.image_url ? (
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <span className="text-7xl">{cat.emoji}</span>
                </div>
              )}
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/10 to-transparent`} />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-center justify-end gap-1">
                <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                <h3 className="text-white text-2xl md:text-4xl text-center drop-shadow-lg" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>{cat.name}</h3>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-white/30 mt-1 group-hover:bg-white/40 transition-colors">
                  Ver produtos →
                </span>
              </div>
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/50 rounded-3xl transition-colors duration-300 pointer-events-none" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
