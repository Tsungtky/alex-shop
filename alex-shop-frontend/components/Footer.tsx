"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function Footer() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const tr = t[lang];

  const hideFooter = pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin");
  if (hideFooter) return null;

  return (
    <footer className="bg-white border-t border-stone-200 px-8 py-12 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-light tracking-[0.3em] text-stone-800 mb-4">
            ALEXSHOP
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            {tr.footerTagline}
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-stone-500 mb-4">MENU</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.footerHome}
              </a>
            </li>
            <li>
              <a href="/products" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.products}
              </a>
            </li>
            <li>
              <a href="/cart" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.cart}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest text-stone-500 mb-4">ACCOUNT</h4>
          <ul className="flex flex-col gap-2">
            <li>
              <a href="/login" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.login}
              </a>
            </li>
            <li>
              <a href="/register" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.register}
              </a>
            </li>
            <li>
              <a href="/orders" className="text-xs text-stone-400 hover:text-stone-700 transition">
                {tr.orderHistory}
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
