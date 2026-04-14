"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";

type Order = {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    trackingNumber: string | null;
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
    pending:          { label: "pending",          color: "border-yellow-300 text-yellow-600" },
    processing:       { label: "processing",       color: "border-blue-300 text-blue-600" },
    shipped:          { label: "shipped",          color: "border-indigo-300 text-indigo-600" },
    delivered:        { label: "delivered",        color: "border-green-300 text-green-600" },
    cancel_requested: { label: "cancel requested", color: "border-amber-400 text-amber-600" },
    cancelled:        { label: "cancelled",        color: "border-red-300 text-red-400" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("ログインしてください。");
            return;
        }
        const fetchOrders = async () => {
            const res = await api.get(`/api/orders/user/${userId}`);
            setOrders(res.data.sort((a: Order, b: Order) => b.id - a.id));
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文履歴</h1>
            <div className="flex flex-col gap-4">
                {orders.map((order) => {
                    const s = STATUS_LABEL[order.status] ?? { label: order.status, color: "border-stone-300 text-stone-600" };
                    return (
                        <Link key={order.id} href={`/orders/${order.id}`} className="border border-stone-200 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition">
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-stone-400 tracking-widest">注文番号 #{order.id}</p>
                                <p className="text-stone-800 font-light">¥{order.totalAmount.toLocaleString()}</p>
                                <p className="text-xs text-stone-400">{order.createdAt.slice(0, 10)}</p>
                                <p className="text-xs text-stone-500 font-mono mt-1">
                                    配送追跡番号: {order.trackingNumber ?? "—"}
                                </p>
                            </div>
                            <span className={`text-xs tracking-widest px-3 py-1 rounded-full border ${s.color}`}>
                                {s.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
