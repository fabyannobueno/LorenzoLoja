import React from "react";

const videos = [
  {
    id: "lAhDq2nFzdU",
    titulo: "Nao Fica Apaixonadinha (KondZilla)",
    views: "222M views",
    publicado: "ha 4 anos",
  },
  {
    id: "k9YufhamtiI",
    titulo: "Nao Fica Emocionadinha (Beco Filmes)",
    views: "46.5M views",
    publicado: "ha 2 anos",
  },
  {
    id: "ue2KpJ7FNxY",
    titulo: "Acabou a Relacao (KondZilla)",
    views: "37.7M views",
    publicado: "ha 4 anos",
  },
  {
    id: "WzpWGoFPVso",
    titulo: "Festinha (KondZilla)",
    views: "11.2M views",
    publicado: "ha 3 anos",
  },
];

function ytThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function VideosSection() {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  return (
    <section id="videos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Discografia</p>
          <h2 className="text-4xl md:text-5xl font-sans text-gray-900">Videos</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              {activeId === video.id ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                    title={video.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <button
                  className="w-full aspect-video relative block overflow-hidden"
                  onClick={() => setActiveId(video.id)}
                  aria-label={`Reproduzir ${video.titulo}`}
                >
                  <img
                    src={ytThumb(video.id)}
                    alt={video.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}

              <div className="p-4">
                <h3 className="font-sans text-gray-900 text-base leading-snug mb-1">{video.titulo}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="text-primary font-sans">{video.views}</span>
                  <span>·</span>
                  <span>{video.publicado}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://youtube.com/@mclorenzoofc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-10 py-3 rounded-full font-sans tracking-wider hover:bg-primary/90 transition-colors"
          >
            Ver Todos os Videos
          </a>
        </div>
      </div>
    </section>
  );
}
