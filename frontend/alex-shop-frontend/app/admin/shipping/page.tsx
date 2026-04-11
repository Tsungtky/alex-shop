"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

type ShippingRate = {
    id: number;
    country: string;
    baseFee: number;
    perKgFee: number;
    isDomestic: boolean;
};

const EMPTY_FORM = { country: "", baseFee: "", perKgFee: "", isDomestic: false };

export default function AdminShippingPage() {
    const [rates, setRates] = useState<ShippingRate[]>([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchRates();
    }, []);

    const fetchRates = async () => {
        const res = await api.get("/api/shippingRate");
        setRates(res.data);
    };

    const handleSubmit = async () => {
        try {
            await api.post("/api/shippingRate", {
                ...form,
                baseFee: Number(form.baseFee),
                perKgFee: Number(form.perKgFee),
            });
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchRates();
        } catch (err) {
            alert("エラーが発生しました");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("削除しますか？")) return;
        await api.delete(`/api/shippingRate/${id}`);
        fetchRates();
    };

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-light text-stone-800 tracking-widest">運費管理</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2 rounded-full text-sm tracking-widest transition"
                >
                    {showForm ? "キャンセル" : "+ 新規追加"}
                </button>
            </div>

            {showForm && (
                <div className="border border-stone-200 rounded-xl p-6 mb-8 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { key: "country", label: "国" },
                            { key: "baseFee", label: "基本送料（¥）" },
                            { key: "perKgFee", label: "1kgあたり（¥）" },
                        ].map(({ key, label }) => (
                            <div key={key}>
                                <label className="text-xs text-stone-400 mb-1 block">{label}</label>
                                <input
                                    type="text"
                                    value={form[key as keyof typeof form] as string}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 focus:outline-none focus:border-stone-400"
                                />
                            </div>
                        ))}
                        <div className="flex items-center gap-2 mt-4">
                            <input
                                type="checkbox"
                                checked={form.isDomestic}
                                onChange={(e) => setForm({ ...form, isDomestic: e.target.checked })}
                            />
                            <label className="text-xs text-stone-500">国内配送</label>
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
                {rates.map((rate) => (
                    <div key={rate.id} className="border border-stone-200 rounded-xl px-6 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-stone-800 font-light">{rate.country}</p>
                            <p className="text-xs text-stone-400">
                                基本: ¥{rate.baseFee?.toLocaleString()} · 1kgあたり: ¥{rate.perKgFee?.toLocaleString()}
                                {rate.isDomestic && " · 国内"}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDelete(rate.id)}
                            className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg transition"
                        >
                            削除
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
