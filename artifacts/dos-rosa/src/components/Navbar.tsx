import React from "react";
import { Menu, ShoppingCart, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiInstagram, SiTiktok, SiYoutube, SiSpotify } from "react-icons/si";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { toast } from "sonner";
import kwaiIconSrc from "@assets/kwai_icon.webp";

const LOGO_WEBP =
  "https://static.wixstatic.com/media/503d91_c7b6678363f848ea973886ce8f9491d9~mv2.png/v1/fill/w_900,h_360,al_c,q_85,enc_webp/file.webp";

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

function SocialBtn({ social }: { social: Social }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
        social.kind === "img"
          ? "bg-transparent hover:opacity-80 hover:scale-110"
          : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
      }`}
    >
      {social.kind === "img" ? (
        <img src={social.src} alt={social.label} className="h-4 w-4 object-contain" />
      ) : (
        <social.icon className="h-4 w-4" />
      )}
      <span className="sr-only">{social.label}</span>
    </a>
  );
}

function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      onClick={() => setOpen(true)}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-md"
      aria-label="Abrir carrinho"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function AuthButton() {
  const { user, loading, openAuthModal, logout } = useCustomerAuth();

  if (loading) return <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />;

  if (!user) {
    return (
      <button
        onClick={() => openAuthModal("login")}
        className="flex items-center gap-1.5 text-sm font-bold text-primary border-2 border-primary/30 hover:border-primary hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all duration-200"
        style={{ fontFamily: "'Fredoka One', sans-serif" }}
      >
        <User className="h-4 w-4" />
        Entrar
      </button>
    );
  }

  const initials = (user.displayName ?? user.email ?? "U")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const firstName = user.displayName?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Você";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border-2 border-primary/20 hover:border-primary/50 pl-1 pr-3 py-1 transition-all duration-200 group">
          {user.photoURL ? (
            <img src={user.photoURL} alt={firstName} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
          )}
          <span className="text-sm font-semibold text-gray-700 max-w-[80px] truncate hidden md:block" style={{ fontFamily: "'Fredoka One', sans-serif" }}>
            {firstName}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary transition-colors hidden md:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-sm font-bold text-gray-800 truncate">{user.displayName ?? "Minha conta"}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await logout();
            toast.success("Até logo! 👋");
          }}
          className="rounded-xl text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Navbar() {
  const { user, openAuthModal } = useCustomerAuth();

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
                <img src={LOGO_WEBP} alt="MC Lorenzo" className="h-12 w-auto object-contain" />
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
                {!user && (
                  <button
                    onClick={() => openAuthModal("login")}
                    className="mx-6 mt-4 py-2.5 rounded-2xl border-2 border-primary text-primary font-bold text-sm"
                    style={{ fontFamily: "'Fredoka One', sans-serif" }}
                  >
                    Entrar / Cadastrar
                  </button>
                )}
                <div className="flex gap-4 px-6 pt-6">
                  {socials.map((s) => <SocialBtn key={s.label} social={s} />)}
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
                link.highlight
                  ? "text-sm tracking-widest font-bold bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full hover:bg-yellow-500 transition-colors uppercase whitespace-nowrap"
                  : "text-sm tracking-widest text-primary hover:text-primary/70 transition-colors uppercase whitespace-nowrap"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right: Socials + Auth + Cart */}
        <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
          {socials.map((s) => <SocialBtn key={s.label} social={s} />)}
          <div className="w-px h-6 bg-gray-200" />
          <AuthButton />
          <CartButton />
        </div>

        {/* Mobile right */}
        <div className="flex xl:hidden items-center gap-2 flex-shrink-0">
          <AuthButton />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
