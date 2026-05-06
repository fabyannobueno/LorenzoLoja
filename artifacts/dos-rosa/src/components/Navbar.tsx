import React from "react";
import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from "react-icons/si";
import kwaiIconSrc from "@assets/kwai_icon.webp";

const LOGO_WEBP = "https://static.wixstatic.com/media/503d91_c7b6678363f848ea973886ce8f9491d9~mv2.png/v1/fill/w_900,h_360,al_c,q_85,enc_webp/file.webp";

const navLinks = [
  { label: "INÍCIO", href: "#inicio" },
  { label: "LOJA", href: "#loja", highlight: true },
  { label: "CONTATO", href: "#contato" },
];

type Social =
  | { kind: "icon"; icon: React.ElementType; href: string; label: string }
  | { kind: "img"; src: string; href: string; label: string };

const socials: Social[] = [
  { kind: "icon", icon: SiInstagram, href: "https://instagram.com/mclorenzoofc", label: "Instagram" },
  { kind: "icon", icon: SiTiktok, href: "https://tiktok.com/@mclorenzoofc", label: "TikTok" },
  { kind: "icon", icon: SiYoutube, href: "https://youtube.com/@mclorenzoofc", label: "YouTube" },
  { kind: "icon", icon: SiSpotify, href: "https://open.spotify.com/intl-pt/artist/4BJhlwUkAivteWZYr34mAD", label: "Spotify" },
  { kind: "img", src: kwaiIconSrc, href: "https://kwai.com/@mclorenzo", label: "Kwai" },
];

function SocialBtn({ social, size }: { social: Social; size: "sm" | "md" }) {
  const cls = size === "sm" ? "w-9 h-9" : "w-9 h-9";
  const iconCls = size === "sm" ? "h-4 w-4" : "h-4 w-4";

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${cls} rounded-full flex items-center justify-center transition-all duration-200 ${
        social.kind === "img"
          ? "bg-transparent hover:opacity-80 hover:scale-110"
          : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
      }`}
    >
      {social.kind === "img" ? (
        <img src={social.src} alt={social.label} className={iconCls} style={{ objectFit: "contain" }} />
      ) : (
        <social.icon className={iconCls} />
      )}
      <span className="sr-only">{social.label}</span>
    </a>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

        {/* Mobile Menu */}
        <div className="flex xl:hidden items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[360px] bg-white p-0">
              <div className="p-4 bg-primary text-white flex items-center justify-center border-b">
                <div className="h-12 w-12 overflow-hidden flex-shrink-0">
                  <img src={LOGO_WEBP} alt="MC Lorenzo" className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col py-4 overflow-y-auto h-[calc(100vh-5rem)]">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="px-6 py-3 text-sm tracking-wider text-gray-800 hover:text-primary hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex gap-4 px-6 pt-6">
                  {socials.map((s) => (
                    <SocialBtn key={s.label} social={s} size="sm" />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <a href="#inicio" className="flex-shrink-0 flex items-center">
          <img src={LOGO_WEBP} alt="MC Lorenzo" className="h-[44px] md:h-[52px] w-auto object-contain" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center justify-center flex-1 mx-4 gap-x-8">
          {navLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className={
                (link as { highlight?: boolean }).highlight
                  ? "text-sm tracking-widest font-bold bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full hover:bg-yellow-500 transition-colors uppercase whitespace-nowrap"
                  : "text-sm tracking-widest text-primary hover:text-primary/70 transition-colors uppercase whitespace-nowrap"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Social Icons */}
        <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
          {socials.map((s) => (
            <SocialBtn key={s.label} social={s} size="md" />
          ))}
        </div>

        {/* Mobile Social (compact) */}
        <div className="flex xl:hidden items-center gap-2 flex-shrink-0">
          {socials.slice(0, 2).map((s) => (
            <SocialBtn key={s.label} social={s} size="sm" />
          ))}
        </div>
      </div>
    </header>
  );
}
