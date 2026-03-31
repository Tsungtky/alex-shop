"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const hideHeader = pathname === "/login" || pathname === "/register";
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
        <Link
          href="/cart"
          className="text-sm text-stone-600 hover:text-stone-900 transition"
        >
          🛒
        </Link>
      </div>
    </header>
  );
}
