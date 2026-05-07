import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Product, Category } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2, ToggleLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

const EMPTY: Partial<Product> = { name: "", sale_price: 0, is_active: true, is_featured: false, manage_stock: false, sort_order: 0 };

function ProductForm({ initial, categories, onSave, onClose }: {
  initial?: Product;
  categories: Category[];
  onSave: (data: Partial<Product>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Product, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch { toast.error("Erro ao salvar produto"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label>Nome *</Label>
          <Input required value={form.name ?? ""} onChange={e => set("name", e.target.value)} placeholder="Nome do produto" />
        </div>
        <div className="space-y-1">
          <Label>Preço de venda *</Label>
          <Input required type="number" step="0.01" min="0" value={form.sale_price ?? 0} onChange={e => set("sale_price", parseFloat(e.target.value))} />
        </div>
        <div className="space-y-1">
          <Label>Preço promocional</Label>
          <Input type="number" step="0.01" min="0" value={form.promotional_price ?? ""} onChange={e => set("promotional_price", e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Opcional" />
        </div>
        <div className="space-y-1">
          <Label>Custo</Label>
          <Input type="number" step="0.01" min="0" value={form.cost_price ?? ""} onChange={e => set("cost_price", e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="Opcional" />
        </div>
        <div className="space-y-1">
          <Label>Categoria</Label>
          <Select value={form.category_id ?? "none"} onValueChange={v => set("category_id", v === "none" ? undefined : v)}>
            <SelectTrigger><SelectValue placeholder="Sem categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem categoria</SelectItem>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-2 space-y-1">
          <Label>Descrição</Label>
          <Textarea rows={2} value={form.description ?? ""} onChange={e => set("description", e.target.value)} placeholder="Descrição do produto" />
        </div>
        <div className="col-span-2 space-y-1">
          <Label>URL da imagem</Label>
          <Input type="url" value={form.image_url ?? ""} onChange={e => set("image_url", e.target.value)} placeholder="https://..." />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_active ?? true} onCheckedChange={v => set("is_active", v)} id="is_active" />
          <Label htmlFor="is_active">Ativo</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={form.is_featured ?? false} onCheckedChange={v => set("is_featured", v)} id="is_featured" />
          <Label htmlFor="is_featured">Destaque</Label>
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </DialogFooter>
    </form>
  );
}

export default function Products() {
  const qc = useQueryClient();
  const { hasPermission } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null | "new">(null);

  const { data: catData } = useQuery({
    queryKey: ["categories-all"],
    queryFn: async () => { const { data } = await api.get<{ success: boolean; data: Category[] }>("/categories?limit=100"); return data.data; },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      const { data } = await api.get<{ success: boolean; data: Product[]; pagination: any }>(`/products?${params}`);
      return data;
    },
  });

  const toggleStatus = useMutation({
    mutationFn: (p: Product) => api.patch(`/products/${p.id}/status`, { is_active: !p.is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
    onError: () => toast.error("Erro ao atualizar"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); toast.success("Produto removido"); },
    onError: () => toast.error("Erro ao remover"),
  });

  async function save(form: Partial<Product>) {
    if (editing === "new") {
      await api.post("/products", form);
      toast.success("Produto criado!");
    } else {
      await api.put(`/products/${(editing as Product).id}`, form);
      toast.success("Produto atualizado!");
    }
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  const categories = catData ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        {hasPermission("products.create") && (
          <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4 mr-2" />Novo produto</Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar produto..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : !data?.data?.length ? (
            <p className="text-center py-12 text-muted-foreground text-sm">Nenhum produto encontrado</p>
          ) : (
            <div className="divide-y">
              {data.data.map(product => (
                <div key={product.id} className="flex items-center gap-3 px-4 py-3">
                  {product.image_url && <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded-lg object-cover shrink-0 bg-muted" />}
                  {!product.image_url && <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      {!product.is_active && <Badge variant="secondary" className="text-xs shrink-0">Inativo</Badge>}
                      {product.is_featured && <Badge className="text-xs shrink-0 bg-yellow-400 text-yellow-900">Destaque</Badge>}
                    </div>
                    <p className="text-xs text-muted-foreground">{product.category?.name ?? "Sem categoria"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">{fmt(product.promotional_price ?? product.sale_price)}</p>
                    {product.promotional_price && <p className="text-xs text-muted-foreground line-through">{fmt(product.sale_price)}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {hasPermission("products.update") && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(product)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus.mutate(product)}><ToggleLeft className="h-3.5 w-3.5" /></Button>
                      </>
                    )}
                    {hasPermission("products.delete") && (
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover produto?")) remove.mutate(product.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                    )}
                  </div>
                </div>
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

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "Novo produto" : "Editar produto"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              initial={editing !== "new" ? editing as Product : undefined}
              categories={categories}
              onSave={save}
              onClose={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
