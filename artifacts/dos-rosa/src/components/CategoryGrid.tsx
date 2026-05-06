import React from "react";

function wixWebp(filename: string, w: number, h: number) {
  return `https://static.wixstatic.com/media/${filename}/v1/fill/w_${w},h_${h},al_c,q_85,enc_webp/file.webp`;
}

const categories = [
  {
    title: "VÍDEOS",
    image: wixWebp("503d91_b0ca1de8b57743dca914798f62612351~mv2.jpg", 800, 600),
    href: "#videos",
  },
  {
    title: "SHOWS",
    image: wixWebp("503d91_d041e52a2ff74e5bb3a1eab057f46607~mv2.jpg", 800, 600),
    href: "#shows",
  },
  {
    title: "SOBRE",
    image: wixWebp("503d91_0efc307f92c74803b0dfa876770d62d1~mv2.jpg", 800, 600),
    href: "#sobre",
  },
  {
    title: "CONTATO",
    image: wixWebp("503d91_6fe42c0b0ed243cfbfba7dff26f3d41e~mv2.jpg", 800, 600),
    href: "#contato",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 md:py-20 px-4 container mx-auto max-w-[1400px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {categories.map((cat, index) => (
          <a
            key={index}
            href={cat.href}
            className="group block relative overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-video md:aspect-[4/3] bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <img
              src={cat.image}
              alt={cat.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex items-end justify-center">
              <h3 className="text-white font-sans text-2xl md:text-3xl lg:text-4xl tracking-wider text-center drop-shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                {cat.title}
              </h3>
            </div>
            <div className="absolute inset-0 border-4 border-transparent group-hover:border-primary rounded-2xl transition-colors duration-300 pointer-events-none" />
          </a>
        ))}
      </div>
    </section>
  );
}
