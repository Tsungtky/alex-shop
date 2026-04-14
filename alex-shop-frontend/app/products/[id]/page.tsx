"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddToCart from "./AddToCart";
import api from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";
import { ProductDetailSkeleton } from "@/components/Skeleton";

type Product = {
  id: number;
  nameJa: string;
  nameEn: string;
  nameZh: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  status: string;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { lang } = useLanguage();
  const tr = t[lang];

  useEffect(() => {
    api.get(`/api/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <ProductDetailSkeleton />;

  const name = lang === "en" ? product.nameEn : lang === "zh" ? product.nameZh : product.nameJa;
  const categoryMap: Record<string, string> = {
    kitchen: tr.categoryKitchen,
    aroma: tr.categoryAroma,
    storage: tr.categoryStorage,
  };
  const categoryLabel = categoryMap[product.category] ?? product.category;

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="grid grid-cols-2 gap-12">
        <img src={product.imageUrl} alt={name} className="w-full h-96 object-cover rounded-2xl" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
        <div className="flex flex-col justify-center gap-4">
          <p className="text-xs tracking-widest text-stone-400 uppercase">{categoryLabel}</p>
          <h1 className="text-3xl font-light text-stone-800">{name}</h1>
          <div className="w-8 h-px bg-stone-300"></div>
          <p className="text-2xl text-stone-700">¥{product.price.toLocaleString()}</p>
          {product.status === "archived" ? (
            <p className="text-sm text-stone-400 tracking-widest border border-stone-200 rounded-full px-6 py-3 text-center">
              {tr.soldOut}
            </p>
          ) : (
            <AddToCart productId={product.id} stock={product.stock} />
          )}
        </div>
      </div>
    </div>
  );
}
