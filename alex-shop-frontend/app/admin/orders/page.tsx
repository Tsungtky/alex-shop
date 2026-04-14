"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";

type Order = {
    id: number;
    user: { firstName: string; lastName: string };
    status: string;
    createdAt: string;
    totalAmount: number;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending:          { label: "pending",          color: "border-yellow-300 text-yellow-600" },
    processing:       { label: "processing",       color: "border-blue-300 text-blue-600" },
    shipped:          { label: "shipped",          color: "border-indigo-300 text-indigo-600" },
    delivered:        { label: "delivered",        color: "border-green-300 text-green-600" },
    cancel_requested: { label: "cancel requested", color: "border-amber-400 text-amber-600" },
    cancelled:        { label: "cancelled",        color: "border-red-300 text-red-400" },
};

export default function AdminOrdersPage() {
    const [orderList, setOrderList] = useState<Order[]>([]);
    const [tab, setTab] = useState<"active" | "cancelled">("active");

    useEffect(() => {
        const fetchOrderList = async () => {
            try {
                const res = await api.get("/api/orders");
                setOrderList(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrderList();
    }, []);

    const active = orderList.filter((o) => o.status !== "cancelled");
    const cancelled = orderList.filter((o) => o.status === "cancelled");
    const displayed = tab === "active" ? active : cancelled;

    return (
        <div className="max-w-5xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文管理</h1>

            {/* タブ */}
            <div className="flex gap-0 mb-6 border-b border-stone-200">
                <button
                    onClick={() => setTab("active")}
                    className={`px-6 py-2 text-sm tracking-widest transition border-b-2 -mb-px ${
                        tab === "active"
                            ? "border-stone-800 text-stone-800"
                            : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                >
                    進行中 {active.length > 0 && <span className="ml-1 text-xs">({active.length})</span>}
                </button>
                <button
                    onClick={() => setTab("cancelled")}
                    className={`px-6 py-2 text-sm tracking-widest transition border-b-2 -mb-px ${
                        tab === "cancelled"
                            ? "border-stone-800 text-stone-800"
                            : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                >
                    キャンセル済み {cancelled.length > 0 && <span className="ml-1 text-xs">({cancelled.length})</span>}
                </button>
            </div>

            {/* 注文リスト */}
            <div className="flex flex-col gap-4">
                {displayed.map((order) => {
                    const s = STATUS_LABEL[order.status] ?? { label: order.status, color: "border-stone-300 text-stone-600" };
                    return (
                        <Link
                            key={order.id}
                            href={`/admin/orders/${order.id}`}
                            className="border border-stone-200 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition"
                        >
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-stone-400 tracking-widest">注文番号 #{order.id}</p>
                                <p className="text-stone-800 font-light">{order.user?.firstName} {order.user?.lastName}</p>
                                <p className="text-xs text-stone-400">{order.createdAt?.slice(0, 10)}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-stone-700">¥{order.totalAmount?.toLocaleString()}</p>
                                <span className={`text-xs tracking-widest px-3 py-1 rounded-full border ${s.color}`}>
                                    {s.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
                {displayed.length === 0 && (
                    <p className="text-sm text-stone-400 text-center py-12">注文がありません</p>
                )}
            </div>
        </div>
    );
}
