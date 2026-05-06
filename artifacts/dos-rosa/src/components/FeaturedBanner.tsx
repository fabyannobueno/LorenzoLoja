import React from "react";
import { ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import FEATURED_IMG from "@assets/Instagram_post_para_loja_de_roupas_corporativo_preto_e_branco__1778078581820.png";

const perks = [
  { icon: Truck, label: "Frete grátis", sub: "acima de R$ 150" },
  { icon: Shield, label: "Compra segura", sub: "pagamento protegido" },
  { icon: RotateCcw, label: "Troca fácil", sub: "em até 30 dias" },
];

export function FeaturedBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 px-4">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto max-w-[1200px] relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text */}
          <div className="text-white order-2 md:order-1">
            <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-1 rounded-full mb-6 uppercase tracking-widest animate-bounce">
              🔥 Lançamento da Semana!
            </span>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              Moletom<br />
              <span className="text-yellow-400">Exclusivo</span><br />
              Lorenzo!
            </h2>
            <p className="text-blue-200 text-lg mb-6 max-w-sm">
              O moletom mais top do Brasil chegou! Edição limitada com bordado exclusivo. 🎤
            </p>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-blue-300 line-through text-xl">R$ 199,90</span>
              <span
                className="text-white text-4xl font-bold"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                R$ 149,90
              </span>
              <span className="bg-red-500 text-white text-sm font-bold px-2 py-0.5 rounded-lg">-25%</span>
            </div>

            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 flex items-center gap-3"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              <ShoppingCart className="h-5 w-5" />
              Quero o meu!
            </button>
          </div>

          {/* Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/30 rounded-3xl blur-2xl scale-110" />
              <img
                src={FEATURED_IMG}
                alt="MC Lorenzo Moletom"
                className="relative w-64 md:w-80 lg:w-96 object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Perks bar */}
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
