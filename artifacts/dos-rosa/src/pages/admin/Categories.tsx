import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Category } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ToggleLeft } from "lucide-react";
import { toast } from "sonner";

const EMPTY: Partial<Category> = { name: "", description: "", image_url: "", sort_order: 0, is_active: true };

function CategoryForm({ initial, onSave, onClose }: {
  initial?: Category;
  onSave: (d: Partial<Category>) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Category>>(initial ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k: keyof Category, v: any) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch { toast.error("Erro ao salvar"); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1"><Label>Nome *</Label><Input required value={form.name ?? ""} onChange={e => set("name", e.target.value)} /></div>
      <div className="space-y-1"><Label>Descrição</Label><Textarea rows={2} value={form.description ?? ""} onChange={e => set("description", e.target.value)} /></div>
      <div className="space-y-1"><Label>URL da imagem</Label><Input type="url" value={form.image_url ?? ""} onChange={e => set("image_url", e.target.value)} placeholder="https://..." /></div>
      <div className="space-y-1"><Label>Ordem</Label><Input type="number" value={form.sort_order ?? 0} onChange={e => set("sort_order", parseInt(e.target.value))} /></div>
      <div className="flex items-center gap-2"><Switch checked={form.is_active ?? true} onCheckedChange={v => set("is_active", v)} id="cat_active" /><Label htmlFor="cat_active">Ativa</Label></div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar"}</Button>
      </DialogFooter>
    </form>
  );
}

export default function Categories() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Category | "new" | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => { const { data } = await api.get<{ success: boolean; data: Category[] }>("/categories?limit=100"); return data.data; },
  });

  const toggle = useMutation({
    mutationFn: (c: Category) => api.patch(`/categories/${c.id}/status`, { is_active: !c.is_active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: () => toast.error("Erro ao atualizar"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["categories"] }); toast.success("Removida!"); },
    onError: () => toast.error("Erro ao remover"),
  });

  async function save(form: Partial<Category>) {
    if (editing === "new") { await api.post("/categories", form); toast.success("Categoria criada!"); }
    else { await api.put(`/categories/${(editing as Category).id}`, form); toast.success("Atualizada!"); }
    qc.invalidateQueries({ queryKey: ["categories"] });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4 mr-2" />Nova categoria</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
          ) : !data?.length ? (
            <p className="text-center py-12 text-muted-foreground text-sm">Nenhuma categoria</p>
          ) : (
            <div className="divide-y">
              {data.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 px-4 py-3">
                  {cat.image_url ? <img src={cat.image_url} alt={cat.name} className="h-10 w-10 rounded-lg object-cover bg-muted shrink-0" /> : <div className="h-10 w-10 rounded-lg bg-muted shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{cat.name}</p>
                      {!cat.is_active && <Badge variant="secondary" className="text-xs">Inativa</Badge>}
                    </div>
                    {cat.description && <p className="text-xs text-muted-foreground truncate">{cat.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(cat)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggle.mutate(cat)}><ToggleLeft className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => { if (confirm("Remover?")) remove.mutate(cat.id); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing === "new" ? "Nova categoria" : "Editar categoria"}</DialogTitle></DialogHeader>
          {editing && <CategoryForm initial={editing !== "new" ? editing as Category : undefined} onSave={save} onClose={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
