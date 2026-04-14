"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

type CartItem = {
  id: number;
  product: { id: number; nameJa: string; nameEn: string; nameZh: string; price: number; imageUrl: string };
  quantity: number;
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { lang } = useLanguage();
  const tr = t[lang];

  const getName = (p: CartItem["product"]) =>
    lang === "en" ? p.nameEn : lang === "zh" ? p.nameZh : p.nameJa;

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    api.get(`/api/cart/user/${userId}`).then((res) => setCartItems(res.data));
  }, []);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await api.put(`/api/cart/${cartItemId}?quantity=${newQuantity}`);
    setCartItems(cartItems.map((item) => item.id === cartItemId ? { ...item, quantity: newQuantity } : item));
  };

  const handleDelete = async (cartItemId: number) => {
    await api.delete(`/api/cart/${cartItemId}`);
    setCartItems(cartItems.filter((item) => item.id !== cartItemId));
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">{tr.cartTitle}</h1>
      {cartItems.length === 0 && (
        <p className="text-stone-400 text-sm text-center py-16">{tr.emptyCart}</p>
      )}
      <div className="flex flex-col gap-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-6 border-b border-stone-200 pb-6">
            <img src={item.product.imageUrl} alt={getName(item.product)} className="w-24 h-24 object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
            <div className="flex-1">
              <p className="text-stone-800 font-light">{getName(item.product)}</p>
              <p className="text-stone-500 text-sm">¥{item.product.price.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition">−</button>
              <span className="text-stone-800 w-6 text-center">{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 transition">＋</button>
            </div>
            <p className="text-stone-700 w-24 text-right">¥{(item.product.price * item.quantity).toLocaleString()}</p>
            <button onClick={() => handleDelete(item.id)} className="text-stone-400 hover:text-red-500 transition text-sm">{tr.remove}</button>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-stone-500 text-sm tracking-widest">{tr.total}</p>
        <p className="text-2xl font-light text-stone-800">
          ¥{cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toLocaleString()}
        </p>
      </div>
      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Link href="/checkout" className="bg-stone-800 hover:bg-stone-900 text-white py-3 px-10 rounded-full text-sm tracking-widest transition">
            {tr.toCheckout}
          </Link>
        </div>
      )}
    </div>
  );
}
