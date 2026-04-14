"use client";

import { useState } from "react";
import api from "@/lib/axios";
import Toast from "@/components/Toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function AddToCart({ productId, stock }: { productId: number; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { lang } = useLanguage();
  const tr = t[lang];

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setToast({ message: tr.login, type: "error" });
      return;
    }
    try {
      await api.post("/api/cart", {
        user: { id: Number(userId) },
        product: { id: Number(productId) },
        quantity,
      });
      setToast({ message: tr.inCart, type: "success" });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err: any) {
      setToast({ message: err.response?.data?.error || tr.errorGeneral, type: "error" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex items-center gap-4">
        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition">−</button>
        <span className="text-lg text-stone-800 w-6 text-center">{quantity}</span>
        <button onClick={() => setQuantity((q) => Math.min(stock, q + 1))} disabled={quantity >= stock} className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition disabled:opacity-40 disabled:cursor-not-allowed">＋</button>
      </div>
      {stock === 0 && <p className="text-xs text-red-400 tracking-widest">{tr.outOfStock}</p>}
      {stock > 0 && stock <= 5 && <p className="text-xs text-amber-500 tracking-widest">{tr.lowStock.replace("{n}", String(stock))}</p>}
      <button
        onClick={handleAddToCart}
        disabled={stock === 0}
        className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-8 rounded-full text-sm tracking-widest transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {tr.addToCart}
      </button>
    </div>
  );
}
