"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

type CartItem = {
  id: number;
  product: {
    id: number;
    nameJa: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("ログインしてください。");
        return;
      }
      const res = await api.get(
        `/api/cart/user/${userId}`
      );
      setCartItems(res.data);
    };
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    await api.put(
      `/api/cart/${cartItemId}?quantity=${newQuantity}`
    );
    setCartItems(
      cartItems.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDelete = async (cartItemId: number) => {
    await api.delete(`/api/cart/${cartItemId}`);
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">
        カート
      </h1>
      {cartItems.length === 0 && (
        <p className="text-stone-400 text-sm text-center py-16">カートに商品がありません</p>
      )}
      <div className="flex flex-col gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-6 border-b border-stone-200 pb-6"
          >
            <img
              src={item.product.imageUrl}
              alt={item.product.nameJa}
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div className="flex-1">
              <p className="text-stone-800 font-light">{item.product.nameJa}</p>
              <p className="text-stone-500 text-sm">
                ¥{item.product.price.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition"
              >
                −
              </button>
              <span className="text-stone-800 w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition"
              >
                ＋
              </button>
            </div>
            <p className="text-stone-700 w-24 text-right">
              ¥{(item.product.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => handleDelete(item.id)}
              className="text-stone-400 hover:text-red-500 transition text-sm"
            >
              削除
            </button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-stone-500 text-sm tracking-widest">合計</p>
        <p className="text-2xl font-light text-stone-800">
          ¥
          {cartItems
            .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            .toLocaleString()}
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <Link
          href="/checkout"
          className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-10 rounded-full text-sm tracking-widest transition"
        >
          注文へ進む
        </Link>
      </div>
    </div>
  );
}
