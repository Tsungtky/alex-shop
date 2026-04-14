"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const inputClass = "w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="text-xs text-stone-400 mb-1 block">{label}</label>
            {children}
        </div>
    );
}

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
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const res = await api.get("/api/coupons");
        setCoupons(res.data);
    };

    const handleSubmit = async () => {
        try {
            await api.post("/api/coupons", {
                ...form,
                value: Number(form.value),
                minOrder: Number(form.minOrder),
                isActive: true,
            });
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchCoupons();
        } catch (err: any) {
            alert(err.response?.data?.message || err.response?.data || "エラーが発生しました");
        }
    };

    const handleUpdate = async () => {
        if (!editingCoupon) return;
        try {
            await api.put(`/api/coupons/${editingCoupon.id}`, editingCoupon);
            setEditingCoupon(null);
            fetchCoupons();
        } catch (err) {
            alert("更新に失敗しました");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("このクーポンを削除しますか？")) return;
        await api.delete(`/api/coupons/${id}`);
        fetchCoupons();
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

            {/* 新增表單 */}
            {showForm && (
                <div className="border border-stone-200 rounded-xl p-6 mb-8 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="クーポンコード">
                            <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={inputClass} />
                        </FormField>
                        <FormField label="タイプ">
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
                                <option value="percent">割引率（%）</option>
                                <option value="fixed">固定割引（¥）</option>
                                <option value="shipping">送料無料</option>
                            </select>
                        </FormField>
                        <FormField label={form.type === "percent" ? "割引率（%）" : form.type === "fixed" ? "割引額（¥）" : "値（不要）"}>
                            <input type="text" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} disabled={form.type === "shipping"} className={`${inputClass} disabled:opacity-50`} />
                        </FormField>
                        <FormField label="最低注文金額（¥）">
                            <input type="text" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} className={inputClass} />
                        </FormField>
                        <FormField label="有効期限">
                            <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputClass} />
                        </FormField>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={handleSubmit} className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-2 rounded-full text-sm tracking-widest transition">
                            追加する
                        </button>
                    </div>
                </div>
            )}

            {/* クーポン一覧 */}
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
                        <div className="flex items-center gap-3">
                            {(() => {
                                const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                                return (
                                    <span className={`text-xs px-3 py-1 rounded-full border ${
                                        isExpired ? "border-red-200 text-red-400" :
                                        coupon.isActive ? "border-green-200 text-green-600" :
                                        "border-stone-200 text-stone-400"
                                    }`}>
                                        {isExpired ? "期限切れ" : coupon.isActive ? "有効" : "無効"}
                                    </span>
                                );
                            })()}
                            <button
                                onClick={() => setEditingCoupon(coupon)}
                                className="text-xs text-stone-500 hover:text-stone-800 border border-stone-200 hover:border-stone-400 px-3 py-1 rounded-lg transition"
                            >
                                編集
                            </button>
                            <button
                                onClick={() => handleDelete(coupon.id)}
                                className="text-xs text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg transition"
                            >
                                削除
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 編集 Modal */}
            {editingCoupon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingCoupon(null)}>
                    <div className="bg-white rounded-2xl p-8 w-full max-w-lg flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-light text-stone-800">クーポン編集</h2>
                            <button onClick={() => setEditingCoupon(null)} className="text-stone-400 hover:text-stone-700 text-xl">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="クーポンコード">
                                <input type="text" value={editingCoupon.code} onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value })} className={inputClass} />
                            </FormField>
                            <FormField label="タイプ">
                                <select value={editingCoupon.type} onChange={(e) => setEditingCoupon({ ...editingCoupon, type: e.target.value })} className={inputClass}>
                                    <option value="percent">割引率（%）</option>
                                    <option value="fixed">固定割引（¥）</option>
                                    <option value="shipping">送料無料</option>
                                </select>
                            </FormField>
                            <FormField label="値">
                                <input type="number" value={editingCoupon.value} onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })} className={inputClass} />
                            </FormField>
                            <FormField label="最低注文金額（¥）">
                                <input type="number" value={editingCoupon.minOrder} onChange={(e) => setEditingCoupon({ ...editingCoupon, minOrder: Number(e.target.value) })} className={inputClass} />
                            </FormField>
                            <FormField label="有効期限">
                                <input type="date" value={editingCoupon.expiresAt?.slice(0, 10)} onChange={(e) => setEditingCoupon({ ...editingCoupon, expiresAt: e.target.value })} className={inputClass} />
                            </FormField>
                            <FormField label="ステータス">
                                <select value={editingCoupon.isActive ? "true" : "false"} onChange={(e) => setEditingCoupon({ ...editingCoupon, isActive: e.target.value === "true" })} className={inputClass}>
                                    <option value="true">有効</option>
                                    <option value="false">無効</option>
                                </select>
                            </FormField>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setEditingCoupon(null)} className="text-sm text-stone-500 px-6 py-2 rounded-full border border-stone-200 hover:bg-stone-50 transition">
                                キャンセル
                            </button>
                            <button onClick={handleUpdate} className="bg-stone-800 hover:bg-stone-900 text-white px-8 py-2 rounded-full text-sm tracking-widest transition">
                                更新する
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
