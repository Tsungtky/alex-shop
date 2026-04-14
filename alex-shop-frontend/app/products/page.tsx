"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";
import { ProductCardSkeleton } from "@/components/Skeleton";

type Product = {
  id: number;
  nameJa: string;
  nameEn: string;
  nameZh: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

const CATEGORIES = (tr: typeof t.ja | typeof t.en | typeof t.zh) => [
  { value: "", label: tr.all },
  { value: "kitchen", label: tr.kitchen },
  { value: "aroma", label: tr.aroma },
  { value: "storage", label: tr.storage },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const { lang } = useLanguage();
  const tr = t[lang];

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  useEffect(() => {
    api.get("/api/products").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  const getName = (p: Product) =>
    lang === "en" ? p.nameEn : lang === "zh" ? p.nameZh : p.nameJa;

  const filtered = products
    .filter((p) => getName(p)?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => category === "" || p.category === category);

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={tr.searchPlaceholder}
          className="flex-1 border border-stone-200 rounded-full px-5 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-stone-200 rounded-full px-5 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 bg-white"
        >
          {CATEGORIES(tr).map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-stone-400 text-sm py-16">{tr.noProducts}</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="border border-stone-200 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer">
                <img src={product.imageUrl} alt={getName(product)} className="w-full h-36 object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                <div className="p-3">
                  <p className="text-sm text-stone-800">{getName(product)}</p>
                  <p className="text-stone-500 text-xs mt-1">¥{product.price.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
