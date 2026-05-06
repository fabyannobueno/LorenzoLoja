import React from "react";

function wixWebp(filename: string, w: number, h: number) {
  return `https://static.wixstatic.com/media/${filename}/v1/fill/w_${w},h_${h},al_c,q_85,enc_webp/file.webp`;
}

const PHOTO_WEBP = wixWebp("503d91_6da65737d34f4c5d927155666a2ea4fc~mv2.png", 800, 900);

export function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Photo */}
          <div className="flex-shrink-0 w-full md:w-[380px]">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img
                src={PHOTO_WEBP}
                alt="MC Lorenzo"
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-primary text-sm tracking-[0.3em] uppercase mb-3">O Brabo do TikTok</p>
            <h2 className="text-4xl md:text-5xl font-sans text-gray-900 mb-6 leading-tight">
              MC Lorenzo
            </h2>
            <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed">
              <p>
                MC Lorenzo iniciou sua carreira artistica em 2020, aos 5 anos de idade, e rapidamente
                conquistou o publico com seu primeiro grande sucesso, que ultrapassou a impressionante
                marca de 200 milhoes de visualizacoes no YouTube.
              </p>
              <p>
                Hoje, aos 10 anos, Lorenzo continua em plena ascensao, acumulando numeros expressivos
                em seus lancamentos musicais, com um total de mais de 300 milhoes de views em seu canal.
              </p>
              <p>
                O jovem artista e um dos maiores fenomenos do funk brasileiro, com presenca marcante
                nas principais plataformas digitais e em shows por todo o Brasil.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="https://open.spotify.com/intl-pt/artist/4BJhlwUkAivteWZYr34mAD"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-sans tracking-wider hover:bg-primary/90 transition-colors"
              >
                Ouvir no Spotify
              </a>
              <a
                href="https://youtube.com/@mclorenzoofc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-sans tracking-wider hover:bg-primary/5 transition-colors"
              >
                Ver no YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
