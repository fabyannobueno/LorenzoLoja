import React from "react";
import { Calendar } from "lucide-react";

export function ShowsSection() {
  return (
    <section id="shows" className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Agenda</p>
          <h2 className="text-4xl md:text-5xl font-sans text-gray-900">Shows</h2>
        </div>

        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-10 w-10 text-primary" />
          </div>
          <p className="text-gray-500 text-lg text-center max-w-md">
            Nenhum show agendado no momento. Fique ligado nas redes sociais para novidades!
          </p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://instagram.com/mclorenzoofc"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-3 rounded-full font-sans tracking-wider hover:bg-primary/90 transition-colors"
            >
              Seguir no Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
