import React, { useState } from "react";
import { ShoppingCart, Star, Zap } from "lucide-react";
import moletomImg from "@assets/moletom_mc_lorenzo.webp";

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  bg: string;
  image?: string;
  tag?: string;
  stars: number;
  reviews: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Camiseta Preta MC Lorenzo",
    price: 89.90,
    oldPrice: 119.90,
    emoji: "👕",
    bg: "from-blue-400 to-blue-600",
    tag: "MAIS VENDIDO",
    stars: 5,
    reviews: 214,
  },
  {
    id: 2,
    name: "Boné Azul Oficial",
    price: 59.90,
    emoji: "🧢",
    bg: "from-yellow-300 to-orange-400",
    stars: 5,
    reviews: 98,
  },
  {
    id: 3,
    name: "Mochila MC Lorenzo",
    price: 129.90,
    oldPrice: 159.90,
    emoji: "🎒",
    bg: "from-purple-400 to-pink-500",
    tag: "LANÇAMENTO",
    stars: 4,
    reviews: 57,
  },
  {
    id: 4,
    name: "Caneca Braba",
    price: 39.90,
    emoji: "☕",
    bg: "from-green-400 to-teal-500",
    stars: 5,
    reviews: 132,
  },
  {
    id: 5,
    name: "Moletom Exclusivo",
    price: 149.90,
    oldPrice: 199.90,
    emoji: "🏆",
    bg: "from-indigo-500 to-blue-700",
    image: moletomImg,
    tag: "OFERTA",
    stars: 5,
    reviews: 76,
  },
  {
    id: 6,
    name: "Kit Adesivos (50 un.)",
    price: 19.90,
    emoji: "⭐",
    bg: "from-pink-400 to-red-400",
    stars: 5,
    reviews: 341,
  },
  {
    id: 7,
    name: "Squeeze MC Lorenzo",
    price: 49.90,
    emoji: "🥤",
    bg: "from-orange-400 to-yellow-400",
    stars: 4,
    reviews: 44,
  },
  {
    id: 8,
    name: "Capinha Celular",
    price: 44.90,
    oldPrice: 64.90,
    emoji: "📱",
    bg: "from-cyan-400 to-blue-500",
    tag: "TOP",
    stars: 5,
    reviews: 189,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export function ProductsSection() {
  const [added, setAdded] = useState<number | null>(null);

  function handleAdd(id: number) {
    setAdded(id);
    setTimeout(() => setAdded(null), 1200);
  }

  return (
    <section id="loja" className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="container mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
            🛍️ Loja Oficial
          </span>
          <h2
            className="text-4xl md:text-6xl font-bold text-blue-700 mb-3"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            Produtos do Lorenzo!
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Garanta seu item exclusivo e mostre que você é o maior fã! 🔥
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1"
            >
              {/* Tag */}
              {p.tag && (
                <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                  <Zap className="h-2.5 w-2.5" />
                  {p.tag}
                </div>
              )}

              {/* Image area — square */}
              <div className="aspect-square overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className={`bg-gradient-to-br ${p.bg} w-full h-full flex items-center justify-center`}>
                    <span className="text-6xl md:text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none">
                      {p.emoji}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">MC Lorenzo</p>
                <h3
                  className="text-gray-800 font-bold text-sm md:text-base leading-tight mb-2"
                  style={{ fontFamily: "'Fredoka One', sans-serif" }}
                >
                  {p.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  <Stars count={p.stars} />
                  <span className="text-xs text-gray-400">({p.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-3">
                  {p.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      R$ {p.oldPrice.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  <span
                    className="text-blue-600 font-bold text-lg"
                    style={{ fontFamily: "'Fredoka One', sans-serif" }}
                  >
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(p.id)}
                  className={`w-full py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    added === p.id
                      ? "bg-green-500 text-white scale-95"
                      : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                  }`}
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {added === p.id ? "Adicionado! ✓" : "COMPRAR"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            🛒 Ver todos os produtos
          </button>
        </div>
      </div>
    </section>
  );
}
