import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Plus, Minus, Tag, LogIn } from "lucide-react";
import { validateCoupon, createOrder } from "@/lib/publicApi";
import { toast } from "sonner";

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

type Step = "cart" | "checkout";

export function CartDrawer() {
  const { items, total, count, remove, update, clear, isOpen, setOpen } = useCart();
  const { user, openAuthModal } = useCustomerAuth();

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);
  const [step, setStep] = useState<Step>("cart");
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    orderType: "delivery",
    paymentMethod: "pix",
    street: "",
    number: "",
    city: "",
    state: "SP",
    zip: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: f.name || user.displayName || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) setStep("cart");
  }, [isOpen]);

  const finalTotal = Math.max(0, total - discount);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCheckingCoupon(true);
    const res = await validateCoupon(couponCode.trim(), total);
    setCheckingCoupon(false);
    if (res.valid) {
      setDiscount(res.discount ?? 0);
      setCouponMsg(`✅ Cupom aplicado! Desconto: ${fmt(res.discount ?? 0)}`);
    } else {
      setDiscount(0);
      setCouponMsg(`❌ ${res.message ?? "Cupom inválido"}`);
    }
  }

  function handleGoCheckout() {
    if (!user) {
      setOpen(false);
      openAuthModal("login");
      toast.info("Faça login para finalizar seu pedido 😊");
      return;
    }
    setStep("checkout");
  }

  async function handlePlaceOrder() {
    if (!form.name.trim()) { toast.error("Digite seu nome completo"); return; }
    if (!form.phone.trim()) { toast.error("Digite seu WhatsApp"); return; }
    setPlacing(true);
    try {
      await createOrder({
        order_type: form.orderType,
        payment_method: form.paymentMethod,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        customer_email: user?.email ?? undefined,
        notes: form.notes || undefined,
        coupon_code: couponCode || undefined,
        delivery_address:
          form.orderType === "delivery"
            ? {
                street: form.street,
                number: form.number,
                city: form.city,
                state: form.state,
                zip_code: form.zip,
              }
            : undefined,
        items: items.map((i) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          quantity: i.quantity,
          unit_price: i.product.promotional_price ?? i.product.sale_price,
        })),
      });
      toast.success("Pedido realizado com sucesso! 🎉");
      clear();
      setCouponCode("");
      setDiscount(0);
      setCouponMsg("");
      setOpen(false);
      setStep("cart");
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message ?? "Erro ao realizar pedido. Tente novamente.");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:w-[420px] flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            {step === "cart" ? `Carrinho (${count})` : "Finalizar pedido"}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
            <span className="text-6xl">🛒</span>
            <p
              className="text-lg font-bold text-gray-700"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              Carrinho vazio!
            </p>
            <p className="text-gray-400 text-sm">Adicione produtos para continuar</p>
            <Button onClick={() => setOpen(false)}>Ver produtos</Button>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => {
                const price = item.product.promotional_price ?? item.product.sale_price;
                return (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="h-14 w-14 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingCart className="h-6 w-6 text-blue-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.product.name}</p>
                      <p className="text-sm text-primary font-bold">{fmt(price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => update(item.product.id, item.quantity - 1)}
                        className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => update(item.product.id, item.quantity + 1)}
                        className="h-7 w-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => remove(item.product.id)}
                        className="h-7 w-7 rounded-full text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-5 pb-5 space-y-4 border-t pt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Código do cupom"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
                <Button variant="outline" size="sm" onClick={applyCoupon} disabled={checkingCoupon}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {couponMsg && <p className="text-xs text-muted-foreground">{couponMsg}</p>}

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{fmt(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-primary">{fmt(finalTotal)}</span>
                </div>
              </div>

              {!user && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 text-sm text-blue-700">
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span>Faça login para finalizar seu pedido</span>
                </div>
              )}

              <Button
                className="w-full text-base py-5"
                onClick={handleGoCheckout}
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                {user ? "Continuar 🛒" : "Entrar para comprar 🔒"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {user && (
                <div className="flex items-center gap-3 bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {(user.displayName ?? user.email ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{user.displayName ?? "Minha conta"}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label>Nome completo *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Seu nome"
                />
              </div>
              <div className="space-y-1">
                <Label>WhatsApp *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-1">
                <Label>Tipo de entrega</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["delivery", "🚚 Entrega"],
                    ["pickup", "🏪 Retirada"],
                    ["dine_in", "🍽️ Mesa"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setForm((f) => ({ ...f, orderType: v }))}
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-colors ${
                        form.orderType === v
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {form.orderType === "delivery" && (
                <div className="space-y-2">
                  <Label>Endereço de entrega</Label>
                  <Input
                    placeholder="Rua / Avenida"
                    value={form.street}
                    onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Número"
                      value={form.number}
                      onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                    />
                    <Input
                      placeholder="CEP"
                      value={form.zip}
                      onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Cidade"
                      value={form.city}
                      onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    />
                    <Input
                      placeholder="Estado"
                      value={form.state}
                      onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                      maxLength={2}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label>Pagamento</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["pix", "📱 Pix"],
                    ["cash", "💵 Dinheiro"],
                    ["card_on_delivery", "💳 Cartão"],
                    ["transfer", "🏦 Transferência"],
                  ].map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => setForm((f) => ({ ...f, paymentMethod: v }))}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 transition-colors ${
                        form.paymentMethod === v
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <Label>Observações</Label>
                <Input
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Ex: entrega rápida, presentear..."
                />
              </div>

              <div className="border rounded-xl p-3 space-y-1 text-sm bg-gray-50">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{fmt(total)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">{fmt(finalTotal)}</span>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 flex gap-2 border-t pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setStep("cart")}>
                Voltar
              </Button>
              <Button
                className="flex-1 py-5 text-sm"
                onClick={handlePlaceOrder}
                disabled={placing}
                style={{ fontFamily: "'Bubblegum Sans', cursive" }}
              >
                {placing ? "Enviando..." : "Fazer pedido 🎉"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
