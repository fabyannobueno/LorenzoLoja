import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Tag, Truck,
  BarChart2, Settings, Image, Star, Bell, FileText, LogOut,
  Menu, ChevronRight, Store, CreditCard, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LOGO = "https://static.wixstatic.com/media/503d91_c7b6678363f848ea973886ce8f9491d9~mv2.png/v1/fill/w_900,h_360,al_c,q_85,enc_webp/file.webp";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles?: string[];
  permission?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["owner"] },
  { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
  { label: "Produtos", href: "/admin/produtos", icon: Package },
  { label: "Categorias", href: "/admin/categorias", icon: Tag },
  { label: "Clientes", href: "/admin/clientes", icon: Users },
  { label: "Cupons", href: "/admin/cupons", icon: CreditCard },
  { label: "Banners", href: "/admin/banners", icon: Image },
  { label: "Entrega", href: "/admin/entrega", icon: Truck },
  { label: "Avaliações", href: "/admin/avaliacoes", icon: Star },
  { label: "Relatórios", href: "/admin/relatorios", icon: BarChart2, permission: "reports.read" },
  { label: "Equipe", href: "/admin/equipe", icon: Users, roles: ["owner"], permission: "team.manage" },
  { label: "Horários", href: "/admin/horarios", icon: Clock },
  { label: "Notificações", href: "/admin/notificacoes", icon: Bell },
  { label: "Auditoria", href: "/admin/auditoria", icon: FileText, roles: ["owner"] },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings, permission: "settings.manage" },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const [location] = useLocation();
  const { user } = useAuth();

  if (!user) return null;
  if (item.roles && !item.roles.includes(user.role)) return null;
  if (item.permission && user.role !== "owner" && !user.permissions.includes(item.permission as any)) return null;

  const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));

  return (
    <Link href={item.href}>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
          active
            ? "bg-primary text-white shadow-sm"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4 shrink-0" />
        {item.label}
        {active && <ChevronRight className="ml-auto h-3 w-3" />}
      </a>
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <div className="p-4 border-b border-sidebar-border">
        <img src={LOGO} alt="MC Lorenzo" className="h-10 w-auto object-contain" />
      </div>

      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <Badge variant="secondary" className="text-xs capitalize mt-0.5">{user.role}</Badge>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onClick={onClose} />
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col border-r border-sidebar-border shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b bg-background flex items-center px-4 gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/configuracoes"><a className="w-full"><Settings className="h-4 w-4 mr-2" />Configurações</a></Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/"><a className="w-full"><Store className="h-4 w-4 mr-2" />Ver loja</a></Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
