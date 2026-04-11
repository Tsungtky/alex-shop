"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Order = {
    id: number;
    user: { firstName: string; lastName: string };
    status: string;
    createdAt: string;
    totalAmount: number;
};

export default function AdminOrdersPage() {
    const [orderList, setOrderList] = useState<Order[]>([]);
    const router = useRouter();

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

    return (
        <div className="max-w-5xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文管理</h1>
            <div className="flex flex-col gap-4">
                {orderList.map((order) => (
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
                            <span className="text-xs tracking-widest px-3 py-1 rounded-full border border-stone-300 text-stone-600">
                                {order.status}
                            </span>
                        </div>
                    </Link>
                ))}
                {orderList.length === 0 && (
                    <p className="text-sm text-stone-400 text-center py-12">注文がありません</p>
                )}
            </div>
        </div>
    );
}
