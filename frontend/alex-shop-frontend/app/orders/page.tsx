"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

type Order = {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
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
            const res = await axios.get(`http://localhost:8080/api/orders/user/${userId}`);
            setOrders(res.data.sort((a: Order, b: Order) => b.id - a.id));
        };
        fetchOrders();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <h1 className="text-2xl font-light text-stone-800 tracking-widest mb-8">注文履歴</h1>
            <div className="flex flex-col gap-4">
                {orders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`} className="border border-stone-200 rounded-xl px-6 py-5 flex items-center justify-between hover:bg-stone-50 transition">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-stone-400 tracking-widest">注文番号 #{order.id}</p>
                            <p className="text-stone-800 font-light">¥{order.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-stone-400">{order.createdAt.slice(0, 10)}</p>
                        </div>
                        <span className="text-xs tracking-widest px-3 py-1 rounded-full border border-stone-300 text-stone-600">
                            {order.status}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
