"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">
        マイページ
      </h1>
      <div className="flex flex-col gap-4">
        <Link
          href="/account/profile"
          className="border border-stone-200 rounded-xl px-6 py-5 hover:bg-stone-50 transition"
        >
          <p className="text-stone-800 font-light tracking-widest">プロフィール</p>
          <p className="text-xs text-stone-400 mt-1">ユーザー名・メールアドレス</p>
        </Link>
        <Link
          href="/orders"
          className="border border-stone-200 rounded-xl px-6 py-5 hover:bg-stone-50 transition"
        >
          <p className="text-stone-800 font-light tracking-widest">注文・返品</p>
          <p className="text-xs text-stone-400 mt-1">注文履歴・返品申請</p>
        </Link>
      </div>
    </div>
  );
}
