import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, type PublicProduct } from "@/lib/publicApi";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import moletomImg from "@assets/moletom_mc_lorenzo.webp";

const FALLBACK: PublicProduct[] = [
  { id: "f1", name: "Camiseta Preta MC Lorenzo", sale_price: 89.90, promotional_price: undefined, is_featured: true, image_url: undefined },
  { id: "f2", name: "Boné Azul Oficial", sale_price: 59.90, is_featured: false, image_url: undefined },
  { id: "f3", name: "Mochila MC Lorenzo", sale_price: 129.90, promotional_price: undefined, is_featured: false, image_url: undefined },
  { id: "f4", name: "Caneca Braba", sale_price: 39.90, is_featured: false, image_url: undefined },
  { id: "f5", name: "Moletom Exclusivo", sale_price: 149.90, promotional_price: undefined, is_featured: true, image_url: moletomImg },
  { id: "f6", name: "Kit Adesivos (50 un.)", sale_price: 19.90, is_featured: false, image_url: undefined },
  { id: "f7", name: "Squeeze MC Lorenzo", sale_price: 49.90, is_featured: false, image_url: undefined },
  { id: "f8", name: "Capinha Celular", sale_price: 44.90, promotional_price: undefined, is_featured: false, image_url: undefined },
];

const EMOJIS = ["👕", "🧢", "🎒", "☕", "🏆", "⭐", "🥤", "📱", "🎤", "👟"];
const GRADS = ["from-blue-400 to-blue-600", "from-yellow-300 to-orange-400", "from-purple-400 to-pink-500", "from-green-400 to-teal-500", "from-indigo-500 to-blue-700", "from-pink-400 to-red-400", "from-orange-400 to-yellow-400", "from-cyan-400 to-blue-500"];

function fmt(v: number) { return "R$ " + v.toFixed(2).replace(".", ","); }

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
      ))}
    </div>
  );
}

function ProductCard({ product, idx }: { product: PublicProduct; idx: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const price = product.promotional_price ?? product.sale_price;
  const hasDiscount = !!product.promotional_price && product.promotional_price < product.sale_price;
  const discountPct = hasDiscount ? Math.round((1 - product.promotional_price! / product.sale_price) * 100) : 0;

  function handleAdd() {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="relative bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
      {product.is_featured && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
          <Zap className="h-2.5 w-2.5" />DESTAQUE
        </div>
      )}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </div>
      )}

      <div className="aspect-square overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className={`bg-gradient-to-br ${GRADS[idx % GRADS.length]} w-full h-full flex items-center justify-center`}>
            <span className="text-6xl md:text-7xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300 select-none">
              {EMOJIS[idx % EMOJIS.length]}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">MC Lorenzo</p>
        <h3 className="text-gray-800 font-bold text-sm md:text-base leading-tight mb-2" style={{ fontFamily: "'Fredoka One', sans-serif" }}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <Stars />
          <span className="text-xs text-gray-400">(0)</span>
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          {hasDiscount && <span className="text-xs text-gray-400 line-through">{fmt(product.sale_price)}</span>}
          <span className="text-blue-600 font-bold text-lg" style={{ fontFamily: "'Fredoka One', sans-serif" }}>{fmt(price)}</span>
        </div>
        <button
          onClick={handleAdd}
          className={`w-full py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white scale-95" : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"}`}
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

  const { data, isLoading } = useQuery({
    queryKey: ["public-products", categoryId, page],
    queryFn: () => fetchProducts({ category_id: categoryId ?? undefined, page, limit: 8 }),
    staleTime: 3 * 60 * 1000,
  });

  const products = data && data.products.length > 0 ? data.products : (categoryId ? [] : FALLBACK);
  const totalPages = data?.totalPages ?? 1;
  const usingFallback = !data || data.products.length === 0;

  return (
    <section id="loja" className="py-16 md:py-24 bg-gradient-to-b from-white to-blue-50 px-4">
      <div className="container mx-auto max-w-[1400px]">
        <div className="text-center mb-12">
          <span className="inline-block bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-widest">
            🛍️ Loja Oficial
          </span>
          <h2 className="text-4xl md:text-6xl font-bold text-blue-700 mb-3" style={{ fontFamily: "'Bubblegum Sans', cursive" }}>
            {categoryName ? `${categoryName}!` : "Produtos do Lorenzo!"}
          </h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Garanta seu item exclusivo e mostre que você é o maior fã! 🔥
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />)}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-400 py-16 text-lg">Nenhum produto nesta categoria ainda.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, idx) => <ProductCard key={p.id} product={p} idx={idx} />)}
          </div>
        )}

        {!usingFallback && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-500">Página {page} de {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {usingFallback && (
          <div className="text-center mt-12">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
              style={{ fontFamily: "'Bubblegum Sans', cursive" }}
            >
              🛒 Ver todos os produtos
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
