"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const hideHeader = pathname === "/login" || pathname === "/register";
  if (hideHeader) return null;
  
  return (
    <footer className="bg-white border-t border-stone-200 px-8 py-12 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-light tracking-[0.3em] text-stone-800 mb-4">
            ALEXSHOP
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            上質なライフスタイルをあなたに。
            <br />
            こだわりのセレクトショップ。
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-stone-500 mb-4">MENU</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/" className="text-xs text-stone-400 hover:text-stone-700 transition">
                ホーム
              </a>
            </li>
            <li>
              <a href="/products" className="text-xs text-stone-400 hover:text-stone-700 transition">
                商品一覧
              </a>
            </li>
            <li>
              <a href="/cart" className="text-xs text-stone-400 hover:text-stone-700 transition">
                カート
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-stone-500 mb-4">ACCOUNT</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/login" className="text-xs text-stone-400 hover:text-stone-700 transition">
                ログイン
              </a>
            </li>
            <li>
              <a href="/register" className="text-xs text-stone-400 hover:text-stone-700 transition">
                登録
              </a>
            </li>
            <li>
              <a href="/orders" className="text-xs text-stone-400 hover:text-stone-700 transition">
                注文履歴
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-stone-100 mt-8 pt-6">
        <p className="text-xs text-stone-300 text-center tracking-widest">
          © 2026 ALEXSHOP. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
