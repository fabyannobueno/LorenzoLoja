import React from "react";

function wixWebp(filename: string, w: number, h: number) {
  return `https://static.wixstatic.com/media/${filename}/v1/fill/w_${w},h_${h},al_c,q_85,enc_webp/file.webp`;
}

const categories = [
  {
    title: "Camisetas",
    emoji: "👕",
    image: wixWebp("503d91_b0ca1de8b57743dca914798f62612351~mv2.jpg", 800, 600),
    href: "#loja",
    color: "from-blue-500/80",
  },
  {
    title: "Bonés",
    emoji: "🧢",
    image: wixWebp("503d91_d041e52a2ff74e5bb3a1eab057f46607~mv2.jpg", 800, 600),
    href: "#loja",
    color: "from-yellow-500/80",
  },
  {
    title: "Mochilas",
    emoji: "🎒",
    image: wixWebp("503d91_0efc307f92c74803b0dfa876770d62d1~mv2.jpg", 800, 600),
    href: "#loja",
    color: "from-purple-500/80",
  },
  {
    title: "Acessórios",
    emoji: "⭐",
    image: wixWebp("503d91_6fe42c0b0ed243cfbfba7dff26f3d41e~mv2.jpg", 800, 600),
    href: "#loja",
    color: "from-pink-500/80",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-10">
          <h2
            className="text-4xl md:text-5xl font-bold text-blue-700 mb-2"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            O que você quer? 🤩
          </h2>
          <p className="text-gray-400 text-base">Escolha sua categoria favorita!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
          {categories.map((cat, index) => (
            <a
              key={index}
              href={cat.href}
              className="group block relative overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} via-black/10 to-transparent`} />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-center justify-end gap-1">
                <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </span>
                <h3
                  className="text-white text-2xl md:text-4xl text-center drop-shadow-lg"
                  style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                >
                  {cat.title}
                </h3>
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
