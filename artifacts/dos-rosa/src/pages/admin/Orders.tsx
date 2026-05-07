import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Order, OrderStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, RefreshCw, Eye, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente", accepted: "Aceito", preparing: "Preparando",
  ready: "Pronto", out_for_delivery: "Em entrega", delivered: "Entregue",
  completed: "Concluído", canceled: "Cancelado", refunded: "Reembolsado",
};
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  canceled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "accepted", accepted: "preparing", preparing: "ready",
  ready: "out_for_delivery", out_for_delivery: "delivered", delivered: "completed",
};

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

function OrderDetailModal({ order, open, onClose }: { order: Order | null; open: boolean; onClose: () => void }) {
  const qc = useQueryClient();

  const advance = useMutation({
    mutationFn: (status: OrderStatus) => api.patch(`/orders/${order!.id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); onClose(); toast.success("Status atualizado!"); },
    onError: () => toast.error("Erro ao atualizar status"),
  });

  const cancel = useMutation({
    mutationFn: () => api.post(`/orders/${order!.id}/cancel`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["orders"] }); onClose(); toast.success("Pedido cancelado"); },
    onError: () => toast.error("Erro ao cancelar"),
  });

  if (!order) return null;
  const next = NEXT_STATUS[order.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Pedido — {order.customer_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border">{order.order_type === "delivery" ? "Entrega" : order.order_type === "pickup" ? "Retirada" : "Mesa"}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border">{order.payment_method.replace("_", " ")}</span>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">Itens</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                  <span>{item.quantity}x {item.product_name}</span>
                  <span className="font-medium">{fmt(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {order.delivery_address && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">Endereço</p>
              <p className="text-sm">{order.delivery_address.street}, {order.delivery_address.number} — {order.delivery_address.city}/{order.delivery_address.state}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">{fmt(order.total)}</span>
          </div>

          {order.notes && <p className="text-sm text-muted-foreground italic">"{order.notes}"</p>}

          <div className="flex gap-2 pt-2">
            {next && (
              <Button className="flex-1" onClick={() => advance.mutate(next)} disabled={advance.isPending}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {STATUS_LABELS[next]}
              </Button>
            )}
            {!["canceled", "refunded", "completed"].includes(order.status) && (
              <Button variant="destructive" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Orders() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Order | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["orders", search, status, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      const { data } = await api.get<{ success: boolean; data: Order[]; pagination: any }>(`/orders?${params}`);
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />Atualizar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar cliente..." className="pl-9" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
            </div>
          ) : !data?.data?.length ? (
            <p className="text-center text-muted-foreground py-12 text-sm">Nenhum pedido encontrado</p>
          ) : (
            <div className="divide-y">
              {data.data.map((order) => (
                <button key={order.id} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent text-left transition-colors" onClick={() => setSelected(order)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{order.customer_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString("pt-BR")} · {order.items.length} iten(s)</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{fmt(order.total)}</p>
                  </div>
                  <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="text-sm text-muted-foreground">Página {page} de {data.pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === data.pagination.totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}

      <OrderDetailModal order={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
