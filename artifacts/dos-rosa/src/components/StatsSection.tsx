import React from "react";

const stats = [
  { value: "1B+", label: "Visualizações no YouTube" },
  { value: "2M+", label: "Seguidores nas Redes" },
  { value: "300M+", label: "Views no Canal" },
  { value: "2020", label: "Início da Carreira" },
];

export function StatsSection() {
  return (
    <section className="bg-primary py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-4xl md:text-5xl lg:text-6xl font-sans">{stat.value}</span>
              <span className="text-sm md:text-base text-white/80 tracking-wide uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
