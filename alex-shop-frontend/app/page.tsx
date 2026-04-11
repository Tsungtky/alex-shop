import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-8 py-32">
        <p className="text-xs tracking-[0.4em] text-stone-400 mb-4">
          NEW COLLECTION 2026
        </p>
        <h1 className="text-6xl font-light text-stone-800 tracking-wide mb-6">
          ALEXSHOP
        </h1>
        <div className="w-12 h-px bg-stone-300 mb-6"></div>
        <p className="text-stone-500 text-sm tracking-widest mb-10">
          上質なライフスタイルをあなたに
        </p>
        <Link
          href="/products"
          className="bg-stone-800 text-white text-sm px-10 py-3 rounded-full hover:bg-stone-900 tracking-widest transition"
        >
          商品を見る
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-3 gap-px bg-stone-200 border-t border-stone-200">
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">🚚</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">
            送料無料
          </p>
          <p className="text-xs text-stone-400">¥5,000以上のご注文</p>
        </div>
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">🔒</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">
            安全なお支払い
          </p>
          <p className="text-xs text-stone-400">SSL暗号化対応</p>
        </div>
        <div className="bg-stone-50 flex flex-col items-center justify-center text-center px-8 py-16">
          <p className="text-2xl mb-4">↩️</p>
          <p className="text-sm font-medium text-stone-700 tracking-wider mb-2">
            30日間返品保証
          </p>
          <p className="text-xs text-stone-400">安心してお買い物</p>
        </div>
      </section>
    </div>
  );
}
