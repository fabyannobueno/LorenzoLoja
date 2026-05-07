import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { fetchProducts, type PublicProduct } from "@/lib/publicApi";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Zap, ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function fmt(v: number) {
  return "R$ " + v.toFixed(2).replace(".", ",");
}

function ProductCard({ product, idx }: { product: PublicProduct; idx: number }) {
  const { add } = useCart();
  const [, navigate] = useLocation();
  const [added, setAdded] = useState(false);

  const price = product.promotional_price ?? product.sale_price;
  const hasDiscount =
    !!product.promotional_price && product.promotional_price < product.sale_price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.promotional_price! / product.sale_price) * 100)
    : 0;

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  function goToProduct() {
    navigate(`/produto/${product.id}`);
  }

  return (
    <div
      onClick={goToProduct}
      className="relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1 cursor-pointer"
    >
      {product.is_featured && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
          <Zap className="h-2.5 w-2.5" />
          DESTAQUE
        </div>
      )}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </div>
      )}

      <div className="aspect-square overflow-hidden bg-gray-50">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <ShoppingCart className="h-14 w-14 text-blue-300" />
          </div>
        )}
      </div>

      <div className="p-4">
        {product.category && (
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.category.name}
          </p>
        )}
        <h3
          className="text-gray-800 font-bold text-sm md:text-base leading-tight mb-3"
          style={{ fontFamily: "'Fredoka One', sans-serif" }}
        >
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mb-3">
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">{fmt(product.sale_price)}</span>
          )}
          <span
            className="text-blue-600 font-bold text-lg"
            style={{ fontFamily: "'Fredoka One', sans-serif" }}
          >
            {fmt(price)}
          </span>
        </div>

        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            added
              ? "bg-green-500 text-white scale-95"
              : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
          }`}
          style={{ fontFamily: "'Bubblegum Sans', cursive" }}
        >
          <ShoppingCart className="h-4 w-4" />
          {added ? "Adicionado! ✓" : "COMPRAR"}
        </button>
      </div>
    </div>
  );
}

interface Props {
  categoryId?: string | null;
  categoryName?: string;
}

export function ProductsSection({ categoryId, categoryName }: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-products", categoryId, page],
    queryFn: () => fetchProducts({ category_id: categoryId ?? undefined, page, limit: 8 }),
    staleTime: 3 * 60 * 1000,
    retry: false,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <section id="loja" className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
            🛍️ Loja Oficial
          </span>
          <h2
            className="text-4xl md:text-6xl font-bold text-blue-700 mb-3"
            style={{ fontFamily: "'Bubblegum Sans', cursive" }}
          >
            {categoryName ? `${categoryName}!` : "Produtos do Lorenzo!"}
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Garanta seu item exclusivo e mostre que você é o maior fã! 🔥
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
            ))}
          </div>
        ) : isError || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-gray-400">
            <PackageSearch className="h-16 w-16 text-blue-200" />
            <p className="text-xl font-semibold" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
              {categoryName
                ? `Nenhum produto em "${categoryName}" ainda`
                : "Nenhum produto disponível ainda"}
            </p>
            <p className="text-sm text-gray-300">Volte em breve, novidades chegando! 🔥</p>
            {categoryName && (
              <Button variant="outline" onClick={() => window.location.hash = "#loja"}>
                Ver todos os produtos
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, idx) => (
                <ProductCard key={p.id} product={p} idx={idx} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-500">
                  Página {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
