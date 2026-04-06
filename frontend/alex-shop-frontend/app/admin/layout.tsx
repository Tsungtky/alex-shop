"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "注文管理" },
  { href: "/admin/inventory", label: "商品管理" },
  { href: "/admin/shipping", label: "運費管理" },
  { href: "/admin/coupons", label: "クーポン管理" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* 側邊欄 */}
      <aside className="w-56 bg-stone-900 px-6 py-12 flex flex-col gap-2">
        <p className="text-xs tracking-widest text-stone-500 mb-6">ADMIN</p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-stone-400 hover:text-white py-2 px-3 rounded-lg hover:bg-stone-800 transition"
          >
            {item.label}
          </Link>
        ))}
        <div className="flex-1" />
        <button
          onClick={handleLogout}
          className="text-sm text-stone-500 hover:text-red-400 py-2 px-3 rounded-lg hover:bg-stone-800 transition text-left"
        >
          ログアウト
        </button>
      </aside>

      {/* メインコンテンツ */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
