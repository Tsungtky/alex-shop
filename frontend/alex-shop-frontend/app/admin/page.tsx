import Link from "next/link";

const sections = [
  { href: "/admin/orders", label: "注文管理", desc: "注文の確認・ステータス更新・キャンセル" },
  { href: "/admin/inventory", label: "商品管理", desc: "商品の追加・編集・削除" },
  { href: "/admin/coupons", label: "クーポン管理", desc: "クーポンの作成・管理" },
];

export default function AdminPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-2">管理者ダッシュボード</h1>
      <p className="text-xs text-stone-400 tracking-widest mb-10">ADMIN</p>
      <div className="grid grid-cols-3 gap-6">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="border border-stone-200 rounded-xl p-6 hover:bg-stone-50 transition flex flex-col gap-2"
          >
            <p className="text-stone-800 font-light">{s.label}</p>
            <p className="text-xs text-stone-400">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
