"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function Home() {
  const { lang } = useLanguage();
  const tr = t[lang];

  return (
    <div className="min-h-screen bg-stone-50">
      <section className="flex flex-col items-center justify-center text-center px-8 py-32">
        <p className="text-xs tracking-[0.4em] text-stone-400 mb-4">NEW COLLECTION 2026</p>
        <h1 className="text-6xl font-light text-stone-800 tracking-wide mb-6">ALEXSHOP</h1>
        <div className="w-12 h-px bg-stone-300 mb-6"></div>
        <p className="text-stone-500 text-sm tracking-widest mb-10">{tr.heroSub}</p>
        <Link
          href="/products"
          className="bg-stone-800 text-white text-sm px-10 py-3 rounded-full hover:bg-stone-900 tracking-widest transition"
        >
          {tr.viewProducts}
        </Link>
      </section>

      <section className="grid grid-cols-3 gap-px bg-stone-200 border-t border-stone-200">
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">🚚</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">{tr.freeShipping}</p>
          <p className="text-xs text-stone-400">{tr.freeShippingSub}</p>
        </div>
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">🔒</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">{tr.securePayment}</p>
          <p className="text-xs text-stone-400">{tr.securePaymentSub}</p>
        </div>
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">↩️</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">{tr.returns}</p>
          <p className="text-xs text-stone-400">{tr.returnsSub}</p>
        </div>
      </section>
    </div>
  );
}
