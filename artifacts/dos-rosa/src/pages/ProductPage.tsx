import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "@/lib/publicApi";
import { useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  ArrowLeft,
  Zap,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  PackageSearch,
} from "lucide-react";

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto max-w-[1200px] px-4 py-10">
      <Skeleton className="h-5 w-32 mb-8 rounded-full" />
      <div className="grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded-xl" />
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const [, params] = useRoute("/produto/:id");
  const [, navigate] = useLocation();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);

  const id = params?.id ?? "";

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["public-product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
    retry: false,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["public-products-related", product?.category_id],
    queryFn: () => fetchProducts({ category_id: product?.category_id, limit: 4 }),
    enabled: !!product?.category_id,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const related = relatedData?.products.filter((p) => p.id !== id).slice(0, 4) ?? [];

  function handleAdd() {
    if (!product) return;
    for (let i = 0; i < qty; i++) add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  const price = product ? (product.promotional_price ?? product.sale_price) : 0;
  const hasDiscount =
    !!product?.promotional_price && product.promotional_price < product.sale_price;
  const discountPct = hasDiscount
    ? Math.round((1 - product!.promotional_price! / product!.sale_price) * 100)
    : 0;

  const images = product
    ? [product.image_url, ...(product.images ?? [])].filter(Boolean) as string[]
    : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1">
        {isLoading ? (
          <ProductPageSkeleton />
        ) : isError || !product ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32 text-gray-400">
            <PackageSearch className="h-20 w-20 text-blue-200" />
            <p className="text-2xl font-bold text-gray-600" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              Produto não encontrado
            </p>
            <p className="text-gray-400">Este produto pode ter sido removido ou não existe.</p>
            <Button onClick={() => navigate("/")} className="mt-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à loja
            </Button>
          </div>
        ) : (
          <>
            <div className="container mx-auto max-w-[1200px] px-4 py-8 md:py-12">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-8 group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Voltar à loja
              </button>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div className="space-y-4">
                  <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-md">
                    {images.length > 0 ? (
                      <img
                        src={images[selectedImg]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                        <ShoppingCart className="h-24 w-24 text-blue-300" />
                      </div>
                    )}
                    {product.is_featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase">
                        <Zap className="h-3 w-3" />
                        Destaque
                      </div>
                    )}
                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full">
                        -{discountPct}%
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImg(i)}
                          className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                            selectedImg === i ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  {product.category && (
                    <span className="text-sm text-primary font-semibold uppercase tracking-widest mb-2">
                      {product.category.name}
                    </span>
                  )}

                  <h1
                    className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight mb-4"
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    {product.name}
                  </h1>

                  <div className="flex items-baseline gap-3 mb-6">
                    {hasDiscount && (
                      <span className="text-gray-400 line-through text-xl">{fmt(product.sale_price)}</span>
                    )}
                    <span
                      className="text-blue-600 font-bold text-4xl"
                      style={{ fontFamily: "'Fredoka One', sans-serif" }}
                    >
                      {fmt(price)}
                    </span>
                  </div>

                  {product.description && (
                    <p className="text-gray-500 text-base leading-relaxed mb-6 border-t border-gray-100 pt-4">
                      {product.description}
                    </p>
                  )}

                  {product.sku && (
                    <p className="text-xs text-gray-300 mb-6">SKU: {product.sku}</p>
                  )}

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm font-semibold text-gray-600">Quantidade:</span>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-2">
                      <button
                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                        className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-gray-800">{qty}</span>
                      <button
                        onClick={() => setQty((q) => q + 1)}
                        className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-primary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAdd}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-3 mb-4 ${
                      added
                        ? "bg-green-500 text-white scale-[0.98]"
                        : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]"
                    }`}
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {added ? "Adicionado ao carrinho! ✓" : `Adicionar ao carrinho — ${fmt(price * qty)}`}
                  </button>

                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {[
                      { icon: Truck, label: "Frete grátis", sub: "acima de R$ 350" },
                      { icon: Shield, label: "Compra segura", sub: "pagamento protegido" },
                      { icon: RotateCcw, label: "Troca fácil", sub: "em até 30 dias" },
                    ].map(({ icon: Icon, label, sub }, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-1.5 bg-blue-50 rounded-2xl p-3 text-center"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <p className="text-[11px] font-bold text-gray-700 leading-tight">{label}</p>
                        <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {related.length > 0 && (
                <div className="mt-16 md:mt-24">
                  <h2
                    className="text-2xl md:text-3xl font-bold text-blue-700 mb-6"
                    style={{ fontFamily: "'Bubblegum Sans', cursive" }}
                  >
                    Você também vai curtir 🔥
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {related.map((p) => {
                      const rPrice = p.promotional_price ?? p.sale_price;
                      const rDiscount =
                        !!p.promotional_price && p.promotional_price < p.sale_price;
                      return (
                        <div
                          key={p.id}
                          onClick={() => { navigate(`/produto/${p.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                          className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group hover:-translate-y-0.5"
                        >
                          <div className="aspect-square overflow-hidden bg-gray-50">
                            {p.image_url ? (
                              <img
                                src={p.image_url}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                <ShoppingCart className="h-10 w-10 text-blue-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p
                              className="text-sm font-bold text-gray-800 leading-tight truncate"
                              style={{ fontFamily: "'Fredoka One', sans-serif" }}
                            >
                              {p.name}
                            </p>
                            <div className="flex items-baseline gap-1 mt-1">
                              {rDiscount && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  {fmt(p.sale_price)}
                                </span>
                              )}
                              <span className="text-primary font-bold text-base">{fmt(rPrice)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
