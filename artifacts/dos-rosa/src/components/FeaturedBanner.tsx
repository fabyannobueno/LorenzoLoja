import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/publicApi";
import { ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const perks = [
  { icon: Truck, label: "Frete grátis", sub: "acima de R$ 350" },
  { icon: Shield, label: "Compra segura", sub: "pagamento protegido" },
  { icon: RotateCcw, label: "Troca fácil", sub: "em até 30 dias" },
];

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

export function FeaturedBanner() {
  const { add } = useCart();
  const [, navigate] = useLocation();

  const { data } = useQuery({
    queryKey: ["public-products-featured"],
    queryFn: () => fetchProducts({ limit: 20, page: 1 }),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const featured = data?.products.find((p) => p.is_featured) ?? data?.products[0];

  if (!featured) return null;

  const price = featured.promotional_price ?? featured.sale_price;
  const hasDiscount =
    !!featured.promotional_price && featured.promotional_price < featured.sale_price;
  const discountPct = hasDiscount
    ? Math.round((1 - featured.promotional_price! / featured.sale_price) * 100)
    : 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 px-4">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-[1200px] relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-white order-2 md:order-1">
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full mb-6 uppercase tracking-widest animate-bounce">
              🔥 {featured.is_featured ? "Destaque da Semana!" : "Lançamento!"}
            </span>
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              {featured.name}
            </h2>
            {featured.description && (
              <p className="text-blue-200 text-lg mb-6 max-w-sm line-clamp-3">
                {featured.description}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-8">
              {hasDiscount && (
                <span className="text-blue-300 line-through text-xl">{fmt(featured.sale_price)}</span>
              )}
              <span
                className="text-white text-4xl font-bold"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                {fmt(price)}
              </span>
              {hasDiscount && (
                <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">
                  -{discountPct}%
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => add(featured)}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-lg px-8 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-3"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                <ShoppingCart className="h-5 w-5" />
                Quero o meu!
              </button>
              <button
                onClick={() => navigate(`/produto/${featured.id}`)}
                className="border-2 border-white/50 text-white font-bold text-lg px-8 py-3.5 rounded-full hover:bg-white/10 transition-all duration-300 active:scale-95"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                Ver detalhes
              </button>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            {featured.image_url ? (
              <img
                src={featured.image_url}
                alt={featured.name}
                className="relative w-64 md:w-80 lg:w-96 object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="w-64 md:w-80 lg:w-96 aspect-square rounded-3xl bg-white/10 flex items-center justify-center">
                <ShoppingCart className="h-24 w-24 text-white/30" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {perks.map(({ icon: Icon, label, sub }, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20"
            >
              <div className="bg-yellow-400 rounded-xl p-2 flex-shrink-0">
                <Icon className="h-5 w-5 text-yellow-900" />
              </div>
              <div>
                <p className="text-white font-bold" style={{ fontFamily: "'Fredoka One', sans-serif" }}>
                  {label}
                </p>
                <p className="text-blue-200 text-sm">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
