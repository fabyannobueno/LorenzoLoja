import React from "react";

const stats = [
  { value: "500+", label: "Produtos disponíveis", emoji: "📦", color: "bg-blue-500" },
  { value: "12K+", label: "Clientes felizes", emoji: "😍", color: "bg-yellow-400" },
  { value: "4.9★", label: "Avaliação média", emoji: "⭐", color: "bg-pink-500" },
  { value: "24h", label: "Envio expresso", emoji: "🚀", color: "bg-green-500" },
];

export function StatsSection() {
  return (
    <section className="py-14 px-4 bg-white">
      <div className="container mx-auto max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 bg-gradient-to-b from-blue-50 to-white rounded-3xl p-6 shadow-sm border border-blue-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-md`}>
                {stat.emoji}
              </div>
              <span
                className="text-3xl md:text-4xl text-blue-700 font-bold"
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                {stat.value}
              </span>
              <span className="text-sm text-gray-500 text-center leading-tight uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
