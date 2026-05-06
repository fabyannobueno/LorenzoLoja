import React from "react";
import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from "react-icons/si";

const LOGO_WEBP =
  "https://static.wixstatic.com/media/503d91_c7b6678363f848ea973886ce8f9491d9~mv2.png/v1/fill/w_900,h_360,al_c,q_85,enc_webp/file.webp";

const socials = [
  { icon: SiInstagram, href: "https://instagram.com/mclorenzoofc", label: "Instagram" },
  { icon: SiTiktok, href: "https://tiktok.com/@mclorenzoofc", label: "TikTok" },
  { icon: SiYoutube, href: "https://youtube.com/@mclorenzoofc", label: "YouTube" },
  { icon: SiSpotify, href: "https://open.spotify.com/intl-pt/artist/4BJhlwUkAivteWZYr34mAD", label: "Spotify" },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0f] text-white pt-16 pb-10 border-t-4 border-primary">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-10">
        {/* Logo */}
        <a href="#inicio" className="inline-block transition-transform hover:scale-105">
          <img
            src={LOGO_WEBP}
            alt="MC Lorenzo"
            className="h-[60px] md:h-[72px] w-auto object-contain"
          />
        </a>

        {/* Slogan */}
        <p className="text-primary text-lg tracking-[0.2em] uppercase">O Brabo do TikTok</p>

        {/* Social Links */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300 text-white"
            >
              <Icon className="h-5 w-5" />
              <span className="sr-only">{label}</span>
            </a>
          ))}
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {[
            { label: "Inicio", href: "#inicio" },
            { label: "Sobre", href: "#sobre" },
            { label: "Videos", href: "#videos" },
            { label: "Shows", href: "#shows" },
            { label: "Contato", href: "#contato" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-400 hover:text-white text-sm tracking-wider uppercase transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-gray-500 text-sm tracking-wide text-center">
          &copy; {new Date().getFullYear()} MC Lorenzo. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
