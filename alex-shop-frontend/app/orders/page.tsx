"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales";
import { OrderCardSkeleton } from "@/components/Skeleton";

type Order = {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    trackingNumber: string | null;
};

const STATUS_COLOR: Record<string, string> = {
    pending:          "border-yellow-300 text-yellow-600",
    processing:       "border-blue-300 text-blue-600",
    shipped:          "border-indigo-300 text-indigo-600",
    delivered:        "border-green-300 text-green-600",
    cancel_requested: "border-amber-400 text-amber-600",
    cancelled:        "border-red-300 text-red-400",
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { lang } = useLanguage();
    const tr = t[lang];

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        api.get(`/api/orders/user/${userId}`).then((res) => {
            setOrders(res.data.sort((a: Order, b: Order) => b.id - a.id));
            setLoading(false);
        });
    }, []);

    const getStatusLabel = (status: string) =>
        tr.statusLabels[status as keyof typeof tr.statusLabels] ?? status;

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">{tr.orderHistory}</h1>
            <div className="flex flex-col gap-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <OrderCardSkeleton key={i} />)
                ) : orders.length === 0 ? (
                    <p className="text-sm text-stone-400 text-center py-12">{tr.noOrders}</p>
                ) : orders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`} className="border border-stone-200 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-stone-400 tracking-widest">{tr.orderNo} #{order.id}</p>
                            <p className="text-stone-800 font-light">¥{order.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-stone-400">{order.createdAt.slice(0, 10)}</p>
                            <p className="text-xs text-stone-500 font-mono mt-1">
                                {tr.trackingNo}: {order.trackingNumber ?? "—"}
                            </p>
                        </div>
                        <span className={`text-xs tracking-widest px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] ?? "border-stone-300 text-stone-600"}`}>
                            {getStatusLabel(order.status)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
