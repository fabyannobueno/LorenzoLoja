import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { DashboardData, Store, Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingBag, DollarSign, Package, Clock, TrendingUp, Store as StoreIcon } from "lucide-react";
import { Link } from "wouter";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendente", accepted: "Aceito", preparing: "Preparando",
  ready: "Pronto", out_for_delivery: "Em entrega", delivered: "Entregue",
  completed: "Concluído", canceled: "Cancelado", refunded: "Reembolsado",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  completed: "bg-green-100 text-green-800",
  canceled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

function fmt(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function StatCard({ title, value, icon: Icon, sub }: { title: string; value: string | number; icon: React.ElementType; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const { data: dash, isLoading: dashLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardData }>("/owner/dashboard");
      return data.data;
    },
    enabled: user?.role === "owner",
  });

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ["store"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Store }>("/owner/store");
      return data.data;
    },
    enabled: user?.role === "owner",
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["orders-recent"],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Order[] }>("/orders?limit=5&page=1");
      return data.data;
    },
  });

  async function setStoreStatus(status: "open" | "closed" | "paused") {
    await api.put("/owner/store/status", { status });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Bem-vindo de volta, {user?.name}</p>
        </div>
        {user?.role === "owner" && store && (
          <div className="flex items-center gap-2">
            <StoreIcon className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue={store.status} onValueChange={(v) => setStoreStatus(v as any)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">🟢 Aberta</SelectItem>
                <SelectItem value="paused">🟡 Pausada</SelectItem>
                <SelectItem value="closed">🔴 Fechada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {user?.role === "owner" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {dashLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)
          ) : (
            <>
              <StatCard title="Pedidos hoje" value={dash?.orders_today ?? 0} icon={ShoppingBag} />
              <StatCard title="Faturamento hoje" value={fmt(dash?.revenue_today ?? 0)} icon={DollarSign} />
              <StatCard title="Produtos ativos" value={dash?.active_products ?? 0} icon={Package} />
              <StatCard title="Pedidos pendentes" value={dash?.pending_orders ?? 0} icon={Clock} sub="Aguardando ação" />
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold">Pedidos recentes</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pedidos"><a>Ver todos</a></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!recentOrders ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
            </div>
          ) : recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum pedido ainda</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/admin/pedidos`}>
                  <a className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-sm font-semibold">{fmt(order.total)}</span>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
