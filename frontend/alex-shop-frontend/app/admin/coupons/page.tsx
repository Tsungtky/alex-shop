"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Coupon = {
    id: number;
    code: string;
    type: string;
    value: number;
    minOrder: number;
    isActive: boolean;
    expiresAt: string;
};

const EMPTY_FORM = {
    code: "",
    type: "percent",
    value: "",
    minOrder: "",
    expiresAt: "",
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "admin") { router.push("/"); return; }
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const res = await axios.get("http://localhost:8080/api/coupons");
        setCoupons(res.data);
    };

    const handleSubmit = async () => {
        try {
            await axios.post("http://localhost:8080/api/coupons", {
                ...form,
                value: Number(form.value),
                minOrder: Number(form.minOrder),
                isActive: true,
            });
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchCoupons();
        } catch (err) {
            alert("エラーが発生しました");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-light text-stone-800 tracking-widest">クーポン管理</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-full text-sm tracking-widest transition"
                >
                    {showForm ? "キャンセル" : "+ 新規クーポン"}
                </button>
            </div>

            {showForm && (
                <div className="border border-stone-200 rounded-xl p-6 mb-8 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">クーポンコード</label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">タイプ</label>
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            >
                                <option value="percent">割引率（%）</option>
                                <option value="fixed">固定割引（¥）</option>
                                <option value="shipping">送料無料</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">
                                {form.type === "percent" ? "割引率（%）" : form.type === "fixed" ? "割引額（¥）" : "値（不要）"}
                            </label>
                            <input
                                type="text"
                                value={form.value}
                                onChange={(e) => setForm({ ...form, value: e.target.value })}
                                disabled={form.type === "shipping"}
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400 disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">最低注文金額（¥）</label>
                            <input
                                type="text"
                                value={form.minOrder}
                                onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-stone-400 mb-1 block">有効期限</label>
                            <input
                                type="date"
                                value={form.expiresAt}
                                onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-2 rounded-full text-sm tracking-widest transition"
                        >
                            追加する
                        </button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {coupons.map((coupon) => (
                    <div key={coupon.id} className="border border-stone-200 rounded-xl px-6 py-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-stone-800 font-light tracking-widest">{coupon.code}</p>
                            <p className="text-xs text-stone-400">
                                {coupon.type === "percent" && `${coupon.value}% OFF`}
                                {coupon.type === "fixed" && `¥${coupon.value?.toLocaleString()} OFF`}
                                {coupon.type === "shipping" && "送料無料"}
                                {coupon.minOrder > 0 && ` · 最低 ¥${coupon.minOrder?.toLocaleString()}`}
                                {coupon.expiresAt && ` · ${coupon.expiresAt}`}
                            </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full border ${
                            coupon.isActive
                                ? "border-green-200 text-green-600"
                                : "border-stone-200 text-stone-400"
                        }`}>
                            {coupon.isActive ? "有効" : "無効"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
