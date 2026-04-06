"use client";

import { useState } from "react";
import axios from "axios";

export default function AddToCart({ productId }: { productId: number }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("ログインしてください。");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/cart", {
        user: { id: Number(userId) },
        product: { id: Number(productId) },
        quantity: quantity,
      });
      alert("カートに追加しました！");
    } catch (err: any) {
      alert(err.response?.data?.message || "エラーが発生しました");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition"
        >
          −
        </button>
        <span className="text-lg text-stone-800 w-6 text-center">
          {quantity}
        </span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition"
        >
          ＋
        </button>
      </div>
      <button
        onClick={handleAddToCart}
        className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-8 rounded-full text-sm tracking-widest transition"
      >
        カートに追加
      </button>
    </div>
  );
}
