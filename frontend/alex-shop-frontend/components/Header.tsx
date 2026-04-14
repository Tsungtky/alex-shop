"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const hideHeader = pathname === "/login" || pathname === "/register" || pathname.startsWith("/admin");
  if (hideHeader) return null;

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-light tracking-[0.3em] text-stone-800">
            ALEXSHOP
          </Link>
          {/* Desktop nav */}
          <Link href="/products" className="hidden md:block text-sm text-stone-600 hover:text-stone-900 transition">
            商品一覧
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop auth links */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-sm text-stone-600 hover:text-stone-900 transition">
                ログアウト
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 transition">
                  ログイン
                </Link>
                <Link href="/register" className="text-sm bg-stone-800 text-white px-4 py-2 rounded-full hover:bg-stone-900 transition">
                  登録
                </Link>
              </>
            )}
          </div>

          <Link href="/cart" className="text-sm text-stone-600 hover:text-stone-900 transition">
            🛒
          </Link>

          {/* Hamburger button (mobile only) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="メニュー"
          >
            <span className={`block w-5 h-0.5 bg-stone-800 transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-0.5 bg-stone-800 transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 border-t border-stone-100 pt-4">
          <Link href="/products" className="text-sm text-stone-600 hover:text-stone-900 transition">
            商品一覧
          </Link>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-left text-sm text-stone-600 hover:text-stone-900 transition">
              ログアウト
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm text-stone-600 hover:text-stone-900 transition">
                ログイン
              </Link>
              <Link href="/register" className="text-sm text-stone-600 hover:text-stone-900 transition">
                登録
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
