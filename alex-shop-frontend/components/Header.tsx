"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useLanguage, Lang } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { lang, setLang } = useLanguage();
  const tr = t[lang];

  const fetchCartCount = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get(`/api/cart/user/${userId}`)
        .then((res) => setCartCount(Array.isArray(res.data) ? res.data.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0))
        .catch(() => setCartCount(0));
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    fetchCartCount();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("cartUpdated", fetchCartCount);
    return () => window.removeEventListener("cartUpdated", fetchCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "role=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push("/login");
  };

  const hideHeader = pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin");
  if (hideHeader) return null;

  const LANGS: { value: Lang; label: string }[] = [
    { value: "ja", label: "日" },
    { value: "en", label: "EN" },
    { value: "zh", label: "中" },
  ];

  return (
    <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-light tracking-[0.3em] text-stone-800">
          ALEXSHOP
        </Link>
        <Link href="/products" className="text-sm text-stone-600 hover:text-stone-900 transition">
          {tr.products}
        </Link>
        <Link href="/products?category=kitchen" className="text-sm text-stone-600 hover:text-stone-900 transition">
          {tr.kitchen}
        </Link>
        <Link href="/products?category=aroma" className="text-sm text-stone-600 hover:text-stone-900 transition">
          {tr.aroma}
        </Link>
        <Link href="/products?category=storage" className="text-sm text-stone-600 hover:text-stone-900 transition">
          {tr.storage}
        </Link>
      </div>
      <div className="flex items-center gap-4">

        {/* 言語切替 */}
        <div className="flex items-center gap-1 border border-stone-200 rounded-full px-2 py-1">
          {LANGS.map((l, i) => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={`text-xs px-2 py-0.5 rounded-full transition ${
                lang === l.value ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-sm text-stone-600 hover:text-stone-900 transition">
            {tr.logout}
          </button>
        ) : (
          <>
            <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 transition">
              {tr.login}
            </Link>
            <Link href="/register" className="text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-900 transition">
              {tr.register}
            </Link>
          </>
        )}
        <Link href="/account" className="text-stone-600 hover:text-stone-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>
        {isLoggedIn && (
          <Link href="/orders" className="text-stone-600 hover:text-stone-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </Link>
        )}
        <Link href="/cart" className="relative text-stone-600 hover:text-stone-900 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-stone-800 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
