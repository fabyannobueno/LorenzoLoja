import React, { useState } from "react";
import { X } from "lucide-react";

function wixWebp(filename: string, w: number, h: number) {
  return `https://static.wixstatic.com/media/${filename}/v1/fill/w_${w},h_${h},al_c,q_85,enc_webp/file.webp`;
}

const photos = [
  wixWebp("503d91_b0ca1de8b57743dca914798f62612351~mv2.jpg", 800, 600),
  wixWebp("503d91_d041e52a2ff74e5bb3a1eab057f46607~mv2.jpg", 800, 600),
  wixWebp("503d91_0efc307f92c74803b0dfa876770d62d1~mv2.jpg", 800, 600),
  wixWebp("503d91_6fe42c0b0ed243cfbfba7dff26f3d41e~mv2.jpg", 800, 600),
  wixWebp("503d91_1e35cfae123a46e4bd0959df6748deab~mv2.jpg", 800, 600),
  wixWebp("503d91_5fdb1fb80c404f82ae041fde5fbd1d9f~mv2.jpg", 800, 600),
];

const photosFull = [
  wixWebp("503d91_b0ca1de8b57743dca914798f62612351~mv2.jpg", 1920, 1080),
  wixWebp("503d91_d041e52a2ff74e5bb3a1eab057f46607~mv2.jpg", 1920, 1080),
  wixWebp("503d91_0efc307f92c74803b0dfa876770d62d1~mv2.jpg", 1920, 1080),
  wixWebp("503d91_6fe42c0b0ed243cfbfba7dff26f3d41e~mv2.jpg", 1920, 1080),
  wixWebp("503d91_1e35cfae123a46e4bd0959df6748deab~mv2.jpg", 1920, 1080),
  wixWebp("503d91_5fdb1fb80c404f82ae041fde5fbd1d9f~mv2.jpg", 1920, 1080),
];

export function PhotosSection() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="fotos" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Galeria</p>
          <h2 className="text-4xl md:text-5xl font-sans text-gray-900">Fotos</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {photos.map((src, i) => (
            <button
              key={i}
              className="group relative overflow-hidden rounded-xl aspect-square bg-gray-100 block"
              onClick={() => setLightbox(i)}
            >
              <img
                src={src}
                alt={`MC Lorenzo foto ${i + 1}`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 rounded-xl" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={photosFull[lightbox]}
            alt={`MC Lorenzo foto ${lightbox + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
