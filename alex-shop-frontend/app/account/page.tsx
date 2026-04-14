"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";

export default function AccountPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = t[lang];

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">{tr.myPage}</h1>
      <div className="flex flex-col gap-4">
        <Link href="/account/profile" className="border border-stone-200 rounded-xl px-6 py-5 hover:bg-stone-50 transition">
          <p className="text-stone-800 font-light tracking-widest">{tr.profile}</p>
          <p className="text-xs text-stone-400 mt-1">{tr.profileSub}</p>
        </Link>
        <Link href="/orders" className="border border-stone-200 rounded-xl px-6 py-5 hover:bg-stone-50 transition">
          <p className="text-stone-800 font-light tracking-widest">{tr.ordersReturns}</p>
          <p className="text-xs text-stone-400 mt-1">{tr.ordersReturnsSub}</p>
        </Link>
      </div>
    </div>
  );
}
