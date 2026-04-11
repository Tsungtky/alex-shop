"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "role=; path=/; max-age=0";
    setIsLoggedIn(false);
    router.push("/login");
  };

  const hideHeader = pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin");
  if (hideHeader) return null;

  return (
    <header className="bg-white border-b border-stone-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link
          href="/"
          className="text-xl font-light tracking-[0.3em] text-stone-800"
        >
          ALEXSHOP
        </Link>
        <Link
          href="/products"
          className="text-sm text-stone-600 hover:text-stone-900 transition"
        >
          商品一覧
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-sm text-stone-600 hover:text-stone-900 transition"
          >
            ログアウト
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm text-stone-600 hover:text-stone-900 transition"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-900 transition"
            >
              登録
            </Link>
          </>
        )}
        <Link
          href="/account"
          className="text-stone-600 hover:text-stone-900 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </Link>
        <Link
          href="/cart"
          className="text-stone-600 hover:text-stone-900 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
