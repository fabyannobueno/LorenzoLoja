import React from "react";
import { Mail, Phone } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "E-mail Comercial",
    value: "contato@mclorenzo.com",
    href: "mailto:contato@mclorenzo.com",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "(11) 91608-8221",
    href: "https://wa.me/5511916088221",
  },
  {
    icon: Mail,
    label: "E-mail para Shows",
    value: "shows@mclorenzo.com",
    href: "mailto:shows@mclorenzo.com",
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-primary text-sm tracking-[0.3em] uppercase mb-2">Fale Conosco</p>
          <h2 className="text-4xl md:text-5xl font-sans">Contato</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map(({ icon: Icon, label, value, href }, i) => (
            <a
              key={i}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/20 group-hover:bg-primary flex items-center justify-center transition-colors duration-300">
                <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <div>
                <p className="text-gray-400 text-sm tracking-wider uppercase mb-1">{label}</p>
                <p className="text-white font-sans text-base">{value}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
